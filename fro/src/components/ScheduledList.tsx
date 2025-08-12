import React, { useEffect, useState } from "react";
import axios from "axios";

interface ScheduledMessage {
  id: number;
  channel: string;
  text: string;
  send_time: number;
}

const ScheduledList: React.FC = () => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);

  const loadMessages = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/scheduled`);
    setMessages(res.data);
  };

  const cancelMessage = async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/messages/scheduled/${id}`);
    loadMessages();
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="card">
      <h2>Scheduled Messages</h2>
      {messages.length === 0 ? (
        <p>No scheduled messages.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id} className="list-item">
              <div>
                <strong>{msg.text}</strong>
                <p>
                  Channel: {msg.channel} | Send at:{" "}
                  {new Date(msg.send_time).toLocaleString()}
                </p>
              </div>
              <button onClick={() => cancelMessage(msg.id)} className="btn-danger">
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledList;
