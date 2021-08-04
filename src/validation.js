import _ from 'lodash';
import * as yup from 'yup';

const schema = yup.string().url();

const state = {
    form: {
      fields: {
        url: '',
      },
      processState: 'filling',
      valid: false,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return _.keyBy(e.inner, 'path');
    }
};

const watchedState = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value === 'true') {
        console.log('!!!!!!!!!!!!');
      }
    }
});

export default (input) => {
    if (JSON.stringify(validate(input)) === JSON.stringify({})) {
        state.form.valid = 'true';
    }
};

console.log("hccycyyg");
