import { useContext } from 'react';
import { GlobalUIContext } from '../../store/interface';
import Loading from '../Loading/Loading';
import CustomError from '../Custom-Error/Custom-Error';
import Modal from '../Modal/Modal';
import './Layout.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loading, showModal, errorMsg } = useContext(GlobalUIContext);

  // Cas d'erreur
  if (errorMsg) return <div className="layout"><CustomError errorMsg={errorMsg} /></div>;

  // Affichage par defaut
  return (
    <div className="layout">
      {children}
      {loading && <div className="overlay"><Loading /></div>}
      {showModal && <div className="overlay"><Modal show={showModal} /></div>}
    </div>
  );
};

export default Layout;
