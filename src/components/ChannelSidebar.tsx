
import type { Community } from "../types/Community";
import type { UserProfile } from "../types/User";

type ChannelSidebarProps = {
  community: Community;
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
};

function ChannelSidebar({
  community,
  activeChannel,
  onChannelSelect,
  user,
  onOpenProfile,
}: ChannelSidebarProps) {
  const textChannels = community.channels.filter(
    (channel) => channel.type === "text"
  );

  const voiceChannels = community.channels.filter(
    (channel) => channel.type === "voice"
  );

  return (
    <aside className="channel-sidebar">
      {/* Community name */}
      <div className="workspace-title">
        <h2>{community.name}</h2>
        <span>⌄</span>
      </div>

      {/* Text channels */}
      <div className="channel-group">
        <p className="group-label">TEXT CHANNELS</p>

        {textChannels.map((channel) => (
          <button
            key={channel.id}
            type="button"
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
      {voiceChannels.length > 0 && (
        <div className="channel-group">
          <p className="group-label">VOICE CHANNELS</p>

          {voiceChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className="channel-item"
              disabled
              title="Voice channels are coming later"
            >
              <span>◉</span>
              {channel.name}
            </button>
          ))}
        </div>
      )}

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
