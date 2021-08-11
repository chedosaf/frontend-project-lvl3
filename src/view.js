import onСhange from 'on-change';

const createPost = (title, href) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const linkText = document.createTextNode(title);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-primary');
  const buttonText = document.createTextNode('Просмотр');
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
  ul.classList.add('list-unstyled');
  posts.forEach(({ title, link }) => {
    const post = createPost(title, link);
    ul.append(post);
  });
  return ul;
};

const createFeed = ({ title, description }) => {
  const section = document.createElement('section');
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  const descriptionElement = document.createElement('p');
  descriptionElement.classList.add('small');
  descriptionElement.textContent = ` ${description}`;
  titleElement.append(descriptionElement);
  section.append(titleElement);
  return section;
};

export default (state, elements) => {
  state.feeds.forEach(({ title, description }) => {
    const feed = createFeed({ title, description });
    elements.feeds.append(feed);
  });
  const posts = createPosts(state.posts);
  elements.posts.append(posts);
};
