import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
    "plugin:mdx/recommended",
  ),
  {
    // MDX injects components (e.g. <Cover>) via useMDXComponents at render time,
    // so jsx-no-undef cannot see them and produces false positives here.
    files: ["**/*.mdx"],
    rules: {
      "react/jsx-no-undef": "off",
    },
  },
];

export default eslintConfig;
