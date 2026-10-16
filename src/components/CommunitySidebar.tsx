
type CommunitySidebarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function CommunitySidebar({
  theme,
  onToggleTheme,
}: CommunitySidebarProps) {
  return (
    <aside className="community-rail">
      <div className="brand-icon">n.</div>

      <button
        className="community-icon active"
        aria-label="Home"
      >
        N
      </button>

      <button
        className="community-icon"
        aria-label="Add community"
      >
        +
      </button>

      <div className="rail-spacer" />

      <button
        className="community-icon"
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
