import React from 'react';
import ReactMarkdown from 'react-markdown';

const LandingPage = ({ content }) => {
  return (
    <div className="landing-page">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default LandingPage;
