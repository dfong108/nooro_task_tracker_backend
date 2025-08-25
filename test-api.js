#!/usr/bin/env node

/**
 * Simple script to test the API directly
 * Run with: node test-api.js
 */

const http = require('http');

const data = JSON.stringify({
  title: "Test Task",
  color: "BLUE",
  completed: false
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending request:', { options, data });

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);

  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('RESPONSE BODY:', responseData);
    try {
      const parsedData = JSON.parse(responseData);
      console.log('PARSED RESPONSE:', parsedData);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', error => {
  console.error('Error sending request:', error);
});

req.write(data);
req.end();
