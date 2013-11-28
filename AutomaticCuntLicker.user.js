// ==UserScript==
// @name        Automatic cunt licker
// @namespace   odnoklassniki
// @description 2 hours
// @include     http://www.odnoklassniki.ru/online
// @include     http://odnoklassniki.ru/online
// @version     1.0
// @grant       none
// ==/UserScript==

var initialWaitTime = 5000,
    reloadWaitTime = 2000,
    popupWaitTime = 1000,
    photoLoadWaitTime = 2500,
    closeWaitTime = 1000,
    fetchWaitTime = 3000,
    
    minAge = "18",    // >= 14
    maxAge = "22",    // <= 99
    
    phraseList = [  "Красота!",
                    "Секси!",
                    "Ты очень красивая :)",
                    "Офигенная фотка!",
                    "Обожаю таких девушек)",
                    "Ого, какие глаза!",
                    "Просто прелесть!",
                    "Лучшая фотка на этом сайте)" ];

document.getElementsByClass = function(tagName, className) {
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
    if (photos.length === 0) {
      setTimeout(doScript, reloadWaitTime);
      return;
    }
    
    evObj = document.createEvent('MouseEvents');
    evObj.initEvent('mouseover', true, false);
    photos[0].children[0].children[0].dispatchEvent(evObj);
    
    setTimeout(function () {
      var photoLink = document.getElementsByClass("a", "gwt-shortcutMenu-iconlink-item")[0].children[0];
      photoLink.click();
    }, popupWaitTime);
    
    setTimeout(function () {
      var commentBlock = document.getElementById("plp_cmtHId"),
        commentEditField,
        commentButton,
        closeButton = document.getElementsByClass("div", "ic ic_i_close")[0],
        usersOnlineButton = document.getElementsByClass("a", "sm fo4c_h_live-link fs-15")[0],
        rand = Math.floor((Math.random()*phraseList.length));
        
      photos.splice (0,1);
        
      if (commentBlock) {
        commentEditField = commentBlock.children[1];
        commentEditField.focus ();
        commentEditField = commentBlock.children[0];
        commentEditField.value = phraseList[rand];
        setTimeout (function () {
          commentButton = commentBlock.children[4].children[0];
          if (commentButton) {
            commentButton.click();  
          }
          closeButton.click();
          setTimeout (function () {
            processPhoto (photos);
          }, closeWaitTime);
        }, popupWaitTime);
      } else if (document.getElementById ("addPrivateProfileButton")) {
        usersOnlineButton.click();
        setTimeout(doScript, reloadWaitTime);  
      } else {
        closeButton.click();
        setTimeout (function () {
          processPhoto (photos);
        }, closeWaitTime); 
      }
    }, photoLoadWaitTime);
}

function fetchPhotos () {
  var photos = document.getElementsByClass("a", "photoWrapper"),
      usersOnlineButton = document.getElementsByClass("a", "sm fo4c_h_live-link fs-15")[0];
  if (photos.length === 0) {
      usersOnlineButton.click();
      setTimeout(doScript, reloadWaitTime);
  } else {
    processPhoto (photos);
  }
}
   
function doScript() {
  var ageSelect = document.getElementsByClass("select", "isl isl__res isl__2num"),
      minAgeSelect = ageSelect[0],
      maxAgeSelect = ageSelect[1],
      rand = Math.floor((Math.random()*cityList.length));
  
  minAgeSelect.value = minAge;
  maxAgeSelect.value = maxAge;
  
  checkbox = document.getElementById ("field_male");
  checkbox.click ();
  setTimeout(fetchPhotos, fetchWaitTime);
}

setTimeout(doScript, initialWaitTime);