# REST API PETWELL

## Introduction

This API provides endpoints to manage authentication for the PetWell application. Using MongoDB, Node.js, Express, and other related technologies.

`Demo Link:` https://petwell-api-wmaq4jxv4a-et.a.run.app

## Daftar API Endpoints
1. [User Endpoints](#user-endpoints)
2. [Artikel Endpoint](#artikel-endpoints)

## User Endpoints

### Register

- **Endpoint:** `/signup`
- **Method:** `POST`
- **Description:** Register a new user with email, username, name, and password.
- **Body:**
  ```json
  {
    "email": "example@example.com",
    "username": "exampleuser",
    "password": "examplepassword"
  }
  ```

### Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticate user by email and password to obtain access token.
- **Body:**
  ```json
  {
    "email": "example@example.com",
    "password": "examplepassword"
  }
  ```

### Verify Email

- **Endpoint:** `/verify/:token`
- **Method:** `GET`
- **Description:** Verify user email using the token sent to the user's email.

### Forgot Password

- **Endpoint:** `/forgot-password`
- **Method:** `POST`
- **Description:** Send a password reset token to the user's email.
- **Body:**
  ```json
  {
  "email": "example@example.com"
  }
  ```

### Reset Password

- **Endpoint:** `/reset-password`
- **Method:** `POST`
- **Description:** Reset the user's password using the reset token.
- **Body:**
  ```json
  {
  "token": "reset_token_here",
  "newPassword": "new_example_password"
  }
  ```

## Artikel Endpoints

### Membuat Artikel

- **URL:** `/article`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
      "title": "Judul Artikel",
      "desc": "Deskripsi Artikel",
      "thumbnail": "URL Thumbnail",
      "type": "Tipe Artikel"
    }
    ```

### Mendapatkan Daftar Seluruh Artikel

- **URL:** `/article`
- **Method:** `GET`

### Mendapatkan Artikel Berdasarkan ID

- **URL:** `/article/:id`
- **Method:** `GET`

### Memperbarui Artikel

- **URL:** `/article/:id`
- **Method:** `PUT`
- **Request Body:**
    ```json
    {
      "title": "Judul Artikel Baru",
      "desc": "Deskripsi Artikel Baru",
      "thumbnail": "URL Thumbnail Baru",
      "type": "Tipe Artikel Baru"
    }
    ```

### Menghapus Artikel

- **URL:** `/article/:id`
- **Method:** `DELETE`

## Running the Server

**To start the server, use the following command:**

```
npm start
```

**For development mode with automatic restarts, use:**

```
npm run dev
```

## Environment Variables
**Ensure you have a `.env` file with the following variables:**
```
DB_URL="your_mongodb_connection_string"
USER_VERIFICATION_TOKEN_SECRET="your_verification_token_secret"
EMAIL_USERNAME="your_email@example.com"
EMAIL_PASSWORD="your_email_password"
JWT_KEY="your_jwt_secret_key"
BASE_URL=https://petwell-api-wmaq4jxv4a-et.a.run.app
```

## Dependencies
- **Refer to `package.json` for the full list of dependencies.**