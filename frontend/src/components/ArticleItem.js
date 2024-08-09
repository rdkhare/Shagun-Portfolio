import React from 'react';
import { Link } from 'react-router-dom';

const ArticleItem = ({ image, title, category, url }) => {
  return (
    <Link to={url} className="relative mb-2 max-w-full md:max-w-lg btn__blue rounded-sm overflow-hidden flex transition-transform hover:scale-105 ">
      <img src={image} alt={title} className="w-32 h-full object-cover" />
      <div className="p-4 flex flex-col justify-center">
        <h3 className="text-sm uppercase">{category}</h3>
        <h2 className="text-lg font-serif mt-2">{title}</h2>
      </div>
    </Link>
  );
};

export default ArticleItem;
