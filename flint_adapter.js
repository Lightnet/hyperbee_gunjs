// https://github.com/gundb/gun-flint/blob/master/docs/KEY_VAL_ADAPTER.MD
// https://github.com/gundb/gun-flint/blob/master/docs/DELTA_ADAPTER.MD
// https://github.com/gundb/gun-flint/blob/master/docs/NODE_ADAPTER.MD
// https://github.com/gundb/gun-mongo-key
// 


// OUTDATE PACKAGE WARNs...

import {Flint, NodeAdapter} from 'gun-flint';

const DBAdapter = new KeyValAdapter({
  opt: function(context, opt) {
    // Initialize the adapter; e.g., create database connection

    
  },
  get: function(key, done) {

  },
  put: function(key, node, done) {

  }
});

export {
  DBAdapter
}