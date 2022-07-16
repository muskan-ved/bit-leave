// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import onboarding from 'src/store/onboarding'
import employee from 'src/store/employee'
import apierror from 'src/store/apiError'

export const store = configureStore({
  reducer: {
    onboarding,
    employee,
    apierror
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false
  })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

