import _ from 'lodash';
import axios from 'axios';
import * as yup from 'yup';
import parse from './parser';
import view from './view';

const validate = (fields, feedsIds) => {
  const schema = yup.string()
    .url()
    .notOneOf(feedsIds).required();
  try {
    schema.validateSync(fields, { abortEarly: false });

    return null;
  } catch (e) {
    return e.errors[0].key;
  }
};

const startApp = (i18nextInstance) => {
  const defaultState = {
    form: {
      fields: {
        url: '',
      },
      processState: 'filling',
      valid: true,
      error: '',
    },
    feeds: [],
    posts: [],
  };

  const form = document.getElementsByClassName('rss-form')[0];
  const feeds = document.getElementsByClassName('feeds')[0];
  const posts = document.getElementsByClassName('posts')[0];
  const input = document.getElementById('url-input');
  const elements = {
    form,
    feeds,
    posts,
    input,
  };

  const addIdToPost = (id) => (post) => ({ ...post, feedId: id });

  const makeFeed = (url, parsedData) => ({
    id: url,
    title: parsedData.title,
    description: parsedData.description,
  });

  const watchedState = view(defaultState, elements, i18nextInstance);

  const makeUpdates = (stat) => {
    if (stat.feeds.length > 0) {
      const feedsUrls = stat.feeds.map(({ id }) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(id)}`);
      const promises = feedsUrls.map((res) => axios.get(res));
      Promise.allSettled(promises).then((responses) => {
        responses.forEach((response, index) => {
          console.log(response.value.statusText);
          if (response.value.statusText !== 'OK') throw new Error('Network response was not ok.');
          const newFeed = parse(response.value.data.contents);
          const oldFeed = watchedState.feeds[index];
          const oldPosts = watchedState.posts.filter(({ feedId }) => feedId === oldFeed.id);
          const newPosts = _.differenceBy(newFeed.posts, oldPosts, 'link').map(addIdToPost(oldFeed.id));
          watchedState.posts = defaultState.posts.concat(newPosts);
        });
      });
    }
    setTimeout(() => makeUpdates(stat), 5000);
  };

  input.addEventListener('input', () => {
    defaultState.form.processState = 'filling';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.valid = true;
    const formData = new FormData(e.target);
    const validateStatus = validate(formData.get('url').toLowerCase().trim(), watchedState.feeds.map((feed) => feed.id));
    if (validateStatus === null) {
      watchedState.form.processState = 'processing';
    } if (validateStatus !== null) {
      watchedState.form.error = validateStatus;
      watchedState.form.valid = false;
      watchedState.form.processState = 'filling';
      return;
    }

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(formData.get('url'))}`) // валидация на содержание RSS!!!
      .then((response) => response.data)
      .then((data) => {
        const parsedData = parse(data.contents);
        if (parsedData === null) {
          watchedState.form.error = 'parseError';
          watchedState.form.processState = 'filling';
          watchedState.form.valid = false;
        } else {
          const feed = makeFeed(formData.get('url'), parsedData);
          watchedState.feeds.push(feed);
          const feedPosts = parsedData.posts.map(addIdToPost(feed.id));
          watchedState.posts.push(...feedPosts);
          watchedState.form.processState = 'finished';
          watchedState.form.valid = true;
        }
      }).catch((err) => {
        console.log(err);
        watchedState.form.error = 'netError';
        watchedState.form.processState = 'filling';
        watchedState.form.valid = false;
      });
  });

  makeUpdates(watchedState);
};

export default startApp;
