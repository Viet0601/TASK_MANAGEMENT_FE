import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  Clock
} from "lucide-react";
import "./Sidebar.scss";
import { LINK } from "../../utils/constants";

const Sidebar = ({ userName = "User" }) => {
  return (
    <div className="sidebar">
    <div className="sidebar-header">
      <h2>Xin chào, User 👋</h2>
      <p>Quản lý nhiệm vụ hiệu quả ✨</p>
    </div>
  
    <nav className="sidebar-nav">
      <NavLink  to={LINK.DASHBOARD} className="sidebar-link">
        <span className="icon">📊</span> Dashboard
      </NavLink>
      <NavLink  to={LINK.COMPLETE} className="sidebar-link">
        <span className="icon">✅</span> Đã hoàn thành
      </NavLink>
      <NavLink   to={LINK.PENDING} className="sidebar-link">
        <span className="icon">⏳</span> Chưa hoàn thành
      </NavLink>
        {/* <NavLink   to={LINK.SETTINGS} className="sidebar-link">
          <span className="icon">⚙️</span> Cài đặt tài khoản
        </NavLink> */}
    </nav>
  
    <div className="sidebar-footer">
      <p>© 2025 Task Manager</p>
    </div>
  </div>
  
  );
};

export default Sidebar;
