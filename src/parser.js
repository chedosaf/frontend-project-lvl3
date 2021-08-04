export default (xmlData) => {
    const parser = new DOMParser();
    const text = parser.parseFromString(xmlData, 'text/xml');
    const feedTitle = text.querySelector('title');
    const title = feedTitle.textContent;
    const feedDescription = text.querySelector('description');
    const description = feedDescription.textContent;
    const postsNodes = text.querySelectorAll('item');
    const posts = [...postsNodes].map((post) => {
      const titleNode = post.querySelector('title');
      const linkNode = post.querySelector('link');
      return {
        title: titleNode.textContent,
        link: linkNode.textContent,
      };
    });
    const result = {
      title,
      description,
      posts,
    };
  
    return result;
  };