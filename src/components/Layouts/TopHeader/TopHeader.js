import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Styles from './TopHeader.module.scss';
import Button from '~/components/Button';
import paths from '~/Config/routes';

const cx = classNames.bind(Styles);

function TopHeader() {
    return (
        <div className={cx('top-header')}>
            <div className={cx('infor')}>
                <div className={cx('infor-group')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                    <span>0123456789</span>
                </div>
                <div className={cx('infor-group')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faEnvelope} />
                    <span>usermail@gmail.com</span>
                </div>
                <div className={cx('infor-group')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                    <span>141 Chien Thang, HaNoi</span>
                </div>
            </div>
            <Button icon={<FontAwesomeIcon icon={faRightFromBracket} />} className={cx('btn')} to={paths.login}>
                LOG OUT 
            </Button>
        </div>
    );
}

export default TopHeader;
