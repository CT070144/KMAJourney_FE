import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Button({ children, to, href, outline, primary, small, medium, large, className, onClick, icon, ...passprops }) {
    const classes = cx('button', {
        [className]: className, //Khi bạn viết [className]: className, nếu className không tồn tại trong styles, nó sẽ bị giữ nguyên, tức là không bị module hóa.
        outline,
        primary,
        small,
        medium,
        large,
    });
    const props = {
        onClick,
        ...passprops,
    };

    let Comp = 'button';
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    return (
        <Comp className={classes} {...props}>
            {icon && <span className={cx('icon')}>{icon}</span>}
            {children}
        </Comp>
    );
}

export default Button;
