import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import app from './application';
import resources from './locales';

const init = () => {
  yup.setLocale({
    // use constant translation keys for messages without values
    mixed: {
      required: () => ({ key: 'required' }),
      notOneOf: () => ({ key: 'notOneOf' }),
    },
    string: {
      url: () => ({ key: 'url' }),
    },
  });

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => app(i18nextInstance));
};

export default init;
