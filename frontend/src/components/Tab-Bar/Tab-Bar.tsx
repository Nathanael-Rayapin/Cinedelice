import { Link, useLocation } from 'react-router';
import './Tab-bar.scss';

const TabBar = ({ tabs }: { tabs: string[] }) => {
    const location = useLocation().pathname;
    
    return (
        <ul className='tab-bar'>
            {tabs.map((tab, index) => {
                return <li
                    key={index}
                    className={location === `/${tab.toLowerCase().replace(' ', '-')}` ? 'active' : ''}
                >
                    <button disabled={location !== tabs[0]} className='btn m-1'>
                        <Link to={`/${tab.toLowerCase().replace(' ', '-')}`}>{tab}</Link>
                    </button>
                </li>
            })}
        </ul>
    )
}

export default TabBar