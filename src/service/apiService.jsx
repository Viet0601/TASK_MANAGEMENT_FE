import axios from "../axios";
export const loginService = async ({email, password}) => {
    return axios.post("/login", { email, password });
    
}
export const registerService = async ({name, email, password}) => {
    return axios.post("/register", { name, email, password });
    
}
export const refreshTokenService = async () => {
    return axios.post("/refresh-token");
    
}
export const getCurrentUserService = async () => {
    return axios.get("/profile");
    
}
export const logoutService=async()=>{
    return axios.post('/logout');
}
export const updateProfileService = async ({ name, bio }) => {
    return axios.put('/profile', { name, bio });
}
export const changePasswordService = async ({ currentPassword, newPassword,confirmPassword }) => {
    return axios.put('/profile/password', { currentPassword, newPassword,confirmPassword });
}
export const getAllTaskService=(page,limit,type)=>{
    return axios.get(`/task?page=${page}&limit=${limit}&type=${type}`)
}

export const createTaskService = async (taskData) => {
    return axios.post('/task', taskData);
}

export const getCompletedTasksService = (page = 1, limit = 6) => {
    return axios.get(`/task/completed?page=${page}&limit=${limit}`);
}

export const getPendingTasksService = (page = 1, limit = 6) => {
    return axios.get(`/task/pending?page=${page}&limit=${limit}`);
}

export const markTaskCompletedService = (taskId) => {
    return axios.put(`/task/${taskId}/completed`);
}

export const markTaskPendingService = (taskId) => {
    return axios.put(`/task/${taskId}/pending`);
}
export const getDataStatisticsService=()=>{
    return axios.get(`/statistics`);
}
export const updateTaskService=(data)=>{
    return axios.put(`/task/${data.taskId}`,data)
}
export const deleteTaskByIdService=(id)=>{
    return axios.delete(`/task/${id}`);
}