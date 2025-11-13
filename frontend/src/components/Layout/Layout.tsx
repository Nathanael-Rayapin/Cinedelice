import { useContext } from 'react';
import { GlobalUIContext } from '../../store/interface';
import Loading from '../Loading/Loading';
import CustomError from '../Custom-Error/Custom-Error';
import './Layout.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { loading, errorMsg } = useContext(GlobalUIContext);

    if (loading) return <Loading />;

    if (errorMsg) return <CustomError errorMsg={errorMsg} />;

    return (
        <div className="layout">
            {children}
        </div>
    )
}

export default Layout