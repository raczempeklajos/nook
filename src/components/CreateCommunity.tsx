
import { useState } from "react";

type CreateCommunityProps = {
  onCreate: (name: string, icon: string) => void;
  onClose: () => void;
};

function CreateCommunity({
  onCreate,
  onClose,
}: CreateCommunityProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedIcon = icon.trim();

    if (!trimmedName) return;

    onCreate(
      trimmedName,
      trimmedIcon || trimmedName.charAt(0).toUpperCase()
    );
  };

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-community-title"
      >
        <div className="settings-header">
          <h2 id="create-community-title">
            Create a community
          </h2>

          <button
            className="settings-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          className="settings-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="community-name">
            Community name
          </label>

          <input
            id="community-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. Design Club"
            maxLength={40}
            required
            autoFocus
          />

          <label htmlFor="community-icon">
            Community icon
          </label>

          <input
            id="community-icon"
            type="text"
            value={icon}
            onChange={(event) =>
              setIcon(event.target.value)
            }
            placeholder="e.g. D"
            maxLength={2}
          />

          <div className="settings-actions">
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              Create community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
