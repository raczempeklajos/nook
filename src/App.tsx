
import { useEffect, useState } from "react";
import CommunitySidebar from "./components/CommunitySidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatPanel from "./components/ChatPanel";
import type { ChatMessage } from "./components/Message";
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
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("nook-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  // Adds a new message to the currently selected channel.
  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      channelId: activeChannel,
      username: "Developer",
      content,
      createdAt: new Date().toISOString(),
      avatarColor: "green",
      isOwnMessage: true,
    };

    setMessages((previous) => [...previous, newMessage]);
  };

  // Updates the content of an existing own message.
  const handleEditMessage = (messageId: string, content: string) => {
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

  // Removes an own message from the local message list.
  const handleDeleteMessage = (messageId: string) => {
    setMessages((previous) =>
      previous.filter(
        (message) =>
          message.id !== messageId || !message.isOwnMessage
      )
    );
  };

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
      />

      <ChatPanel
        activeChannel={activeChannel}
        messages={filteredMessages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}

export default App;
