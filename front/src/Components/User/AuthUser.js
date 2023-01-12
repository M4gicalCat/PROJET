import {useState} from "react";
import {api} from "../../utils";
import {ErrorMessage} from "../ErrorMessage";

export const AuthUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api('/user/login', {username, password});
      console.log(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button type="submit" onClick={handleSubmit} disabled={loading}>Login</button>
      <ErrorMessage message={error}/>
    </form>
  );
}