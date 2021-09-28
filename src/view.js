import onChange from 'on-change';

const hiden = document.getElementsByClassName('card-body');
const feedback = document.getElementsByClassName('feedback')[0];

const postElement = document.getElementsByClassName('posts');
const btns = postElement[0].getElementsByClassName('btn');
const modalTitle = document.getElementsByClassName('modal-title')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];
const modalFooter = document.getElementsByClassName('modal-footer')[0];
const modalA = modalFooter.getElementsByClassName('btn')[0];
const input = document.getElementById('url-input');

export default (state, elements, i18nextInstance) => {
  const createPost = (title, href) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0', 'fw-bold');
    const a = document.createElement('a');
    const linkText = document.createTextNode(title);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-primary');
    const buttonText = document.createTextNode(i18nextInstance.t('show'));
    button.append(buttonText);
    a.setAttribute('href', href);
    a.append(linkText);
    li.append(a);
    li.append(button);
    return li;
  };

  const createPosts = (posts) => {
    if (posts.length === 0) {
      return '';
    }
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'posts-list');
    posts.forEach(({ title, link }) => {
      const post = createPost(title, link);
      ul.append(post);
    });
    return ul;
  };

  const createFeed = (title, description) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.classList.add('h6', 'm-0');
    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('m-0', 'small', 'text-black-50');
    descriptionElement.textContent = ` ${description}`;
    titleElement.append(descriptionElement);
    li.append(titleElement);
    return li;
  };

  const createFeeds = (feeds) => {
    if (feeds.length === 0) {
      return '';
    }
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'feeds-list');
    feeds.forEach(({ title, description }) => {
      const feed = createFeed(title, description);
      ul.append(feed);
    });
    return ul;
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        document.getElementsByClassName('feeds-list')[0].replaceWith(createFeeds(state.feeds));
        [...hiden].forEach((hide) => {
          hide.classList.remove('d-none');
        });
        break;
      case 'posts':
        console.log('Boom');
        document.getElementsByClassName('posts-list')[0].replaceWith(createPosts(state.posts));
        console.log(document.getElementsByClassName('posts-list')[0]);
        [...btns].forEach((btn) => {
          btn.setAttribute('data-bs-toggle', 'modal');
          btn.setAttribute('data-bs-target', '#modal');
          btn.addEventListener('click', () => {
            const li = btn.closest('.list-group-item');
            li.classList.remove('fw-bold');
            li.classList.add('fw-normal');
            modalTitle.innerText = state.posts.filter((p) => p.link === btn.previousElementSibling
              .href)[0]
              .title;
            modalBody.innerText = state.posts.filter((p) => p.link === btn.previousElementSibling
              .href)[0]
              .description;
            modalA.href = btn.previousElementSibling.href;
          });
        });
        break;
      case 'form.valid':
        if (value === true) {
          elements.input.classList.remove('is-invalid');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          feedback.innerText = i18nextInstance.t('feedBack');
        } else {
          elements.input.classList.add('is-invalid');
          feedback.classList.remove('text-success');
          feedback.classList.add('text-danger');
          feedback.innerText = i18nextInstance.t(state.form.error);
        }
        break;
      case 'form.processState':
        switch (value) {
          case 'filling': {
            console.log(state.form.processState);
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            break;
          }
          case 'processing': {
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            feedback.innerText = i18nextInstance.t('loading');
            console.log('2');
            break;
          }
          case 'finished': {
            input.classList.remove('is-invalid');
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            feedback.innerText = i18nextInstance.t('feedBack');
            input.value = '';
            break;
          }
          default:
            throw new Error(`Unknown state: ${value}`);
        }
        break;
      default:
        break;
    }
  });
  return watchedState;
};
