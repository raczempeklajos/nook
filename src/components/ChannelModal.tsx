
import { useState, type FormEvent } from "react";

type ChannelModalProps = {
  mode: "create" | "edit" | "delete";
  initialName?: string;
  onSave: (name: string) => void;
  onDelete: () => void;
  onClose: () => void;
};

function ChannelModal({
  mode,
  initialName = "",
  onSave,
  onDelete,
  onClose,
}: ChannelModalProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!trimmedName) return;

    onSave(trimmedName);
  };

  const title =
    mode === "create"
      ? "Create text channel"
      : mode === "edit"
        ? "Edit text channel"
        : "Delete text channel";

  return (
    <div
      className="settings-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="settings-panel"
        role={mode === "delete" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="channel-modal-title"
      >
        <div className="settings-header">
          <div>
            <h2 id="channel-modal-title">{title}</h2>
            <p>
              {mode === "create"
                ? "Add a new channel to your community."
                : mode === "edit"
                  ? "Change the channel name."
                  : "This action cannot be undone."}
            </p>
          </div>

          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {mode === "delete" ? (
          <>
            <p className="community-delete-warning">
              Are you sure you want to delete{" "}
              <strong>#{initialName}</strong>?
              The channel and its messages will be removed.
            </p>

            <div className="settings-actions">
              <button
                type="button"
                className="settings-cancel"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="settings-delete"
                onClick={onDelete}
              >
                Delete channel
              </button>
            </div>
          </>
        ) : (
          <form
            className="settings-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="channel-name">
              Channel name
            </label>

            <input
              id="channel-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. general"
              maxLength={40}
              required
              autoFocus
            />

            <div className="settings-actions">
              <button
                type="button"
                className="settings-cancel"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="settings-save"
              >
                {mode === "create"
                  ? "Create channel"
                  : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChannelModal;
