import '../template.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import parse from './parser';

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



const makeFeed = (url, parsedData) => ({
    id: url,
    title: parsedData.title,
    description: parsedData.description,
  });
  

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // console.log(formData.get('url'));
//     const { url } = state.form.fields;
//     fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent('https://wikipedia.org')}`)
//   .then

  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(formData.get('url'))}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then((data) => {
      const parsedData = parse(data.contents);
      const feed = makeFeed(formData.get('url'), parsedData);
      console.log(feed);
    });
      
});



