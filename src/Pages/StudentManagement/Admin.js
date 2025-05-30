import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import ReactLogo  from '~/components/ReactLogo';
import {PanelRightOpen, PanelLeftOpen, ChevronRight} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

import paths from '~/Config/routes';
const cx = classNames.bind(styles);

function Admin() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const openMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    return ( <div className={cx('wrapper')}>
        <div className={cx('header')}>
        <FontAwesomeIcon icon={faBarsStaggered} className={cx('menu-icon')} onClick={openMenu} />
        <ReactLogo width={80} height={80} />
        <h1 className={cx('title')}>QUẢN LÝ SINH VIÊN</h1>
           
           
        </div>
        <div className={cx('content')}>
            {isMenuOpen && (
                <div className={cx('sidebar')}>
                    
                    
                    <ul className={cx('menu-list')}>
                        <li className={cx('menu-item')}>
                            <Link to={paths.studentList} className={cx('menu-link')}>Xem danh sách sinh viên
                            <ChevronRight className={cx('list-icon')} /></Link>
                            
                        </li>
                        <li className={cx('menu-item')}>
                            <Link to={paths.subjects} className={cx('menu-link')}>Danh sách môn học
                            <ChevronRight className={cx('list-icon')} /></Link>
                       
                        </li>
                        <li className={cx('menu-item')}>
                            <Link to={paths.addStudent} className={cx('menu-link')}>Thêm sinh viên
                            <ChevronRight className={cx('list-icon')}   /></Link>
                       
                        </li>
                        <li className={cx('menu-item')}>
                            <Link to={paths.addScore} className={cx('menu-link')}>Nhập điểm
                            <ChevronRight className={cx('list-icon')}/></Link>
                        
                        </li>
                        <li className={cx('menu-item')}>
                            <Link to={paths.scoreList} className={cx('menu-link')}>Xem điểm
                            <ChevronRight className={cx('list-icon')}/></Link>
                            </li>
                    </ul>
                </div>
            )}

            <div className={cx('main')}>
                <Outlet />
            </div>
        </div>

    </div> );
}

export default Admin;