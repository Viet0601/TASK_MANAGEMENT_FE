export const QUERY_KEY = {
    fetchAllTask:(page,type)=>['fetchAllTask',{page,type}],
    fetchStatistic:()=>['fetchStatistic'],
    fetchCompletedTask:(page)=>['fetchCompletedTask',page],
    fetchPendingTask:(page)=>['fetchPendingTask',page],
}