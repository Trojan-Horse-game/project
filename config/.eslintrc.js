module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/vue",
    "plugin:jest/recommended",
  ],
  settings: {
    "eslint.workingDirectories": [
      { directory: "../server", changeProcessCWD: true },
      { directory: "../client", changeProcessCWD: true },
    ]
  }
};
