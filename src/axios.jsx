import { API_URL } from './utils/constants';
import axios from 'axios';
const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
instance.interceptors.request.use(function (config) {
    
    const token= localStorage.getItem("access_token");
    if(token)
    {
      config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

//   let isRefreshing = false;
//   let refreshSubscribers = [];
  
//   function onRefreshed(token) {
//     refreshSubscribers.forEach((cb) => cb(token));
//     refreshSubscribers = [];
//   }
  
//   instance.interceptors.response.use(
//     (response) => (response && response.data ? response.data : response),
//     async (error) => {
//       const originalRequest = error.config;
  
//       // Nếu lỗi là 401 và chưa retry
//       if (error.response && error.response.status === 401 && !originalRequest._retry) {
//         if (isRefreshing) {
//           // Nếu đã có 1 request refresh đang chạy -> chờ
//           return new Promise((resolve) => {
//             refreshSubscribers.push((token) => {
//               originalRequest.headers["Authorization"] = "Bearer " + token;
//               resolve(instance(originalRequest));
//             });
//           });
//         }
  
//         originalRequest._retry = true;
//         isRefreshing = true;
  
//         try {
//           console.log("Goi API refeshToken")
//           // gọi API refresh (server đọc refresh token từ cookie HttpOnly)
//           const res = await axios.post(
//            `${BACKEND_URL}/refresh-token`,
//             {},
//             { withCredentials: true }
//           );
          
//           const newAccessToken = res.data.dt; // giả sử server trả {dt: "new_token"}
  
//           // Lưu lại localStorage
//           localStorage.setItem("access_token", newAccessToken);
  
//           // Thông báo cho các request đang chờ
//           onRefreshed(newAccessToken);
//           isRefreshing = false;
  
//           // Retry request gốc
//           originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
//           return instance(originalRequest);
//         } catch (err) {
//           isRefreshing = false;
//           // Nếu refresh thất bại -> logout
//           localStorage.removeItem("access_token");
//           // window.location.href = "/login";
//           return Promise.reject(err);
//         }
//       }
  
//       return error && error.response && error.response.data
//         ? error.response.data
//         : Promise.reject(error);
//     }
//   );
instance.interceptors.response.use(function (response) {
    return response && response.data ? response.data : response;
  }, function (error) {
    return error && error.response && error.response.data ? error.response.data :  Promise.reject(error);
  });
export default instance;
