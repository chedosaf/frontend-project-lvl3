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
    feeds: '...', // продумать хранение
    posts: '...', //
  };

const validate = (input) => {
  const errors = {};
  
  if (wasAdded) { // продумать wasAdded
      errors.wasAdded = 'Url was added before!';
  } if (!schema.isValidSync(fields)) {
      errors.valid = 'Url invalid'
  } return errors;
};

export default (input) => {
    const errors = validate(input);
    const valid = _.isEqual(errors, {});
    return { errors, valid};
}
