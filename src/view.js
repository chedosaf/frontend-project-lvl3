import onChange from 'on-change';

export default (state, elements, i18nextInstance) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const feedback = document.querySelector('.feedback');
  // let btns = null; // i don't like
  const modalButton = document.querySelector('.modal-footer .btn');
  const input = document.querySelector('#url-input');
  const submitButton = document.querySelector('#submit');

  const createPost = (title, href) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0', 'fw-bold');
    const a = document.createElement('a');
    const linkText = document.createTextNode(title);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.dataset.id = href;
    button.classList.add('btn', 'btn-primary');
    const buttonText = document.createTextNode(i18nextInstance.t('show'));
    button.append(buttonText);
    a.setAttribute('href', href);
    a.classList.add('fw-bold');
    a.append(linkText);
    li.append(a);
    li.append(button);
    return li;
  };

  const createPosts = (posts) => {
    if (posts.length === 0) {
      const ul = document.createElement('ul');
      return ul;
    }
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'posts-list');
    posts.forEach(({ title, link }) => {
      const post = createPost(title, link);
      ul.append(post);
    });
    const addedPosts = document.createElement('div'); // is a node
    const h2 = document.createElement('h2');
    h2.textContent = 'Посты';
    h2.classList.add('card-title', 'h4');
    addedPosts.appendChild(h2);
    addedPosts.appendChild(ul);
    return addedPosts;
  };

  const createFeed = (title, description) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.classList.add('h6', 'm-0');
    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('m-0', 'small', 'text-black-50');
    descriptionElement.textContent = `${description}`;
    titleElement.append(descriptionElement);
    li.append(titleElement);
    return li;
  };

  const createFeeds = (feeds) => {
    if (feeds.length === 0) {
      const ul = document.createElement('ul');
      return ul;
    }
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'feeds-list');
    feeds.forEach(({ title, description }) => {
      const feed = createFeed(title, description);
      ul.append(feed);
    });
    const addedFeeds = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = 'Фиды';
    h2.classList.add('card-title', 'h4');
    addedFeeds.appendChild(h2);
    addedFeeds.appendChild(ul);
    return addedFeeds;
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        document.querySelector('.feeds div').replaceWith(createFeeds(state.feeds));
        break;
      case 'posts':
        document.querySelector('.posts div').replaceWith(createPosts(state.posts));
        // btns = document.querySelectorAll('.posts .btn');
        // [...btns].forEach((btn) => {
        //   btn.setAttribute('data-bs-toggle', 'modal');
        //   btn.setAttribute('data-bs-target', '#modal');
        // btn.addEventListener('click', () => {
        // const li = btn.closest('.list-group-item');
        // const a = btn.previousSibling;
        // li.classList.remove('fw-bold');
        // a.classList.remove('fw-bold');
        // li.classList.add('fw-normal');
        // });
        // });
        break;
      case 'id':
        modalTitle.textContent = state.posts.filter((p) => p.link === state.id)[0]
          .title;
        modalBody.textContent = state.posts.filter((p) => p.link === state.id)[0]
          .description;
        modalButton.href = state.id;
        break;
      case 'form.valid':
        if (value === true) {
          elements.input.classList.remove('is-invalid');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          feedback.textContent = i18nextInstance.t('feedBack');
        } else {
          input.removeAttribute('readonly');
          elements.input.classList.add('is-invalid');
          feedback.classList.remove('text-success');
          feedback.classList.add('text-danger');
          feedback.textContent = i18nextInstance.t(state.form.error);
        }
        break;
      case 'form.processState':
        switch (value) {
          case 'filling': {
            submitButton.disabled = false;
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            break;
          }
          case 'processing': {
            input.setAttribute('readonly', 'readonly');
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            feedback.textContent = i18nextInstance.t('loading');
            submitButton.disabled = true;
            break;
          }
          case 'finished': {
            submitButton.disabled = false;
            input.removeAttribute('readonly');
            input.classList.remove('is-invalid');
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            feedback.textContent = i18nextInstance.t('feedBack');
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
