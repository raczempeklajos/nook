
export type ChatMessage = {
  id: string;
  channelId: string;
  username: string;
  content: string;
  timestamp: string;
  avatarColor: "purple" | "green";
};

type MessageProps = {
  message: ChatMessage;
};

function Message({ message }: MessageProps) {
  return (
    <article className="message">
      <div
        className={`message-avatar avatar-${message.avatarColor}`}
      >
        {message.username.charAt(0).toUpperCase()}
      </div>

      <div className="message-body">
        <div className="message-meta">
          <strong>{message.username}</strong>
          <span>{message.timestamp}</span>
        </div>

        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default Message;
