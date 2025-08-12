
import React from "react";


const ConnectSlack: React.FC = () => {
  const connectSlack = () => {
    window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${
      import.meta.env.VITE_SLACK_CLIENT_ID
    }&scope=chat:write,channels:read&redirect_uri=${encodeURIComponent(
      import.meta.env.VITE_SLACK_REDIRECT_URI
    )}`;
  };

  // After OAuth redirect and token saved, call onConnect from parent (see Step 3)

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={connectSlack} className="btn-primary">
        Connect to Slack
      </button>
    </div>
  );
};

export default ConnectSlack;
