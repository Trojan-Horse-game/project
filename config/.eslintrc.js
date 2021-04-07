module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:vue/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:jest/recommended",
  ],
  settings: {
    "eslint.workingDirectories": [
      { directory: "../server", changeProcessCWD: true },
      { directory: "../client", changeProcessCWD: true },
    ],
  },
};
