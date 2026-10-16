
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

// Temporary channel data until the backend is connected.
const channels: Channel[] = [
  { id: "general", name: "general" },
  { id: "projects", name: "projects" },
  { id: "random", name: "random" },
];

// Temporary messages for testing the interface.
const initialMessages: ChatMessage[] = [
  {
    id: "1",
    channelId: "general",
    username: "Alex",
    content: "Welcome to Nook! 👋",
    timestamp: "10:30 AM",
    avatarColor: "purple",
  },
  {
    id: "2",
    channelId: "general",
    username: "Sam",
    content: "Really liking the calm atmosphere here.",
    timestamp: "10:32 AM",
    avatarColor: "green",
  },
  {
    id: "3",
    channelId: "projects",
    username: "Alex",
    content: "What are you working on today?",
    timestamp: "11:00 AM",
    avatarColor: "purple",
  },
  {
    id: "4",
    channelId: "random",
    username: "Sam",
    content: "Anyone listening to something good?",
    timestamp: "11:15 AM",
    avatarColor: "green",
  },
];

function App() {
  // Loads the saved theme or defaults to light mode.
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("nook-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  const [activeChannel, setActiveChannel] = useState("general");

  // Stores all messages across different channels.
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  // Creates a new message for the selected channel.
  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      channelId: activeChannel,
      username: "Developer",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatarColor: "green",
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage,
    ]);
  };

  // Only show messages from the selected channel.
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
      />
    </div>
  );
}

export default App;
