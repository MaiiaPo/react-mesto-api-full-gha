/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const AuthError = require('../errors/auth-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Пользователь с id: ${userId} не найден`));
      }
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const {
        // eslint-disable-next-line no-shadow
        email, name, about, avatar,
      } = user;
      return res.status(201).send({
        email, name, about, avatar,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }

      if (error.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Пользователь с id: ${userId} не найден`));
      }
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        return next(new NotFoundError(`Пользователь с id: ${userId} не найден`));
      }
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((error) => next(new AuthError(error.message)));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};
