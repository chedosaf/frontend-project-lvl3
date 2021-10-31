const mixed = {
  required: () => ({ key: 'required' }),
  notOneOf: () => ({ key: 'notOneOf' }),
};
const string = {
  url: () => ({ key: 'url' }),
};

export { mixed, string };
