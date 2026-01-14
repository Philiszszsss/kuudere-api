import * as cheerio from 'cheerio';
import CryptoJS from 'crypto-js';
import ky from 'ky';
import type { ExtractedData } from './types';

const ZENCLOUD_BASE_URL = 'https://zencloudz.cc';

const getCryptoJS = async (): Promise<typeof CryptoJS> => {
  return CryptoJS;
};

function extractEmbeddedData(html: string): ExtractedData | null {
  try {
    const $ = cheerio.load(html);

    let scriptContent = '';
    $('script').each((_, element) => {
      const content = $(element).html();
      if (content?.includes('__sveltekit_')) {
        scriptContent = content;
        return false;
      }
    });

    if (!scriptContent) {
      console.log('Could not find the SvelteKit script');
      return null;
    }

    const dataMatch = scriptContent.match(
      /data:\s*\[null,null,\{type:"data",data:(\{[\s\S]*?\}),uses:/
    );

    if (!dataMatch) {
      console.log('Could not match the data pattern');
      return null;
    }

    const jsonString = dataMatch[1];
    const dataObject = new Function(`return ${jsonString}`)();

    return dataObject;
  } catch (error) {
    console.error('Error parsing the data:', error);
    return null;
  }
}

const fetchPageContent = async (url: string): Promise<string> => {
  return await ky.get(url).text();
};

async function generateFieldMapping(seed: string) {
  const crypto = await getCryptoJS();
  const hash = crypto.SHA256(seed).toString();

  return {
    videoField: `vf_${hash.substring(0, 8)}`,
    keyField: `kf_${hash.substring(8, 16)}`,
    ivField: `ivf_${hash.substring(16, 24)}`,
    containerName: `cd_${hash.substring(24, 32)}`,
    arrayName: `ad_${hash.substring(32, 40)}`,
    objectName: `od_${hash.substring(40, 48)}`,
    tokenField: `${hash.substring(48, 64)}_${hash.substring(56, 64)}`,
  };
}

function extractEncryptedData(obfuscatedData: any, fieldMapping: any) {
  try {
    const container = obfuscatedData[fieldMapping.containerName];
    if (!container) {
      throw new Error('Container not found in obfuscated data');
    }

    const dataArray = container[fieldMapping.arrayName];
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Array not found in obfuscated data');
    }

    const dataObject = dataArray[0][fieldMapping.objectName];
    if (!dataObject) {
      throw new Error('Object not found in obfuscated data');
    }

    const encryptedVideo = dataObject[fieldMapping.videoField];
    const encryptionKey = dataObject[fieldMapping.keyField];
    const initializationVector = dataObject[fieldMapping.ivField];

    if (!encryptionKey || !initializationVector) {
      throw new Error('Missing required key/iv fields in obfuscated data');
    }

    return {
      video_b64: encryptedVideo,
      key_b64: encryptionKey,
      iv_b64: initializationVector,
    };
  } catch (error) {
    throw new Error('Invalid obfuscated data structure');
  }
}

async function getVideoSources(url: string) {
  const pageContent = await fetchPageContent(url);
  const extractedData = extractEmbeddedData(pageContent);

  const crypto = await getCryptoJS();
  const obfuscatedCryptoData = extractedData?.obfuscated_crypto_data;
  const obfuscationSeed = extractedData?.obfuscation_seed;

  if (!obfuscatedCryptoData || !obfuscationSeed) {
    throw new Error('Missing obfuscated decryption data');
  }

  const fieldMapping = await generateFieldMapping(obfuscationSeed);
  if (!fieldMapping) {
    throw new Error('Field mapping resolution failed');
  }

  const encryptedData = extractEncryptedData(obfuscatedCryptoData, fieldMapping);
  const tokenFieldName = fieldMapping.tokenField;

  let authToken: string | null = null;
  for (const [key, value] of Object.entries(extractedData)) {
    if (key === tokenFieldName && typeof value === 'string' && value.length > 0) {
      authToken = value;
      break;
    }
  }

  if (!authToken) {
    throw new Error(`Missing randomized token field: ${tokenFieldName}`);
  }

  const tokenResponse = await fetch(`${ZENCLOUD_BASE_URL}/api/m3u8/${authToken}`);
  if (!tokenResponse.ok) {
    throw new Error(`Token fetch failed: ${tokenResponse.status}`);
  }

  const tokenPayload = (await tokenResponse.json()) as { video_b64: string };
  if (!tokenPayload?.video_b64) {
    throw new Error('Token response missing video_b64');
  }

  const key = crypto.enc.Base64.parse(encryptedData.key_b64);
  const iv = crypto.enc.Base64.parse(encryptedData.iv_b64);
  const encryptedVideoUrl = crypto.enc.Base64.parse(tokenPayload.video_b64);

  let decryptedUrl: string;

  try {
    const decrypted = crypto.AES.decrypt(encryptedVideoUrl.toString(), key, {
      iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });

    decryptedUrl = decrypted.toString(crypto.enc.Utf8);

    if (!decryptedUrl || decryptedUrl.trim() === '') {
      throw new Error('Method 1 failed - empty result');
    }
  } catch {
    try {
      const cipherParams = crypto.lib.CipherParams.create({
        ciphertext: encryptedVideoUrl,
      });

      const decrypted = crypto.AES.decrypt(cipherParams, key, {
        iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
      });

      decryptedUrl = decrypted.toString(crypto.enc.Utf8);
    } catch {
      throw new Error('All decryption methods failed');
    }
  }

  if (!decryptedUrl || decryptedUrl.trim() === '') {
    throw new Error('Decryption resulted in empty video URL');
  }

  const { obfuscated_crypto_data, obfuscation_seed, ...metadata } = extractedData;

  return {
    url: decryptedUrl,
    ...metadata,
  };
}

export const Zencloud = {
  getSources: getVideoSources,
};

export const ZencloudUtils = {
  extractEmbeddedData,
  generateFieldMapping,
  extractEncryptedData,
};
