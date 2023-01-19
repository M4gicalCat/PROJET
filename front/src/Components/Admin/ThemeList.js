import {useEffect, useState} from "react";
import {api} from "../../utils";
import {Spinner} from "../Spinner";
import {ErrorMessage} from "../ErrorMessage";
import {ActionButton} from "../ActionButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";
import {Title} from "../Title";
import {List} from "../List";
import styled from "styled-components";

const AB = styled(ActionButton)`
  margin: 0 0 1rem auto;
`;

export const ThemeList = () => {
  const theme = useSelector(state => state.theme);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deleteTheme = async (id) => {
    setLoading(true);
    try {
      await api('/theme/delete', {id});
      setThemes(th => th.filter(t => t.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await api('/theme/all');
        setThemes(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <Title>Thèmes</Title>
      <List>
        <AB>
          <FontAwesomeIcon icon={faPlusCircle} color={theme.color.text} style={{width: "1.5rem", height: '1.5rem'}}/>
        </AB>
        {themes.map(({id, label}) => (
          <div key={id}>
            <span>{label}</span>
            <div>
              <ActionButton>
                <FontAwesomeIcon color={theme.color.text} icon={faFloppyDisk} />
              </ActionButton>
              <ActionButton>
                <FontAwesomeIcon color={theme.color.error.background} onClick={() => deleteTheme(id)} icon={faTrash} />
              </ActionButton>
            </div>
          </div>
        ))}
      </List>

    </>
  );
}