import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { api } from '../../utils';
import { Spinner } from '../Spinner';
import { ErrorMessage } from '../ErrorMessage';
import { Title } from '../Title';
import { ActionButton } from '../ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faFloppyDisk,
  faMinus,
  faPen,
  faPlus,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Input } from '../Input';

const AB = styled(ActionButton)`
  margin: 0 0 1rem auto;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

List.Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  ${({ open, theme }) =>
    open
      ? `
    margin: 1rem 0;
    border: 1px solid ${theme.color.border};
    border-radius: 5px;
    `
      : `
    &:hover {
    background-color: ${theme.color.card.background};
    border: 1px solid ${theme.color.border};
    border-radius: 5px;
  }`}
`;

List.Item.Head = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ open }) =>
    open
      ? `margin-bottom: 2rem; border-bottom: inherit;padding-bottom: .7rem;`
      : ''}
  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 5rem;
    & * {
      width: 1rem;
      height: 1rem;
    }
  }
`;

List.Item.Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  > div {
    width: 100%;
    text-align: left;
  }
  & ${Title} {
    width: max-content;
    margin: 0.5rem auto 1rem auto;
  }
`;

const Theme = ({ chosen, theme, changeVisibility }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <ActionButton onClick={() => changeVisibility(theme.id)}>
      <FontAwesomeIcon
        color={chosen ? 'red' : 'green'}
        icon={chosen ? faMinus : faPlus}
      />
    </ActionButton>
    <span style={{ marginLeft: '1rem' }}>{theme.label}</span>
  </div>
);

const Inscription = ({
  inscription,
  getThemes,
  themes,
  deleteInscription,
  loading,
  updateUser,
}) => {
  const theme = useSelector(state => state.theme);
  const [email, setEmail] = useState(inscription.email);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [unchosenThemes, setUnchosenThemes] = useState([]);
  const [chosenThemes, setChosenThemes] = useState(inscription.themes);

  const handleEdit = e => {
    e.stopPropagation();
    if (edit) {
      console.log('echo thames', inscription.themes);
      updateUser(inscription.id, email, inscription.themes);
    }
    inscription.email = email;
    setEdit(e => !e);
  };

  useEffect(() => {
    if (open) {
      getThemes();
    }
  }, [open]);

  useEffect(() => {
    if (JSON.stringify(chosenThemes) === JSON.stringify(inscription.themes))
      return;
    updateUser(inscription.id, inscription.email, chosenThemes);
    setUnchosenThemes(
      themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
    );
  }, [chosenThemes]);

  useEffect(() => {
    setUnchosenThemes(
      themes.filter(t => !chosenThemes.find(ct => ct.id === t.id))
    );
  }, [themes, chosenThemes]);

  return (
    <List.Item onClick={() => setOpen(o => !o)} open={open}>
      <List.Item.Head open={open}>
        {loading ? (
          <Spinner />
        ) : edit ? (
          <Input
            onClick={e => e.stopPropagation()}
            type="email"
            value={email}
            onInput={e => setEmail(e.target.value)}
          />
        ) : (
          <span>{inscription.email}</span>
        )}
        <div>
          <ActionButton>
            <FontAwesomeIcon
              onClick={handleEdit}
              color={theme.color.text}
              icon={edit ? faFloppyDisk : faPen}
            />
          </ActionButton>
          <ActionButton>
            <FontAwesomeIcon
              color={theme.color.text}
              icon={open ? faChevronUp : faChevronDown}
              onClick={e => {
                e.stopPropagation();
                setOpen(o => !o);
              }}
            />
          </ActionButton>
          <ActionButton>
            <FontAwesomeIcon
              color={theme.color.error.background}
              icon={faTrash}
              onClick={() => deleteInscription(inscription.id)}
            />
          </ActionButton>
        </div>
      </List.Item.Head>
      {open && (
        <List.Item.Body onClick={e => e.stopPropagation()}>
          <Title small border>
            Themes choisis
          </Title>
          {chosenThemes.map(t => (
            <Theme
              key={t.id}
              chosen
              theme={t}
              changeVisibility={() =>
                setChosenThemes(chosen =>
                  chosen.filter(({ id }) => id !== t.id)
                )
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
        </List.Item.Body>
      )}
    </List.Item>
  );
};

export const UserList = () => {
  const theme = useSelector(state => state.theme);
  const auth = useSelector(state => state.auth);
  const redirect = useNavigate();
  const [inscriptions, setInscriptions] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState({
    all: true,
    themes: null,
    edit: null,
  });
  const [error, setError] = useState('');

  const getInscriptions = async () => {
    setError('');
    setLoading(o => ({ ...o, all: true }));
    try {
      const result = await api('/user/all');
      setInscriptions(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({ ...o, all: false }));
    }
  };

  const updateUser = async (id, email, themes) => {
    try {
      await api('/admin/updateInscription', {
        id,
        email,
        themes: themes.map(t => t.id),
      });
      const i = inscriptions.find(i => i.id === id);
      i.themes = themes;
      i.email = email;
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

  const deleteInscription = async id => {
    setError('');
    setLoading(o => ({ ...o, edit: id }));
    try {
      await api('/admin/deleteInscription', { id });
      setInscriptions(inscriptions.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({ ...o, edit: null }));
    }
  };

  useEffect(() => {
    getInscriptions().then(() => {});
  }, []);

  if (loading.all || !('account' in auth)) return <Spinner />;
  if (!auth.admin) return redirect('/');
  return (
    <>
      <Title>Inscriptions</Title>
      <ErrorMessage message={error} />
      <List>
        <AB style={{ float: 'right' }}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color={theme.color.text}
          />
        </AB>
        {inscriptions.map(inscription => (
          <Inscription
            updateUser={updateUser}
            inscription={inscription}
            key={inscription.id}
            themes={themes}
            getThemes={getThemes}
            deleteInscription={deleteInscription}
            loading={loading.edit === inscription.id}
          />
        ))}
      </List>
    </>
  );
};
