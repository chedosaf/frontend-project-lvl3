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

const addIdToPost = (id) => (post) => ({ ...post, feedId: id });

const makeFeed = (url, parsedData) => ({
  id: url,
  title: parsedData.title,
  description: parsedData.description,
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(formData.get('url'))}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    }).then((data) => {
      const parsedData = parse(data.contents);
      const feed = makeFeed(formData.get('url'), parsedData);
      state.feeds.push(feed);
      const feedPosts = parsedData.posts.map(addIdToPost(feed.id));
      state.posts.push(...feedPosts);
      console.log(state.posts);
      console.log(state.feeds);
    });
});
