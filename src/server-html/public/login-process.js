function saveAccessKey(key) {
  var storage = window.localStorage;
  storage.setItem('hyunsub-access-key', key);
}

function saveAccessUser(user) {
  var storage = window.localStorage;
  storage.setItem('hyunsub-access-user', user);
}