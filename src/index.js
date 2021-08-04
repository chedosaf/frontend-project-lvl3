import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const elements = {
  form: document.getElementsByClassName('rss-form'),
};

elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);
});

