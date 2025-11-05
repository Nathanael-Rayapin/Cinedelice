import './Footer.scss';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';

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
            <NavLink to="/cgu">CGU</NavLink>
            <NavLink to="/about">À propos</NavLink>
          </nav>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;