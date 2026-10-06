function Topbar({ darkMode, setDarkMode }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span>Water Intelligence</span>
          <span>/</span>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-button" title="Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>

        <button
          className="icon-button"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="user-profile">
          <div className="avatar">SE</div>

          <div className="user-info">
            <strong>Sebin Eapen</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;