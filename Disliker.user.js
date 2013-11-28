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
      var dislikeBlock = document.getElementsByClass("li", "mark mark__last")[0],
        dislikeButton,
        closeButton = document.getElementsByClass("div", "ic ic_i_close")[0],
        usersOnlineButton = document.getElementsByClass("a", "sm fo4c_h_live-link fs-15")[0];
        
      photos.splice (0,1);
        
      if (dislikeBlock) {
        dislikeButton = dislikeBlock.children[0];
        dislikeButton.click();
        closeButton.click();
        setTimeout (function () {
          processPhoto (photos);
        }, closeWaitTime);
      } else {
         usersOnlineButton.click();
         setTimeout(doScript, reloadWaitTime);
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
  var photos = document.getElementsByClass("a", "photoWrapper"),
      ageSelect = document.getElementsByClass("select", "isl isl__res isl__2num"),
      minAgeSelect = ageSelect[0],
      maxAgeSelect = ageSelect[1],
      checkbox;
  
  minAgeSelect.value = minAge;
  maxAgeSelect.value = maxAge;
  
  checkbox = document.getElementById ("field_female");
  checkbox.click ();
  checkbox.click ();
  setTimeout(fetchPhotos, fetchWaitTime);
}

doScript();