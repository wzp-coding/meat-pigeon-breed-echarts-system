import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import { authMiddleware } from '@/store/middlewares'

const rootReducer = combineReducers({
  user: userReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authMiddleware)
})

export default store

export type IStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type GetState = () => RootState