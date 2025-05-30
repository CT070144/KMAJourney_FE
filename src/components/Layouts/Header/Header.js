import classNames from 'classnames/bind';

import Styles from './Header.module.scss';
import Search from '~/components/Search';
import TopHeader from '~/components/Layouts/TopHeader';
import Sidebar from '~/components/Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faChartPie, faCloud, faFeatherPointed, faInbox, faListCheck, faRankingStar, faShoppingBag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import paths from '~/Config/routes';
const cx = classNames.bind(Styles);
const MENU_ITEMS = [
    {
        title: 'KMA Score',
        icon: <FontAwesomeIcon icon={faRankingStar} className={cx('menu-icon')} />,
        to: paths.score,
    },
    {
        title: 'Administration',
        icon: <FontAwesomeIcon icon={faCloud} className={cx('menu-icon')} />,
        to: paths.administration,
    },
    {
        title: 'About me',
        icon: <FontAwesomeIcon icon={faInbox} className={cx('menu-icon')} />,
        to: paths.about,
    },
    {
        title: 'Shop',
        icon: <FontAwesomeIcon icon={faShoppingBag} className={cx('menu-icon')} />,
        to: paths.myshop,
    },
    {
        title: 'Dashboard',
        icon: <FontAwesomeIcon icon={faChartColumn} className={cx('menu-icon')} />,
        to: paths.about,
    },
];

function Header() {

    
     
    return (
        <div className={cx('wrapper')}>
            <TopHeader />
            <div className={cx('header')}>
                <h1 className={cx('header-item')}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <h5 className={cx('title')}>KMA Journey</h5>
                </h1>
                <Search />
            </div>
            <Sidebar items={MENU_ITEMS} />
        </div>
    );
}

export default Header;
