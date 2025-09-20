import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import FullScreenLoader from './components/FullScreenLoader/FullScreenLoader'
import { useContext } from 'react';
import AppContext from './context/AppContext';
import { LINK } from './utils/constants';
import Masterlayout from './Masterlayout';
import Settings from './pages/Settings/Settings';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import DashBoard from './components/DashBoard/DashBoard';
import CompletedTask from './components/CompletedTask/CompletedTask';
import PendingTask from './components/PendingTask/PendingTask';

function App() {
  const {isLoading} = useContext(AppContext);
  const isAuthenticated= useSelector(state=>state.user.isAuthenticated)
  return (
    <>
      <Routes>
        <Route path="/auth" element={isAuthenticated?<Navigate to={LINK.HOME} replace /> : <Auth />} />
        <Route path={LINK.HOME} element={<PrivateRoute><Masterlayout/></PrivateRoute>}>
            <Route index element={<DashBoard/>}/>
            <Route  path={LINK.COMPLETE} element={<CompletedTask/>}/>
            <Route  path={LINK.PENDING} element={<PendingTask/>}/>
            <Route  path={LINK.SETTINGS} element={<Settings/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      {isLoading && <FullScreenLoader show={isLoading} text="Vui lòng chờ..." />}
    </>
  )
}

export default App
