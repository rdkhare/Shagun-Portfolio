import React from 'react';

const WritingArticleItem = ({ image, title }) => {
  return (
    <div className="relative mb-4 btn__blue rounded-md overflow-hidden transition-transform">
      <img src={image} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-serif mt-2 text-[var(--color-article-title)]">{title}</h2>
      </div>
    </div>
  );
};

export default WritingArticleItem;
