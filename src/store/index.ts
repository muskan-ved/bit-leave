// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import onboarding from 'src/store/onboarding'

export const store = configureStore({
  reducer: {
    onboarding
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false
  })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

