import React from 'react';

const Footer = () => {
  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
      </div>
      <footer style={footerStyle}>
        <p style={copyrightStyle}>&copy; 2024 Your Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '20vh', 
};

const contentStyle = {
  flex: 1, 
};

const footerStyle = {
  backgroundColor: 'black',
  color: 'white',
  textAlign: 'center',
  padding: '10px',
};

const copyrightStyle = {
  margin: '0',
};

export default Footer;
