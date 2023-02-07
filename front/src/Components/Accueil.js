import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { User } from './User';
import { Admin } from './Admin/Admin';
import { CustomLink } from './CustomLink';

export const Accueil = () => {
  const loginRef = useRef();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (Object.keys(auth).length === 0) return; // Not loaded
    if (!auth.account) loginRef.current?.click();
  }, [auth.account, loginRef.current]);

  if (!auth.account) {
    return (
      <CustomLink ref={loginRef} to={'/login'}>
        Veuillez vous connecter pour continuer
      </CustomLink>
    );
  }

  return auth.admin ? <Admin /> : <User />;
};
