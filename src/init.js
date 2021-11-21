import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import startApp from './application';
import resources from './locales';
import { mixed, string } from './locales/yupLocale';

const init = () => {
  yup.setLocale({
    mixed,
    string,
  });

  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => startApp(i18nextInstance));
};

export default init;
