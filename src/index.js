import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const forms = document.getElementsByClassName('rss-form');

const form = forms[0];

// const button = form.getElementsById('submitButton');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    console.log(formData.get('url'));
  });



