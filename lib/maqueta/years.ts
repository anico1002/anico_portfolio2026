/* Años de experiencia (28 en 2026): se cuentan desde el inicio de carrera (`career_start` de
   public/profile.txt, igual que la web actual) y suben solos cada año. Las páginas que los usan se
   regeneran a diario (`revalidate`), así que el número cambia en la web sin volver a desplegar. */
export const CAREER_START = 1998;
export const yearsOfExperience = () => new Date().getFullYear() - CAREER_START;
