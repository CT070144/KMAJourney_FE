
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import ReactLogo from '~/components/ReactLogo';
import { Outlet } from 'react-router-dom';

import Styles from './Auth.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(Styles);

function Auth() {
  
    return (
        <div className={cx('wrapper')}>
            <div className={cx('large-50')}>
                <div>
                    <ReactLogo />
                    <div className={cx('infor')}>
                        <h1 className={cx('greeting')}>WELCOME TO KMAJOURNEY</h1>
                        <span className={cx('author')}>Developed by Lucas</span>
                        <div className={cx('social-links')}>
                            <Button
                                className={cx('social-btn')}
                                icon={<FontAwesomeIcon icon={faFacebook} />}
                                href="https://www.facebook.com/vanphuctrugg/"
                            />
                            <Button
                                className={cx('social-btn')}
                                icon={<FontAwesomeIcon icon={faInstagram} />}
                                href="https://www.instagram.com/ngvanphuc_/"
                            />
                            <Button
                                className={cx('social-btn')}
                                icon={<FontAwesomeIcon icon={faGithub} />}
                                href="https://github.com/CT070144"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('large-50')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Auth;
