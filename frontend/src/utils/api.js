class Api {
  constructor({headers, address}) {
    this._headers = headers;
    this._address = address;
  }

  _checkResponse(res) {
    if (res.ok) return res.json();
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`Ошибка ${res.status}`);
  }

  _request(url, options) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`
    return fetch(`${this._address}${url}`, options).then(this._checkResponse)
  }

  // Получение существующих карточек с сервера
  getInitialCards() {
    return this._request('/cards', {
      headers: this._headers,
    })
  }

  getUserData() {
    return this._request('/users/me', {
      headers: this._headers,
    })
  }

  updateUserData(userData) {
    return this._request('/users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    })
  }

  editAvatar(link) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link.avatar,
      }),
    })
  }

  addCard(data) {
    return this._request('/cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
    })
  }

  removeCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`/cards/${cardId}/likes/`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers,
    })
  }
}

const api = new Api({
  address: 'https://api.maiiapo.mesto.student.nomoredomains.work',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
