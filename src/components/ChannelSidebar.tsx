
import type { UserProfile } from "../types/User";

type Channel = {
  id: string;
  name: string;
};

type ChannelSidebarProps = {
  channels: Channel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
};

function ChannelSidebar({
  channels,
  activeChannel,
  onChannelSelect,
  user,
  onOpenProfile,
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

        <button className="channel-item" type="button">
          <span>◉</span>
          Lounge
        </button>
      </div>

      <div className="sidebar-spacer" />

      {/* Current user profile */}
      <button
        type="button"
        className="current-user"
        onClick={onOpenProfile}
        aria-label="Open profile settings"
      >
        <div className="user-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="current-user-details">
          <strong>{user.username}</strong>

          <small>
            {user.status === "dnd"
              ? "Do Not Disturb"
              : user.status.charAt(0).toUpperCase() +
                user.status.slice(1)}
          </small>
        </div>

        <span
          className={`status-indicator status-${user.status}`}
        />
      </button>
    </aside>
  );
}

export default ChannelSidebar;
