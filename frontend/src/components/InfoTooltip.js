import PopupWithForm from "./PopupWithForm";
import React from "react";
import success from "../images/success.svg";
import error from "../images/error.svg";

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  const button = false;
  return (
    <div className='infoTooltip'>
      <PopupWithForm
        name='infoTooltip'
        title={isSuccess ? 'Вы успешно зарегистрировались' : 'Что-то пошло не так!\nПопробуйте ещё раз.'}
        button={button}
        isOpen={isOpen}
        onClose={onClose}
        isInfo={true}
      >
        <img className='infoTooltip__img' src={isSuccess ? success : error} alt={isSuccess ? 'Успешно' : 'Ошибка регистрации'}/>
      </PopupWithForm>
    </div>
  );
}

export default InfoTooltip;
