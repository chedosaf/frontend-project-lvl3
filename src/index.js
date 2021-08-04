import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const elements = {
  input: document.getElementById('url-input'),
  button: document.getElementById('submitButton'),
  form: document.getElementById('form'),
};

elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);
});

