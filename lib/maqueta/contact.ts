/* Datos de contacto (public/profile.txt), compartidos por el pie de todas las páginas.
   El email no va escrito entero en el código (2026-10-17): se monta en el navegador con `email()`, para que no lo
   recojan los robots que leen el HTML buscando direcciones para spam. */
const USER = "anico.es";
const DOMAIN = ["gmail", "com"];
export const email = () => `${USER}@${DOMAIN.join(".")}`;
export const LINKEDIN = "https://es.linkedin.com/in/anico";
