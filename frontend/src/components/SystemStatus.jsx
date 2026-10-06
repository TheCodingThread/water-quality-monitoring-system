function SystemStatus() {
  return (
    <div className="system-status-card">
      <div className="section-heading">
        <div>
          <h2>System Status</h2>
          <p>Current platform health</p>
        </div>

        <span className="live-badge">
          <span className="live-dot"></span>
          LIVE
        </span>
      </div>

      <div className="system-status-list">
        <div className="system-status-row">
          <div className="system-status-name">
            <span className="service-icon">⚡</span>

            <div>
              <strong>API Server</strong>
              <small>Backend service</small>
            </div>
          </div>

          <span className="service-online">
            Online
          </span>
        </div>

        <div className="system-status-row">
          <div className="system-status-name">
            <span className="service-icon">🗄️</span>

            <div>
              <strong>Database</strong>
              <small>MongoDB Atlas</small>
            </div>
          </div>

          <span className="service-online">
            Connected
          </span>
        </div>

        <div className="system-status-row">
          <div className="system-status-name">
            <span className="service-icon">📡</span>

            <div>
              <strong>Sensor Stream</strong>
              <small>Live data polling</small>
            </div>
          </div>

          <span className="service-online">
            Active
          </span>
        </div>
      </div>

      <div className="last-update">
        Data refresh interval: <strong>5 seconds</strong>
      </div>
    </div>
  );
}

export default SystemStatus;