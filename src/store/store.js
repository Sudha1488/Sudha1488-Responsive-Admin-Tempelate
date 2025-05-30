import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import usersReducer from "./slice/users/usersSlice";


export const store = configureStore({
  reducer: {
    auth:authReducer,
    users:usersReducer,
  },
});
