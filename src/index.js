import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const forms = document.getElementsByClassName('rss-form');

const form = form[0];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target.value);
  });



