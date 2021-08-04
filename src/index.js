import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const form = document.forms[0];
const submit = form.getElementsById('submitButton');
console.log(submit);

submit.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target.value);
});

