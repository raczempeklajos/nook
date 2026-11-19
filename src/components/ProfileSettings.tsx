
import { useState, type FormEvent } from "react";
import type {
  UserProfile,
  UserStatus,
} from "../types/User";

type ProfileSettingsProps = {
  user: UserProfile;
  onSave: (user: UserProfile) => Promise<void>;
  onClose: () => void;
};

function ProfileSettings({
  user,
  onSave,
  onClose,
}: ProfileSettingsProps) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [status, setStatus] = useState<UserStatus>(
    user.status
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        ...user,
        username: trimmedUsername,
        bio: bio.trim(),
        status,
      });

      onClose();
    } catch (saveError) {
      console.error("Profile save failed:", saveError);

      setError(
        "Could not save your profile. Check that the backend is running and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="settings-backdrop"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <section
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-header">
          <div>
            <h2 id="profile-settings-title">
              My Profile
            </h2>
            <p>Make your space feel like you.</p>
          </div>

          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="settings-form"
        >
          <div className="profile-preview">
            <div className="profile-avatar">
              {username.trim().charAt(0).toUpperCase() ||
                "?"}
            </div>

            <div>
              <strong>
                {username || "Your name"}
              </strong>
              <small>Personal profile</small>
            </div>
          </div>

          <label htmlFor="profile-username">
            Username
          </label>

          <input
            id="profile-username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            maxLength={32}
            required
            disabled={isSaving}
          />

          <label htmlFor="profile-bio">
            About me
          </label>

          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            maxLength={160}
            rows={3}
            disabled={isSaving}
          />

          <label htmlFor="profile-status">
            Status
          </label>

          <select
            id="profile-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as UserStatus
              )
            }
            disabled={isSaving}
          >
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="dnd">
              Do Not Disturb
            </option>
            <option value="invisible">
              Invisible
            </option>
          </select>

          {error && (
            <p role="alert" style={{ color: "#d9534f" }}>
              {error}
            </p>
          )}

          <div className="settings-actions">
            <button
              type="button"
              className="settings-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="settings-save"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProfileSettings;
