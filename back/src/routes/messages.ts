import express from 'express';
import db from '../config/db';
import { sendSlackMessage, fetchSlackChannels } from '../services/SlackServices';

const router = express.Router();

// Send a Slack message immediately
router.post('/send', async (req, res) => {
  const { channel, text } = req.body;
  console.log('[Backend] POST /send called with:', { channel, text });

  try {
    // Call Slack API to send message
    const slackResponse = await sendSlackMessage(channel, text);

    // If Slack API call succeeded, send success JSON back
    return res.json({ ok: true, data: slackResponse });
  } catch (err) {
    console.error('[Backend] Error sending message:', err);

    // Send JSON error back
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ ok: false, error: message });
  }
});

// Schedule a Slack message
router.post('/schedule', (req, res) => {
  const { channel, text, dateTime } = req.body;
  console.log('[Backend] POST /schedule called with:', { channel, text, dateTime });
  try {
    db.prepare(`INSERT INTO scheduled_messages (channel, text, send_time) VALUES (?, ?, ?)`)
      .run(channel, text, new Date(dateTime).getTime());
    console.log('[Backend] Message scheduled successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] Error scheduling message:', err);
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// Get all scheduled messages
router.get('/scheduled', (req, res) => {
  console.log('[Backend] GET /scheduled called');
  try {
    const msgs = db.prepare(`SELECT * FROM scheduled_messages`).all();
    res.json(msgs);
  } catch (err) {
    console.error('[Backend] Error fetching scheduled messages:', err);
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// Delete a scheduled message by ID

router.delete('/scheduled/:id', (req, res) => {
  const id = req.params.id;
  console.log('[Backend] DELETE /scheduled/:id called with id:', id);
  try {
    db.prepare(`DELETE FROM scheduled_messages WHERE id = ?`).run(id);
    console.log('[Backend] Scheduled message deleted successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] Error deleting scheduled message:', err);
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});


// NEW: Get list of Slack channels
router.get('/channels', async (req, res) => {
  console.log('[Backend] GET /channels called');
  try {
    const channels = await fetchSlackChannels();
    console.log(`[Backend] Slack channels fetched: ${channels?.length}`);
    res.json({ ok: true, channels });
  } catch (error) {
    console.error('[Backend] Error fetching Slack channels:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: message });
  }
});

export default router;
