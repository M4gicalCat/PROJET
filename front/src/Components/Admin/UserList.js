import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {api} from "../../utils";
import {Spinner} from "../Spinner";
import {ErrorMessage} from "../ErrorMessage";
import {Title} from "../Title";
import {List} from "../List";
import {ActionButton} from "../ActionButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const AB = styled(ActionButton)`
  margin: 0 0 1rem auto;
`;

export const UserList = () => {
  const theme = useSelector(state => state.theme);
  const [inscriptions, setInscriptions] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getInscriptions = async () => {
    setLoading(true);
    try {
      const result = await api('/user/all');
      setInscriptions(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getThemes = async () => {
    setLoading(true);
    try {
      const result = await api('/theme/all');
      setThemes(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInscriptions().then(() => {});
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <>
      <Title>Inscriptions</Title>
      <List>
        <AB style={{float: 'right'}}>
          <FontAwesomeIcon icon={faPlusCircle} color={theme.color.text}/>
        </AB>
        {inscriptions.map(({email, id}) => (
          <div key={id}>
            <span>{email}</span>
            <div>
              <ActionButton>
                <FontAwesomeIcon color={theme.color.text} icon={faFloppyDisk} />
              </ActionButton>
              <ActionButton>
                <FontAwesomeIcon color={theme.color.error.background} icon={faTrash} />
              </ActionButton>
            </div>
          </div>
        ))}
      </List>
    </>
  );
}