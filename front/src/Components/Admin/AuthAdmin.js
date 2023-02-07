import {useEffect, useRef, useState} from "react";
import {api} from "../../utils";
import {ErrorMessage} from "../ErrorMessage";
import {Title} from "../Title";
import {Button} from "../Button";
import {Form} from "../Form";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setAdmin, setAccount} from "../../store/AuthenticateSlice";

export const AuthAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api('/admin/login', {username, password});
      if (result.error) throw new Error(result.error);
      dispatch(setAccount(result));
      dispatch(setAdmin(true));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth?.account) ref.current?.click();
  }, [auth?.account, ref.current]);

  return auth?.account ? (
    <>
      <ErrorMessage message="Vous êtes déjà connecté. Veuillez retourner à l'accueil."/>
      <Link to={'/'} ref={ref}/>
    </>
  ) : (
    <Form onSubmit={handleSubmit}>
      <Title border>Connexion <br/> administrateur</Title>
      <input type="text" placeholder="Nom" value={username} onChange={(e) => setUsername(e.target.value)}/>
      <input type="password" autoComplete="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button type="submit" disabled={loading || !auth || [username.length, password.length].includes(0)}>Se connecter</Button>
      <ErrorMessage message={error}/>
    </Form>
  );
}