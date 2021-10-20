import _ from 'lodash';
import parse from './parser';
import view from './view';
import validate from './validation';

export default (i18nextInstance) => {
  const state = {
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

  const watchedState = view(state, elements, i18nextInstance);

  const makeUpdates = (stat) => {
    if (stat.feeds.length > 0) {
      const feedsUrls = stat.feeds.map(({ id }) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(id)}`);
      const promises = feedsUrls.map((res) => fetch(res));
      Promise.allSettled(promises).then((responses) => {
        responses.forEach((response, index) => {
          if (!response.value.ok) throw new Error('Network response was not ok.');
          return response.value.json().then((json) => {
            const newFeed = parse(json.contents);
            const oldFeed = watchedState.feeds[index];
            const oldPosts = watchedState.posts.filter(({ feedId }) => feedId === oldFeed.id);
            const getNewPosts = (newPosts, prevPosts) => _.differenceBy(newPosts, prevPosts, 'link');
            const newPosts = getNewPosts(newFeed.posts, oldPosts).map(addIdToPost(oldFeed.id));
            watchedState.posts = state.posts.concat(newPosts);
          });
        });
      });
    }
    setTimeout(() => makeUpdates(stat), 5000);
  };

  input.addEventListener('input', () => {
    state.form.processState = 'filling';
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

    fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(formData.get('url'))}`) // валидация на содержание RSS!!!
      .then((response) => response.json())
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
      }).catch(() => {
        watchedState.form.error = 'netError';
        watchedState.form.processState = 'filling';
        watchedState.form.valid = false;
        throw new Error('Network response was not ok.');
      });
  });

  makeUpdates(watchedState);
};
