
import { useEffect, useState } from "react";
import CommunitySidebar from "./components/CommunitySidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatPanel from "./components/ChatPanel";
import ProfileSettings from "./components/ProfileSettings";
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
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("nook-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  // User profile state
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

  // Profile settings visibility
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Community state
  const [communities] =
    useState<Community[]>(initialCommunities);

  // Currently selected community
  const [activeCommunityId, setActiveCommunityId] =
    useState("my-space");

  // Currently selected text channel
  const [activeChannel, setActiveChannel] =
    useState("general");

  // Message state
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  // Save theme changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

  // Toggle light and dark mode
  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  // Save user profile
  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);

    localStorage.setItem(
      "nook-user",
      JSON.stringify(updatedUser)
    );
  };

  // Find the currently selected community
  const activeCommunity =
    communities.find(
      (community) => community.id === activeCommunityId
    ) ?? communities[0];

  // Switch community and select its first text channel
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

  // Find the selected channel's display name
  const activeChannelName =
    activeCommunity.channels.find(
      (channel) => channel.id === activeChannel
    )?.name ?? "";

  // Add a new message
  const handleSendMessage = (content: string) => {
    if (!activeChannelName) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      channelId: activeChannel,
      username: user.username,
      content,
      createdAt: new Date().toISOString(),
      avatarColor: "green",
      isOwnMessage: true,
    };

    setMessages((previous) => [...previous, newMessage]);
  };

  // Edit an existing own message
  const handleEditMessage = (
    messageId: string,
    content: string
  ) => {
    const updatedContent = content.trim();

    if (!updatedContent) return;

    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId && message.isOwnMessage
          ? {
              ...message,
              content: updatedContent,
              editedAt: new Date().toISOString(),
            }
          : message
      )
    );
  };

  // Delete an existing own message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((previous) =>
      previous.filter(
        (message) =>
          message.id !== messageId || !message.isOwnMessage
      )
    );
  };

  // Filter messages by selected channel
  const filteredMessages = messages.filter(
    (message) => message.channelId === activeChannel
  );

  return (
    <div className="app-shell">
      <CommunitySidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        communities={communities}
        activeCommunityId={activeCommunityId}
        onCommunitySelect={handleCommunitySelect}
      />

      <ChannelSidebar
        community={activeCommunity}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
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

      {/* Profile settings modal */}
      {isProfileOpen && (
        <ProfileSettings
          user={user}
          onSave={handleSaveProfile}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
