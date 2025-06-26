module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react/jsx-key": "off",
    "no-unsafe-optional-chaining": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
