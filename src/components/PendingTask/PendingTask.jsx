import React, { useContext, useState, useEffect, useRef } from 'react';
import './PendingTask.scss';
import { FaClock, FaCalendarAlt, FaFlag, FaTrash, FaCheck, FaEdit, FaExclamationTriangle, FaFire } from 'react-icons/fa';
import { Pagination } from 'antd';
import AppContext from '../../context/AppContext';
import { deleteTaskByIdService, getPendingTasksService, markTaskCompletedService } from '../../service/apiService';
import toast from 'react-hot-toast';
import UpdateTask from '../Modal/UpdateTask';
import ConfirmModal from '../Modal/ConfirmModal';

const PendingTask = () => {
  const { isLoading, setIsLoading,page,setPage,refetchPendingTask,pendingTasks,refetchCompletedTasks ,refetchStatistics,refetchTasksQuery} = useContext(AppContext);
  const [editingTask, setEditingTask] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const [isShowDelete,setIsShowDelete]=useState(false);
  const [deleteItem,setDeleteItem]=useState(null);
  const topRef = useRef(null);
  
  useEffect(() => {
    if(!window.location.pathname.includes("/task/pending")) return;
    if (topRef.current) {
      const topPosition = topRef.current.getBoundingClientRect().top + window.scrollY - 150; // +window.scrollY để lấy vị trí thực
      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    }
  }, [page,window.location.pathname]);

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
        refetchPendingTask();
        refetchStatistics();
        refetchTasksQuery();
        setIsShowDelete(false)
        
      }
      else 
      {
        toast.error("Xóa nhiệm vụ thất bại")
      }
      setIsLoading(false)
    }
  }
  const [updateTasks, setUpdateTasks] = useState([]);
  const [name,setName]=useState("")
  const [isComfirm,setIsConfirm]=useState(false)
  const toggleModal=(task)=>{
      if(!isComfirm)
      {
        setName(task.title);
        setUpdateTasks(task)
      }
      setIsConfirm(!isComfirm)
  }
  const handleConfirm=async()=>{
    const taskId=updateTasks._id;
    if(!taskId) return ;
    setIsLoading(true);
    const res=await markTaskCompletedService(taskId);
    if(res && res.success){
      toast.success("Đã hoàn thành nhiệm vụ");
      setIsConfirm(false);
      refetchCompletedTasks();
      refetchStatistics();
      refetchTasksQuery()
      refetchPendingTask()
      
    }
    else 
    {
      toast.error("Đã xảy ra lỗi!")
    }
    setIsLoading(false)
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
  const [stats, setStats] = useState({
    total: 0,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0
  });

  const limit = 6;

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdue = pendingTasks && pendingTasks.list && pendingTasks.list.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;

    const dueToday =  pendingTasks && pendingTasks.list && pendingTasks.list.filter(task => {
      const dueDate = new Date(task.dueDate);
      const taskDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      return taskDueDate.getTime() === today.getTime();
    }).length;

    const dueThisWeek =  pendingTasks && pendingTasks.list && pendingTasks.list.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length;

    setStats({
      total:  pendingTasks && pendingTasks.list && pendingTasks.list.length,
      overdue,
      dueToday,
      dueThisWeek
    });
  };

  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'High': return 'Cao';
      case 'Medium': return 'Vừa';
      case 'Low': return 'Thấp';
      default: return priority;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDueDateStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    const diffTime = taskDueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', text: 'Quá hạn', color: '#ef4444' };
    } else if (diffDays === 0) {
      return { status: 'today', text: 'Hôm nay', color: '#f59e0b' };
    } else if (diffDays <= 3) {
      return { status: 'urgent', text: `${diffDays} ngày`, color: '#f59e0b' };
    } else if (diffDays <= 7) {
      return { status: 'soon', text: `${diffDays} ngày`, color: '#3b82f6' };
    } else {
      return { status: 'normal', text: `${diffDays} ngày`, color: '#10b981' };
    }
  };

 
  useEffect(() => {
    setPage(1);
    refetchPendingTask()
  }, []);
  useEffect(() => {
   if( pendingTasks)
   {calculateStats()}
  }, [pendingTasks]);

  return (
    <>
     <div className="pending-tasks-page" ref={topRef}>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FaClock />
          </div>
          <div className="header-text">
            <h1>Nhiệm vụ đang chờ</h1>
            <p>Danh sách các nhiệm vụ cần hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng cộng</p>
          </div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{stats.overdue}</h3>
            <p>Quá hạn</p>
          </div>
        </div>
        <div className="stat-card today">
          <div className="stat-icon">
            <FaFire />
          </div>
          <div className="stat-content">
            <h3>{stats.dueToday}</h3>
            <p>Hôm nay</p>
          </div>
        </div>
        <div className="stat-card week">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.dueThisWeek}</h3>
            <p>Tuần này</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        { pendingTasks && pendingTasks.list && pendingTasks.list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaClock />
            </div>
            <h3>Không có nhiệm vụ nào đang chờ</h3>
            <p>Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            { pendingTasks && pendingTasks.list && pendingTasks.list.map((task, index) => {
              const dueStatus = getDueDateStatus(task.dueDate);
              return (
                <div 
                  key={task._id} 
                  className={`task-card pending ${dueStatus.status}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="task-header">
                    <div className="task-title">
                      <h3>{task.title}</h3>
                      <div className="pending-badge">
                        <FaClock />
                        <span>Đang chờ</span>
                      </div>
                    </div>
                    <div 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      <FaFlag />
                      <span>{getPriorityLabel(task.priority)}</span>
                    </div>
                  </div>

                  {task.description && (
                    <div className="task-description">
                      <p>{task.description}</p>
                    </div>
                  )}

                  <div className="task-meta">
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>Hạn: {formatDate(task.dueDate)}</span>
                    </div>
                    <div 
                      className="due-status"
                      style={{ color: dueStatus.color }}
                    >
                      <FaExclamationTriangle />
                      <span>{dueStatus.text}</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button 
                      className="action-btn complete"
                      onClick={() => toggleModal(task)}
                      title="Đánh dấu hoàn thành"
                
                    >
                      <FaCheck />
                      <span>Hoàn thành</span>
                    </button>
                    <button 
                    onClick={()=>handleToggle(task)}
                      className="action-btn edit"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                      <span>Sửa</span>
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => ToggleDeleteModal(task)}
                      title="Xóa nhiệm vụ"
                    >
                      <FaTrash />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
     {pendingTasks && pendingTasks.list && pendingTasks.list.length>0 &&  <Pagination defaultCurrent={page} align='center' total={pendingTasks&& pendingTasks.total}/>}
    </div>
    {editingTask && <UpdateTask refetch1={refetchPendingTask} refetch2={refetchStatistics}  isOpen={editingTask} onClose={handleToggle} task={updateItem}/>}
    {isComfirm && <ConfirmModal
     message={"Bạn đã hoàn thành nhiệm vụ"} 
     name={name} open={isComfirm} 
     onCancel={toggleModal} 
     title={"Xác nhận hoàn thành"}
     onConfirm={handleConfirm}
     />}
    {isShowDelete && <ConfirmModal
     message={"Bạn đã chắc chắn muốn xóa nhiệm vụ"} 
     name={name} open={isShowDelete} 
     onCancel={ToggleDeleteModal} 
     title={"Xác nhận xóa"}
     onConfirm={handleConfirmDelete}

     />}
    </>
   
  );
};

export default PendingTask;