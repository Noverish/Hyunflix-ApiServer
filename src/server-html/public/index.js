// from https://developer.mozilla.org/ko/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // Firefox를 제외한 모든 브라우저
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // 코드가 존재하지 않을 수도 있기 때문에 테스트 이름 필드도 있습니다.
      // Firefox를 제외한 모든 브라우저
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // 이미 저장된 것이있는 경우에만 QuotaExceededError를 확인하십시오.
      storage.length !== 0;
  }
}

function getLocalStorage(key) {
  var storage = window.localStorage;
  return storage.getItem(key)
}

function main() {
  if (storageAvailable('localStorage')) {
    const accessKey = getLocalStorage('hyunsub-access-key');
    if(!accessKey) {
      window.location.href='/login'
    } else {
      var text = document.createTextNode('환영합니다! ' + getLocalStorage('hyunsub-access-user'));
      document.getElementById('access-user').appendChild(text);
    }
  } else {
    var h1Tag = document.createElement('h1');
    var text = document.createTextNode('Cannot use');
    h1Tag.appendChild(text);
  document.body.appendChild(h1Tag);
  }
  
}

main();