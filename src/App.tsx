
import { useEffect, useState } from "react";
import CommunitySidebar from "./components/CommunitySidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatPanel from "./components/ChatPanel";
import ProfileSettings from "./components/ProfileSettings";
import CreateCommunity from "./components/CreateCommunity";
import EditCommunity from "./components/EditCommunity";
import DeleteCommunity from "./components/DeleteCommunity";

import type { ChatMessage } from "./components/Message";
import { defaultUser, type UserProfile } from "./types/User";
import { initialCommunities } from "./data/communities";
import type { Community } from "./types/Community";

import "./App.css";

type Theme = "light" | "dark";

// Temporary messages for testing the application.
const initialMessages: ChatMessage[] = [
  {
    id: "1",
    channelId: "general",
    username: "Alex",
    content: "Welcome to Nook! 👋",
    createdAt: "2026-10-16T10:30:00",
    avatarColor: "purple",
    isOwnMessage: false,
  },
  {
    id: "2",
    channelId: "general",
    username: "Sam",
    content: "Really liking the calm atmosphere here.",
    createdAt: "2026-10-16T10:32:00",
    avatarColor: "green",
    isOwnMessage: false,
  },
  {
    id: "3",
    channelId: "projects",
    username: "Alex",
    content: "What are you working on today?",
    createdAt: "2026-10-16T11:00:00",
    avatarColor: "purple",
    isOwnMessage: false,
  },
  {
    id: "4",
    channelId: "random",
    username: "Sam",
    content: "Anyone listening to something good?",
    createdAt: "2026-10-16T11:15:00",
    avatarColor: "green",
    isOwnMessage: false,
  },
];

function App() {
  // =========================
  // THEME
  // =========================

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("nook-theme");
    return savedTheme === "dark" ? "dark" : "light";
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

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem("nook-user");

      if (savedUser) {
        const parsedUser: unknown = JSON.parse(savedUser);

        if (
          typeof parsedUser === "object" &&
          parsedUser !== null &&
          "username" in parsedUser &&
          typeof parsedUser.username === "string" &&
          parsedUser.username.trim().length > 0 &&
          "bio" in parsedUser &&
          typeof parsedUser.bio === "string" &&
          "status" in parsedUser &&
          (parsedUser.status === "online" ||
            parsedUser.status === "away" ||
            parsedUser.status === "dnd" ||
            parsedUser.status === "invisible")
        ) {
          return {
            ...defaultUser,
            username: parsedUser.username,
            bio: parsedUser.bio,
            status: parsedUser.status,
          };
        }
      }
    } catch {
      // Ignore invalid saved profile data.
    }

    return defaultUser;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const [communities, setCommunities] = useState<Community[]>(
    () => {
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
        // Ignore invalid saved community data.
      }

      return initialCommunities;
    }
  );

  const [activeCommunityId, setActiveCommunityId] =
    useState("my-space");

  const [activeChannel, setActiveChannel] =
    useState("general");

  // Community modal states
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] =
    useState(false);

  const [editingCommunityId, setEditingCommunityId] =
    useState<string | null>(null);

  const [deletingCommunityId, setDeletingCommunityId] =
    useState<string | null>(null);

  // Save communities
  const saveCommunities = (updated: Community[]) => {
    setCommunities(updated);

    localStorage.setItem(
      "nook-communities",
      JSON.stringify(updated)
    );
  };

  // Currently selected community
  const activeCommunity =
    communities.find(
      (community) => community.id === activeCommunityId
    ) ?? communities[0];

  // Switch community
  const handleCommunitySelect = (communityId: string) => {
    const selectedCommunity = communities.find(
      (community) => community.id === communityId
    );

    if (!selectedCommunity) return;

    setActiveCommunityId(communityId);

    const firstTextChannel = selectedCommunity.channels.find(
      (channel) => channel.type === "text"
    );

    setActiveChannel(firstTextChannel?.id ?? "");
  };

  // Create community
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

  // Edit community
  const handleEditCommunity = (
    id: string,
    name: string,
    icon: string
  ) => {
    const updated = communities.map((community) =>
      community.id === id
        ? {
            ...community,
            name,
            icon,
          }
        : community
    );

    saveCommunities(updated);
    setEditingCommunityId(null);
  };

  // Delete community
  const handleDeleteCommunity = (id: string) => {
    // Always keep at least one community.
    if (communities.length <= 1) {
      setDeletingCommunityId(null);
      return;
    }

    const deletedCommunity = communities.find(
      (community) => community.id === id
    );

    if (!deletedCommunity) {
      setDeletingCommunityId(null);
      return;
    }

    const updated = communities.filter(
      (community) => community.id !== id
    );

    saveCommunities(updated);

    // Remove messages belonging to deleted channels.
    const deletedChannelIds = new Set(
      deletedCommunity.channels.map((channel) => channel.id)
    );

    setMessages((previous) =>
      previous.filter(
        (message) =>
          !deletedChannelIds.has(message.channelId)
      )
    );

    // Select another community if the active one was deleted.
    if (activeCommunityId === id) {
      const nextCommunity = updated[0];

      setActiveCommunityId(nextCommunity.id);

      const firstTextChannel = nextCommunity.channels.find(
        (channel) => channel.type === "text"
      );

      setActiveChannel(firstTextChannel?.id ?? "");
    }

    setDeletingCommunityId(null);
  };

  // Selected community for editing
  const editingCommunity = communities.find(
    (community) => community.id === editingCommunityId
  );

  // Selected community for deletion
  const deletingCommunity = communities.find(
    (community) => community.id === deletingCommunityId
  );

  // =========================
  // CHANNELS
  // =========================

  const activeChannelName =
    activeCommunity?.channels.find(
      (channel) => channel.id === activeChannel
    )?.name ?? "";

  // =========================
  // MESSAGES
  // =========================

  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  // Send message
  const handleSendMessage = (content: string) => {
    if (!activeChannelName || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
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

  // Edit message
  const handleEditMessage = (
    messageId: string,
    content: string
  ) => {
    const updatedContent = content.trim();

    if (!updatedContent) return;

    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId &&
        message.isOwnMessage
          ? {
              ...message,
              content: updatedContent,
              editedAt: new Date().toISOString(),
            }
          : message
      )
    );
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((previous) =>
      previous.filter(
        (message) =>
          message.id !== messageId ||
          !message.isOwnMessage
      )
    );
  };

  // Messages for active channel
  const filteredMessages = messages.filter(
    (message) => message.channelId === activeChannel
  );

  // =========================
  // APPLICATION LAYOUT
  // =========================

  return (
    <div className="app-shell">
      {/* Community sidebar */}
      <CommunitySidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        communities={communities}
        activeCommunityId={activeCommunityId}
        onCommunitySelect={handleCommunitySelect}
        onCreateCommunity={() =>
          setIsCreateCommunityOpen(true)
        }
        onEditCommunity={setEditingCommunityId}
        onDeleteCommunity={setDeletingCommunityId}
      />

      {/* Channel sidebar */}
      {activeCommunity && (
        <ChannelSidebar
          community={activeCommunity}
          activeChannel={activeChannel}
          onChannelSelect={setActiveChannel}
          user={user}
          onOpenProfile={() =>
            setIsProfileOpen(true)
          }
        />
      )}

      {/* Chat */}
      <ChatPanel
        activeChannel={activeChannelName}
        messages={filteredMessages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* Profile settings */}
      {isProfileOpen && (
        <ProfileSettings
          user={user}
          onSave={handleSaveProfile}
          onClose={() =>
            setIsProfileOpen(false)
          }
        />
      )}

      {/* Create community */}
      {isCreateCommunityOpen && (
        <CreateCommunity
          onCreate={handleCreateCommunity}
          onClose={() =>
            setIsCreateCommunityOpen(false)
          }
        />
      )}

      {/* Edit community */}
      {editingCommunity && (
        <EditCommunity
          key={editingCommunity.id}
          community={editingCommunity}
          onSave={handleEditCommunity}
          onClose={() =>
            setEditingCommunityId(null)
          }
        />
      )}

      {/* Delete community */}
      {deletingCommunity && (
        <DeleteCommunity
          community={deletingCommunity}
          onConfirm={handleDeleteCommunity}
          onClose={() =>
            setDeletingCommunityId(null)
          }
        />
      )}
    </div>
  );
}

export default App;
