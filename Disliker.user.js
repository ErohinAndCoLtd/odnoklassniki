// ==UserScript==
// @name        Disliker
// @namespace   odnoklassniki
// @description azaza
// @include     http://www.odnoklassniki.ru/online
// @include     http://odnoklassniki.ru/online
// @version     1.3.4
// @grant       none
// ==/UserScript==

var reloadWaitTime = 2000,
    popupWaitTime = 1000,
    photoLoadWaitTime = 2500,
    closeWaitTime = 1000,
    fetchWaitTime = 3000,
    
    minAge = "14",    // >= 14
    maxAge = "99";    // <= 99

document.getElementsByClass = function(tagName, className) {                                             // Вспомогательная функция, позволяющая получить все элементы с определенным тэгом и классом
  var itemsfound = new Array,
      elems = document.getElementsByTagName(tagName),
      i;
  for(i = 0; i < elems.length; ++i) {
    if(elems[i].className === className) {
      itemsfound.push(elems[i]);
    }
  }
  return itemsfound;
}

function processPhoto (photos) {
    var evObj;
    if (photos.length === 0) {                                                                            // Если длина буфера фото - ноль, значит, они кончились. Возвращаемся в начало скрипта.
      setTimeout(doScript, reloadWaitTime);
      return;
    }
    
    evObj = document.createEvent('MouseEvents');                                                           // Для вывода всплывающего меню симулируем ивент прохождения курсора мыши по фото
    evObj.initEvent('mouseover', true, false);
    photos[0].children[0].children[0].dispatchEvent(evObj);
    
    setTimeout(function () {                                                                                // Ждем, пока меню всплывет и
      var photoLink = document.getElementsByClass("a", "gwt-shortcutMenu-iconlink-item")[0].children[0];    // Получаем ссылку на увеличенное фото и
      photoLink.click();                                                                                    // Жмем ее
    }, popupWaitTime);
    
    setTimeout(function () {                                                                                 // Ждем, пока откроется увеличенное фото
      var dislikeBlock = document.getElementsByClass("li", "mark mark__last")[0],                            // Получаем блок с дизлайком
        dislikeButton,
        closeButton = document.getElementsByClass("div", "ic ic_i_close")[0],                                // Получаем кнопку закрытия увеличенной фотографии
        usersOnlineButton = document.getElementsByClass("a", "sm fo4c_h_live-link fs-15")[0];                // Получаем кнопку возврата к пользователям онлайн
        
      photos.splice (0,1);                                                                                   // Вне зависимости от результата, первая фотка в буфере нам уже не нужна
        
      if (dislikeBlock) {                                                                                    // Если блок с дизлайком найден, то
        dislikeButton = dislikeBlock.children[0];                                                            // Находим собственно кнопку
        dislikeButton.click();                                                                               // Жмем
        closeButton.click();                                                                                 // И закрываем увеличенное изображение
        setTimeout (function () {
          processPhoto (photos);                                                                             // После чего переходим к следующему фото
        }, closeWaitTime);
      } else {
         usersOnlineButton.click();                                                                          // Если же нет, то возвращаемся к странице с пользователями и перезапускаемся
         setTimeout(doScript, reloadWaitTime);
      }
    }, photoLoadWaitTime);
}

function fetchPhotos () {
  var photos = document.getElementsByClass("a", "photoWrapper"),                                // Находим все фото
      usersOnlineButton = document.getElementsByClass("a", "sm fo4c_h_live-link fs-15")[0];     // Находим кнопку возврата на страницу "Пользователи онлайн"
  if (photos.length === 0) {                                                                    // Если фото не нашлись, то возвращаемся к пользователям онлайн и повторяем
      usersOnlineButton.click();
      setTimeout(doScript, reloadWaitTime);
  } else {                                                                                       // Если нашлись, запускаем обработку фото
    processPhoto (photos);
  }
}
   
function doScript() {
  var ageSelect = document.getElementsByClass("select", "isl isl__res isl__2num"),                // Находим селекторы возраста
      minAgeSelect = ageSelect[0],
      maxAgeSelect = ageSelect[1],
      checkbox;
                                                                                                  // Устанавливаем возрасты
  minAgeSelect.value = minAge;
  maxAgeSelect.value = maxAge;
  
  checkbox = document.getElementById ("field_female");                                            // Выбираем чекбокс "женщины" и кликаем два раза.
  checkbox.click ();                                                                              // Это нужно потому, что после изменения значени селекторов
  checkbox.click ();                                                                              // программно перезагрузски фото не происходит
  setTimeout(fetchPhotos, fetchWaitTime);                                                         // Запускаем загрузку фото
}

doScript();