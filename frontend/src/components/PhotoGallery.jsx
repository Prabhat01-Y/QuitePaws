import React from 'react';
import './PhotoGallery.css';


import img1 from '../assets/a.png';     
import img2 from '../assets/a1.jpg';    
import img3 from '../assets/b1.jpg';    
import img4 from '../assets/c.png';     
import img5 from '../assets/c1.png';    
import img6 from '../assets/1bi.png';   
import img7 from '../assets/2bi.png';   

const PhotoGallery = () => {
  return (
    <div className="gallery-wrapper">
      <div className="gallery">
        <img src={img1} alt="Gallery 1" />
        <img src={img2} alt="Gallery 2" />
        <img src={img3} alt="Gallery 3" />
        <img src={img4} alt="Gallery 4" />
        <img src={img5} alt="Gallery 5" />
        <img src={img6} alt="Gallery 6" />
        <img src={img7} alt="Gallery 7" />
      </div>
    </div>
  );
};

export default PhotoGallery;