import React from 'react';
import WritingArticleItem from '../components/WritingArticleItem';

const articles = [
  { id: 1, image: 'https://www.domino.com/wp-content/uploads/2023/02/02/Toronto-Moody-Kitchen-Renovation-domino-4.jpg', title: 'By Stealing a Sliver of Space From the Kitchen, This Narrow Home Got an Indoor-Outdoor Tub', category: 'Home Tours' },
  { id: 2, image: 'https://www.domino.com/wp-content/uploads/2022/12/09/compact-cottage-renovation-domino-2.jpg', title: 'A Bar Hidden Behind Bifolds Is Just One Visual Trick in This Toronto Kitchen', category: 'Home Tours' },
  { id: 3, image: 'https://www.domino.com/wp-content/uploads/2022/11/04/little-cat-lodge-Catskill-hotel-domino-12.jpg', title: 'A Jolt of Red-Orange Breaks Up All the Wood Paneling in This Hudson Valley Hotel', category: 'Home Tours' },
  { id: 4, image: 'https://via.placeholder.com/300', title: 'Article Sample 4', category: 'Culture' },
  { id: 5, image: 'https://via.placeholder.com/300', title: 'Article Sample 5', category: 'Culture' },
];

const categories = [...new Set(articles.map(article => article.category))];

const WritingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-5xl font-serif font-bold">Writing</h1>
      </header>
      {categories.map(category => (
        <section key={category} className="my-8">
          <h2 className="text-3xl font-serif font-semibold mb-4 text-center">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(article => article.category === category).map(article => (
              <WritingArticleItem key={article.id} image={article.image} title={article.title} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default WritingPage;
