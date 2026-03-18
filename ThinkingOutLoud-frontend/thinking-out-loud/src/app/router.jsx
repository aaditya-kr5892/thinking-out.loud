import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BlogList from "../features/Blogs/BlogList";
import BlogDetails from "../features/Blogs/BlogDetails";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AdminEditor from "../features/admin/AdminEditor"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BlogList />
      },
      {
        path: "blogs/:id",
        element: <BlogDetails />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "admin/editor",
        element: <AdminEditor />
      },
      {
        path:"admin/editor/:id",
        element:<AdminEditor/>
      }
    ]
  }
]);