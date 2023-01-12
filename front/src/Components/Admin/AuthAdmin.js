import {useState} from "react";
import {api} from "../../utils";
import {ErrorMessage} from "../ErrorMessage";
import {Title} from "../Title";
import {Button} from "../Button";
import {Form} from "../Form";

export const AuthAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api('/admin/login', {username, password});
      localStorage.setItem("admin", result.username);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Title border>Connexion <br/> administrateur</Title>
      <input type="text" placeholder="Nom" value={username} onChange={(e) => setUsername(e.target.value)}/>
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button type="submit" disabled={loading}>Se connecter</Button>
      <ErrorMessage message={error}/>
    </Form>
  );
}