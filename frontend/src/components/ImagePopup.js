function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_image ${card && 'popup_opened'}`}>
      <div className="full">
        <button
          className="popup__close popup__close_image link"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <figure className="figure">
          <img
            className="full__image"
            src={card ? card.link : ''}
            alt={card ? card.name : ''}
          />
          <figcaption className="full__caption">{card ? card.name : ''}</figcaption>
        </figure>
      </div>
    </div>
  )
}
export default ImagePopup;
