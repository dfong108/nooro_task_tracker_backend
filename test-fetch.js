#!/usr/bin/env node

/**
 * Test script using fetch API to more closely match browser behavior
 * Run with: node test-fetch.js
 */

const fetch = require('node-fetch');

async function testApi() {
  const task = {
    title: "Test Task from Fetch",
    color: "BLUE",
    completed: false
  };

  console.log('Sending task:', task);

  try {
    // First try the debug endpoint
    const debugResponse = await fetch('http://localhost:4000/api/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const debugResult = await debugResponse.json();
    console.log('Debug endpoint response:', debugResult);

    // Then try the tasks endpoint
    const response = await fetch('http://localhost:4000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
