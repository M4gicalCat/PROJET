import {useEffect, useState} from "react";
import {api} from "../../utils";
import {Title} from "../Title";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {Button} from "../Button";

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
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
`;

export const Admin = () => {
  const [nbInscrits, setNbInscrits] = useState(0);
  const [nbThemes, setNbThemes] = useState(0);

  const getInitialData = async () => {
    const [nbI, nbT] = await Promise.all([
      api('/user/count'),
      api('/theme/count'),
    ]);
    setNbInscrits(nbI.count);
    setNbThemes(nbT.count);
  }

  useEffect(() => {
    getInitialData().then(() => {});
  }, []);

  return (
    <Container>
      <Title>Admin</Title>
      <div>
        <Link to='/admin/themes'>
          <Button>
            Voir les {nbThemes} themes
          </Button>
        </Link>
        <Link to='/admin/inscriptions'>
          <Button>
          Voir les {nbInscrits} inscrits
          </Button>
        </Link>
      </div>
    </Container>
  );
}