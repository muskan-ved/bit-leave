// ** Toolkit imports
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'

// ** Reducers
import onboarding from 'src/store/onboarding'
import employee from 'src/store/employee'
import apierror from 'src/store/apiError'
import user from 'src/store/user'
import organisation from 'src/store/organisation'
import thresholds from 'src/store/thresholds'
import profile from 'src/store/profile'
import actionApproval from 'src/store/actionapproval'
import roleManage from './roleManage'
import notification from './notification'
import setUPPost  from './setup'
import xeroSignUp  from './xeroSignup'

export const reducers = {
  onboarding,
  employee,
  user,
  organisation,
  apierror,
  thresholds,
  profile,
  actionApproval,
  roleManage,
  notification,
  setUPPost,
  xeroSignUp

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

