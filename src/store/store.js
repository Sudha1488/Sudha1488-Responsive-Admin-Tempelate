import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import usersReducer from "./slice/users/usersSlice";
import rolesReducer from "./slice/roles/rolesSlice";
import permissionsReducer from "./slice/permissions/permissionsSlice"


export const store = configureStore({
  reducer: {
    auth:authReducer,
    users:usersReducer,
    roles:rolesReducer,
    permissions:permissionsReducer
  },
});
