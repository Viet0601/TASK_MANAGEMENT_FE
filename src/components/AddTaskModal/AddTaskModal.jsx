import React, { useContext, useState } from 'react';
import './AddTaskModal.scss';
import { FaTimes, FaCalendarAlt, FaFlag, FaEdit, FaAlignLeft } from 'react-icons/fa';
import { createTaskService } from '../../service/apiService';
import AppContext from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: ''
  });
  const {isLoading, setIsLoading,refetchTasksQuery,refetchStatistics} = useContext(AppContext)
  const [errors, setErrors] = useState({});
  const resetForm=()=>{
    setFormData({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: ''
      })
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tên nhiệm vụ không được để trống';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Deadline không được để trống';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Deadline không được là ngày trong quá khứ';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLoading) return;
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const res =await createTaskService(formData);
    if(res && res.success)
    {
        resetForm()
        refetchTasksQuery()
        refetchStatistics()
        toast.success(res.message);
        onClose();
    }else 
    {
        toast.error(res.message);
    }
    setIsLoading(false)
   
  };

  const priorityOptions = [
    { value: 'Low', label: 'Thấp', color: '#10B981', bgColor: '#D1FAE5' },
    { value: 'Medium', label: 'Vừa', color: '#F59E0B', bgColor: '#FEF3C7' },
    { value: 'High', label: 'Cao', color: '#EF4444', bgColor: '#FEE2E2' }
  ];

  if (!isOpen) return null;

  return (
    <div className="add-task-modal-overlay" onClick={onClose}>
      <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <FaEdit />
            </div>
            <div className="header-text">
              <h2>Tạo nhiệm vụ mới</h2>
              <p>Thêm một nhiệm vụ mới vào danh sách của bạn</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-form">
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FaEdit className="label-icon" />
              Tên nhiệm vụ *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Nhập tên nhiệm vụ..."
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaAlignLeft className="label-icon" />
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Mô tả chi tiết về nhiệm vụ..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaFlag className="label-icon" />
              Độ ưu tiên
            </label>
            <div className="priority-options">
              {priorityOptions.map((option) => (
                <label key={option.value} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={handleInputChange}
                    className="priority-input"
                  />
                  <div 
                    className="priority-card"
                    style={{
                      borderColor: formData.priority === option.value ? option.color : '#E5E7EB',
                      backgroundColor: formData.priority === option.value ? option.bgColor : '#F9FAFB'
                    }}
                  >
                    <div 
                      className="priority-indicator"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="priority-label">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaCalendarAlt className="label-icon" />
              Deadline *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          {errors.submit && (
            <div className="submit-error">
              <span className="error-message">{errors.submit}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Đang tạo...
                </div>
              ) : (
                'Thêm'
              )}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
