import fs from 'fs';
//import Gun from 'gun';
import http from 'http';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Hyperbee from 'hyperbee';
import Hypercore from 'hypercore';

// Note: Pass Gun({localStorage: false}) to disable localStorage.
import Gun from 'gun';
import SEA from 'gun/sea.js';
import Radix from 'gun/lib/radix.js';
import Radisk from 'gun/lib/radisk.js';
import Store from 'gun/lib/store.js';
import Rindexed from 'gun/lib/rindexed.js';

// var Rad = require('gun/lib/radisk'); // in NodeJS
//var Rad = window.Radisk; // in Browser, still needs the above script tags.
//var rad = Rad(opt);

//console.log(Gun);
//console.log(SEA);
//console.log(Radix);
//console.log(Radisk);
//console.log(Store);
//console.log(Rindexed);

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

//const server = http.createServer(Gun.serve(__dirname));

async function main(){
  //set up data
  const core = new Hypercore("./data");
  await core.ready();
  // console.log("Hypercore Information");
  // console.log("core.id: ",core.id);
  // console.log("core.version: ",core.version);
  // console.log("core.key: ",core.key);
  // console.log("core.keyPair: ",core.keyPair);
  // console.log("core.discoveryKey: ",core.discoveryKey);
  // console.log("core.encryptionKey: ",core.encryptionKey);

  const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' });

  await db.ready();
  console.log("Hyperbee Information");
  // console.log("db.version: ",db.version);
  // console.log("db.id: ",db.id);
  // console.log("db.key: ",db.key);
  // console.log("db.key hex: ",db.key.toString('hex'));
  // console.log("db.discoveryKey: ",db.discoveryKey);
  // console.log("db.discoveryKey hex: ",db.discoveryKey.toString('hex'));

  //web server
  const server = http.createServer(serverHandler);
  //let localStorage = [];
  var HBopt = {store: {}};
  //required put function
  HBopt.store.put = async function(key, data, cb){
    console.log("===PUT===");
    console.log("key: ", key);
    console.log("data: ", data);
    await db.put(''+key, data); //string
    //localStorage[''+key] = data;
    return cb(null, 1);
  }
  //required get function
  HBopt.store.get = async function(key, cb){
    console.log("===GET===");
    console.log("key: ",key);
    let data = await db.get(''+key);
    if(data==null){
      return cb(null, undefined);
    }
    console.log("data:", data);
    //console.log("localStorage: ",localStorage.length);
    //cb(null, localStorage[''+key])
    return cb(null, data?.value);
  }
  //console.log(Radisk(HBopt));
  //console.log(await db.get('!'))
  //await db.put(''+'test', JSON.stringify({test:"test"}));
  //console.log(await db.get(''+'test'))


  // https://stackoverflow.com/questions/60408502/how-to-put-data-in-gundb-at-server-side-as-a-peer
  var gunConfig = {
    web: server.listen(config.port),
    file:false,//disable file save
    peers: config.peers, // peers
    //localStorage:false,// disable ? browser
    //radisk: true, // 
    //axe: true, //
    store:HBopt.store // works
    //store:Radisk(HBopt) // works
    //store:Store(HBopt) // nope
    //store:Radix(HBopt) // nope
    //store:Rindexed(HBopt) // works
  };

  var gun = Gun(gunConfig);
  //console.log("gun.opt");
  //console.log(gun.opt);
  gun.on('hi', peer =>{ 
    //console.log('HI > ',peer);
    console.log('HI > Peer!');
  });
  gun.on('bye', peer =>{ 
    //console.log('BYE > ',peer);
    console.log('BYE > Peer!');
  });
  //console.log(gun);

  console.log('Web: http://127.0.0.1:3000');
}

main();