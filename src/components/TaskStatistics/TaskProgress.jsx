import React, { useEffect, useState, useRef, useContext } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import './TaskProgress.scss';
import AppContext from '../../context/AppContext';


const TaskProgress= ({
  totalTasks,
  completedTasks,
  className = '',
  showDetails = true
}) => {
  const {statistics} =useContext(AppContext)
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const progressRef = useRef(null);
  
  const incompleteTasks = statistics && statistics.pending;
  const progressPercentage =  ((statistics&& statistics.done) / (statistics&&statistics.total)) * 100 ? ((statistics&& statistics.done) / (statistics&&statistics.total)) * 100:0 ;

  useEffect(() => {
    setIsAnimating(true);
    
    // Reset values first
    setAnimatedProgress(0);
    setAnimatedCompleted(0);
    
    // Start animation after a short delay
    const timer = setTimeout(() => {
      animateProgress();
    }, 100);

    return () => clearTimeout(timer);
  }, [progressPercentage, completedTasks]);

  const animateProgress = () => {
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    const startProgress = 0;
    const startCompleted = 0;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentProgress = startProgress + (progressPercentage - startProgress) * easeOutCubic;
      const currentCompleted = startCompleted + ((statistics&&statistics.done) - startCompleted) * easeOutCubic ? startCompleted + ((statistics&&statistics.done) - startCompleted) * easeOutCubic:0;
      
      setAnimatedProgress(currentProgress);
      setAnimatedCompleted(Math.round(currentCompleted));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  const progressColor = getProgressColor(progressPercentage);

  return (
    <div className={`task-progress ${className}`}>
      <div className="progress-header">
        <div className="progress-title">
          <h3>Tiến độ nhiệm vụ</h3>
          <div className="progress-percentage">
            <span className={`percentage-value percentage-value--${progressColor}`}>
              {Math.round(animatedProgress)}%
            </span>
          </div>
        </div>
        
        {showDetails && (
          <div className="progress-details">
            <div className="detail-item detail-item--completed">
              <CheckCircle size={16} />
              <span>{animatedCompleted} hoàn thành</span>
            </div>
            <div className="detail-item detail-item--incomplete">
              <Clock size={16} />
              <span>{incompleteTasks} chưa hoàn thành</span>
            </div>
          </div>
        )}
      </div>

      <div className="progress-container">
        <div className="progress-track">
          <div 
            ref={progressRef}
            className={`progress-fill progress-fill--${progressColor} ${isAnimating ? 'animating' : ''}`}
            style={{ 
              width: `${animatedProgress}%`,
              '--progress-width': `${progressPercentage}%`
            }}
          >
            <div className="progress-shine"></div>
          </div>
          
          {/* <div className="progress-markers">
            {[25, 50, 75].map(marker => (
              <div 
                key={marker}
                className={`progress-marker ${animatedProgress >= marker ? 'active' : ''}`}
                style={{ left: `${marker}%` }}
              >
                <div className="marker-dot"></div>
                <div className="marker-label">{marker}%</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      <div className="progress-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng số:</span>
          <span className="summary-value">{statistics&&statistics.total} nhiệm vụ</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Còn lại:</span>
          <span className="summary-value summary-value--highlight">
            {incompleteTasks} nhiệm vụ
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;