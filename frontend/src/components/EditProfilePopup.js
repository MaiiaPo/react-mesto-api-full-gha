import PopupWithForm from "./PopupWithForm";
import React, {useEffect} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {useForm} from "../hooks/useForm";

function EditProfilePopup ({isOpen, onClose, isLoading, onUpdateUser}) {
  const {values, handleChange, setValues} = useForm({})
  const currentUser = React.useContext(CurrentUserContext);

  useEffect(() => {
    if(currentUser){
      setValues({name: currentUser.name, description: currentUser.about})
    }
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name: values.name,
      about: values.description,
    });
  }

  return (
    <PopupWithForm
      name='edit'
      title='Редактировать профиль'
      buttonValue={isLoading? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="form__field">
        <input
          type="text"
          name="name"
          placeholder="Имя"
          className="popup__input popup__input_type_name"
          id="name-input"
          minLength="2"
          maxLength="40"
          required
          value={values.name || ''}
          onChange={handleChange}
        />
        <span className="popup__error popup__error_visible name-input-error"></span>
      </label>
      <label className="form__field">
        <input
          type="text"
          name="description"
          placeholder="О себе"
          className="popup__input popup__input_type_description"
          id="description-input"
          minLength="2"
          maxLength="200"
          required
          value={values.description || ''}
          onChange={handleChange}
        />
        <span className="popup__error popup__error_visible description-input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
