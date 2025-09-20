import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { LINK } from './utils/constants'

const PrivateRoute = ({children}) => {
    const isAuthenticated= useSelector(state=>state.user.isAuthenticated)
    if(!isAuthenticated)
    {
        return <Navigate to={LINK.LOGIN} />
    }
  return (
   <>
   {children}
   </>
  )
}

export default PrivateRoute