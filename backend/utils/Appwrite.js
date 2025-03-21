const { Client, Storage } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwrite API Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
    .setSelfSigned(true);

// Initialize Appwrite storage
const storage = new Storage(client);

module.exports = {
    client,
    storage,
};
