import React from 'react';

const StatsRadar = ({ stats }) => {
  const maxStat = 150;
  const statsList = [
    { label: 'HP', value: stats.HP, color: '#ef4444' },
    { label: 'ATK', value: stats.Attack, color: '#f97316' },
    { label: 'DEF', value: stats.Defense, color: '#eab308' },
    { label: 'SP.ATK', value: stats.SpecialAttack, color: '#3b82f6' },
    { label: 'SP.DEF', value: stats.SpecialDefense, color: '#8b5cf6' },
    { label: 'SPD', value: stats.Speed, color: '#ec4899' }
  ];

  const angleSlice = (Math.PI * 2) / statsList.length;
  const radius = 100;
  const centerX = 150;
  const centerY = 150;

  const points = statsList.map((stat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + (radius * (stat.value / maxStat)) * Math.cos(angle);
    const y = centerY + (radius * (stat.value / maxStat)) * Math.sin(angle);
    return { x, y, ...stat };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const gridPoints = [0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
    return statsList.map((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + (radius * ratio) * Math.cos(angle);
      const y = centerY + (radius * ratio) * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  const labelPositions = statsList.map((stat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + (radius + 40) * Math.cos(angle);
    const y = centerY + (radius + 40) * Math.sin(angle);
    return { x, y, ...stat };
  });

  return (
    <div className="stats-radar-container">
      <svg width={300} height={300} className="stats-radar-svg">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {gridPoints.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        <polygon
          points={polygonPoints}
          fill="url(#radarGradient)"
          stroke="#4f46e5"
          strokeWidth={2}
        />

        {points.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={point.color}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {labelPositions.map((pos, i) => (
          <g key={`label-${i}`}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className="stats-radar-label-text"
              fill={pos.color}
            >
              {pos.label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 16}
              textAnchor="middle"
              className="stats-radar-value-text"
            >
              {pos.value}
            </text>
          </g>
        ))}
      </svg>

      <div className="stats-list">
        {statsList.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-item-header">
              <span className="stat-item-label">{stat.label}</span>
              <span className="stat-item-value">{stat.value}</span>
            </div>
            <div className="stat-item-bar">
              <div
                className="stat-item-fill"
                style={{
                  width: `${(stat.value / maxStat) * 100}%`,
                  backgroundColor: stat.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsRadar;
