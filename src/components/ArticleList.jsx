import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const articlesRef = dbRef(database, 'articles/');
    onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      const articlesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setArticles(articlesList);
    });
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="article-title text-4xl">Latest Articles</h1>
        <Link to="/archive" className="bg-[#1a1a1a] text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-200 text-lg tracking-wide">
          View Archives
        </Link>
      </div>
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
        {articles.map((article, index) => (
          <article key={article.id} className={`border-b border-gray-300 pb-8 ${index === 0 ? 'md:col-span-2' : ''}`}>
            <Link to={`/articles/${article.id}`} className="block group">
              <h2 className={`article-title mb-4 ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} leading-tight hover:text-gray-700`}>
                {article.title}
              </h2>
              <div className="text-sm text-gray-600 mb-3 tracking-wide">
                By {article.author} • {new Date(article.createdAt).toLocaleString()}
              </div>
              <p className={`article-text text-gray-700 ${index === 0 ? 'text-xl' : 'text-base'}`}>
                {article.excerpt}
              </p>
              <div className="mt-4 text-sm font-semibold tracking-wide text-gray-900 group-hover:text-gray-700">
                Continue Reading →
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
