import React from 'react';
import {useForm} from "../hooks/useForm";

function Login( { handleLogin }) {
  const {values, handleChange} = useForm({});

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!values.email || !values.password) {
      return;
    }
    handleLogin(values);
  }

  return (
    <div className="content auth">
        <h1 className="auth__title">Вход</h1>
        <form
          className="auth__form"
          onSubmit={handleSubmit}
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
          <button className="auth__submit" type="submit">Войти</button>
        </form>

    </div>
  )
}

export default Login;
