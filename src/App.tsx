
import { useEffect, useState } from "react";
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

function App() {
  // Loads the previously selected theme.
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("nook-theme");

    return savedTheme === "dark" ? "dark" : "light";
  });

  const [activeChannel, setActiveChannel] = useState("general");

  // Applies and saves the selected theme.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nook-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  return (
    <div className="app-shell">
      {/* Community navigation */}
      <aside className="community-rail">
        <div className="brand-icon">n.</div>

        <button className="community-icon active" aria-label="Home">
          N
        </button>

        <button className="community-icon" aria-label="Add community">
          +
        </button>

        <div className="rail-spacer" />

        <button
          className="community-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </aside>

      {/* Channel navigation */}
      <aside className="channel-sidebar">
        <div className="workspace-title">
          <h2>My Space</h2>
          <span>⌄</span>
        </div>

        <div className="channel-group">
          <p className="group-label">TEXT CHANNELS</p>

          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${
                activeChannel === channel.id ? "selected" : ""
              }`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <span>#</span>
              {channel.name}
            </button>
          ))}
        </div>

        <div className="channel-group">
          <p className="group-label">VOICE CHANNELS</p>
          <button className="channel-item">
            <span>◉</span>
            Lounge
          </button>
        </div>

        <div className="sidebar-spacer" />

        <div className="current-user">
          <div className="user-avatar">L</div>
          <div>
            <strong>Developer</strong>
            <small>Online</small>
          </div>
          <span className="online-dot" />
        </div>
      </aside>

      {/* Main chat panel */}
      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <span className="header-hash">#</span>
            <strong>{activeChannel}</strong>
          </div>

          <span className="header-description">
            A quieter place to connect.
          </span>
        </header>

        <section className="chat-content">
          <div className="welcome-message">
            <div className="welcome-icon">#</div>
            <h1>Welcome to #{activeChannel}</h1>
            <p>
              This is the beginning of your conversation.
            </p>
          </div>

          <div className="message">
            <div className="message-avatar avatar-purple">
              A
            </div>

            <div className="message-body">
              <div className="message-meta">
                <strong>Alex</strong>
                <span>10:30 AM</span>
              </div>

              <p>Welcome to Nook! 👋</p>
            </div>
          </div>

          <div className="message">
            <div className="message-avatar avatar-green">
              S
            </div>

            <div className="message-body">
              <div className="message-meta">
                <strong>Sam</strong>
                <span>10:32 AM</span>
              </div>

              <p>
                Really liking the calm atmosphere here.
              </p>
            </div>
          </div>
        </section>

        {/* Message composer - visual placeholder for now */}
        <div className="composer-container">
          <div className="message-composer">
            <span className="composer-plus">+</span>

            <input
              type="text"
              placeholder={`Message #${activeChannel}`}
              aria-label="Message input"
              disabled
            />

            <button type="button" disabled aria-label="Send message">
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
