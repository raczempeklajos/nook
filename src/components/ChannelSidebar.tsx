
type Channel = {
  id: string;
  name: string;
};

type ChannelSidebarProps = {
  channels: Channel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
};

function ChannelSidebar({
  channels,
  activeChannel,
  onChannelSelect,
}: ChannelSidebarProps) {
  return (
    <aside className="channel-sidebar">
      {/* Workspace header */}
      <div className="workspace-title">
        <h2>My Space</h2>
        <span>⌄</span>
      </div>

      {/* Text channels */}
      <div className="channel-group">
        <p className="group-label">TEXT CHANNELS</p>

        {channels.map((channel) => (
          <button
            key={channel.id}
            className={`channel-item ${
              activeChannel === channel.id ? "selected" : ""
            }`}
            onClick={() => onChannelSelect(channel.id)}
          >
            <span>#</span>
            {channel.name}
          </button>
        ))}
      </div>

      {/* Voice channels */}
      <div className="channel-group">
        <p className="group-label">VOICE CHANNELS</p>

        <button className="channel-item">
          <span>◉</span>
          Lounge
        </button>
      </div>

      <div className="sidebar-spacer" />

      {/* Current user */}
      <div className="current-user">
        <div className="user-avatar">L</div>

        <div>
          <strong>Developer</strong>
          <small>Online</small>
        </div>

        <span className="online-dot" />
      </div>
    </aside>
  );
}

export default ChannelSidebar;
