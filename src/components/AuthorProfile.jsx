import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';

const AuthorProfile = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const authorRef = dbRef(database, `authors/${authorId}`);
    onValue(authorRef, (snapshot) => {
      if (snapshot.exists()) {
        setAuthor(snapshot.val());
      } else {
        console.error('No author found with the given ID');
      }
    });

    const articlesRef = dbRef(database, 'articles/');
    onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      const articlesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      const authorArticles = articlesList.filter(article => article.authorId === authorId);
      setArticles(authorArticles);
    });
  }, [authorId]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div className="author-profile">
      <h1 className="text-3xl mb-4">{author.name}</h1>
      <p className="mb-4">{author.biography}</p>

      <h2 className="text-2xl mb-4">Articles by {author.name}</h2>
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.id} className="border-b border-gray-300 pb-8">
            <h3 className="article-title mb-4 text-2xl md:text-3xl leading-tight">
              {article.title}
            </h3>
            <div className="text-sm text-gray-600 mb-3 tracking-wide">
              Published on {new Date(article.createdAt).toLocaleString()}
            </div>
            <p className="article-text text-gray-700">
              {article.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AuthorProfile;
