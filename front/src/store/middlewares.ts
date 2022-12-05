import { Middleware, PayloadAction } from '@reduxjs/toolkit'
import { SET_USER_INFO } from '@/store/userSlice'
import { LOCAL_STORAGE } from '@/constants'
import { RootState } from '@/store/index'

export const authMiddleware: Middleware<{}, RootState> =
	(storeApi) => (next) => (action: PayloadAction) => {
		if(SET_USER_INFO.match(action)) {
			if(action.payload.token) {
				localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(action.payload))
			}else {
				localStorage.removeItem(LOCAL_STORAGE.USER)
			}
		}

		return next(action)
	}
