import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from './Spinner';
import { api } from '../utils';
import { setAccount, setAdmin } from '../store/AuthenticateSlice';
import { useDispatch, useSelector } from 'react-redux';

export const Logout = () => {
  const ref = useRef();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    api('/logout').then(() => {
      dispatch(setAccount(null));
      dispatch(setAdmin(false));
    });
  }, []);

  useEffect(() => {
    if (!auth?.account) ref.current?.click();
  }, [auth?.account, ref.current]);

  return (
    <>
      <Spinner />
      <Link to={'/'} ref={ref} style={{ visibility: 'hidden' }} />
    </>
  );
};
