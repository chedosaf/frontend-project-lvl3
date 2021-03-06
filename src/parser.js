export default (xmlData) => {
  const parser = new DOMParser();
  const text = parser.parseFromString(xmlData, 'text/xml');
  if (text.querySelector('parsererror')) {
    const error = new Error('Parser Error');
    error.type = 'Parser Error';
    throw error;
  }
  const feedTitle = text.querySelector('title');
  const title = feedTitle.textContent;
  const feedDescription = text.querySelector('description');
  const description = feedDescription.textContent;
  const postsNodes = text.querySelectorAll('item');
  const posts = [...postsNodes].map((post) => {
    const titleNode = post.querySelector('title');
    const linkNode = post.querySelector('link');
    const descriptionNode = post.querySelector('description');
    return {
      title: titleNode.textContent,
      link: linkNode.textContent,
      description: descriptionNode.textContent,
    };
  });
  const result = {
    title,
    description,
    posts,
  };
  return result;
};
