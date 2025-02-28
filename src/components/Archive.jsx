import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';

const Archive = () => {
  const [articles, setArticles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const articlesRef = dbRef(database, 'articles/');
    onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      const articlesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setArticles(articlesList);
    });
  }, []);

  const applyDateFilter = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = articles.filter(article => {
      const articleDate = new Date(article.createdAt);
      return articleDate >= start && articleDate <= end;
    });
    setFilteredArticles(filtered);
  };

  return (
    <div className="archive">
      <h1 className="text-3xl mb-4">Article Archive</h1>
      <div className="mb-4">
        <label className="block mb-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={applyDateFilter}
        className="mb-4 px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-gray-800"
      >
        Filter
      </button>
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
        {filteredArticles.length > 0 ? filteredArticles.map((article) => (
          <article key={article.id} className="border-b border-gray-300 pb-8">
            <h2 className="article-title mb-4 text-2xl md:text-3xl leading-tight">
              {article.title}
            </h2>
            <div className="text-sm text-gray-600 mb-3 tracking-wide">
              By {article.author} • {new Date(article.createdAt).toLocaleString()}
            </div>
            <p className="article-text text-gray-700">
              {article.excerpt}
            </p>
          </article>
        )) : articles.map((article) => (
          <article key={article.id} className="border-b border-gray-300 pb-8">
            <h2 className="article-title mb-4 text-2xl md:text-3xl leading-tight">
              {article.title}
            </h2>
            <div className="text-sm text-gray-600 mb-3 tracking-wide">
              By {article.author} • {new Date(article.createdAt).toLocaleString()}
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

export default Archive;
