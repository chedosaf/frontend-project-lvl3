const createPost = (href, title) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const linkText = document.createTextNode(title);
  a.setAttribute('href', href);
  a.appendChild(linkText);
  li.appendChild(a);
  return li;
};

const createPosts = (posts) => {};

const createFeed = (title, description) => {
    
};