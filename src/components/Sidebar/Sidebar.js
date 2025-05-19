import classNames from 'classnames/bind';
import { useState } from 'react';
import Styles from './Sidebar.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Styles);
function Sidebar({ items }) {
    const [activeItem, setActiveItem] = useState('KMA Score');
    const handleClickItem = (item) => {
        setActiveItem(item);
    };
    return (
        <div className={cx('sidebar-wrapper')}>
            <sidebar className={cx('sidebar-menu')}>
                {items.map((item, index) => {
                    const active = activeItem === item.title ? 'active' : '';
                    return (
                        <Link to={item.to} className={cx('menu-item', { active })} onClick={() => handleClickItem(item.title)}>
                            <i className={cx('menu-icon')}>{item.icon}</i>
                            <spans className={cx('title')} to={item.to}>
                                {item.title}
                            </spans>
                        </Link>
                    );
                })}
            </sidebar>
        </div>
    );
}

export default Sidebar;
