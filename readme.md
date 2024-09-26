# PortalX

## Getting Started

This guide will help you set up and run the client and server for PortalX using npm.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)

MongoDB needs to be installed in your system:

#### MongoDB Installation (CLI)

1. Download the MongoDB installer from the [official MongoDB website](https://www.mongodb.com/try/download/community).
2. Follow the instructions to install MongoDB on your system.
3. After installation, start the MongoDB server:
    ```sh
    mongod
    ```

#### MongoDB Installation (GUI)

1. Download MongoDB Compass from the [official MongoDB Compass website](https://www.mongodb.com/try/download/compass).
2. Follow the instructions to install MongoDB Compass on your system.
3. Open MongoDB Compass and connect to your MongoDB server.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/PortalX.git
    cd PortalX
    ```

2. Install dependencies for both client and server:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```

### Running the Client

1. Navigate to the client directory:
    ```sh
    cd client
    ```

2. Start the client:
    ```sh
    npm start
    (or)
    npm run dev
    ```

### Running the Server

1. Navigate to the server directory:
    ```sh
    cd server
    ```

2. Start the server:
    ```sh
    npm start
    ```

### Additional Scripts

- To run tests:
    ```sh
    npm test
    ```

- To build the project:
    ```sh
    npm run build
    ```

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

### Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc