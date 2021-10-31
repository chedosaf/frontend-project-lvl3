import onChange from 'on-change';

export default (state, elements, i18nextInstance) => {
  const postElement = document.getElementsByClassName('posts');
  const postAndFeedsBodys = document.getElementsByClassName('card-body');
  const modalTitle = document.querySelector('h5');
  const modalBody = document.getElementsByClassName('modal-body')[0];
  const feedback = document.getElementsByClassName('feedback')[0];
  const btns = postElement[0].getElementsByClassName('btn');
  const modalFooter = document.getElementsByClassName('modal-footer')[0];
  const modalButton = modalFooter.getElementsByClassName('btn')[0];
  const input = document.getElementById('url-input');
  const submitButton = document.getElementById('submit');

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
    a.classList.add('fw-bold');
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
        [...postAndFeedsBodys].forEach((body) => {
          body.classList.remove('d-none');
        });
        break;
      case 'posts':
        document.getElementsByClassName('posts-list')[0].replaceWith(createPosts(state.posts));
        [...btns].forEach((btn) => {
          btn.setAttribute('data-bs-toggle', 'modal');
          btn.setAttribute('data-bs-target', '#modal');
          btn.addEventListener('click', () => {
            const li = btn.closest('.list-group-item');
            const a = btn.previousSibling;
            li.classList.remove('fw-bold');
            a.classList.remove('fw-bold');
            li.classList.add('fw-normal');
            modalTitle.textContent = state.posts.filter((p) => p.link === btn.previousElementSibling
              .href)[0]
              .title;
            modalBody.textContent = state.posts.filter((p) => p.link === btn.previousElementSibling
              .href)[0]
              .description;
            modalButton.href = btn.previousElementSibling.href;
          });
        });
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
