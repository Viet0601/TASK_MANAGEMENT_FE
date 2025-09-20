import React, { useContext, useState } from "react";
import "./TaskItem.scss";
import { Badge, Card, Space } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import TaskStatusSelect from "../TaskStatusSelect/TaskStatusSelect";
import UpdateTask from "../Modal/UpdateTask";
import AppContext from "../../context/AppContext";
import ConfirmModal from "../Modal/ConfirmModal";
import { deleteTaskByIdService } from "../../service/apiService";
import toast from "react-hot-toast";
import { FaRegCalendarTimes } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
const TaskItem = ({ tasks }) => {
  const [editingTask, setEditingTask] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const {refetchTasksQuery,setIsLoading,isLoading,refetchCompletedTasks,refetchStatistics,refetchPendingTask}=useContext(AppContext);
  const [name,setName]=useState("")
   const [isShowDelete,setIsShowDelete]=useState(false);
  const [deleteItem,setDeleteItem]=useState(null);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const ToggleDeleteModal=(task)=>{
    if(isShowDelete===false)
    {
      setDeleteItem(task);
      setName(task.title)
    }
    setIsShowDelete(!isShowDelete);
  }
  const handleConfirmDelete=async()=>{
    const taskId=deleteItem?._id;
    if(taskId)
    {
      setIsLoading(true);
      const res=await deleteTaskByIdService(taskId);
      if(res&& res.success){
        toast.success(res.message);
        refetchCompletedTasks();
        refetchStatistics();
        refetchTasksQuery();
        refetchPendingTask()
        setIsShowDelete(false)
        
      }
      else 
      {
        toast.error("Xóa nhiệm vụ thất bại")
      }
      setIsLoading(false)
    }
  }
  const handleToggle = (task) => {
    setEditingTask(!editingTask)
    if(editingTask)
    {
      
       setUpdateItem(null);
    }
    else 
    {
      setUpdateItem(task)
    }
     
  };

 
  return (
    <>
      <div className="task-item-board">
      {tasks &&
        tasks.map((task) => (
          <Badge.Ribbon key={task._id}
            text={
              task.priority === "Low"
                ? "Thấp"
                : task.priority === "Medium"
                ? "Vừa"
                : "Cao"
            }
            color={
              task.priority === "Low"
                ? "green"
                : task.priority === "Medium"
                ? "volcano"
                : "red"
            }
            placement="end"
          >
           
            
            <div className="task-item-card ">
              <div className="infor-task-cover">
                  <div className="d-flex flex-column">
                <h3 className="task-item-title">{task.title}</h3>

                <p style={{ fontSize: "12px", fontStyle: "italic" }}>
                  {task.description
                    ? task.description
                    : "Không có mô tả nào..."}
                </p>
                 </div>

              <div className="actions">
                    <div className="d-flex align-items-center gap-2 ">
                      <TaskStatusSelect taskId={task?._id} value={task.completed? "completed":"pending"} />
                    <button onClick={() => handleToggle(task)} className="edit-btn">
                    ✏️
                  </button>
                
                <button
                  style={{ color: "red" }}
                  onClick={() => ToggleDeleteModal(task)}
                  className="delete-btn"
                >
                  <AiOutlineDelete size={24} />
                </button>
                    </div>
              </div>
              </div>
              <div className="d-flex align-items-center justify-content-between ">
              <div className="d-flex align-items-center gap-1 mt-2">
                      <IoTimeOutline  color="green"/>
                      <span>Ngày tạo: {formatDate(task.createdAt)}</span>
                    </div>
              <div className="d-flex align-items-center gap-1">
                      <FaRegCalendarTimes style={{color:"red"}} />
                      <span>Hạn: {formatDate(task.dueDate)}</span>
                    </div>
              </div>
              
            </div>
          </Badge.Ribbon>
        ))}
    </div>
    {editingTask && <UpdateTask refetch1={refetchTasksQuery} refetch2={refetchStatistics} isOpen={editingTask} onClose={handleToggle} task={updateItem} />}
    {isShowDelete && <ConfirmModal message={"Bạn có chắc chắn xóa nhiệm vụ"} 
    name={name}
    onCancel={ToggleDeleteModal}
    onConfirm={handleConfirmDelete}
    open={isShowDelete}
    title={"Xác nhận xóa"}
    />}
    </>
  
  );
};

export default TaskItem;
