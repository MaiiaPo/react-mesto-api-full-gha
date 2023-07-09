import React from 'react';
import {useForm} from "../hooks/useForm";
import {Link} from 'react-router-dom';

function Register({ handleRegister }) {
  const {values, handleChange} = useForm({})

  return (
    <div className="content auth">
      <h1 className="auth__title">Регистрация</h1>
      <form
        className="auth__form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister(values);
        }}
      >
        <input
          className="auth__input"
          name="email"
          type="email"
          placeholder="Email"
          value={values.email || ""}
          onChange={handleChange}
          minLength="2"
          maxLength="40"
          required
        />
        <input
          className="auth__input"
          name="password"
          type="password"
          placeholder="Пароль"
          value={values.password || ""}
          onChange={handleChange}
          minLength="6"
          maxLength="200"
          required
        />
        <button className="auth__submit" type="submit">Зарегистрироваться</button>
      </form>

      <p className="auth__register-text">Уже зарегистрированы? <Link to='/sign-in' className="auth__sign-in">Войти</Link></p>
    </div>
  )
}

export default Register;
