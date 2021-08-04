const createPost = (title, href) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const linkText = document.createTextNode(title);
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.appendChild(linkText);
    li.appendChild(a);
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
      ul.appendChild(post);
    });
    return ul;
  };


const createFeed = ({ title, description, posts }) => {
    const section = document.createElement('section');
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = ` ${description}`;
    titleElement.appendChild(descriptionElement);
    const postsElement = createPosts(posts);
    section.appendChild(titleElement);
    section.appendChild(postsElement);
    return section;
  };