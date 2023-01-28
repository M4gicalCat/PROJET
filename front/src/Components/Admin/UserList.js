import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {api} from "../../utils";
import {Spinner} from "../Spinner";
import {ErrorMessage} from "../ErrorMessage";
import {Title} from "../Title";
import {ActionButton} from "../ActionButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faFloppyDisk, faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

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
  border-bottom: 1px solid ${({theme}) => theme.color.border};
  ${({open, theme}) => (
    open ? `
    margin: 1rem 0;
    border: 1px solid ${theme.color.border};
    border-radius: 5px;
    ` : `
    &:hover {
    background-color: ${theme.color.card.background};
    border: 1px solid ${theme.color.border};
    border-radius: 5px;
  }`)}
`;

List.Item.Head = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({open}) => open ? `margin-bottom: 2rem; border-bottom: inherit;padding-bottom: .7rem;` : ""}
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
    margin: .5rem auto 1rem auto;
  }
`;

const Inscription = ({inscription, getThemes, themes, deleteInscription, loading}) => {
  const theme = useSelector(state => state.theme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getThemes();
    }
  }, [open]);

  const unchosenThemes = themes.filter(t => !inscription.themes.includes(t.id));

  return (
    <List.Item onClick={() => setOpen(o => !o)} open={open}>
      <List.Item.Head open={open}>
        {loading ? <Spinner/> : <span>{inscription.email}</span>}
        <div>
          <ActionButton>
            <FontAwesomeIcon color={theme.color.text} icon={open ? faChevronUp : faChevronDown} onClick={(e) => {
              e.stopPropagation();
              setOpen(o => !o);
            }} />
          </ActionButton>
          <ActionButton>
            <FontAwesomeIcon color={theme.color.error.background} icon={faTrash} onClick={() => deleteInscription(inscription.id)} />
          </ActionButton>
        </div>
      </List.Item.Head>
      {open && (
        <List.Item.Body onClick={e => e.stopPropagation()}>
          <Title small border>Themes choisis</Title>
          {inscription.themes.map(t => (
            <div key={t.id}>{t.label}</div>
          ))}
          <Title small border>Themes disponibles</Title>
          {unchosenThemes.map(t => (
            <div key={t.id}>{t.label}</div>
          ))}
        </List.Item.Body>
      )}
    </List.Item>
  )
}

export const UserList = () => {
  const theme = useSelector(state => state.theme);
  const [inscriptions, setInscriptions] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState({all: true, themes: null, edit: null});
  const [error, setError] = useState("");

  const getInscriptions = async () => {
    setError("");
    setLoading(o => ({...o, all: true}));
    try {
      const result = await api('/user/all');
      setInscriptions(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({...o, all: false}));
    }
  };

  const getThemes = async () => {
    if (themes.length > 0 || loading.themes) return;
    setError("");

    setLoading(o => ({...o, themes: true}));
    try {
      setThemes(await api('/theme/all'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({...o, themes: false}));
    }
  };

  const deleteInscription = async (id) => {
    setError("");
    setLoading(o => ({...o, edit: id}));
    try {
      await api('/admin/deleteInscription', {id});
      setInscriptions(inscriptions.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(o => ({...o, edit: null}));
    }
  };

  useEffect(() => {
    getInscriptions().then(() => {});
  }, []);

  if (loading.all) return <Spinner />;
  return (
    <>
      <Title>Inscriptions</Title>
      <ErrorMessage message={error} />
      <List>
        <AB style={{float: 'right'}}>
          <FontAwesomeIcon icon={faPlusCircle} style={{width: "1.5rem", height: '1.5rem'}} color={theme.color.text}/>
        </AB>
        {inscriptions.map(inscription => (
          <Inscription inscription={inscription} key={inscription.id} themes={themes} getThemes={getThemes} deleteInscription={deleteInscription} loading={loading.edit === inscription.id} />
        ))}
      </List>
    </>
  );
}