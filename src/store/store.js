import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import usersReducer from "./slice/users/usersSlice";
import rolesReducer from "./slice/roles/rolesSlice";
import permissionsReducer from "./slice/permissions/permissionsSlice"
import helperSlice from './slice/helper/helperSlice';
import countriesSlice from './slice/country/countrySlice'
import statesSlice from './slice/state/stateSlice';
import citiesSlice from './slice/city/citySlice'


export const store = configureStore({
  reducer: {
    auth:authReducer,
    users:usersReducer,
    roles:rolesReducer,
    permissions:permissionsReducer,
    helper:helperSlice,
    countries:countriesSlice,
    states:statesSlice,
    cities:citiesSlice
  },
});
