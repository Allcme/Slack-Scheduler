
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchSlackChannels, sendMessage, scheduleMessage, getScheduledMessages } from "../api/slack";

interface ScheduledMessage {
  id: number;
  channel: string;
  text: string;
  send_time: number;
}

const MessageForm: React.FC = () => {
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [channel, setChannel] = useState("");
  const [text, setText] = useState("");
  const [sendTime, setSendTime] = useState<Date | null>(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);

  // Load Slack channels
  useEffect(() => {
    console.log('[Frontend] Fetching Slack channels from backend...');
    fetchSlackChannels()
      .then((channels) => {
         console.log('[Frontend] Channels received:', channels);
        setChannels(channels);
        setLoadingChannels(false);
      })
      .catch((err) => {
         console.error('[Frontend] Error fetching channels:', err);
        setError(err.message);
        setLoadingChannels(false);
      });
  }, []);

  // Load scheduled messages
  const loadScheduledMessages = async () => {
    try {
      const messages = await getScheduledMessages();
      setScheduledMessages(messages);
    } catch (err) {
      console.error("Failed to load scheduled messages:", err);
    }
  };

  useEffect(() => {
    loadScheduledMessages();
  }, []);

  // Send message now handler
  const handleSendNow = async () => {
    if (!channel) {
      alert("Please select a channel");
      return;
    }
    if (!text.trim()) {
      alert("Message text cannot be empty");
      return;
    }
    try {
      await sendMessage(channel, text);
      alert("Message sent!");
      setText("");
    } catch (err: unknown) {
      let message = "Unknown error";

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string") {
          message = maybeMessage;
        }
      }

      alert("Failed to send/schedule message: " + message);
    }
  };

  // Schedule message handler
  const handleSchedule = async () => {
    if (!channel) {
      alert("Please select a channel");
      return;
    }
    if (!text.trim()) {
      alert("Message text cannot be empty");
      return;
    }
    if (!sendTime) {
      alert("Please pick a date & time to schedule");
      return;
    }
    try {
      await scheduleMessage(channel, text, sendTime.toISOString());
      alert("Message scheduled!");
      setText("");
      setSendTime(null);
      loadScheduledMessages();  // Refresh scheduled messages list
    } catch (err: unknown) {
      let message = "Unknown error";

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string") {
          message = maybeMessage;
        }
      }

      alert("Failed to send/schedule message: " + message);
    }
  };

  if (loadingChannels) return <div>Loading channels...</div>;
  if (error) return <div>Error loading channels: {error}</div>;

  return (
    <>
      <div className="card">
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select a channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", height: "100px", padding: "8px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
          <button onClick={handleSendNow} className="btn-primary">
            Send Now
          </button>

          <div style={{ flexGrow: 1 }}>
            <DatePicker
              selected={sendTime}
              onChange={(date) => setSendTime(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Pick date & time"
            />
          </div>

          <button onClick={handleSchedule} className="btn-secondary">
            Schedule
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Scheduled Messages</h2>
        {scheduledMessages.length === 0 ? (
          <p>No scheduled messages.</p>
        ) : (
          <ul>
            {scheduledMessages.map((msg) => (
              <li key={msg.id} className="list-item">
                <div>
                  <strong>{msg.text}</strong>
                  <p>
                    Channel: {msg.channel} | Send at: {new Date(msg.send_time).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MessageForm;
