import React, { useContext } from "react";
import "./TaskStatusSelect.scss";
import AppContext from "../../context/AppContext";
import {
  markTaskCompletedService,
  markTaskPendingService,
} from "../../service/apiService";
import toast from "react-hot-toast";
import { Select } from "antd";

const options = [
  {
    label: "Đã hoàn thành",
    value: "completed",
    gradient: "linear-gradient(135deg,#10b981,#4ddbb3)",
  },
  {
    label: "Chưa hoàn thành",
    value: "pending",
    gradient: "linear-gradient(135deg,#f59e0b,#f8c14a)",
  },
];

const TaskStatusSelect = ({ value, taskId }) => {
  const { isLoading, setIsLoading, refetchTasksQuery, refetchStatistics } =
    useContext(AppContext);
  const onChange = async (e) => {
    if (isLoading) return;
    if (!taskId) return;
    setIsLoading(true);
    if (e === "completed") {
      const res = await markTaskCompletedService(taskId);
      if (res && res.success) {
        refetchStatistics();
        refetchTasksQuery();
        setIsLoading(false);
      } else {
        toast.error(res.message);
        setIsLoading(false);
      }
    } else {
      const res = await markTaskPendingService(taskId);
      if (res && res.success) {
        refetchStatistics();
        refetchTasksQuery();
        setIsLoading(false);
      } else {
        toast.error(res.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <Select
      value={value==="completed" ? "completed" : "pending"}
      style={{ width: 150, }}
      onChange={(e)=>onChange(e)}
      options={[
       {
    label: "Đã hoàn thành",
    value: "completed",
  
  },
  {
    label: "Chưa hoàn thành",
    value: "pending",
   
  },
      ]}
    />
  );
};

export default TaskStatusSelect;
