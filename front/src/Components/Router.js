import {ThemeProvider} from "styled-components";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import React, {useState} from "react";
import {themes} from "../themes";
import {Error} from "./Error";
import {Menu} from "./Menu";
import {AuthAdmin} from "./Admin/AuthAdmin";
import {HomeLogin} from "./HomeLogin";
import {AuthUser} from "./User/AuthUser";

export const Router = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Menu theme={theme} setTheme={setTheme} />,
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <>coucou</>,
        },
        {
          path: 'login',
          element: <Outlet />,
          children: [
            {
              path: "",
              element: <HomeLogin />
            },
            {
              path: 'admin',
              element: <AuthAdmin />,
            },
            {
              path: 'user',
              element: <AuthUser />
            }
          ]
        }
      ],
    },
  ], {basename: '/app'});

  return (
    <ThemeProvider theme={themes[theme]}>
      <RouterProvider router={router} />
    </ThemeProvider>);
};