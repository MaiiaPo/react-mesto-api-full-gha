import headerLogoMobile from "../images/logo_mobile.svg";
import headerLogo from "../images/logo.svg";
import { Route, Routes, Link  } from 'react-router-dom';

function Header(props) {
  return (
    <header className="header">
      <div className="header__container">
        <Link to='/'>
          <picture>
            <source className="header__logo" media="(max-width: 767px)" srcSet={headerLogoMobile}/>
            <img className="header__logo" src={headerLogo} alt="Логотип 'Место'"/>
          </picture>
        </Link>
        <div className="header__info-user">
          {props.loggedIn && <div className="header__email">{ props.email }</div>}
          <Routes>
            <Route path="/" element={<Link className="header__auth" onClick={props.handleSignOut} to="/sign-in">Выйти</Link>}/>
            <Route path="/sign-up" element={<Link className="header__auth" to="/sign-in">Войти</Link>}/>
            <Route path="/sign-in" element={<Link className="header__auth" to="/sign-up">Регистрация</Link>} />
          </Routes>
        </div>
      </div>
    </header>
  )
}

export default Header;
