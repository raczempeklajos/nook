
export type ChatMessage = {
  id: string;
  channelId: string;
  username: string;
  content: string;
  createdAt: string;
  editedAt?: string;
  avatarColor: "purple" | "green";
  isOwnMessage: boolean;
};

type MessageProps = {
  message: ChatMessage;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
};

import { useState } from "react";

function Message({ message, onEdit, onDelete }: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const handleSave = () => {
    const content = editedContent.trim();

    if (!content) return;

    onEdit(message.id, content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  return (
    <article className="message">
      <div className={`message-avatar avatar-${message.avatarColor}`}>
        {message.username.charAt(0).toUpperCase()}
      </div>

      <div className="message-body">
        <div className="message-meta">
          <strong>{message.username}</strong>
          <time dateTime={message.createdAt} title={new Date(message.createdAt).toLocaleString()}>
            {formattedTime}
          </time>
          {message.editedAt && <span>(edited)</span>}
        </div>

        {isEditing ? (
          <div className="message-edit">
            <input
              type="text"
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSave();
                if (event.key === "Escape") handleCancel();
              }}
              aria-label="Edit message"
            />

            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <p>{message.content}</p>
        )}

        {message.isOwnMessage && !isEditing && (
          <div className="message-actions">
            <button
              onClick={() => {
                setEditedContent(message.content);
                setIsEditing(true);
              }}
            >
              Edit
            </button>

            <button onClick={() => onDelete(message.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default Message;
