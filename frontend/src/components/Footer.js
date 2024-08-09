import React from 'react';

const Footer = () => {
  return (
    <div className="bg-white w-full py-8">
      <div className="container mx-auto flex justify-center items-center space-x-8">
        <span className="text-lg font-semibold text-gray-700">Featured In</span>
        <div className="flex space-x-4">
          <img src="https://via.placeholder.com/150x50" alt="Logo 1" />
          <img src="https://via.placeholder.com/150x50" alt="Logo 2" />
          <img src="https://via.placeholder.com/150x50" alt="Logo 3" />
          <img src="https://via.placeholder.com/150x50" alt="Logo 4" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
