# REST API PETWELL

## Introduction

This API provides endpoints to manage authentication for the PetWell application. Using MongoDB, Node.js, Express, and other related technologies.

`Demo Link:` https://petwell-api-wmaq4jxv4a-et.a.run.app

## Daftar API Endpoints

1. [User Endpoints](#user-endpoints)
2. [Artikel Endpoint](#artikel-endpoints)
3. [Pet Endpoint](#pet-endpoints)
4. [Profile Endpoint](#profile-endpoints)
5. [Appointment Endpoint](#appointment-endpoints)

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

## Pet Endpoints

### Create Pet

- **Endpoint:** `/pets`
- **Method:** `POST`
- **Description:** Create a new pet.
- **Request Body:**
  ```json
  {
    "name": "nama hewan",
    "species": "kucing/anjing",
    "age": 3
  }
  ```

### Get All Pet

- **Endpoint:** `/pets`
- **Method:** `GET`
- **Description:** Get all pet list.

### Get Pet (By Id)

- **Endpoint:** `/pets/:id`
- **Method:** `GET`
- **Description:** Get specific pet information.

### Update Pet (By Id)

- **Endpoint:** `/pets/:id`
- **Method:** `UPDATE`
- **Description:** Update specific pet information.
- **Request Body:**
  ```json
  {
    "name": "nama hewan",
    "species": "kucing/anjing",
    "age": 3
  }
  ```

### Delete Pet (By Id)

- **Endpoint:** `/pets/:id`
- **Method:** `DELETE`
- **Description:** Delete specific pet information.
- **Request Body:**

## Profile Endpoints

### Get Profile

- **Endpoint:** `/profile`
- **Method:** `GET`
- **Description:** Get user profile.

### Update Profile

- **Endpoint:** `/profile`
- **Method:** `UPDATE`
- **Description:** Update user profile.
- **Request Body:**
  ```json
  {
    "username": "username",
    "profilePict": "url"
  }
  ```

## Appointment Endpoints

### List Dokter yang tersedia

- **Endpoint:** `/appointments`
- **Method:** `GET`
- **Description:** Retrieves a list of all doctors available.

### Detail profil dan jadwal dokter

- **Endpoint:** `/appointments/detail`
- **Method:** `GET`
- **Description:** Retrieves details of a specific doctor including their schedules.

### Detail profil dan jadwal dokter

- **Endpoint:** `/appointments/detail`
- **Method:** `GET`
- **Description:** Retrieves details of a specific doctor including their schedules.
- **Query Parameter:** doctorId: ID of the doctor

### Summary appointment

- **Endpoint:** `/appointments/summary`
- **Method:** `GET`
- **Description:** Retrieves detailed appointment information based on selected work hour.
- **Query Parameter:** workHourId: ID of the selected work hour

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
