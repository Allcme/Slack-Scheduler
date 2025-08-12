// src/api/slack.ts

// Fetch Slack channels
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function fetchSlackChannels() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/channels`);
    const data = await response.json();
    if (data.ok) {
      return data.channels;
    } else {
      throw new Error(data.error || 'Failed to fetch channels');
    }
  } catch (error) {
    console.error('Error fetching Slack channels:', error);
    throw error;
  }
}

// Send message immediately
export async function sendMessage(channel: string, text: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text }),
    });
    const data = await response.json();
    if (data.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Schedule a message
export async function scheduleMessage(channel: string, text: string, dateTime: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text, dateTime }),
    });
    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to schedule message');
    }
  } catch (error) {
    console.error('Error scheduling message:', error);
    throw error;
  }
}

// Get scheduled messages
export async function getScheduledMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/scheduled`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;  // data is directly the array of scheduled messages
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    throw error;
  }
}


// Cancel scheduled message by ID
export async function cancelScheduledMessage(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/scheduled/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to cancel scheduled message');
    }
  } catch (error) {
    console.error('Error canceling scheduled message:', error);
    throw error;
  }
}
