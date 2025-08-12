// src/components/SlackChannelsList.tsx
import React, { useEffect, useState } from 'react';
import { fetchSlackChannels } from '../api/slack';

interface SlackChannel {
  id: string;
  name: string;
  // add other properties you want to display
}

const SlackChannelsList: React.FC = () => {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlackChannels()
      .then(channels => {
        setChannels(channels);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Slack channels...</div>;
  if (error) return <div>Error loading channels: {error}</div>;

  return (
    <div>
      <h3>Slack Channels</h3>
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SlackChannelsList;
