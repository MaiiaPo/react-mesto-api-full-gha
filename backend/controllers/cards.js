/* eslint-disable import/no-unresolved */
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return Card.deleteOne(card)
        .then(() => res.send(card))
        .catch((error) => next(error));
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      }
      return next(new BadRequest(`Карточка с id: ${cardId} не найдена`));
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      }
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      }
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};
