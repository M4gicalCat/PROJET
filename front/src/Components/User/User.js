import { Title } from '../Title';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Theme } from '../Admin/UserList';
import { api } from '../../utils';

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

// là où il est appelé (Accueil.js), il ne reçoit pas de props => getThemes, themes, updateUser sera toujours undefined

// récupère les fonctions dans le côté admin, par contre les routes ne sont pas les mêmes (appeler les routes côté utilisateur et pas admin)
export const User = () => {
  const auth = useSelector(state => state.auth);
  const redirect = useNavigate();

  const [user, setUser] = useState({});
  const [email, setEmail] = useState(user.email);
  const theme = useSelector(state => state.theme);
  const [themes, setThemes] = useState([]);
  const [chosenThemes, setChosenThemes] = useState(user.themes);
  const [unchosenThemes, setUnchosenThemes] = useState([]);
  const [loading, setLoading] = useState({
    all: true,
    themes: null,
    edit: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    getThemes();
  }, []);

  useEffect(() => {
    if (JSON.stringify(chosenThemes) === JSON.stringify(user.themes)) return;
    updateUser(user.id, user.email, chosenThemes);
    setUnchosenThemes(
      themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
    );
  }, [chosenThemes]);

  useEffect(() => {
    setUnchosenThemes(
      themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
    );
  }, [themes, chosenThemes]);

  useEffect(() => {
    api('/user/get').then(setUser);
  }, [auth]);

  const updateUser = async (id, email, themes) => {
    try {
      await api('/user/update', {
        id,
        email,
        themes: themes.map(t => t.id),
      });
      user.themes = themes;
      user.email = email;
    } catch (e) {
      setError(e.message);
    }
  };

  const getThemes = async () => {
    if (themes.length > 0 || loading.themes) return;
    setError('');

    setLoading(o => ({ ...o, themes: true }));
    try {
      setThemes(await api('/theme/all'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({ ...o, themes: false }));
    }
  };

  if ((!auth.account && 'account' in auth) || auth.admin) redirect('/login');

  return (
    <Container>
      <Title>User</Title>
      <div>
        <Title small border>
          Themes choisis
        </Title>
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
        <Title small border>
          Themes disponibles
        </Title>
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
