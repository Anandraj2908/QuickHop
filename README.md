
# Project Setup Guide

This guide provides a step-by-step process to set up the project, including the backend, bikepool (user app), bikepoolrider (rider app), and socket services.



## Prerequisites

Ensure the following are installed:
- **Node.js** (v14 or higher)
- **Expo CLI** (for React Native apps)
- **MongoDB Atlas** (for database setup)
- A text editor like **VS Code**



## Folder Structure

```
project/
├── backend/          # Node.js backend
├── bikePool/         # React Native user app
├── bikePoolRider/    # React Native rider app
└── socket/           # Node.js socket service
```



## 1. Backend Setup

### Steps
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following content:
   ```env
   TWILIO_ACCOUNT_SID=your_twillio_account_sid
   TWILIO_AUTH_TOKEN=
   TWILIO_SERVICE_SID=
   CORS_ORIGIN=
   ACCESS_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRY=
   REFRESH_TOKEN_SECRET=
   REFRESH_TOKEN_EXPIRY=
   MONGO_URI=your_mongodb_atlas_connection_string
   PORT=8000
   ```

4. Start the server:
   ```bash
   nodemon run dev
   ```

---

## 2. Bikepool (User App) Setup

### Steps
1. Navigate to the `bikepool` folder:
   ```bash
   cd bikepool
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `bikepool` folder with the following content:
   ```env
   EXPO_PUBLIC_SERVER_URI=http://your_ip:8000/api/v1
   EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_api_key
   EXPO_PUBLIC_HOST_IP=your_ip
   EXPO_PUBLIC_SOCKET_PORT=8080
   ```

4. Start the app:
   ```bash
   expo start
   ```

---

## 3. BikepoolRider (Rider App) Setup

### Steps
1. Navigate to the `bikepoolrider` folder:
   ```bash
   cd bikepoolrider
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `bikepoolrider` folder with the following content:
   ```env
   EXPO_PUBLIC_SERVER_URI=http://your_ip:8000/api/v1
   EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_api_key
   EXPO_PUBLIC_HOST_IP=your_ip
   EXPO_PUBLIC_SOCKET_PORT=8080
   ```

4. Start the app:
   ```bash
   expo start
   ```

---

## 4. Socket Service Setup

### Steps
1. Navigate to the `socket` folder:
   ```bash
   cd socket
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the socket server:
   ```bash
   npm start
   ```

---


# API Key and Credentials Setup Guide

This guide provides steps to obtain the Google Maps API Key, MongoDB Atlas connection string and Twilio credentials (Account SID, Auth Token, and Service SID).



## Google Maps API Key Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Library**.
4. Search for **Google Maps JavaScript API** and enable it.
5. Navigate to **APIs & Services > Credentials**.
6. Click on **Create Credentials** and select **API Key**.
7. Copy the API Key and add it to your `.env` file:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```



## Twilio Credentials Setup

1. Go to the [Twilio Console](https://www.twilio.com/console) and sign in or create an account.
2. Navigate to the **Account Settings** to find your **Account SID** and **Auth Token**.
3. Go to the **Twilio Verify** section to create a new service and obtain the **Service SID**.
4. Add the credentials to your `.env` file:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_SERVICE_SID=your_service_sid
   ```



## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. Create a new cluster and set up a database.
3. Obtain the connection string and replace `your_mongodb_atlas_connection_string` in the `.env` file of the backend.




## Notes

- Replace placeholders in the `.env` file with actual credentials.
- Ensure all keys and tokens are kept secure and not shared publicly.



## Contact

For any issues, create an issue in the GitHub repository.
