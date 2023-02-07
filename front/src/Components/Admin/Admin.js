import { useEffect, useState } from 'react';
import { api } from '../../utils';
import { Title } from '../Title';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  > div {
    width: max-content;
    margin-top: 5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }
`;

export const Admin = () => {
  const [nbInscrits, setNbInscrits] = useState(0);
  const [nbThemes, setNbThemes] = useState(0);
  const auth = useSelector(state => state.auth);
  const redirect = useNavigate();

  const getInitialData = async () => {
    const [nbI, nbT] = await Promise.all([
      api('/user/count'),
      api('/theme/count'),
    ]);
    setNbInscrits(nbI.count);
    setNbThemes(nbT.count);
  };

  useEffect(() => {
    getInitialData().then(() => {});
  }, []);

  if (!auth.admin) return redirect('/login');

  return (
    <Container>
      <Title>Admin</Title>
      <div>
        <Link to="/admin/themes">
          <Button>Gérer les {nbThemes} themes</Button>
        </Link>
        <Link to="/admin/inscriptions">
          <Button>Gérer les {nbInscrits} inscrits</Button>
        </Link>
        <Link to="/admin/admins">
          <Button>Gérer les administrateurs</Button>
        </Link>
      </div>
    </Container>
  );
};
