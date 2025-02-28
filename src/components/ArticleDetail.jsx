import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref as dbRef, get, push, onValue } from 'firebase/database';
import '../styles/animations.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const articleRef = dbRef(database, `articles/${id}`);
      const snapshot = await get(articleRef);
      if (snapshot.exists()) {
        setArticle(snapshot.val());
      } else {
        console.error('No article found with the given ID');
      }
      setLoading(false);
    };
    fetchArticle();

    const commentsRef = dbRef(database, `comments/${id}`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setComments(commentsList);
    });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentsRef = dbRef(database, `comments/${id}`);
    await push(commentsRef, { text: newComment, createdAt: new Date().toISOString() });
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  const articleUrl = window.location.href;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;

  return (
    <div className="parallax-container">
      <div className="parallax-layer parallax-back">
        <div className="bg-gradient-to-b from-gray-100 to-transparent h-96"></div>
      </div>
      
      <div className="parallax-layer parallax-base">
        <article className="max-w-4xl mx-auto px-4 py-8 bg-white/90 backdrop-blur-sm">
          <h1 className="article-title text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 animate-[fadeIn_0.5s_ease-out]">
            {article.title}
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 tracking-wide border-b border-gray-300 pb-4 animate-[fadeIn_0.5s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
            By {article.author} • {new Date(article.createdAt).toLocaleString()}
          </div>

          <div className="article-text text-xl space-y-6">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p 
                key={`${article.id}-p${index}`} 
                className="first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left animate-[fadeIn_0.5s_ease-out] [animation-delay:var(--delay)]"
                style={{ '--delay': `${0.4 + index * 0.1}s` }}
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>

          <div className="social-share mt-8 animate-[fadeIn_0.5s_ease-out_0.8s] opacity-0 [animation-fill-mode:forwards]">
            <h2 className="text-xl mb-4">Share this article</h2>
            <div className="flex space-x-4">
              <a 
                href={twitterShareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-card px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-all"
              >
                Share on Twitter
              </a>
              <a 
                href={facebookShareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-card px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
              >
                Share on Facebook
              </a>
            </div>
          </div>

          <div className="comments-section mt-12 animate-[fadeIn_0.5s_ease-out_1s] opacity-0 [animation-fill-mode:forwards]">
            <h2 className="text-2xl mb-4">Comments</h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="article-card p-4 bg-gray-50 rounded-lg"
                >
                  <p>{comment.text}</p>
                  <span className="text-sm text-gray-600">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                placeholder="Add a comment..."
                required
              />
              <button 
                type="submit" 
                className="article-card mt-2 px-6 py-2 bg-[#1a1a1a] text-white rounded hover:bg-gray-800 transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
