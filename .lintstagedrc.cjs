module.exports = {
  "*.{css,json,md}": "prettier --write",
  "*.{js,mjs}": ["prettier --write", "eslint --fix"],
};
