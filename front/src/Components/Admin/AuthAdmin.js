import {useEffect, useRef, useState} from "react";
import {api} from "../../utils";
import {ErrorMessage} from "../ErrorMessage";
import {Title} from "../Title";
import {Button} from "../Button";
import {Form} from "../Form";
import {useConnected} from "../../hooks";
import {Link} from "react-router-dom";

export const AuthAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {connected, setConnectedInfos, loading: connectedLoading} = useConnected();
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api('/admin/login', {username, password});
      setConnectedInfos(true, result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (connected) ref.current?.click();
  }, [connected, ref.current]);

  return connected ? (
    <>
      <ErrorMessage message="Vous êtes déjà connecté. Veuillez retourner à l'accueil."/>
      <Link to={'/'} ref={ref}/>
    </>
  ) : (
    <Form onSubmit={handleSubmit}>
      <Title border>Connexion <br/> administrateur</Title>
      <input type="text" placeholder="Nom" value={username} onChange={(e) => setUsername(e.target.value)}/>
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button type="submit" disabled={loading || connectedLoading}>Se connecter</Button>
      <ErrorMessage message={error}/>
    </Form>
  );
}