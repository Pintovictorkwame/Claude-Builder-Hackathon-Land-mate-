# CBH LandMate - Legal AI Assistant Backend

Welcome to the backend documentation for the **CBH LandMate** application. This API provides authentication, vector-based retrieving (RAG), conversational AI, and OCR capabilities for a Ghanaian legal assistant.

## Base URL
When running locally, the base URL for all API requests is:
`http://localhost:5000/api`

## Authentication

All secured endpoints require a standard Bearer Token in the headers:
```json
{
  "Authorization": "Bearer <YOUR_JWT_TOKEN_HERE>"
}
```

### 1. Register User
- **Endpoint:** `POST /auth/signup`
- **Access:** Public
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (201):** `{ "success": true, "token": "..." }`

### 2. Login User
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200):** `{ "success": true, "token": "..." }`

### 3. Get Current User Profile
- **Endpoint:** `GET /auth/me`
- **Access:** Private (Needs Token)
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Chat & Knowledge Base

### 4. Send Message to AI
- **Endpoint:** `POST /chat`
- **Access:** Public or Private (Token is optional. If provided, chat is saved to history).
- **Query Params:** `?mode=legal` (Default) OR `?mode=simple` (Explains it for a 10-year-old).
- **Body:**
```json
{
  "message": "Who does land in Ghana belong to?",
  "sessionId": "optional_session_id_to_continue_chat"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "answer": "All land in Ghana belongs to the people...",
    "source": "Land Act 2020",
    "confidence": "high"
  },
  "sessionId": "64abcd012..."
}
```

### 5. Get All Chat Sessions
- **Endpoint:** `GET /chat/sessions`
- **Access:** Private (Needs Token)
- **Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64abcd...",
      "title": "Who does land in Ghana...",
      "createdAt": "2026-03-28T14:40:00.000Z",
      "updatedAt": "2026-03-28T14:40:00.000Z"
    }
  ]
}
```

### 6. Get Chat History For Specific Session
- **Endpoint:** `GET /chat/history/:sessionId`
- **Access:** Private (Needs Token)
- **Query Params:** `?page=1&limit=20`
- **Response (200):**
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "data": [
    {
      "role": "user",
      "content": "Who does land in Ghana belong to?",
      "timestamp": "2026-03-28T14:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "{\"answer\":\"All land in Ghana belongs...\",\"source\":\"Land Act 2020\",\"confidence\":\"high\"}",
      "timestamp": "2026-03-28T14:00:03.000Z"
    }
  ]
}
```

---

## Optical Character Recognition (OCR)

### 7. Extract Text from PDF/Image
Extract raw text from an image (JPG/PNG) or document (PDF).
- **Endpoint:** `POST /ocr/extract`
- **Access:** Public or Private (Token is optional)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:** Key must be `file`
- **Response (200):** `{ "success": true, "text": "Extracted text..." }`

### 8. Analyze Document with AI
Extract text from a file and immediately feed it to the AI for legal analysis.
- **Endpoint:** `POST /ocr/analyze`
- **Access:** Public or Private (Token is optional)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:** Key must be `file`
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "answer": "The provided document is a deed of assignment...",
    "source": "Provided Document",
    "confidence": "high"
  }
}
```
