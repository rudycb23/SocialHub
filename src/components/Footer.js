import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer fixed-bottom bg-light py-1 text-center">
      &copy; {currentYear} Social Hub
    </footer>
  );
};

export default Footer;
