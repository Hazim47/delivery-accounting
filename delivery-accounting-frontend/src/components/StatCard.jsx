import "./StatCard.css";

function StatCard({
  title,
  value,
  icon
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-header">

        <span className="stat-title">
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <h2 className="stat-value">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;