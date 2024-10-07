const http = require('http');
const fs = require('fs');
const url = require('url');

// Define the path to the JSON file
const dataFilePath = './hospitals.json';

// Function to read data from the JSON file
const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Create an HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Handle GET request
    if (method === 'GET') {
        const hospitals = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hospitals));
    }

    // Handle POST request
    else if (method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newHospital = JSON.parse(body);
            const hospitals = readData();
            hospitals.push(newHospital);
            writeData(hospitals);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newHospital));
        });
    }

    // Handle PUT request
    else if (method === 'PUT') {
        const id = parseInt(parsedUrl.query.id);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedHospital = JSON.parse(body);
            const hospitals = readData();
            hospitals[id] = updatedHospital;
            writeData(hospitals);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedHospital));
        });
    }

    // Handle DELETE request
    else if (method === 'DELETE') {
        const id = parseInt(parsedUrl.query.id);
        const hospitals = readData();
        const deletedHospital = hospitals.splice(id, 1);
        writeData(hospitals);
        res.writeHead(204);
        res.end();
    }

    // Handle 404
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
