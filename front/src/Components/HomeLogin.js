import {CustomLink} from "./CustomLink";

export const HomeLogin = () => (
  <>
    <CustomLink to="/login/admin">Administrateur</CustomLink>
    <CustomLink to="/login/user">Autre</CustomLink>
  </>
);