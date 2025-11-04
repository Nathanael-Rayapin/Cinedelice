import './Footer.scss';
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-left"> 
          <img src={logo} alt="Logo" className="footer-logo" />
          <p className="footer-copyright">©Copyright 2025</p>
        </div>
        
        <div className="footer-right">
          <nav className="footer-nav">
            <a href="#cgu">CGU</a>
            <a href="#about">À propos</a>
          </nav>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;