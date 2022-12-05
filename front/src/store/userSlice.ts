import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { serviceLoginByToken } from '@/services'

import type { AppDispatch } from '.'

export interface UserState {
  isLockScreen: boolean
  userInfo: LoginType.Res['userInfo']
}

const initialState: UserState = {
  isLockScreen: false,
  userInfo: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER_INFO: (state, action: PayloadAction<UserState['userInfo']>) => {
      state.userInfo = action.payload
    }
  }
})

export const { SET_USER_INFO } = userSlice.actions

export const loginByToken = (token: string) => (dispatch: AppDispatch) => {
  // return serviceLoginByToken(token).then(res => {
  //   const userInfo = res.userInfo
  //   return dispatch(SET_USER_INFO(userInfo))
  // })
}

export default userSlice.reducer
