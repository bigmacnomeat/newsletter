import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import { database, storage } from '../firebase';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const articlesRef = dbRef(database, 'articles/');
    onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      const articlesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setArticles(articlesList);
    });
  }, []);

  const handleDelete = (id) => {
    const articleRef = dbRef(database, `articles/${id}`);
    remove(articleRef);
  };

  const handleEdit = (article) => {
    setEditingArticle({ ...article });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingArticle({
      id: '',
      title: '',
      content: '',
      author: '',
      status: 'Draft',
      attachment: null
    });
    setIsCreating(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const articleId = editingArticle.id || Date.now().toString();
    const articleRef = dbRef(database, `articles/${articleId}`);
    
    const articleData = {
      ...editingArticle,
      createdAt: editingArticle.createdAt || new Date().toISOString(),
      id: articleId
    };

    if (uploadedFile) {
      const fileRef = storageRef(storage, `attachments/${articleId}/${uploadedFile.name}`);
      await uploadBytes(fileRef, uploadedFile);
      const downloadURL = await getDownloadURL(fileRef);
      articleData.attachment = downloadURL;
    }

    await set(articleRef, articleData);
    setEditingArticle(null);
    setUploadedFile(null);
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setUploadedFile(null);
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="article-title text-4xl">Command Post</h1>
        <button
          onClick={handleCreate}
          className="bg-[#1a1a1a] text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-200 text-lg tracking-wide"
        >
          Deploy New Article
        </button>
      </div>

      {editingArticle ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded h-48 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
              <input
                type="text"
                value={editingArticle.author}
                onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={editingArticle.status}
                onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
              <FileUploader onFileSelect={handleFileSelect} />
              {uploadedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Attached: {uploadedFile.name}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-gray-800"
              >
                {isCreating ? 'Deploy Article' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Attachment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-lg">{article.title}</td>
                  <td className="px-6 py-4 text-gray-500">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(article.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {article.attachment ? <a href={article.attachment} target="_blank" rel="noopener noreferrer">View</a> : 'None'}
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
