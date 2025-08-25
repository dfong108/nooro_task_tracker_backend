#!/usr/bin/env node

/**
 * Test script for updating tasks directly
 * Run with: node test-update.js TASK_ID
 */

const fetch = require('node-fetch');

async function testUpdateTask() {
  const taskId = process.argv[2]; // Get task ID from command line

  if (!taskId) {
    console.error('Please provide a task ID as argument');
    console.error('Usage: node test-update.js TASK_ID');
    process.exit(1);
  }

  console.log(`Testing direct update for task: ${taskId}`);

  // First get the current task state
  try {
    const getResponse = await fetch(`http://localhost:4000/api/tasks/${taskId}`);
    const getResult = await getResponse.json();
    console.log('Current task state:', getResult.data);

    // Then update just the completed field
    const newCompletedState = !getResult.data.completed;
    console.log(`\nUpdating completed state to: ${newCompletedState}`);

    const updateResponse = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompletedState })
    });

    const updateResult = await updateResponse.json();
    console.log('Update response status:', updateResponse.status);
    console.log('Update response:', updateResult);

    // Verify the state was updated correctly
    const verifyResponse = await fetch(`http://localhost:4000/api/tasks/${taskId}`);
    const verifyResult = await verifyResponse.json();
    console.log('\nVerified task state after update:', verifyResult.data);
    console.log(`Completed was properly updated: ${verifyResult.data.completed === newCompletedState}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpdateTask();
