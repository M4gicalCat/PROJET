import {ThemeProvider} from "styled-components";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {themes} from "../themes";
import {Error} from "./Error";
import {Menu} from "./Menu";
import {AuthAdmin} from "./Admin/AuthAdmin";
import {HomeLogin} from "./HomeLogin";
import {AuthUser} from "./User/AuthUser";
import {Logout} from "./Logout";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../utils";
import {Spinner} from "./Spinner";
import {setAccount, setAdmin} from "../store/AuthenticateSlice";

export const Router = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (auth) return;
    (async () => {
      const result = await api('/connected');
      if (result.error) {
        dispatch(setAccount(null));
        dispatch(setAdmin(false));
        return;
      }
      dispatch(setAccount(result));
      dispatch(setAdmin(!!result.username));
    })();
  } ,[auth]);

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
        },
        {
          path: 'logout',
          element: <Logout />
        }
      ],
    },
  ], {basename: '/app'});

  return (
    <ThemeProvider theme={themes[theme]}>
      {auth ? <RouterProvider router={router} /> : <Spinner />}
    </ThemeProvider>
  );
};