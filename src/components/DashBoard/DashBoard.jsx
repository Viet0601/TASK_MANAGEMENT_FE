import React, { useContext, useEffect, useRef, useState } from "react";
import "./DashBoard.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FaFire, FaHome, FaCheckCircle } from "react-icons/fa";
import TaskItem from "../TaskItem/TaskItem";
import { Pagination } from "antd";
import AppContext from "../../context/AppContext";
import AddTaskModal from "../AddTaskModal/AddTaskModal";

const DashBoard = () => {
  const { tasks, refreshTasks, page ,statistics,setPage} = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskAdded = () => {
    // Refresh tasks list after adding new task
    if (refreshTasks) {
      refreshTasks();
    }
  };
 
  return (
    <>
    <div className="task-overview" ref={topRef}>
      <div className="task-header d-flex align-items-center justify-content-between">
        <div className="d-flex flex-column">
          <h2 style={{ margin: 0, textAlign: "start" }}>Tổng quan nhiệm vụ</h2>
          <p style={{ margin: 0, textAlign: "start", fontSize: "14px" }}>
            Manage your tasks efficiently
          </p>
        </div>

        <button className="add-task-btn" onClick={handleOpenModal}>
          + Add New Task
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <FaHome />
          <div className="d-flex flex-column">
            <h3 style={{ fontSize: "18px", margin: 0 }}>
              {statistics && statistics.total}
            </h3>
            <p style={{ fontSize: "12px" }}>Tổng nhiệm vụ</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle />
          <div className="d-flex flex-column">
            <h3 style={{ fontSize: "18px", margin: 0 }}>
              {statistics && statistics.low}
            </h3>
            <p style={{ fontSize: "12px" }}>Ưu tiên thấp</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle />
          <div className="d-flex flex-column">
            <h3 style={{ fontSize: "18px", margin: 0 }}>
              {statistics && statistics.medium}
            </h3>
            <p style={{ fontSize: "12px" }}>Ưu tiên vừa</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle />
          <div className="d-flex flex-column">
            <h3 style={{ fontSize: "18px", margin: 0 }}>
              {statistics && statistics.high}
            </h3>
            <p style={{ fontSize: "12px" }}>Ưu tiên cao</p>
          </div>
        </div>
      </div>

      <div className="task-list">
        {tasks && tasks.list && tasks.list.length > 0 ? (
          <TaskItem tasks={tasks && tasks.list} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCheckCircle />
            </div>
            <h3>Chưa có nhiệm vụ nào</h3>
            <p>Hãy thêm một số nhiệm vụ để thấy chúng ở đây!</p>
          </div>
        )}
      </div>
      {/* <div><Pagination/></div> */}
      {tasks && tasks.list && tasks.list.length > 0 && (
        <Pagination
          align="center"
          onChange={(e)=>setPage(e)}
          className="mt-3"
          defaultCurrent={page}
          total={tasks && tasks.total * 10}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskAdded={handleTaskAdded}
      />
    </div>
   
    </>
  );
};

export default DashBoard;
