import React, { useContext, useState, useEffect, useRef } from 'react';
import './CompletedTask.scss';
import { FaCheckCircle, FaCalendarAlt, FaFlag, FaTrash, FaUndo, FaTrophy, FaStar } from 'react-icons/fa';
import { Pagination } from 'antd';
import AppContext from '../../context/AppContext';
import { deleteTaskByIdService, getCompletedTasksService, markTaskPendingService } from '../../service/apiService';
import toast from 'react-hot-toast';
import ConfirmModal from '../Modal/ConfirmModal';

const CompletedTask = () => {
  const { isLoading,refetchPendingTask, setIsLoading,setType,setPage,page,completedTasks,refetchCompletedTasks,refetchStatistics,refetchTasksQuery } = useContext(AppContext);
  const [updateTasks, setUpdateTasks] = useState([]);
  const [name,setName]=useState("")
  const [isComfirm,setIsConfirm]=useState(false)
  const topRef = useRef(null);
  
  useEffect(() => {
    if(!window.location.pathname.includes("/")) return;
    if (topRef.current) {
      const topPosition = topRef.current.getBoundingClientRect().top + window.scrollY - 150; // +window.scrollY để lấy vị trí thực
      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    }
  }, [page,window.location.pathname]);
  const [isShowDelete,setIsShowDelete]=useState(false);
  const [deleteItem,setDeleteItem]=useState(null);
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
        setIsShowDelete(false)
        
      }
      else 
      {
        toast.error("Xóa nhiệm vụ thất bại")
      }
      setIsLoading(false)
    }
  }
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
    const res=await markTaskPendingService(taskId);
    if(res && res.success){
      toast.success("Đã hoàn tác nhiệm vụ");
      setIsConfirm(false);
      refetchCompletedTasks()
      refetchStatistics();
      refetchTasksQuery()
      refetchPendingTask()
    }
    else 
    {
      toast.error("Hoàn tác thất bại!")
    }
    setIsLoading(false)
  }
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0
  });

   const limit = 6;

  
     const calculateStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = completedTasks && completedTasks.list.filter(task => {
      const completedDate = new Date(task.completedAt || task.updatedAt);
      return completedDate >= weekAgo;
    }).length;

    const thisMonth = completedTasks && completedTasks.list.filter(task => {
      const completedDate = new Date(task.completedAt || task.updatedAt);
      return completedDate >= monthAgo;
    }).length;

    setStats({
      total: completedTasks && completedTasks.list && completedTasks.list.length,
      thisWeek,
      thisMonth
    });
  };

  // const handleMarkPending = async (taskId) => {
  //   try {
  //     const response = await markTaskPendingService(taskId);
  //     if (response.data.success) {
  //       toast.success('Đã chuyển nhiệm vụ về trạng thái chờ');
  //       fetchCompletedTasks(currentPage);
  //     }
  //   } catch (error) {
  //     console.error('Error marking task as pending:', error);
  //     toast.error('Có lỗi xảy ra khi cập nhật nhiệm vụ');
  //   }
  // };

  // const handleDelete = async (taskId) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
  //     try {
  //       // const response = await deleteTaskService(taskId);
  //       // if (response.data.success) {
  //       //   toast.success('Đã xóa nhiệm vụ thành công');
  //       //   fetchCompletedTasks(currentPage);
  //       // }
  //     } catch (error) {
  //       console.error('Error deleting task:', error);
  //       toast.error('Có lỗi xảy ra khi xóa nhiệm vụ');
  //     }
  //   }
  // };

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

  useEffect(() => {
    refetchCompletedTasks(page)
  }, [page]);
  useEffect(() => {
    setPage(1)
  }, []);
  useEffect(() => {
   if(completedTasks)
   {
    calculateStats()
   }
  }, [completedTasks]);

  return (
    <>
    <div className="completed-tasks-page" ref={topRef}>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FaTrophy />
          </div>
          <div className="header-text">
            <h1>Nhiệm vụ đã hoàn thành</h1>
            <p>Danh sách các nhiệm vụ bạn đã hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng cộng</p>
          </div>
        </div>
        <div className="stat-card week">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>{stats.thisWeek}</h3>
            <p>Tuần này</p>
          </div>
        </div>
        <div className="stat-card month">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.thisMonth}</h3>
            <p>Tháng này</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        {completedTasks && completedTasks.list && completedTasks.list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCheckCircle />
            </div>
            <h3>Chưa có nhiệm vụ nào hoàn thành</h3>
            <p>Hãy hoàn thành một số nhiệm vụ để thấy chúng ở đây!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {completedTasks && completedTasks.list && completedTasks.list.length>0 && completedTasks.list.map((task, index) => (
              <div 
                key={task._id} 
                className="task-card completed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="task-header">
                  <div className="task-title">
                    <h3>{task.title}</h3>
                    <div className="completed-badge">
                      <FaCheckCircle />
                      <span>Hoàn thành</span>
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
                    <span>Hoàn thành: {formatDate(task.completedAt || task.updatedAt)}</span>
                  </div>
                  {task.dueDate && (
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>Hạn: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>

                <div className="task-actions">
                  <button 
                    className="action-btn undo"
                    onClick={() => toggleModal(task)}
                    title="Chuyển về trạng thái chờ"

                  >
                    <FaUndo />
                    <span>Hoàn tác</span>
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
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination align='center' defaultCurrent={page} total={completedTasks&& completedTasks.total * 10} onChange={(e)=>setPage(e)} />

    </div>
    {isComfirm && <ConfirmModal
     message={"Bạn có muốn hoàn tác nhiệm vụ"} 
     name={name} open={isComfirm} 
     onCancel={toggleModal} 
     title={"Xác nhận hoàn tác"}
     onConfirm={handleConfirm}
     />}
    {isShowDelete && <ConfirmModal
     message={"Bạn có chắc chắn muốn xóa nhiệm vụ"} 
     name={name} open={isShowDelete} 
     onCancel={ToggleDeleteModal} 
     title={"Xác nhận xoá"}
     onConfirm={handleConfirmDelete}
     />}
    </>
  );
};

export default CompletedTask;