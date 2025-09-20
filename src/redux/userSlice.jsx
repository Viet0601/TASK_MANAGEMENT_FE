import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated:false,
    user:null,
    token:null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isLoginSuccessRedux: (state, action) => {
        if(state)
        {
          state.isAuthenticated = true
        state.token = action.payload 
        }
        return state;
       
    },
    isLogoutRedux:(state,action)=>{
      return initialState
    },
    setProfileRedux:(state,action)=>{
      if(state)
      {
        state.user= action.payload;
      }
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const {setProfileRedux, isLoginSuccessRedux,isLogoutRedux } = userSlice.actions

export default userSlice.reducer