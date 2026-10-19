import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Copias de referencia de otras webs y pruebas sueltas: no son código del proyecto.
    "refs/**",
    "fuentes-prueba/**",
    "motion/**",
    "scripts/mockups/photoshop/**", // ExtendScript de Photoshop, no JS del navegador
  ]),
]);

export default eslintConfig;
