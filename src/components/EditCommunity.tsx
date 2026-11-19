
import { useState, type FormEvent } from "react";
import type { Community } from "../types/Community";

type EditCommunityProps = {
  community: Community;
  onSave: (id: string, name: string, icon: string) => void;
  onClose: () => void;
};

function EditCommunity({
  community,
  onSave,
  onClose,
}: EditCommunityProps) {
  const [name, setName] = useState(community.name);
  const [icon, setIcon] = useState(community.icon);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedIcon = icon.trim();

    if (!trimmedName) return;

    onSave(
      community.id,
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
        aria-labelledby="edit-community-title"
      >
        <div className="settings-header">
          <h2 id="edit-community-title">Edit community</h2>
          <button
            type="button"
            className="settings-close"
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
          <label htmlFor="edit-community-name">
            Community name
          </label>
          <input
            id="edit-community-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={40}
            required
            autoFocus
          />

          <label htmlFor="edit-community-icon">
            Community icon
          </label>
          <input
            id="edit-community-icon"
            value={icon}
            onChange={(event) =>
              setIcon(event.target.value)
            }
            maxLength={2}
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCommunity;
