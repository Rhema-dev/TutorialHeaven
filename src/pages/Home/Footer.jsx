import DonateButton from './DonateButton';

const Footer = () => {
  return (
    <footer className="roadmap-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>TutorialHeaven</h4>
          <p>Helping you navigate your learning journey</p>
          <p>Developed by Rhema Emmanuel-Great Oshiokhua</p>
        </div>
         
       
        <div className="footer-section">
          <p className="copyright">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;