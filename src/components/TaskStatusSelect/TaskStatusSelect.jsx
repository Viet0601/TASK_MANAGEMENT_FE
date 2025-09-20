import React, { useContext } from "react";
import "./TaskStatusSelect.scss";
import AppContext from "../../context/AppContext";
import { markTaskCompletedService, markTaskPendingService } from "../../service/apiService";
import toast from "react-hot-toast";

const options = [
  { label: "Đã hoàn thành", value: "completed", gradient: "linear-gradient(135deg,#10b981,#4ddbb3)" },
  { label: "Chưa hoàn thành", value: "pending", gradient: "linear-gradient(135deg,#f59e0b,#f8c14a)"},
];

const TaskStatusSelect = ({ value,taskId }) => {
  const {isLoading,setIsLoading,refetchTasksQuery,refetchStatistics}=useContext(AppContext)
  const onChange=async(e)=>{
    if(isLoading) return ;
    if(!taskId) return ;
    setIsLoading(true);
    if(e==="completed")
    {
      const res= await markTaskCompletedService(taskId)
      if(res && res.success)
      {
        refetchStatistics()
        refetchTasksQuery();
        setIsLoading(false);
      }
      else 
      {
        toast.error(res.message)
        setIsLoading(false);
      }
      
    }
    else
    {
      const res= await markTaskPendingService(taskId)
      if(res && res.success)
      {
        refetchStatistics()
        refetchTasksQuery();
        setIsLoading(false)
      }
      else 
      {
        toast.error(res.message)
        setIsLoading(false);
      }
    }
  
  }
 
  return (
    <div
      className="task-status-select"
      style={{
        background: value==="completed" ? "linear-gradient(135deg,#10b981,#4ddbb3)":"linear-gradient(135deg,#f59e0b,#f8c14a)",   // ← đây
        backgroundSize: "200% 200%",
        animation: "gradientShimmer 3s ease infinite",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(opt => (
          <option style={{cursor:"pointer"}} key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="arrow" />
    </div>
  );
};

export default TaskStatusSelect;
