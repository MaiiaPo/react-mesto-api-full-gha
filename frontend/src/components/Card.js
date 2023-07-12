import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardDelete, onCardLike}) {
  const currentUser = React.useContext(CurrentUserContext);

  // Являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id
    ? card.owner._id  === currentUser._id
    : card.owner === currentUser._id;
  // Есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.includes(currentUser._id);

  const cardLikeButtonClassName = (
    `element__like ${isLiked && 'element__like_active'}`
  );

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="element">
      { isOwn && <button className="element__delete link" type="button" aria-label="Удалить" onClick={handleDeleteClick} />}
      <img className="element__image" src={card.link} alt={card.name} onClick={handleClick}/>
      <div className="element__info">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-block">
          <button className={cardLikeButtonClassName} type="button" aria-label="Нравится" onClick={handleLikeClick}></button>
          <p className="element__count">{card.likes.length}</p>
        </div>
      </div>
    </article>
  )
}

export default Card;
