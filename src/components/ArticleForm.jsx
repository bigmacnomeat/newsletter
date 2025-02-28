import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleForm = ({ article = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll add the logic to save/update the article
    console.log('Form submitted:', formData);
    navigate('/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {article ? 'Edit Article' : 'Create New Article'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {article ? 'Update' : 'Create'} Article
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
