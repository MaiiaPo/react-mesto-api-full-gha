import {useEffect} from "react";

function PopupWithForm({name, title, buttonValue, children, isOpen, onClose, onSubmit, button, isInfo}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`} >
      <div className={`popup__container ${isInfo ? 'popup__container_img' : ''}`}>
        <button
          className="popup__close popup__close_add link"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <h2 className={`popup__title ${isInfo ? 'popup__title_center' : ''}`}>{title}</h2>
        <form name={`${name}_form`} className={`form ${isInfo ? '' : 'popup__form'}`} onSubmit={onSubmit}>
          <fieldset className="form__set">
            {children}
            {button && <input type="submit" value={buttonValue} className="popup__button"/>}
          </fieldset>
        </form>
      </div>
    </div>
  )
}

PopupWithForm.defaultProps = {button: true, isInfo: false};
export default PopupWithForm;
