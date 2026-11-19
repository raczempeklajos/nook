
import type { Community } from "../types/Community";

type DeleteCommunityProps = {
  community: Community;
  onConfirm: (id: string) => void;
  onClose: () => void;
};

function DeleteCommunity({
  community,
  onConfirm,
  onClose,
}: DeleteCommunityProps) {
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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-community-title"
        aria-describedby="delete-community-description"
      >
        <div className="settings-header">
          <h2 id="delete-community-title">
            Delete community
          </h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p
          id="delete-community-description"
          className="community-delete-warning"
        >
          Are you sure you want to delete{" "}
          <strong>{community.name}</strong>?
          This action cannot be undone.
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
            onClick={() => onConfirm(community.id)}
          >
            Delete community
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCommunity;
