import PopupWithForm from "./PopupWithForm";
import React from "react";

function EditAvatarPopup ({isOpen, onClose, isLoading, onUpdateAvatar}) {
  const refUrl = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: refUrl.current.value,
    });
  }

  React.useEffect(() => {
    refUrl.current.value = '';
  }, [isOpen]);

  return (
    <PopupWithForm
      name='edit-avatar'
      title='Обновить аватар'
      buttonValue={isLoading? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="form__field">
        <input
          ref={refUrl}
          type="url"
          name="avatar-link"
          placeholder="Ссылка на аватар"
          className="popup__input popup__input_type_link"
          id="avatar-link-input"
          required
        />
        <span className="popup__error popup__error_visible avatar-link-input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
