import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useCallback } from "react";

const API_URL = "http://localhost:4000/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async()=>{
    const response = await axios.get(API_URL);
    return response.data;
});

export const addUser = createAsyncThunk("users/addUser", async(user)=>{
    const response = await axios.post(API_URL, user);
    return response.data;
});

export const updateUser = createAsyncThunk("users/updateUser", async({id, user})=>{
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
})

export const deleteUser = createAsyncThunk("users/deleteUser", async(id)=>{
    await axios.delete(`${API_URL}/${id}`);
    return id;
})


const initialState = {
    users:[],
    loading:false,
    error:null,
}

const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchUsers.pending,(state)=>{
            state.loading=true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled,(state, action)=>{
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })

        .addCase(addUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state,action)=>{
            state.loading = false;
            state.users.push(action.payload);
        })
        .addCase(addUser.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })

        .addCase(updateUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.fulfilled, (state,action) =>{
            state.loading=false;
            const index = state.users.findIndex((user)=> user.id === action.payload.id);
            if(index !== -1){
                state.users[index] = action.payload;
            }
        })
        .addCase(updateUser.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })

        .addCase(deleteUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state,action)=>{
            state.loading = false;
            state.users = state.users.filter((user)=> user.id != action.payload)
        })
        .addCase(deleteUser.rejected, (state)=>{
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export default usersSlice.reducer;