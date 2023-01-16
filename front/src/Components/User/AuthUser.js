import {useEffect, useRef, useState} from "react";
import {api} from "../../utils";
import {ErrorMessage} from "../ErrorMessage";
import {Form} from "../Form";
import {Link} from "react-router-dom";
import {Button} from "../Button";
import {setAccount, setAdmin} from "../../store/AuthenticateSlice";
import {useDispatch, useSelector} from "react-redux";

export const AuthUser = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api('/user/login', {email});
      dispatch(setAccount(result));
      dispatch(setAdmin(false));
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
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <Button type="submit" onClick={handleSubmit} disabled={loading || !auth}>Se connecter</Button>
      <ErrorMessage message={error}/>
    </Form>
  );
}