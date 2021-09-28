import * as yup from 'yup';

export default (fields, feedsIds) => {
  const schema = yup.string() // yup.setLocale()
    .url()
    .notOneOf(feedsIds).required();
  try {
    schema.validateSync(fields, { abortEarly: false });

    return null;
  } catch (e) {
    return e.errors[0].key;
  }
};
