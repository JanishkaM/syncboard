# Sync Board

Sync Board is a web application that allows users to copy and paste content across multiple devices. It is built using Next.js and MongoDB.

## Features

- Create, edit, and delete boards.
- Share boards with unique links.
- Copy and paste content seamlessly.
- Responsive design for all devices.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: MongoDB, Mongoose
- **Icons**: React Icons

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JanishkaM/syncboard.git
   cd syncboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   APP_URL_API=<your-api-url> # default -> https://localhost:3000/api 
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the MIT License.