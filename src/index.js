import '../template.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import parse from './parser';
import view from './view';

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

const feeds = document.getElementsByClassName('feeds')[0];
const posts = document.getElementsByClassName('posts')[0];
const elements = {
  feeds,
  posts,
};

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
      console.log(parsedData.posts);
      // console.log(feedPosts);
      view(state, elements);
    });
});
