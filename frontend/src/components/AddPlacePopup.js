import PopupWithForm from "./PopupWithForm";
import React, {useEffect} from "react";
import {useForm} from "../hooks/useForm";

function AddPlacePopup ({onAddPlace, isOpen, onClose, isLoading}) {
  const {values, handleChange, setValues} = useForm({})

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: values.namePlace,
      link: values.link,
    });
  }

  useEffect(() => {
    setValues({})
  }, [isOpen]);

  return (
    <PopupWithForm
      name='add'
      title='Новое место'
      buttonValue={isLoading? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="form__field">
        <input
          type="text"
          name="namePlace"
          placeholder="Название"
          className="popup__input popup__input_type_name-place"
          id="name-place-input"
          minLength="2"
          maxLength="30"
          value={values.namePlace || ''}
          onChange={handleChange}
          required
        />
        <span className="popup__error popup__error_visible name-place-input-error"></span>
      </label>
      <label className="form__field">
        <input
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          className="popup__input popup__input_type_link"
          id="link-input"
          value={values.link || ''}
          onChange={handleChange}
          required
        />
        <span className="popup__error popup__error_visible link-input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
