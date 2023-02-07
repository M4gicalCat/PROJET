import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { api } from '../../utils';
import { Title } from '../Title';
import { ActionButton as AB } from '../ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFloppyDisk,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input as OldInput } from '../Input';

const List = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  width: max-content;
  grid-row-gap: 1px;
  background-color: ${({ theme }) => theme.color.border};
  border: ${({ theme }) => theme.color.border} 1px solid;
  & > * {
    padding: 0.7rem 2rem;
    margin: 0;
    font-size: 1rem;
    height: 1.5rem;
    background-color: ${({ theme }) => theme.background};
  }
`;

const Container = styled.div`
  margin: auto;
  max-width: 100vw;
  width: max-content;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ActionButton = styled(AB)`
  width: 1rem;
  height: 1rem;
`;

const Input = styled(OldInput)`
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.card.background};
`;

export const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const theme = useSelector(state => state.theme);
  const auth = useSelector(({ auth }) => auth);
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dataCall = async () => {
    setAdmins(await api('/admin/all'));
  };

  useEffect(() => {
    if (!auth.account) return;
    if (!auth.admin) navigate('/');
    dataCall().then();
  }, [auth]);

  return (
    <>
      <Title>Administrateurs</Title>
      <Container>
        <AB onClick={() => setCreating(true)}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color={theme.color.text}
          />
        </AB>
        <List>
          <span>Nom</span>
          <span>Mot de passe</span>
          <span>Actions</span>
          {admins.map(admin => (
            <Admin
              theme={theme}
              admin={admin}
              deleteAdmin={
                admin.username === auth?.account?.username
                  ? undefined
                  : async () => {
                      await api('/admin/delete', { username: admin.username });
                      setAdmins(old => old.filter(a => a !== admin));
                    }
              }
            />
          ))}
          {creating && (
            <>
              <Input
                placeholder="Nom de l'admin"
                type="text"
                value={username}
                onInput={e => setUsername(e.target.value)}
              />
              <Input
                placeholder="Mot de passe"
                hint="Mot de passe"
                type="password"
                value={password}
                onInput={e => setPassword(e.target.value)}
              />
              <span>
                <ActionButton
                  onClick={async () => {
                    const newAdmin = await api('/admin/create', {
                      username,
                      password,
                    });
                    setAdmins(old => [...old, newAdmin]);
                    setCreating(false);
                    setUsername('');
                    setPassword('');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    color={theme.color.text}
                  />
                </ActionButton>
                <ActionButton
                  style={{ marginLeft: '1rem' }}
                  onClick={() => {
                    setCreating(false);
                    setUsername('');
                    setPassword('');
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} color={theme.color.text} />
                </ActionButton>
              </span>
            </>
          )}
        </List>
      </Container>
    </>
  );
};

const Admin = ({ admin, deleteAdmin, theme }) => {
  return (
    <>
      <span>{admin.username}</span>
      <span>{admin.password.split('').map(() => '*')}</span>
      <span>
        {deleteAdmin && (
          <ActionButton onClick={deleteAdmin}>
            <FontAwesomeIcon
              icon={faTrash}
              color={theme.color.error.background}
            />
          </ActionButton>
        )}
      </span>
    </>
  );
};
