
import { useEffect, useState } from "react";
import CommunitySidebar from "./components/CommunitySidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatPanel from "./components/ChatPanel";
import ProfileSettings from "./components/ProfileSettings";
import CreateCommunity from "./components/CreateCommunity";
import EditCommunity from "./components/EditCommunity";
import DeleteCommunity from "./components/DeleteCommunity";
import ChannelModal from "./components/ChannelModal";

import type { ChatMessage } from "./components/Message";
import { defaultUser, type UserProfile } from "./types/User";
import { initialCommunities } from "./data/communities";
import type { Community } from "./types/Community";

import "./App.css";

type Theme = "light" | "dark";
type ChannelModalMode = "create" | "edit" | "delete";

type ChannelModalState = {
  mode: ChannelModalMode;
  communityId: string;
  channelId?: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    communityId: "my-space",
    channelId: "general",
    username: "Alex",
    content: "Welcome to Nook! 👋",
    createdAt: "2026-10-16T10:30:00",
    avatarColor: "purple",
    isOwnMessage: false,
  },
  {
    id: "2",
    communityId: "my-space",
    channelId: "general",
    username: "Sam",
    content: "Really liking the calm atmosphere here.",
    createdAt: "2026-10-16T10:32:00",
    avatarColor: "green",
    isOwnMessage: false,
  },
  {
    id: "3",
    communityId: "my-space",
    channelId: "projects",
    username: "Alex",
    content: "What are you working on today?",
    createdAt: "2026-10-16T11:00:00",
    avatarColor: "purple",
    isOwnMessage: false,
  },
  {
    id: "4",
    communityId: "my-space",
    channelId: "random",
    username: "Sam",
    content: "Anyone listening to something good?",
    createdAt: "2026-10-16T11:15:00",
    avatarColor: "green",
    isOwnMessage: false,
  },
];

function loadMessages(): ChatMessage[] {
  try {
    const saved = localStorage.getItem("nook-messages");

    if (saved !== null) {
      const parsed: unknown = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.every(
          (message) =>
            message !== null &&
            typeof message === "object" &&
            typeof message.id === "string" &&
            typeof message.communityId === "string" &&
            typeof message.channelId === "string" &&
            typeof message.username === "string" &&
            typeof message.content === "string" &&
            typeof message.createdAt === "string" &&
            (message.editedAt === undefined ||
              typeof message.editedAt === "string") &&
            (message.avatarColor === "purple" ||
              message.avatarColor === "green") &&
            typeof message.isOwnMessage === "boolean"
        )
      ) {
        return parsed as ChatMessage[];
      }
    }
  } catch {
    // Ignore invalid saved messages.
  }

  return initialMessages;
}

function loadCommunities(): Community[] {
  try {
    const saved = localStorage.getItem("nook-communities");

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(
          (community) =>
            community !== null &&
            typeof community === "object" &&
            typeof community.id === "string" &&
            typeof community.name === "string" &&
            typeof community.icon === "string" &&
            Array.isArray(community.channels) &&
            community.channels.every(
              (channel: unknown) =>
                channel !== null &&
                typeof channel === "object" &&
                "id" in channel &&
                typeof channel.id === "string" &&
                "name" in channel &&
                typeof channel.name === "string" &&
                "type" in channel &&
                (channel.type === "text" ||
                  channel.type === "voice")
            )
        )
      ) {
        return parsed as Community[];
      }
    }
  } catch {
    // Ignore invalid saved communities.
  }

  return initialCommunities;
}

function loadUser(): UserProfile {
  try {
    const saved = localStorage.getItem("nook-user");

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "username" in parsed &&
        typeof parsed.username === "string" &&
        parsed.username.trim().length > 0 &&
        "bio" in parsed &&
        typeof parsed.bio === "string" &&
        "status" in parsed &&
        (parsed.status === "online" ||
          parsed.status === "away" ||
          parsed.status === "dnd" ||
          parsed.status === "invisible")
      ) {
        return {
          ...defaultUser,
          username: parsed.username,
          bio: parsed.bio,
          status: parsed.status,
        };
      }
    }
  } catch {
    // Ignore invalid saved profile.
  }

  return defaultUser;
}

function App() {
  // =========================
  // THEME
  // =========================

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("nook-theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  // =========================
  // USER PROFILE
  // =========================

  const [user, setUser] = useState<UserProfile>(loadUser);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);

    localStorage.setItem(
      "nook-user",
      JSON.stringify(updatedUser)
    );
  };

  // =========================
  // COMMUNITIES
  // =========================

  const [communities, setCommunities] =
    useState<Community[]>(loadCommunities);

  const [activeCommunityId, setActiveCommunityId] =
    useState(() => {
      try {
        return (
          localStorage.getItem("nook-active-community") ||
          "my-space"
        );
      } catch {
        return "my-space";
      }
    });

  const [activeChannel, setActiveChannel] =
    useState("general");

  const [isCreateCommunityOpen, setIsCreateCommunityOpen] =
    useState(false);

  const [editingCommunityId, setEditingCommunityId] =
    useState<string | null>(null);

  const [deletingCommunityId, setDeletingCommunityId] =
    useState<string | null>(null);

  const [channelModal, setChannelModal] =
    useState<ChannelModalState | null>(null);

  // =========================
  // MESSAGES
  // =========================

  const [messages, setMessages] =
    useState<ChatMessage[]>(loadMessages);

  // Automatically persist every message change.
  useEffect(() => {
    localStorage.setItem(
      "nook-messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  const saveCommunities = (updated: Community[]) => {
    setCommunities(updated);

    localStorage.setItem(
      "nook-communities",
      JSON.stringify(updated)
    );
  };

  const activeCommunity =
    communities.find(
      (community) => community.id === activeCommunityId
    ) ?? communities[0];

  // Keep the active community and channel valid.
  useEffect(() => {
    if (!activeCommunity) return;

    if (activeCommunity.id !== activeCommunityId) {
      setActiveCommunityId(activeCommunity.id);
    }

    const selectedChannel = activeCommunity.channels.find(
      (channel) =>
        channel.id === activeChannel &&
        channel.type === "text"
    );

    if (!selectedChannel) {
      const firstTextChannel = activeCommunity.channels.find(
        (channel) => channel.type === "text"
      );

      setActiveChannel(firstTextChannel?.id ?? "");
    }
  }, [activeCommunity, activeCommunityId, activeChannel]);

  useEffect(() => {
    if (activeCommunity) {
      localStorage.setItem(
        "nook-active-community",
        activeCommunity.id
      );
    }
  }, [activeCommunity]);

  // =========================
  // COMMUNITY MANAGEMENT
  // =========================

  const handleCommunitySelect = (communityId: string) => {
    const selected = communities.find(
      (community) => community.id === communityId
    );

    if (!selected) return;

    setActiveCommunityId(communityId);

    const firstTextChannel = selected.channels.find(
      (channel) => channel.type === "text"
    );

    setActiveChannel(firstTextChannel?.id ?? "");
  };

  const handleCreateCommunity = (
    name: string,
    icon: string
  ) => {
    const newCommunity: Community = {
      id: crypto.randomUUID(),
      name,
      icon,
      channels: [
        {
          id: crypto.randomUUID(),
          name: "general",
          type: "text",
        },
      ],
    };

    saveCommunities([...communities, newCommunity]);

    setActiveCommunityId(newCommunity.id);
    setActiveChannel(newCommunity.channels[0].id);
    setIsCreateCommunityOpen(false);
  };

  const handleEditCommunity = (
    id: string,
    name: string,
    icon: string
  ) => {
    const updated = communities.map((community) =>
      community.id === id
        ? { ...community, name, icon }
        : community
    );

    saveCommunities(updated);
    setEditingCommunityId(null);
  };

  const handleDeleteCommunity = (id: string) => {
    if (communities.length <= 1) {
      setDeletingCommunityId(null);
      return;
    }

    const deleted = communities.find(
      (community) => community.id === id
    );

    if (!deleted) {
      setDeletingCommunityId(null);
      return;
    }

    const updated = communities.filter(
      (community) => community.id !== id
    );

    saveCommunities(updated);

    // Delete only messages belonging to this community.
    setMessages((previous) =>
      previous.filter(
        (message) => message.communityId !== id
      )
    );

    if (activeCommunityId === id) {
      const next = updated[0];

      setActiveCommunityId(next.id);

      const firstTextChannel = next.channels.find(
        (channel) => channel.type === "text"
      );

      setActiveChannel(firstTextChannel?.id ?? "");
    }

    setDeletingCommunityId(null);
  };

  const editingCommunity = communities.find(
    (community) => community.id === editingCommunityId
  );

  const deletingCommunity = communities.find(
    (community) => community.id === deletingCommunityId
  );

  // =========================
  // CHANNEL MANAGEMENT
  // =========================

  const handleCreateChannel = (name: string) => {
    if (!channelModal || channelModal.mode !== "create") {
      return;
    }

    const community = communities.find(
      (item) => item.id === channelModal.communityId
    );

    if (!community) return;

    const normalizedName = name.trim();

    if (!normalizedName) return;

    const alreadyExists = community.channels.some(
      (channel) =>
        channel.name.toLowerCase() ===
        normalizedName.toLowerCase()
    );

    if (alreadyExists) {
      window.alert(
        "A channel with this name already exists."
      );
      return;
    }

    const newChannel = {
      id: crypto.randomUUID(),
      name: normalizedName,
      type: "text" as const,
    };

    const updated = communities.map((item) =>
      item.id === community.id
        ? {
            ...item,
            channels: [...item.channels, newChannel],
          }
        : item
    );

    saveCommunities(updated);
    setActiveCommunityId(community.id);
    setActiveChannel(newChannel.id);
    setChannelModal(null);
  };

  const handleEditChannel = (name: string) => {
    if (
      !channelModal ||
      channelModal.mode !== "edit" ||
      !channelModal.channelId
    ) {
      return;
    }

    const community = communities.find(
      (item) => item.id === channelModal.communityId
    );

    if (!community) return;

    const normalizedName = name.trim();

    if (!normalizedName) return;

    const alreadyExists = community.channels.some(
      (channel) =>
        channel.id !== channelModal.channelId &&
        channel.name.toLowerCase() ===
          normalizedName.toLowerCase()
    );

    if (alreadyExists) {
      window.alert(
        "A channel with this name already exists."
      );
      return;
    }

    const updated = communities.map((item) =>
      item.id === community.id
        ? {
            ...item,
            channels: item.channels.map((channel) =>
              channel.id === channelModal.channelId
                ? { ...channel, name: normalizedName }
                : channel
            ),
          }
        : item
    );

    saveCommunities(updated);
    setChannelModal(null);
  };

  const handleDeleteChannel = () => {
    if (
      !channelModal ||
      channelModal.mode !== "delete" ||
      !channelModal.channelId
    ) {
      return;
    }

    const community = communities.find(
      (item) => item.id === channelModal.communityId
    );

    if (!community) return;

    const textChannels = community.channels.filter(
      (channel) => channel.type === "text"
    );

    if (textChannels.length <= 1) {
      setChannelModal(null);
      return;
    }

    const channelId = channelModal.channelId;

    const updated = communities.map((item) =>
      item.id === community.id
        ? {
            ...item,
            channels: item.channels.filter(
              (channel) => channel.id !== channelId
            ),
          }
        : item
    );

    saveCommunities(updated);

    // Delete messages from this channel in this community.
    setMessages((previous) =>
      previous.filter(
        (message) =>
          !(
            message.communityId === community.id &&
            message.channelId === channelId
          )
      )
    );

    if (
      activeCommunityId === community.id &&
      activeChannel === channelId
    ) {
      const nextChannel = textChannels.find(
        (channel) => channel.id !== channelId
      );

      setActiveChannel(nextChannel?.id ?? "");
    }

    setChannelModal(null);
  };

  const modalCommunity = communities.find(
    (community) =>
      community.id === channelModal?.communityId
  );

  const modalChannel = modalCommunity?.channels.find(
    (channel) => channel.id === channelModal?.channelId
  );

  // =========================
  // MESSAGE MANAGEMENT
  // =========================

  const activeChannelName =
    activeCommunity?.channels.find(
      (channel) => channel.id === activeChannel
    )?.name ?? "";

  const handleSendMessage = (content: string) => {
    if (
      !activeCommunity ||
      !activeChannelName ||
      !content.trim()
    ) {
      return;
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      communityId: activeCommunity.id,
      channelId: activeChannel,
      username: user.username,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      avatarColor: "green",
      isOwnMessage: true,
    };

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);
  };

  const handleEditMessage = (
    messageId: string,
    content: string
  ) => {
    const updatedContent = content.trim();

    if (!updatedContent || !activeCommunity) return;

    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId &&
        message.isOwnMessage &&
        message.communityId === activeCommunity.id &&
        message.channelId === activeChannel
          ? {
              ...message,
              content: updatedContent,
              editedAt: new Date().toISOString(),
            }
          : message
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeCommunity) return;

    setMessages((previous) =>
      previous.filter(
        (message) =>
          !(
            message.id === messageId &&
            message.isOwnMessage &&
            message.communityId === activeCommunity.id &&
            message.channelId === activeChannel
          )
      )
    );
  };

  // Filter by both community and channel.
  const filteredMessages = messages.filter(
    (message) =>
      message.communityId === activeCommunity?.id &&
      message.channelId === activeChannel
  );

  // =========================
  // APPLICATION LAYOUT
  // =========================

  return (
    <div className="app-shell">
      <CommunitySidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        communities={communities}
        activeCommunityId={activeCommunity.id}
        onCommunitySelect={handleCommunitySelect}
        onCreateCommunity={() =>
          setIsCreateCommunityOpen(true)
        }
        onEditCommunity={setEditingCommunityId}
        onDeleteCommunity={setDeletingCommunityId}
      />

      <ChannelSidebar
        community={activeCommunity}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
        onCreateChannel={() =>
          setChannelModal({
            mode: "create",
            communityId: activeCommunity.id,
          })
        }
        onEditChannel={(channelId) =>
          setChannelModal({
            mode: "edit",
            communityId: activeCommunity.id,
            channelId,
          })
        }
        onDeleteChannel={(channelId) =>
          setChannelModal({
            mode: "delete",
            communityId: activeCommunity.id,
            channelId,
          })
        }
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <ChatPanel
        activeChannel={activeChannelName}
        messages={filteredMessages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />

      {isProfileOpen && (
        <ProfileSettings
          user={user}
          onSave={handleSaveProfile}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {isCreateCommunityOpen && (
        <CreateCommunity
          onCreate={handleCreateCommunity}
          onClose={() =>
            setIsCreateCommunityOpen(false)
          }
        />
      )}

      {editingCommunity && (
        <EditCommunity
          key={editingCommunity.id}
          community={editingCommunity}
          onSave={handleEditCommunity}
          onClose={() => setEditingCommunityId(null)}
        />
      )}

      {deletingCommunity && (
        <DeleteCommunity
          community={deletingCommunity}
          onConfirm={handleDeleteCommunity}
          onClose={() => setDeletingCommunityId(null)}
        />
      )}

      {channelModal &&
        modalCommunity &&
        (channelModal.mode === "create" ||
          modalChannel) && (
          <ChannelModal
            key={`${channelModal.mode}-${channelModal.channelId ?? "new"}`}
            mode={channelModal.mode}
            initialName={modalChannel?.name ?? ""}
            onSave={
              channelModal.mode === "create"
                ? handleCreateChannel
                : handleEditChannel
            }
            onDelete={handleDeleteChannel}
            onClose={() => setChannelModal(null)}
          />
        )}
    </div>
  );
}

export default App;
