import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import parser from './parser';

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

const forms = document.getElementsByClassName('rss-form');

const form = forms[0];

// const button = form.getElementsById('submitButton');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // console.log(formData.get('url'));
//     const { url } = state.form.fields;
//     fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent('https://wikipedia.org')}`)
//   .then

  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(formData.get('url'))}`)
    .then((resp) => {
        const parsedData = parse(resp.data);
        state.posts.push(parsedData.posts);
        console.log(state.posts);
    });
      
});



