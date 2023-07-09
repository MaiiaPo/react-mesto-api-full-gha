class Api {
  constructor({token, address}) {
    this._token = token;
    this._address = address;
  }

  _checkResponse(res) {
    if (res.ok) return res.json();
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`Ошибка ${res.status}`);
  }

  _request(url, options) {
    return fetch(`${this._address}${url}`, options).then(this._checkResponse)
  }

  // Получение существующих карточек с сервера
  getInitialCards() {
    return this._request('/cards', {
      headers: {
        authorization: this._token,
      },
    })
  }

  getUserData() {
    return this._request('/users/me', {
      headers: {
        authorization: this._token,
      },
    })
  }

  updateUserData(userData) {
    return this._request('/users/me', {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    })
  }

  editAvatar(link) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        avatar: link.avatar,
      }),
    })
  }

  addCard(data) {
    return this._request('/cards', {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    })
  }

  removeCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
      },
    })
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`/cards/likes/${cardId}`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: {
        authorization: this._token,
      },
    })
  }
}

const api = new Api({
  address: 'https://mesto.nomoreparties.co/v1/cohort-62',
  token: '2966f134-ddf9-4ef6-92e6-3cc74f9bff8f',
});

export default api;
