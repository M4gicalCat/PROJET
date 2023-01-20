import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun, faX } from "@fortawesome/free-solid-svg-icons";
import { useWindowSize } from "../hooks";
import { Spinner } from "./Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "../store/ThemeSlice";
import {themes} from "../themes";

const Nav = styled.nav`
  position: fixed;
  top: 0;
  display: flex;
  width: 100%;
  max-width: 100vw;
  justify-content: space-around;
  align-items: center;
  background-color: #282c34;
  color: white;
  height: max-content;
  z-index: 9999;
  & > * {
    padding: 1rem;
    text-decoration: none;
    color: white;

    &:hover {
      color: ${({theme}) => theme.color.hover};
    }

    transition-duration: .25s;
  }
`;

export const SmallNav = styled.nav`
  position: fixed;
  top: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  background-color: #282c34;
  color: white;
  height: max-content;
  z-index: 9999;
  & > * {
    padding: 1rem;
    text-decoration: none;
    color: white;

    &:hover {
      color: ${({theme}) => theme.color.hover};
    }
  }
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease-in-out;

  & > * {
    padding: 1rem;
    text-decoration: none;
    text-align: center;
    color: white;
    border-bottom: 1px solid #63cbfb;
    width: 100%;
  }
`;

const PhoneMenu = ({connected}) => {
  const [open, setOpen] = useState(false);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const toggleTheme = () => dispatch(setTheme(theme.name === "light" ? "dark" : "light"));

  return (
    <SmallNav>
      {open ? (
          <>
            <FontAwesomeIcon icon={faX} onClick={() => setOpen(false)}/>
            <List>
              <Link onClick={() => setOpen(false)} to="/">Accueil</Link>
              {connected
                ? (<Link onClick={() => setOpen(false)} to="/login">Se connecter</Link>)
                : (<Link onClick={() => setOpen(false)} to="/logout">Se déconnecter</Link>)
              }
            </List>
          </>
        ) : (
            <FontAwesomeIcon icon={faBars} onClick={() => setOpen(true)}/>
        )}
      <FontAwesomeIcon
        icon={theme === "light" ? faMoon : faSun}
        onClick={() => toggleTheme()}
      />
    </SmallNav>
  );
}

const LargeMenu = ({connected}) => {
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const toggleTheme = () => dispatch(setTheme(theme.name === "light" ? "dark" : "light"));
  return (
    <Nav>
      <Link to="/">Accueil</Link>
      {connected
        ? (<Link to="/logout">Se déconnecter</Link>)
        : (<Link to="/login">Se connecter</Link>)
      }
      <FontAwesomeIcon
        style={{width: "1rem"}}
        icon={theme === "light" ? faMoon : faSun}
        onClick={() => toggleTheme()}
      />
    </Nav>
  );
};

const Background = styled.div`
  background-color: ${props => props.theme.background};
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  color: ${props => props.theme.color.text};
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({theme}) => theme.color.scrollbar.thumb};
    height: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({theme}) => theme.color.scrollbar.hover};
  }
`;

export const Menu = () => {
  const width = useWindowSize();
  const auth = useSelector(state => state.auth);

  return (
    <>
      {(width < 500) ? <PhoneMenu {...{connected: !!auth?.account}}/> : <LargeMenu connected={!!auth?.account}/>}
      <Background>
        <div style={{height: "5rem"}}/>
        {!auth ? <Spinner /> : <Outlet/>}
      </Background>
    </>
  );
};