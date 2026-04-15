import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <section className="page_404">
        <div className="container-404">
            <div className="row-404">    
                <div className="col-404">
                    <div className="text-center-404">
                        <div className="four_zero_four_bg">
                            <h1 className="text-center">404</h1>
                        </div>
                        
                        <div className="contant_box_404">
                            <h3 className="h2">Looks like you're lost</h3>
                            <p>The page you are looking for is not available!</p>
                            <a href="/" className="link_404">Go to Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default NotFound;