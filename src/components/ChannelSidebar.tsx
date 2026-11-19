
import { useEffect, useRef, useState } from "react";
import type { Community } from "../types/Community";
import type { UserProfile } from "../types/User";

type ChannelSidebarProps = {
  community: Community;
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: () => void;
  onEditChannel: (channelId: string) => void;
  onDeleteChannel: (channelId: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
};

function ChannelSidebar({
  community,
  activeChannel,
  onChannelSelect,
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  user,
  onOpenProfile,
}: ChannelSidebarProps) {
  const [menuChannelId, setMenuChannelId] =
    useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const textChannels = community.channels.filter(
    (channel) => channel.type === "text"
  );

  const voiceChannels = community.channels.filter(
    (channel) => channel.type === "voice"
  );

  useEffect(() => {
    if (!menuChannelId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuChannelId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuChannelId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuChannelId]);

  return (
    <aside className="channel-sidebar">
      <div className="workspace-title">
        <h2>{community.name}</h2>
        <span>⌄</span>
      </div>

      {/* Text channels */}
      <div className="channel-group">
        <div className="channel-group-header">
          <p className="group-label">TEXT CHANNELS</p>

          <button
            type="button"
            className="channel-add-button"
            onClick={onCreateChannel}
            title="Create text channel"
            aria-label="Create text channel"
          >
            +
          </button>
        </div>

        {textChannels.map((channel) => (
          <div
            key={channel.id}
            className="channel-row"
            ref={
              menuChannelId === channel.id
                ? menuRef
                : undefined
            }
          >
            <button
              type="button"
              className={`channel-item ${
                activeChannel === channel.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                setMenuChannelId(null);
                onChannelSelect(channel.id);
              }}
            >
              <span>#</span>
              <span className="channel-name">
                {channel.name}
              </span>
            </button>

            <button
              type="button"
              className="channel-menu-button"
              onClick={() =>
                setMenuChannelId((current) =>
                  current === channel.id
                    ? null
                    : channel.id
                )
              }
              aria-label={`Manage ${channel.name}`}
              aria-expanded={
                menuChannelId === channel.id
              }
              title="Channel options"
            >
              ⋯
            </button>

            {menuChannelId === channel.id && (
              <div className="channel-context-menu">
                <button
                  type="button"
                  onClick={() => {
                    setMenuChannelId(null);
                    onEditChannel(channel.id);
                  }}
                >
                  Edit channel
                </button>

                <button
                  type="button"
                  className="danger"
                  disabled={textChannels.length <= 1}
                  title={
                    textChannels.length <= 1
                      ? "Keep at least one text channel"
                      : "Delete channel"
                  }
                  onClick={() => {
                    setMenuChannelId(null);
                    onDeleteChannel(channel.id);
                  }}
                >
                  Delete channel
                </button>
              </div>
            )}
          </div>
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
