import React, { useState, useEffect } from "react";
import { 
  FaPaw, 
  FaUserFriends, 
  FaHeartbeat, 
  FaClipboardList
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./AdminStyles.css";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    totalAdoptions: 0,
    totalRescues: 0,
    activeRescues: 0,
    totalVolunteers: 0,
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/metrics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMetrics();
    }
  }, [token]);

  // Line Chart Logic
  const generateLineChart = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendMap = {};
    metrics.monthlyTrends?.forEach(t => { trendMap[t._id.month - 1] = t.count; });
    const maxVal = Math.max(...Object.values(trendMap), 10);
    const width = 1000, height = 300, padding = 40;
    const points = months.map((_, i) => {
      const x = (i / (months.length - 1)) * (width - 2 * padding) + padding;
      const count = trendMap[i] || 0;
      const y = height - ((count / maxVal) * (height - 2 * padding) + padding);
      return { x, y, count, month: _ };
    });
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const fillPath = `${linePath} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <div className="line-chart-outer">
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1={padding} y1={padding + (i * (height - 2 * padding) / 3)} x2={width - padding} y2={padding + (i * (height - 2 * padding) / 3)} stroke="var(--border)" strokeDasharray="4 4" />
          ))}
          <path d={fillPath} fill="url(#lineGradient)" />
          <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i} className="chart-point-group">
              <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="var(--primary)" strokeWidth="3" className="chart-dot" />
              <text x={p.x} y={height - 5} textAnchor="middle" className="chart-axis-label">{p.month}</text>
              <rect x={p.x - 20} y={0} width="40" height={height} fill="transparent" className="point-trigger" />
              <g className="chart-tooltip-popup">
                 <rect x={p.x - 35} y={p.y - 45} width="70" height="30" rx="6" fill="var(--text-heading)" />
                 <text x={p.x} y={p.y - 25} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{p.count}</text>
              </g>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Donut Chart Logic (Integrated Database Data)
  const generateDonutChart = () => {
    const data = [
      { label: "Animals", value: metrics.totalAnimals || 0, color: "var(--primary)" },
      { label: "Adoptions", value: metrics.totalAdoptions || 0, color: "var(--secondary)" },
      { label: "Rescues", value: metrics.totalRescues || 0, color: "var(--accent)" }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <div className="donut-chart-container">
        <svg viewBox="0 0 200 200" className="donut-svg">
          {data.map((item, i) => {
            const percentage = (item.value / total) * 100;
            const strokeDash = (percentage * circumference) / 100;
            const currentOffset = offset;
            offset += strokeDash;
            
            return (
              <circle
                key={item.label}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeDashoffset={-currentOffset}
                className="donut-segment"
              />
            );
          })}
          <text x="100" y="85" textAnchor="middle" className="donut-center-text-label">{currentYear} FOCUS</text>
          <text x="100" y="115" textAnchor="middle" className="donut-center-text-value">{total}</text>
        </svg>
        
        <div className="donut-legend">
          {data.map(item => (
            <div key={item.label} className="legend-item-donut">
               <span className="legend-color" style={{ backgroundColor: item.color }}></span>
               <span className="legend-label">{item.label}</span>
               <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="admin-loading">Initializing Dashboard Analytics...</div>;
  }

  return (
    <div className="dashboard-content-wrapper">
      {/* Top Level Quick Metrics */}
      <section className="stats-grid">
        <StatCard icon={<FaPaw />} value={metrics.totalAnimals || 0} label="Total Animals" color="green" trend="Total in system" isUp={true}/>
        <StatCard icon={<FaClipboardList />} value={metrics.totalAdoptions || 0} label="Adoption Request" color="blue" trend="All applications" isUp={true}/>
        <StatCard icon={<FaHeartbeat />} value={metrics.activeRescues || 0} label="Active Case" color="orange" trend="Current reports" isUp={false}/>
        <StatCard icon={<FaUserFriends />} value={metrics.totalVolunteers || 0} label="Volunteers" color="purple" trend="Active network" isUp={true}/>
      </section>

      {/* Analytics Row: Line Chart + Donut Chart */}
      <div className="dashboard-grid analytics-row">
        
        {/* Line Chart Section */}
        <div className="card performance-card">
          <div className="card-header dashboard-card-header">
            <div className="header-info">
              <h2>Performance Trend</h2>
              <p>Database engagement activities per month</p>
            </div>
          </div>
          <div className="chart-wrapper">
             {generateLineChart()}
          </div>
        </div>

        {/* Donut Chart Section - Fixed Heading */}
        <div className="card distribution-card">
          <div className="card-header dashboard-card-header">
            <div className="header-info">
              <h2>Activity Mix</h2>
              <p>Year {currentYear} overall focus distribution</p>
            </div>
          </div>
          <div className="chart-wrapper">
             {generateDonutChart()}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, trend, isUp }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-details">
        <h3>{label}</h3>
        <div className="stat-value">{value}</div>
        <div className={`stat-trend ${isUp ? 'up' : 'down'}`}>
           {trend}
        </div>
      </div>
    </div>
  );
}