
import type { Community } from "../types/Community";

type CommunitySidebarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onCreateCommunity: () => void;
  communities: Community[];
  activeCommunityId: string;
  onCommunitySelect: (communityId: string) => void;
};

function CommunitySidebar({
  theme,
  onToggleTheme,
  communities,
  activeCommunityId,
  onCommunitySelect,
  onCreateCommunity,
}: CommunitySidebarProps) {
  return (
    <aside className="community-rail">
      {/* Nook brand */}
      <div className="brand-icon">n.</div>

      {/* Community list */}
      {communities.map((community) => (
        <button
          key={community.id}
          type="button"
          className={`community-icon ${
            activeCommunityId === community.id ? "active" : ""
          }`}
          onClick={() => onCommunitySelect(community.id)}
          title={community.name}
          aria-label={`Open ${community.name}`}
          aria-pressed={activeCommunityId === community.id}
        >
          {community.icon}
        </button>
      ))}

      {/* Create community button - coming later */}
      
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

      {/* Theme toggle */}
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
