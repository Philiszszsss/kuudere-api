# Kuudere API

A high-performance, lightweight anime data and streaming API built with [ElysiaJS](https://elysiajs.com/). This service provides endpoints for searching anime, retrieving details, fetching episode lists, and generating streaming sources from [https://kuudere.to](https://kuudere.to)

## 🚀 Features

* **Fast & Lightweight:** Built on top of the Elysia framework.
* **Type Safety:** extensive runtime validation using Elysia's `t` schema.
* **Robust Logging:** Integrated with `Logestic` for request logging.
* **Error Handling:** Centralized handling for Timeouts, HTTP errors, and 404s.
* **CORS Enabled:** Ready for frontend integration.

## 🛠 Prerequisites

* [Bun](https://bun.sh/) (Recommended) or Node.js
* Git

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/kuudere-api.git
cd kuudere-api

```


2. **Install dependencies**
```bash
bun install

```


3. **Environment Setup**
Create a `.env` file in the root directory:
```env
PORT=3000

```



## ⚡ Usage

### Development

To start the server in development mode (with hot reloading):

```bash
bun dev

```

### Production

To run the server in production mode:

```bash
bun start

```

The server will start on `http://localhost:3000` (or your defined PORT).

## 📚 API Documentation

All endpoints are prefixed with `/api/v1`.

### 1. Search Anime

Search for an anime title.

* **Endpoint:** `GET /api/v1/search`
* **Query Parameters:**
* `query` (string, required): The search term.



**Example:**

```http
GET /api/v1/search?query=naruto

```

### 2. Get Anime Info

Retrieve detailed information about a specific anime.

* **Endpoint:** `GET /api/v1/info/:id`
* **Path Parameters:**
* `id` (string, required): The unique ID of the anime.



**Example:**

```http
GET /api/v1/info/naruto-shippuden

```

### 3. Get Episodes

Fetch the list of episodes for a specific anime.

* **Endpoint:** `GET /api/v1/episodes/:id`
* **Path Parameters:**
* `id` (string, required): The unique ID of the anime.



**Example:**

```http
GET /api/v1/episodes/naruto-shippuden

```

### 4. Get Streaming Sources

Retrieve streaming links/sources for a specific episode.

* **Endpoint:** `GET /api/v1/sources`
* **Query Parameters:**
* `id` (string, required): The unique ID of the episode.
* `subType` (string, optional): `'sub'` or `'dub'`. Defaults to `'sub'`.



**Example:**

```http
GET /api/v1/sources?id=naruto-episode-1&subType=sub

```

## ⚠️ Error Handling

The API uses a standardized error response format.

| Status Code | Code | Description |
| --- | --- | --- |
| `200` | `SUCCESS` | Request was successful. |
| `400` | `BAD_REQUEST` | Validation failed or invalid parameters. |
| `404` | `NOT_FOUND` | Route or resource not found. |
| `408` | `REQUEST_TIMEOUT` | Upstream request timed out. |
| `500` | `INTERNAL_SERVER_ERROR` | Server-side error. |

**Error Response Example:**

```json
{
  "success": false,
  "message": "Requested timed out. Please try again.",
  "code": "REQUEST_TIMEOUT",
  "error": {
    "name": "TimeoutError",
    "message": "Request timed out"
  }
}

```

