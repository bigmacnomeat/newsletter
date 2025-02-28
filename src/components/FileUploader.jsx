import React, { useState } from 'react';

const FileUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-300'}
          hover:border-gray-400`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".txt,.doc,.docx,.pdf,.md"
        />
        
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">📄</div>
          <div className="text-lg text-gray-600">
            {selectedFile ? (
              <>Selected: {selectedFile.name}</>
            ) : (
              <>
                Drop your intelligence report here, or click to select
                <p className="text-sm text-gray-500 mt-2">
                  Supports: TXT, DOC, DOCX, PDF, MD
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
