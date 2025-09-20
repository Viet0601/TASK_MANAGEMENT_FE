import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTaskService, getCurrentUserService, getCompletedTasksService, getPendingTasksService, getDataStatisticsService } from "../service/apiService";
import { setProfileRedux } from "../redux/userSlice";
import {useQuery, useQueryClient} from "@tanstack/react-query"
import { QUERY_KEY } from "../query/queryKey";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
     const queryClient = useQueryClient();
    const [page,setPage]=useState(1);
    const limit=6;
    const [type,setType]=useState("ALL");
    const token = useSelector(state=>state.user?.token)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
   const resetAllState=()=>{
    queryClient.clear()
   }
   const {data:statistics,refetch:refetchStatistics} = useQuery({
    queryKey:QUERY_KEY.fetchStatistic(),
    queryFn:async()=>{
        setIsLoading(true);
        const res= await getDataStatisticsService();
        if(res && res.success){
            setIsLoading(false);
            return res.data;
        }
        setIsLoading(false);
        return {}
    }
   })
   const {data:pendingTasks,refetch:refetchPendingTask} = useQuery({
    queryKey:QUERY_KEY.fetchPendingTask(page),
    queryFn:async()=>{
        setIsLoading(true);
        const res= await getPendingTasksService(page,limit);
        if(res && res.success){
         
            setIsLoading(false);
            return res.data;
        }
        setIsLoading(false);
        return {list:[],total:0}
    }
   })
   const {data:completedTasks,refetch:refetchCompletedTasks} = useQuery({
    queryKey:QUERY_KEY.fetchCompletedTask(page),
    queryFn:async()=>{
        setIsLoading(true);
        const res= await getCompletedTasksService(page,limit);
        if(res && res.success){
         
            setIsLoading(false);
            return res.data;
        }
        setIsLoading(false);
        return {list:[],total:0}
    }
   })
   const {data:tasks,refetch:refetchTasksQuery} = useQuery({
    queryKey:QUERY_KEY.fetchAllTask(page,type),
    queryFn:async()=>{
        setIsLoading(true);
        const res= await getAllTaskService(page,limit,type);
        if(res && res.success){
            setIsLoading(false);
            return res.data;
        }
        setIsLoading(false);
        return {list:[],total:0}
    }
   })

    const getProfile=async()=>{
        setIsLoading(true);
        const res= await getCurrentUserService();
        if(res && res.success)
        {
            setIsLoading(false)
            dispatch(setProfileRedux(res.data))
        }
    }

    const refreshTasks = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.fetchAllTask(page, type) });
    };

   
    useEffect(()=>{
        if(token)
        {
            getProfile()
            refetchStatistics()
            refetchCompletedTasks()
            refetchPendingTask()
            refetchTasksQuery()
          
        }
    },[token])
    const value = {isLoading,setIsLoading,dispatch,navigate,tasks,refreshTasks,page,statistics,refetchStatistics,setPage,refetchTasksQuery
        ,setType,completedTasks,refetchCompletedTasks,pendingTasks,refetchPendingTask,resetAllState
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContext;
