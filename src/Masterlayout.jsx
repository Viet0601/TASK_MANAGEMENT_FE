import React, { useEffect, useState, useRef } from "react";
import "./Masterlayout.scss";
import Navbar from "./components/Navbar/Navbar";
import TaskStatistics from "./components/TaskStatistics/TaskStatistic";
import TaskProgress from "./components/TaskStatistics/TaskProgress";
import Sidebar from "./components/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import PerfectScrollbar from 'react-perfect-scrollbar'

const SIDEBAR_WIDTH = 256;

const Masterlayout = () => {
  const taskData = {
    totalTasks: 24,
    completedTasks: 18,
    inProgressTasks: 4,
  };
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // for smooth unmount
  const [sidebarShouldRender, setSidebarShouldRender] = useState(false); // for mount before animation
  const sidebarRef = useRef(null);

  useEffect(() => {
    const resetSize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setShowSidebar(false);
      }
    };
    resetSize();
    window.addEventListener("resize", resetSize);
    return () => window.removeEventListener("resize", resetSize);
  }, []);

  // Mount sidebar before animating open, and keep it mounted until animation closes
  useEffect(() => {
    if (isMobile) {
      if (showSidebar) {
        setSidebarShouldRender(true);
        // Wait for next tick to trigger animation
        setTimeout(() => setSidebarVisible(true), 10);
      } else {
        setSidebarVisible(false);
        // Wait for animation before unmounting
        const timeout = setTimeout(() => setSidebarShouldRender(false), 350);
        return () => clearTimeout(timeout);
      }
    } else {
      setSidebarShouldRender(true);
      setSidebarVisible(true);
    }
  }, [showSidebar, isMobile]);

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, showSidebar]);

  return (
    <>
      <div className="master_layout_compoennt">
        <Navbar />
        {/* Nút bars nổi khi mobile */}
        {isMobile && !showSidebar && (
          <button
            style={{
              position: "fixed",
              top: 80,
              left: 10,
              zIndex: 2000,
              background: "white",
              border: "none",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => setShowSidebar(true)}
            aria-label="Open sidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="16" width="18" height="2" rx="1" />
            </svg>
          </button>
        )}
        <div className="master_layout_content">
          {/* Sidebar hiển thị khi desktop hoặc khi mobile và showSidebar=true */}
          {(sidebarShouldRender || !isMobile) && (
            <>
              {/* Overlay for mobile */}
              {isMobile && (
                <div
                  className="sidebar-overlay"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: sidebarVisible
                      ? "rgba(0,0,0,0.25)"
                      : "rgba(0,0,0,0)",
                    opacity: sidebarVisible ? 1 : 0,
                    pointerEvents: sidebarVisible ? "auto" : "none",
                    zIndex: 2099,
                    transition: "background 0.35s, opacity 0.35s",
                  }}
                  onClick={() => setShowSidebar(false)}
                />
              )}
              <div
                ref={sidebarRef}
                className={
                  !isMobile
                    ? "left-open"
                    : sidebarVisible
                    ? "left-open sidebar-animate"
                    : "left-close sidebar-animate"
                }
                style={
                  isMobile
                    ? {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        height: "100vh",
                        width: `${SIDEBAR_WIDTH}px`,
                        background: "#fff",
                        zIndex: 2100,
                        boxShadow: sidebarVisible
                          ? "2px 0 8px rgba(0,0,0,0.15)"
                          : "none",
                        transform: sidebarVisible
                          ? "translateX(0)"
                          : `translateX(-${SIDEBAR_WIDTH}px)`,
                        transition:
                          "transform 0.35s cubic-bezier(0.77,0,0.175,1), box-shadow 0.35s",
                        willChange: "transform",
                        display: "block",
                      }
                    : {}
                } 
              >
                {/* Nút đóng sidebar khi mobile */}
                {isMobile && sidebarVisible && (
                  <button
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "transparent",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      zIndex: 2200,
                      transition: "color 0.2s",
                    }}
                    onClick={() => setShowSidebar(false)}
                    aria-label="Close sidebar"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="6" y1="18" x2="18" y2="6" />
                    </svg>
                  </button>
                )}
                <Sidebar />
              </div>
            </>
          )}
          <div className="mid">
            <PerfectScrollbar options={{suppressScrollX:true}}>
                <Outlet />
            </PerfectScrollbar>
          
          </div>
          <div className="right">
            <TaskStatistics
              totalTasks={taskData.totalTasks}
              completedTasks={taskData.completedTasks}
              inProgressTasks={taskData.inProgressTasks}
            />

            <TaskProgress
              className="mt-2"
              totalTasks={taskData.totalTasks}
              completedTasks={taskData.completedTasks}
              showDetails={true}
            />
          </div>
        </div>
      </div>
      {/* Extra CSS for smooth sidebar animation */}
      <style>{`
        .sidebar-animate {
          will-change: transform;
        }
      `}</style>
    </>
  );
};

export default Masterlayout;
