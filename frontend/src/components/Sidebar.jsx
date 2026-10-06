function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "monitoring", icon: "◉", label: "Live Monitoring" },
    { id: "analytics", icon: "⌁", label: "Analytics" },
    { id: "devices", icon: "▣", label: "Devices" },
    { id: "map", icon: "⌖", label: "Water Map" },
    { id: "alerts", icon: "⚠", label: "Alerts" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">💧</div>

        <div>
          <h2>WaterIQ</h2>
          <span>Water Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;