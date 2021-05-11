module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    "no-use-before-define": "off",
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  }
};
