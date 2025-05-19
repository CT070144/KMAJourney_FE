import classNames from "classnames/bind";

import styles from "./ReactLogo.module.scss";
import logo from "./logo.svg";

function ReactLogo({ width, height }) {
  const cx = classNames.bind(styles);
  return (
    <img
      src={logo}
      width={width}
      height={height}
      className={cx("App-logo")}
      alt="logo"
    />
  );
}

export default ReactLogo;
