// ** Toolkit imports
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'

// ** Reducers
import onboarding from 'src/store/onboarding'
import employee from 'src/store/employee'
import apierror from 'src/store/apiError'
import user from 'src/store/user'
import organisation from 'src/store/organisation'

export const reducers = {
  onboarding,
  employee,
  user,
  organisation,
  apierror
}

const combinedReducer = combineReducers(reducers);

const rootReducer = (state: ReturnType<typeof combinedReducer>|undefined, action: AnyAction) => {
  if (action.type === 'store/reset') {
    return combinedReducer(undefined, action);
  };
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

