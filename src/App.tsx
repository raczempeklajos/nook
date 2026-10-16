
import { useEffect, useState } from "react";
import CommunitySidebar from "./components/CommunitySidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatPanel from "./components/ChatPanel";
import ProfileSettings from "./components/ProfileSettings";
import type { ChatMessage } from "./components/Message";
import { defaultUser, type UserProfile } from "./types/User";
import "./App.css";

type Theme = "light" | "dark";

type Channel = {
  id: string;
  name: string;
};

const channels: Channel[] = [
  { id: "general", name: "general" },
  { id: "projects", name: "projects" },
  { id: "random", name: "random" },
];

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

  // Channel and message states
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  // Save theme changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

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

  // Add a new message
  const handleSendMessage = (content: string) => {
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

  // Filter messages by active channel
  const filteredMessages = messages.filter(
    (message) => message.channelId === activeChannel
  );

  return (
    <div className="app-shell">
      <CommunitySidebar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ChannelSidebar
        channels={channels}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <ChatPanel
        activeChannel={activeChannel}
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
