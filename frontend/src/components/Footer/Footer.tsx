import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <img src={logo} alt="Logo" />
        <p className="footer-copyright">©Copyright 2025</p>

        <nav>
          <NavLink to="/cgu">CGU</NavLink>
          <NavLink to="/about">À propos</NavLink>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;