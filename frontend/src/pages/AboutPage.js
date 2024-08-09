import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const experiences = [
    {
      company: 'Company A',
      title: 'Position Title A',
      dates: '2020–Present',
      description: 'Description of responsibilities and achievements for Position Title A at Company A.',
    },
    {
      company: 'Company B',
      title: 'Position Title B',
      dates: '2018–2020',
      description: 'Description of responsibilities and achievements for Position Title B at Company B.',
    },
    {
      company: 'Company C',
      title: 'Position Title C',
      dates: '2016–2018',
      description: 'Description of responsibilities and achievements for Position Title C at Company C.',
    },
    {
      company: 'Company D',
      title: 'Position Title D',
      dates: '2014–2016',
      description: 'Description of responsibilities and achievements for Position Title D at Company D.',
    },
  ];

  return (
    <div className="about-container">
      <div className="bio-section">
        <h1 className="title">About Me</h1>
        <div className="bio-content">
          <div className="bio-text">
            <p className="text-lg">I'm Shagun Khare</p>
            <p className="text-lg">Lorem Ipsum Lore</p>
            <p className="text-lg">More info</p>
          </div>
          <div className="bio-image-container">
            <img src="https://via.placeholder.com/300" alt="Shagun Khare" className="bio-image" />
          </div>
        </div>
      </div>
      <div className="work-section">
        <h1 className="title">Work</h1>
        {experiences.map((exp, index) => (
          <div key={index} className="work-experience">
            <h3 className="company">{exp.company}</h3>
            <h4 className="dates">{exp.dates}</h4>
            <h5 className="position">{exp.title}</h5>
            <p className="description">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
