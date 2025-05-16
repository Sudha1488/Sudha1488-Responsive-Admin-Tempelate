import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

//pages
import Home from "../pages/Home";
import Login from "../pages/LoginPage/Login";

//components
import EmployeeDetails from "../Components/Employee/EmployeeDetails/EmployeeDetails";
import AddEmployee from "../Components/Employee/AddEmployee/AddEmployee";
import Leave from "./../Components/Leave/Leave";
import User from "../Components/Access/User/User";
import Roles from "../Components/Access/Roles/Roles";
import Permissions from "../Components/Access/Permissions/Permissions";
import Category from "../Components/ManageBlogs/Category/Category";
import Blogs from "../Components/ManageBlogs/Blogs/Blogs";
import Country from "../Components/Masters/Country/Country";
import State from "../Components/Masters/State/State";
import City from "../Components/Masters/City/City";
import Pages from "../Components/Pages/Pages";
import Banner from "../Components/Banner/Banner";
import Settings from "../Components/Settings/Settings";
import Inquiries from './../Components/Inquiries/Inquiries';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/leave" element={<Leave />} />

          <Route path="/employee/details" element={<EmployeeDetails />} />
          <Route path="/employee/add" element={<AddEmployee />} />

          <Route path="/access/user" element={<User />} />
          <Route path="/access/roles" element={<Roles />} />
          <Route path="/access/permissions" element={<Permissions />} />

          <Route path="/manage-blogs/category" element={<Category />} />
          <Route path="/manage-blogs/list" element={<Blogs />} />


          <Route path="/masters/country" element={<Country />} />
          <Route path="/masters/state" element={<State />} />
          <Route path="/masters/city" element={<City />} />


          <Route path="/pages" element={<Pages />} />


          <Route path="/inquiries" element={<Inquiries />} />


          <Route path="/banner" element={<Banner />} />


          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
