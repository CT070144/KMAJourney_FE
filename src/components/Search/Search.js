import classNames from 'classnames/bind';
import Styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Styles);

function Search() {
    return (
        <div className={cx('search-wrapper')}>
            <div className={cx('search', 'header-item')}>
                <input type="text" placeholder="Search..." className={cx('input')} />
                <Button className={cx('btn')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faSearch} />
                </Button>
            </div>
        </div>
    );
}

export default Search;
