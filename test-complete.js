#!/usr/bin/env node

/**
 * Test script for task completion
 * Run with: node test-complete.js
 */

const fetch = require('node-fetch');

async function testTaskCompletion() {
  const taskId = process.argv[2]; // Get task ID from command line

  if (!taskId) {
    console.error('Please provide a task ID as argument');
    console.error('Usage: node test-complete.js TASK_ID');
    process.exit(1);
  }

  console.log(`Testing completion toggle for task: ${taskId}`);

  // First try the debug endpoint
  try {
    console.log('\n1. Testing debug/complete endpoint...');
    const debugResponse = await fetch('http://localhost:4000/api/debug/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: false })
    });

    const debugResult = await debugResponse.json();
    console.log('Debug endpoint response:', debugResult);
  } catch (error) {
    console.error('Debug endpoint error:', error);
  }

  // Then try with a boolean value
  try {
    console.log('\n2. Testing with boolean false...');
    const response1 = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: false })
    });

    const result1 = await response1.json();
    console.log('Response status:', response1.status);
    console.log('Response:', result1);
  } catch (error) {
    console.error('Error with boolean false:', error);
  }

  // Try with string value 'true'
  try {
    console.log('\n3. Testing with string "true"...');
    const response2 = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: 'true' })
    });

    const result2 = await response2.json();
    console.log('Response status:', response2.status);
    console.log('Response:', result2);
  } catch (error) {
    console.error('Error with string "true":', error);
  }

  // Try without any body - should toggle
  try {
    console.log('\n4. Testing with empty body (should toggle)...');
    const response3 = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const result3 = await response3.json();
    console.log('Response status:', response3.status);
    console.log('Response:', result3);
  } catch (error) {
    console.error('Error with empty body:', error);
  }
}

testTaskCompletion();
