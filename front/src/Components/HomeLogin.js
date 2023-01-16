import {CustomLink} from "./CustomLink";
import {Title} from "./Title";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {Button} from "./Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  > div {
    width: max-content;
    margin: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;

    > button {
      transition: .35s;
      &:hover {
        background-color: ${({theme}) => theme.color.hover};
      }
    }

    & a {
      text-decoration: none;
      color: ${({theme}) => theme.color.text};
    }
  }
`;

export const HomeLogin = () => (
  <Container>
    <Title>Choisissez une option de connexion</Title>
    <div>
      <Link to="/login/admin"><Button>Administrateur</Button></Link>
      <Link to="/login/user"><Button>Autre</Button></Link>
    </div>
  </Container>
);