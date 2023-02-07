import { useEffect, useState } from 'react';
import { api } from '../../utils';
import { Spinner } from '../Spinner';
import { ErrorMessage } from '../ErrorMessage';
import { ActionButton } from '../ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFloppyDisk,
  faPen,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { Title } from '../Title';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AB = styled(ActionButton)`
  margin: 0 0 1rem auto;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    &:hover {
      background-color: ${({ theme }) => theme.color.card.background};
    }
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
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: transparent;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 1rem;
  font-size: 1.1rem;

  &:focus {
    outline: none;
  }
`;

const ThemeInput = ({ label, setLabel }) => {
  return (
    <Input type="text" value={label} onInput={e => setLabel(e.target.value)} />
  );
};

export const ThemeList = () => {
  const theme = useSelector(state => state.theme);
  const auth = useSelector(state => state.auth);
  const redirect = useNavigate();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState({ all: true, edit: null });
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [newLabel, setNewLabel] = useState(null);

  const deleteTheme = async id => {
    setLoading(true);
    try {
      await api('/theme/delete', { id });
      setThemes(th => th.filter(t => t.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createTheme = async () => {
    setLoading(o => ({ ...o, create: true }));
    try {
      const theme = await api('/theme/create', { label: newLabel });
      setThemes(th => [...th, theme]);
      setNewLabel(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({ ...o, create: false }));
    }
  };

  const handleEdit = async id => {
    if (edit !== id) {
      setEdit(id);
      setEditLabel(themes.find(t => t.id === id).label);
      return;
    }
    if (editLabel === themes.find(t => t.id === id).label) {
      return setEdit(null);
    }
    setLoading(o => ({ ...o, edit: id }));
    try {
      await api('/theme/update', { id, label: editLabel });
      setThemes(
        themes.map(t => (t.id === id ? { ...t, label: editLabel } : t))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({ ...o, edit: null }));
      setEdit(null);
    }
  };

  useEffect(() => {
    setLoading(o => ({ ...o, all: true }));
    (async () => {
      try {
        const result = await api('/theme/all');
        setThemes(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(o => ({ ...o, all: false }));
      }
    })();
  }, []);

  if (loading.all) return <Spinner />;
  if (!auth.admin) return redirect('/');
  return (
    <>
      <Title>Thèmes</Title>
      <ErrorMessage message={error} />
      <List>
        <AB>
          <FontAwesomeIcon
            icon={faPlusCircle}
            color={theme.color.text}
            style={{ width: '1.5rem', height: '1.5rem' }}
            onClick={() => setNewLabel(l => l ?? 'Nouveau thème')}
          />
        </AB>
        {themes.map(({ id, label }) => {
          return loading.edit === id ? (
            <Spinner />
          ) : (
            <div key={id}>
              {edit === id ? (
                <ThemeInput label={editLabel} setLabel={setEditLabel} />
              ) : (
                <span>{label}</span>
              )}
              <div>
                <ActionButton>
                  <FontAwesomeIcon
                    onClick={() => handleEdit(id)}
                    color={theme.color.text}
                    icon={edit === id ? faFloppyDisk : faPen}
                  />
                </ActionButton>
                <ActionButton>
                  <FontAwesomeIcon
                    color={theme.color.error.background}
                    onClick={() => deleteTheme(id)}
                    icon={faTrash}
                  />
                </ActionButton>
              </div>
            </div>
          );
        })}
        {newLabel !== null && (
          <div key={-1}>
            <ThemeInput label={newLabel} setLabel={setNewLabel} />
            <div>
              <ActionButton>
                <FontAwesomeIcon
                  onClick={() => createTheme()}
                  color={theme.color.text}
                  icon={faFloppyDisk}
                />
              </ActionButton>
              <ActionButton>
                <FontAwesomeIcon
                  color={theme.color.error.background}
                  onClick={() => setNewLabel(null)}
                  icon={faTrash}
                />
              </ActionButton>
            </div>
          </div>
        )}
      </List>
    </>
  );
};
