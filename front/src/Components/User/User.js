import { Title } from '../Title';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Theme } from '../Admin/UserList';
import { api } from '../../utils';
import { ErrorMessage } from '../ErrorMessage';
import { setAccount } from '../../store/AuthenticateSlice';
import { Input } from '../Input';
import { ActionButton } from '../ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  > .truc {
    width: max-content;
    display: flex;
    flex-direction: column;
    > div {
      display: grid;
      grid-template-columns: auto auto;
    }
  }
`;

const Line = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 1rem 0;
  > * {
    margin-right: 1rem;
  }
`;

export const User = () => {
  const auth = useSelector(state => state.auth);
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const theme = useSelector(state => state.theme);
  const [themes, setThemes] = useState([]);
  const [chosenThemes, setChosenThemes] = useState([]);
  const [unchosenThemes, setUnchosenThemes] = useState([]);
  const [loading, setLoading] = useState({
    all: true,
    themes: null,
    edit: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    getThemes().then();
  }, []);

  useEffect(() => {
    if (auth.account === null) {
      redirect('/login');
      return;
    }
    setUser(auth.account);
    setEmail(auth.account.email);
    setChosenThemes(auth.account.themes ?? []);
  }, [auth.account]);

  useEffect(() => {
    setUnchosenThemes(
      themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
    );
  }, [themes, chosenThemes]);

  useEffect(() => {
    if (JSON.stringify(chosenThemes) === JSON.stringify(user.themes)) return;
    updateUser().then(() => {
      setUnchosenThemes(
        themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
      );
    });
  }, [chosenThemes]);

  const updateUser = async () => {
    if (email.length === 0 || loading.edit) return;
    try {
      await api('/user/update', {
        email,
        themes: chosenThemes.map(t => t.id),
      });
      dispatch(setAccount({ ...user, email, themes: chosenThemes }));
    } catch (e) {
      setError(e.message ?? 'Une erreur est survenue');
    }
  };

  const deleteUser = async () => {
    try {
      await api('/user/delete', {
        email,
      });
      dispatch(setAccount(null));
      redirect('/login');
    } catch (e) {
      setError(e.message ?? 'Une erreur est survenue');
    }
  };

  const getThemes = async () => {
    if (themes.length > 0 || loading.themes) return;
    setError('');

    setLoading(o => ({ ...o, themes: true }));
    try {
      setThemes(await api('/theme/all'));
    } catch (e) {
      setError(e.message ?? 'Une erreur est survenue');
    } finally {
      setLoading(o => ({ ...o, themes: false }));
    }
  };

  if (!auth.account === null || auth.admin) redirect('/login');

  return (
    <Container>
      <Title>Votre inscription</Title>
      <ErrorMessage message={error} />
      <Line>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <ActionButton onClick={updateUser}>
          <FontAwesomeIcon icon={faFloppyDisk} color={theme.color.text} />
        </ActionButton>
        <ActionButton onClick={deleteUser}>
          <FontAwesomeIcon
            icon={faTrash}
            color={theme.color.error.background}
          />
        </ActionButton>
      </Line>
      <Title small border>
        Themes choisis
      </Title>
      <div className={'truc'}>
        {chosenThemes.map(t => (
          <Theme
            key={t.id}
            chosen
            theme={t}
            changeVisibility={() =>
              setChosenThemes(chosen => chosen.filter(({ id }) => id !== t.id))
            }
          />
        ))}
      </div>
      <Title small border>
        Themes disponibles
      </Title>
      <div className={'truc'}>
        {unchosenThemes.map(t => (
          <Theme
            key={t.id}
            theme={t}
            changeVisibility={() => setChosenThemes(chosen => [...chosen, t])}
          />
        ))}
      </div>
    </Container>
  );
};
