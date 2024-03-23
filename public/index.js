
//import '/van-x.nomodule.min.js';
import van from "van";
import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';
import 'https://cdn.jsdelivr.net/npm/gun/lib/radix.js';
import 'https://cdn.jsdelivr.net/npm/gun/lib/radisk.js';
import 'https://cdn.jsdelivr.net/npm/gun/lib/store.js';
import 'https://cdn.jsdelivr.net/npm/gun/lib/rindexed.js';

//console.log(window.Radisk);

//console.log(Gun.SEA);

const {button, div, input} = van.tags
var gun = GUN({
  peers:["http://127.0.0.1:3000/gun"],
  localStorage:false
});

// gun.get('mark').put({
//   name: "Mark",
//   email: "mark@gun.eco",
// });

// gun.get('mark').on((data, key) => {
//   console.log("realtime updates:", data);
// });

// setInterval(() => { gun.get('mark').get('live').put(Math.random()) }, 1000);


const App = () => {
  const dom = div()
  const key = van.state('');
  const value = van.state('');

  function btnGet(){
    gun.get(key.val).once((data, key) => {
      console.log("data", data);
    })
  }

  function btnPut(){
    console.log(key.val)
    console.log(value.val)
    gun.get(key.val).put({text:value.val});
  }

  return div(
    dom,
    input({value:key,oninput:e=>key.val=e.target.value,placeholder:'key'}),
    input({value:value,oninput:e=>value.val=e.target.value,placeholder:'value'}),
    button({onclick:()=>btnPut()},'put'),
    button({onclick:()=>btnGet()},'get')
  )
}

van.add(document.body, App())

