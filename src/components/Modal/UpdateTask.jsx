import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./UpdateTask.scss";
import AppContext from "../../context/AppContext";
import {  updateTaskService } from "../../service/apiService";
import toast from "react-hot-toast";

const UpdateTask = ({ task, isOpen, onClose , refetch1=()=>{},refetch2=()=>{} }) => {
    const {isLoading,setIsLoading,refetchTasksQuery,page}=useContext(AppContext);

  const [form, setForm] = useState({
    taskId:"",
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        taskId:task._id || "",
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !form.taskId) return;
  
   setIsLoading(true);
   const res = await updateTaskService(form)
   if(res && res.success)
   {
    toast.success(res.message);
    onClose();
   refetch1()
   refetch2()
   }
   else 
   {
    toast.error(res.message);
   }
   setIsLoading(false)
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="update-task__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="update-task__modal"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cập nhật Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề <span>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Độ ưu tiên</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Thấp</option>
                  <option value="Medium">Trung bình</option>
                  <option value="High">Cao</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày hết hạn <span>*</span></label>
                <input
                   min={new Date().toISOString().split('T')[0]}
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="actions">
                <button type="button" className="cancel" onClick={onClose}>
                  Hủy
                </button>
                <button type="submit" className="submit">
                  Cập nhật
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateTask;
