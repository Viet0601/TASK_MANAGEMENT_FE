import React, { useEffect, useMemo, useState } from "react";
import "./Settings.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { changePasswordService, getCurrentUserService, updateProfileService } from "../../service/apiService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { setProfileRedux } from "../../redux/userSlice";

const Settings = () => {
 const profileData= useSelector(s=>s.user.user);
  const {dispatch,isLoading,setIsLoading}=useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profileData) {
      setName(profileData?.name || "");
      setEmail(profileData?.email || "");
      setBio(profileData?.bio || "");
    }
  }, [profileData]);

 

 

  const canSaveProfile = useMemo(() => name && name.trim().length > 0, [name]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if(isLoading) return ;
    if (!canSaveProfile) {
      toast.error("Tên không được để trống");
      return;

    }
    setIsLoading(true)
    const res = await updateProfileService({name,bio});
    if(res && res.success)
    {
      toast.success(res.message);
      dispatch(setProfileRedux(res.data));
    }
    else 
    {
      toast.error(res.message);
    }
    setIsLoading(false)
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if(isLoading) return ;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }
    setIsLoading(true)
    const res = await changePasswordService({currentPassword,newPassword,confirmPassword});
    if(res && res.success)
    {
      toast.success(res.message);
     setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    }
    else 
    {
      toast.error(res.message);
    }
    setIsLoading(false)
   
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Cài đặt tài khoản</h1>
        <p>Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <div className="settings-grid">
        <section className="card profile-card">
          <div className="card-header">
            <h2>Thông tin người dùng</h2>
            <span className="hint">Email không thể thay đổi</span>
          </div>
          <form className="card-body1" onSubmit={handleSaveProfile}>
           
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} disabled placeholder="Email" />
            </div>
            <div className="form-group">
              <label>Tên hiển thị</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="form-group">
              <label>Giới thiệu</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Mô tả ngắn về bạn"
              />
            </div>
            <div className="actions">
              <button type="submit" className="btn primary">
                { "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </section>

        <section className="card password-card">
          <div className="card-header">
            <h2>Đổi mật khẩu</h2>
            <span className="hint">Giữ tài khoản an toàn</span>
          </div>
          <form className="card-body2" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="actions">
              <button type="submit" className="btn gradient" >
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;


