/*import React from "react";
import ConnectSlack from "./components/ConnectSlack";
import MessageForm from "./components/MessageForm";
import ScheduledList from "./components/ScheduledList";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Slack Connect</h1>
      <ConnectSlack />
      <MessageForm />
      <ScheduledList />
    </div>
  );
};

export default App;
*/

/*import React, { useState, useEffect } from "react";
import axios from "axios";
import ConnectSlack from "./components/ConnectSlack";
import MessageForm from "./components/MessageForm";
import ScheduledList from "./components/ScheduledList";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/check-token");
        setIsConnected(res.data.connected);
      } catch {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    }
    checkConnection();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Slack Connect</h1>
      {!isConnected ? (
        <ConnectSlack />
      ) : (
        <>
          <MessageForm />
          <ScheduledList />
        </>
      )}
    </div>
  );
};

export default App;
*/
import React, { useState, useEffect } from "react";
import ConnectSlack from "./components/ConnectSlack";
import MessageForm from "./components/MessageForm";
import ScheduledList from "./components/ScheduledList";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedParam = params.get("connected");

    if (connectedParam === "true") {
      setIsConnected(true);

      // Optionally clean URL after reading param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="container">
      <h1>Slack Connect</h1>
      {!isConnected ? (
        <ConnectSlack />
      ) : (
        <>
          <MessageForm />
          <ScheduledList />
        </>
      )}
    </div>
  );
};

export default App;
