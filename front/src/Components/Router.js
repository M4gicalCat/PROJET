import { ThemeProvider } from 'styled-components';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import React, { useEffect } from 'react';
import { themes } from '../themes';
import { Error } from './Error';
import { Menu } from './Menu';
import { AuthAdmin } from './Admin/AuthAdmin';
import { HomeLogin } from './HomeLogin';
import { AuthUser } from './User/AuthUser';
import { Logout } from './Logout';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../utils';
import { Spinner } from './Spinner';
import { setAccount, setAdmin } from '../store/AuthenticateSlice';
import { Accueil } from './Accueil';
import { ThemeList } from './Admin/ThemeList';
import { UserList } from './Admin/UserList';
import { AdminList } from './Admin/AdminList';
import { User } from './User/User';

export const Router = () => {
  const auth = useSelector(state => state.auth);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if ([...Object.keys(auth)].length > 0) return;
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
  }, [auth]);

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Menu />,
        errorElement: <Error />,
        children: [
          {
            path: '/',
            element: <Accueil />,
          },
          {
            path: 'login',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <HomeLogin />,
              },
              {
                path: 'admin',
                element: <AuthAdmin />,
              },
              {
                path: 'user',
                element: <AuthUser />,
              },
            ],
          },
          {
            path: 'logout',
            element: <Logout />,
          },
          {
            path: 'admin',
            element: <Outlet />,
            children: [
              {
                path: 'themes',
                element: <ThemeList />,
              },
              {
                path: 'inscriptions',
                element: <UserList />,
              },
              {
                path: 'admins',
                element: <AdminList />,
              },
            ],
          },
        ],
      },
    ],
    { basename: '/app' }
  );

  return (
    <ThemeProvider theme={theme}>
      {auth ? <RouterProvider router={router} /> : <Spinner />}
    </ThemeProvider>
  );
};
