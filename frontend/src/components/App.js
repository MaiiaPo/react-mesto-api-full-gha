import React, {useEffect} from 'react';
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRouteElement from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import {auth} from "../utils/auth";
import { useNavigate } from 'react-router-dom';

function App() {
  // Видимость попапов
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  const [cards, setCards] = React.useState([]);

  // Выбранная карточка
  const [selectedCard, setSelectedCard] = React.useState(null);

  // Информация о пользователе
  const [currentUser, setCurrentUser] = React.useState(null);
  const [userEmail, setUserEmail] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);

  // Авторизован пользователь или нет
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isSuccessAuth, setIsSuccessAuth] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // настало время проверить токен
    tokenCheck();
  }, [])

  const tokenCheck = () => {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит, действующий он или нет
    if (localStorage.getItem('jwt')){
      const jwt = localStorage.getItem('jwt');

      auth.getToken(jwt).then((res) => {
        if (res){
          setLoggedIn(true);
          navigate("/", {replace: true})
          setUserEmail(res.email);
          setCurrentUser(res);

          api.getInitialCards()
            .then((cardsData) => {
              setCards(cardsData);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
        .catch((err) => console.error(err));
    }
  }

  useEffect(() => {
    loggedIn && Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCards(cardsData);
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loggedIn]);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);

    setSelectedCard(null);
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard

  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  function handleCardLike(card) {
    // Есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.includes(currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleCardDelete(card) {
    api.removeCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleUpdateUser(userData) {
    setIsLoading(true);
    api.updateUserData(userData).then((currentUser) => {
      setCurrentUser(currentUser);
      closeAllPopups();
    })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api.editAvatar({ avatar }).then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(newPlace) {
    setIsLoading(true);
    api.addCard(newPlace).then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleRegister (values) {
    const { email, password } = values;
    auth.register(email, password)
      .then(() => {
        setIsInfoTooltipOpen(true);
        setIsSuccessAuth(true)
        navigate('/sign-in', {replace: true});
      })
      .catch((e) => {
        setIsInfoTooltipOpen(true);
        setIsSuccessAuth(false)
        console.error(e)
      });
  }

  function handleLogin (values) {
    const { email, password } = values;
    if (!email || !password){
      return;
    }

    auth.authorize(email, password).then((data) => {
      if (data.token){
        setUserEmail(email);
        setLoggedIn(true);
        navigate('/');
        tokenCheck();
      }
    })
      .catch(err => {
        console.error(err)
        setIsInfoTooltipOpen(true);
        setIsSuccessAuth(false)
      });
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setUserEmail('');
  }

  return (
    <div className="App">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header email={userEmail} loggedIn={loggedIn} handleSignOut={handleSignOut}/>
          <Routes>
            <Route path="/sign-up" element={<Register handleRegister={handleRegister}/>} />
            <Route path="/sign-in" element={<Login handleLogin={handleLogin}/>}/>
            <Route
              path="/"
              element={
                <ProtectedRouteElement
                  element={Main}
                  loggedIn={loggedIn}
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />
          </Routes>
          <Footer />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <PopupWithForm
            name='confirm'
            title='Вы уверены?'
            buttonValue='Да'
            children={<></>}
            onClose={closeAllPopups}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccessAuth}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
