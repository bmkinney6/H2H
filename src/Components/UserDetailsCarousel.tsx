import React, { useState } from 'react';
import '../Styles/UserDetailsCarousel.css';

type UserDetailsCarouselProps = {
  tabs: string[];
  components: React.ReactNode[];
};

const UserDetailsCarousel: React.FC<UserDetailsCarouselProps> = ({ tabs, components }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabbed-carousel">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="carousel">
        {components.map((Component, idx) => (
          <div
            className={`slide ${activeIndex === idx ? 'active' : ''}`}
            key={idx}
          >
            {Component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetailsCarousel;
