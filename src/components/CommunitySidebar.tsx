
import { useEffect, useRef, useState } from "react";
import type { Community } from "../types/Community";

type CommunitySidebarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onCreateCommunity: () => void;
  communities: Community[];
  activeCommunityId: string;
  onCommunitySelect: (communityId: string) => void;
  onEditCommunity: (communityId: string) => void;
  onDeleteCommunity: (communityId: string) => void;
};

function CommunitySidebar({
  theme,
  onToggleTheme,
  onCreateCommunity,
  communities,
  activeCommunityId,
  onCommunitySelect,
  onEditCommunity,
  onDeleteCommunity,
}: CommunitySidebarProps) {
  const [menuCommunityId, setMenuCommunityId] =
    useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuCommunityId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuCommunityId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuCommunityId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuCommunityId]);

  return (
    <aside className="community-rail">
      <div className="brand-icon">n.</div>

      {communities.map((community) => (
        <div
          key={community.id}
          className="community-item-wrapper"
          ref={
            menuCommunityId === community.id
              ? menuRef
              : undefined
          }
        >
          <button
            type="button"
            className={`community-icon ${
              activeCommunityId === community.id
                ? "active"
                : ""
            }`}
            onClick={() => {
              setMenuCommunityId(null);
              onCommunitySelect(community.id);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              setMenuCommunityId(community.id);
            }}
            title={community.name}
            aria-label={`Open ${community.name}`}
            aria-pressed={
              activeCommunityId === community.id
            }
          >
            {community.icon}
          </button>

          {menuCommunityId === community.id && (
            <div className="community-context-menu">
              <button
                type="button"
                onClick={() => {
                  setMenuCommunityId(null);
                  onEditCommunity(community.id);
                }}
              >
                Edit community
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  setMenuCommunityId(null);
                  onDeleteCommunity(community.id);
                }}
              >
                Delete community
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        className="community-icon"
        type="button"
        onClick={onCreateCommunity}
        aria-label="Create community"
        title="Create community"
      >
        +
      </button>

      <div className="rail-spacer" />

      <button
        className="community-icon"
        type="button"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === "light" ? "☾" : "☀"}
      </button>
    </aside>
  );
}

export default CommunitySidebar;
