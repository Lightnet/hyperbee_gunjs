# hyperbee_gunjs

# LICENSE: MIT

# Created By: Lightnet

# Information:

  Just sample test.

  Prototype build for peer to peer network on nodejs npm pear package (https://docs.pears.com). To develop on hyperbee as database and gun.js graph node tree. Since gun.js can be use as server and client to handle app.

  Idea by using the peer to peer secure network.
```
Pear loads applications remotely from peers and allows anyone to create and share applications with peers.
```
 One of the reason is without need certs on web site hosting. Just used on peer to peer network. Is what I think. Since it secure network and keys from pear packages.

 Note need more better handle array.

# Install:
```
  npm install -g pear
```
  Current windows does not work currently.

# Start:

Command line
```
npm install
node webserver.js
```
  Just testing how gun handle get and put into the hyperbee database.

# Notes:
 * windows 10
   * current not working for pear 1.0.2

# refs and links:
 * https://github.com/holepunchto/hyperbee
 * https://docs.pears.com/guides/getting-started
 * https://github.com/amark/gun/issues/1194
 * https://github.com/gundb/gun-flint/blob/master/docs/NODE_ADAPTER.MD


# database, store and config:
  There are ways to handle database and config them.

```js
import Gun from 'gun';
import SEA from 'gun/sea.js';
import Radix from 'gun/lib/radix.js';
import Radisk from 'gun/lib/radisk.js';
import Store from 'gun/lib/store.js';
import Rindexed from 'gun/lib/rindexed.js';
//note might be incorrect set up for lib for testing
//...
var DBopt = {store: {}};

DBopt.store.put = async function(key, data, cb){
  console.log("===PUT===");
  console.log("key: ", key);
  console.log("data: ", data);
  localStorage[''+key] = data;
}

DBopt.store.get = async function(key, cb){
  console.log("===GET===");
  console.log("key: ",key);
  cb(null, localStorage[''+key])
}

var gunConfig = {
  web: server.listen(config.port),
  file:false,//disable file save
  peers: config.peers, // peers
  //localStorage:false,// disable ? browser
  //radisk: true, // default = true
  //axe: true, // default = true
  store:DBopt.store // works
};

var gun = Gun(gunConfig);
gun.on('hi', peer =>{ 
  //console.log('HI > ',peer);
  console.log('HI > Peer!');
});
gun.on('bye', peer =>{ 
  //console.log('BYE > ',peer);
  console.log('BYE > Peer!');
});

```

  Note it store single key by default. Might be incorrect but read in gun js docs site. 
   * https://gun.eco/docs/RAD
   * https://gun.eco/docs/Radisk
   * https://gun.eco/docs/Building-Storage-Adapters (out date)?
   * https://www.npmjs.com/package/gun-flint
   
```js
 localstore['!'] = {"test":"test"};
```
  Note if you disable radisk which disable the store get and put call for opt config.


  If not use radisk is disable.

 * https://gun.eco/docs/Building-Storage-Adapters#alternative-to-writing-your-own-adapter-from-scratch
```js
var Gun = require('gun/gun');

// `db` param passed in is the gun instance
// that is being created.
Gun.on('create', function(db) {

  // This line is critical to allow other
  // extensions to register as well.
  this.to.next(db);

  // Register IO listeners with gun context
  db.on('get', function(request) {

    // same as above.
    this.to.next(request);

    // read data, etc.
  });
  db.on('put', function(request) {

    // same as above.
    this.to.next(request);

    // write data, etc.
  });
});
```
  This is another way to handle database get and set data but required more handle of key and value and node graph. Reason is linking data relate to ids.

# Packages:
 * Note some package are outdate. Required some work.
   * https://github.com/gundb/gun-flint

 * https://stackoverflow.com/questions/17509669/how-to-install-an-npm-package-from-github-directly
```
npm install https://github.com/<user>/<name>.git
```

```
npm install git+ssh://git@github.com:<githubname>/<githubrepo.git[#<commit-ish>]
npm install git+ssh://git@github.com:<githubname>/<githubrepo.git>[#semver:^x.x]
npm install git+https://git@github.com/<githubname>/<githubrepo.git>
npm install git://github.com/<githubname>/<githubrepo.git>
npm install github:<githubname>/<githubrepo>[#<commit-ish>]
```