
import { useEffect, useRef, useState, type FormEvent } from "react";
import Message, { type ChatMessage } from "./Message";

type ChatPanelProps = {
  activeChannel: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
};

function ChatPanel({
  activeChannel,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}: ChatPanelProps) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scrolls to the latest message when the channel or message count changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeChannel, messages.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = messageInput.trim();

    if (!content) return;

    onSendMessage(content);
    setMessageInput("");
  };

  return (
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
          <p>This is the beginning of your conversation.</p>
        </div>

        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
          />
        ))}

        <div ref={messagesEndRef} />
      </section>

      <div className="composer-container">
        <form className="message-composer" onSubmit={handleSubmit}>
          <span className="composer-plus">+</span>

          <input
            type="text"
            placeholder={`Message #${activeChannel}`}
            aria-label="Message input"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={!messageInput.trim()}
          >
            ➤
          </button>
        </form>
      </div>
    </main>
  );
}

export default ChatPanel;
