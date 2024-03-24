


import fs from 'fs';
import http from 'http';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Note: Pass Gun({localStorage: false}) to disable localStorage.
import Gun from 'gun';
//import SEA from 'gun/sea.js';
//import Radix from 'gun/lib/radix.js';
//import 'gun/lib/radix.js';
//import Radisk from 'gun/lib/radisk.js';
//import 'gun/lib/store.js';
//import 'gun/lib/rindexed.js';
//import Rindexed from 'gun/lib/rindexed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3000,
  peers: process.env.PEERS && process.env.PEERS.split(',') || []
};

function serverHandler(request, response) {
  //console.log('request ', request.url);
  let filePath = request.url;

  if (filePath == '/') {
      filePath = 'public/index.html';
  }
  else {
      filePath = 'public' + request.url;
  }

  let extname = String(path.extname(filePath)).toLowerCase();
  let mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
      '.ico' : 'image/x-icon'
  };

  let contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, function(error, content) {
      if (error) {
          if(error.code == 'ENOENT') {
              fs.readFile('public/404.html', function(error, content) {
                  response.writeHead(404, { 'Content-Type': 'text/html' });
                  response.end(content, 'utf-8');
              });
          }
          else {
              response.writeHead(500);
              response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
          }
      }
      else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
      }
  });

}

async function main(){
  //===================================
  //web server
  const server = http.createServer(serverHandler);
  //let localStorage = [];
  var HBopt = {store: {}};
  //required put function
  HBopt.store.put = async function(key, data, cb){
    console.log("===PUT===");
    console.log("key: ", key);
    console.log("data: ", data);
    // await db.put(''+key, data); //string
    localStorage[''+key] = data;
    return cb(null, 1);
  }
  //required get function
  HBopt.store.get = async function(key, cb){
    console.log("===GET===");
    console.log("key: ",key);
    // let data = await db.get(''+key);
    // if(data==null){
    //   return cb(null, undefined);
    // }
    //console.log("data:", data);
    //console.log("localStorage: ",localStorage.length);
    cb(null, localStorage[''+key])
    //return cb(null, data?.value);
  }

  var gunConfig = {
    web: server.listen(config.port),
    file:false,//disable file save
    peers: config.peers, // peers
    localStorage:false,// disable ? browser
    radisk: false, // default true
    axe: false, // default true
    //store:HBopt.store // works
  };

  //console.log(Gun._);

  Gun.on('create', function(db) {
    this.to.next(db);
    // Register IO listeners with gun context
    db.on('get', function(request) {
      // same as above.
      this.to.next(request);
      console.log("==GET==")
      // read data, etc.
      // read data, etc.
      var dedupId = request['#'];
      var get = request.get;
      var key = get['#'];
      var field = get['.'];


    });
    db.on('put', function(request) {
      // same as above.
      this.to.next(request);
      console.log("==PUT==")
      // grab the node delta
      var delta = request.put;
      var dedupId = request['#'];
      // write data, etc.
      console.log("delta: ",delta);
      console.log("dedupId: ",dedupId);



    });

  });



  var gun = Gun(gunConfig);
  //console.log(gun._.opt);

  // var storage = Object(null);
  // gun._.opt.store = {};
  // gun._.opt.store.put = function(file, data, cb){
  //   console.log(`put with ${file}, data ${data}, callback`);
  //   storage[file] = data
  //   cb(undefined, 1)
  // }
  // gun._.opt.store.get = function(file, cb){
  //     console.log(`get with ${file}, callback`);
  //     var temp = storage[file] || undefined
  //     console.log(`Found ${file}: ${temp}`);
  //     cb(temp)
  // }




  gun.on('hi', peer =>{ 
    //console.log('HI > ',peer);
    console.log('HI > Peer!');
  });
  // gun.on('bye', peer =>{ 
  //   //console.log('BYE > ',peer);
  //   console.log('BYE > Peer!');
  // });
  //console.log(gun);

  console.log('Web: http://127.0.0.1:3000');
}

main();