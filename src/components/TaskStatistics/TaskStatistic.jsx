import React, { useContext } from 'react';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import './TaskStatistics.scss';
import AppContext from '../../context/AppContext';



const TaskStatistics=({
  totalTasks,
  completedTasks,
  inProgressTasks,
  className = ''
}) => {
  const {statistics} =useContext(AppContext);
  const completionRate = statistics && Math.round((statistics.done / statistics.total) * 100) ?Math.round((statistics.done / statistics.total) * 100):0 ;
  const pendingTasks = statistics && statistics.pending;

  const stats = [
    {
      id: 'total',
      label: 'Tổng nhiệm vụ',
      value: statistics && statistics.total,
      icon: Target,
      color: 'blue',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'completed',
      label: 'Đã hoàn thành',
      value: statistics&& statistics.done,
      icon: CheckCircle,
      color: 'green',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'inProgress',
      label: 'Đang thực hiện',
      value: statistics&&statistics.pending,
      icon: Clock,
      color: 'orange',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      id: 'completion',
      label: 'Tỉ lệ hoàn thành',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'purple',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
  ];

  return (
    <div className={`task-statistics ${className}`}>
      <div className="statistics-header">
        <h2 className="statistics-title">Thống kê nhiệm vụ</h2>
        <p className="statistics-subtitle">Tổng quan về tiến độ công việc</p>
      </div>
      
      <div className="statistics-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.id} 
              className={`stat-card stat-card--${stat.color}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card__background">
                <div 
                  className="stat-card__gradient"
                  style={{ background: stat.gradient }}
                ></div>
              </div>
              
              <div className="stat-card__content">
                <div className="stat-card__icon">
                  <IconComponent size={24} />
                </div>
                
                <div className="stat-card__info">
                  <div className="stat-card__value" data-value={stat.value}>
                    {stat.value}
                  </div>
                  <div className="stat-card__label">{stat.label}</div>
                </div>
              </div>
              
              <div className="stat-card__shine"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskStatistics;