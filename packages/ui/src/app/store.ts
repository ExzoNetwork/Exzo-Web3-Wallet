import { configureStore } from '@reduxjs/toolkit'
import collection from '../slices/collection'

export const store = configureStore({
	reducer: {
		collection: collection,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
