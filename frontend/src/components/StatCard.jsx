function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "blue",
  children,
}) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-title">
          {title}
        </span>
      </div>

      {children ? (
        children
      ) : (
        <>
          <div className="stat-value">
            {value}
          </div>

          <div className="stat-subtitle">
            {subtitle}
          </div>
        </>
      )}
    </div>
  );
}

export default StatCard;