import Header from '~/components/Layouts/Header';
import Footer from '~/components/Layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);


function DefaultLayout({children}) {
    return (
        <div className={cx('wrapper')}>
         <Header 
               
            />
          <div className={cx('content')}>
            {children}
          </div>
               
           
            <Footer />
        </div>
           
     
    );
}

export default DefaultLayout;
