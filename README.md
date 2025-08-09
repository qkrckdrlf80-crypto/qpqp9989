# Stock Page Project

## Overview
This project is a stock page application that allows users to view, add, and manage stock information. It utilizes a MongoDB database for data storage and Express.js for the server-side logic.

## Project Structure
```
stock-page-project
├── public
│   ├── css
│   │   └── styles.css       # Contains styles for the web page
│   ├── js
│   │   └── scripts.js       # Contains client-side JavaScript code
│   └── index.html           # The main HTML structure of the web page
├── server
│   ├── db
│   │   └── connection.js    # MongoDB connection setup
│   ├── routes
│   │   └── stocks.js        # API routes for stock operations
│   └── server.js            # Express server setup and execution
├── package.json              # npm configuration file
└── README.md                 # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd stock-page-project
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000` to view the application.

## Features
- View stock information
- Add new stocks
- Delete existing stocks
- Responsive design

## Technologies Used
- HTML, CSS, JavaScript for the front-end
- Node.js and Express.js for the back-end
- MongoDB for the database

## License
This project is licensed under the MIT License.