
 * https://gun.eco/docs/RAD#api

```js
// var Rad = require('gun/lib/radisk'); // in NodeJS
var Rad = window.Radisk; // in Browser, still needs the above script tags.
var rad = Rad(opt);
```

```js
var localStorage = [];

var opt = {store: {}};
opt.store.put = function(key, data, cb){
  localStorage[''+key] = data;
  cb(null, 1);
}
opt.store.get = function(key, cb){
  cb(null, localStorage[''+key])
}
```