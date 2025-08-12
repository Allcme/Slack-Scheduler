
import axios from "axios";
import db from "../config/db";
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } from "../env";

// Exchange OAuth code for token and save only access_token with long expiry
export async function exchangeCodeForToken(code: string) {
  console.log("[SlackServices] Exchanging code for token...");
  const res = await axios.post("https://slack.com/api/oauth.v2.access", null, {
    params: {
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code,
      redirect_uri: SLACK_REDIRECT_URI,
    },
  });

  if (!res.data.ok) {
    console.error("[SlackServices] OAuth error:", res.data.error);
    throw new Error(res.data.error);
  }

  const { access_token } = res.data;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30 ; // 30d expiry

  // Clear old tokens and insert new one with long expiry
  db.prepare(`DELETE FROM tokens`).run();
  db.prepare(`INSERT INTO tokens (access_token, expires_at) VALUES (?, ?)`)
    .run(access_token, expiresAt);

  console.log("[SlackServices] Token stored in DB with long expiry");
  return res.data;
}

// Get the current saved token record from DB
export function getToken() {
  return db.prepare(`SELECT * FROM tokens LIMIT 1`).get();
}

// Simplified refreshTokenIfNeeded: just return the access token without refreshing
export async function refreshTokenIfNeeded() {
  const token = getToken();
  if (!token) throw new Error("No token stored");
  return token.access_token; // no refresh logic
}

// Send message to Slack channel
export async function sendSlackMessage(channel: string, text: string) {
  const accessToken = await refreshTokenIfNeeded();

  const res = await axios.post(
    "https://slack.com/api/chat.postMessage",
    { channel, text },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.data.ok) {
    console.error("[SlackServices] sendSlackMessage error:", res.data.error);
    throw new Error(res.data.error);
  }

  console.log(`[SlackServices] Message sent to channel ${channel}`);
  return res.data;
}

// Fetch Slack channels
export async function fetchSlackChannels() {
  const token = await refreshTokenIfNeeded();
  if (!token) throw new Error("No Slack access token found");

  const res = await axios.get("https://slack.com/api/conversations.list", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.data.ok) {
    throw new Error(res.data.error || "Failed to fetch channels");
  }

  return res.data.channels; // Array of channel objects
}
