import React from 'react';
import ArticleItem from '../components/ArticleItem';
import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

const HomePage = () => {
    return (
      <div className="container mx-auto p-4">
        <header className="text-center my-8">
          <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)]">
            <ReactTyped backSpeed={80} strings={["Lorem, ipsum and lorem ipsum. Meet Shagun Khare."]} typeSpeed={100} loop={false} />
          </h1>
        </header>

        {/* Divider Line */}
        <hr className="border-t border-[var(--color-secondary)] my-16 hr-animated" />

        {/* Bio Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-4">
              Lorem Ipsum Lorem Ipsum Lorem Ipsum
            </h2>
            <p className="text-lg text-[var(--color-secondary)]">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Rutrum risus volutpat litora praesent nascetur iaculis. 
            Ante hac proin integer vulputate cursus. Felis interdum posuere iaculis nisl per convallis penatibus conubia venenatis. 
            Nec libero tortor vehicula eget est. 
            Pharetra phasellus in iaculis proin; massa iaculis vel? 
            Fusce iaculis erat inceptos, erat curae morbi mauris sociosqu.
            </p>
            <Link to="/about" className="mt-4 text-xl font-semibold text-[var(--color-secondary)] border-[var(--color-secondary)] border-2 py-2 px-4 inline-block rounded hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
              Learn More
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="https://via.placeholder.com/400x400" 
              alt="Shagun Khare" 
              className="rounded-md shadow-lg"
            />
          </div>
        </div>

        <hr className="border-t border-[var(--color-secondary)] my-16 hr-animated-1" />

        {/* Articles Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <Link to="/writing" className="md:col-span-2 md:row-span-3 aspect-w-1 aspect-h-1 btn__blue rounded-md overflow-hidden shadow-lg transition-all hover:shadow-2xl flex items-center justify-center">
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-3xl font-serif text-center">
                Read all of Shagun’s pieces <span className="underline decoration-[var(--color-accent)]">here</span>.
              </span>
            </div>
          </Link>
          <div className="md:col-span-2">
            <ArticleItem image="https://via.placeholder.com/150" title="Article Sample 1" category="Category 1" url="https://google.com" />
          </div>
          <div className="md:col-span-2">
            <ArticleItem image="https://via.placeholder.com/150" title="Article Sample 2" category="Category 2" url="https://google.com" />
          </div>
          <div className="md:col-span-2">
            <ArticleItem image="https://via.placeholder.com/150" title="Article Sample 3" category="Category 3" url="https://google.com" />
          </div>
        </div>

      </div>
    );
  };
  
  export default HomePage;
