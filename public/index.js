
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

const {button, div, input, label} = van.tags
var gun = GUN({
  peers:["http://127.0.0.1:3000/gun"],
  localStorage:false,
  radisk:false
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
  const rootkey = van.state('');
  const key = van.state('');
  const value = van.state('');
  const nodeData =  van.state({});
  const statusData = label('None');

  function btnGet(){
    if(typeof rootkey.val === 'string' && rootkey.val.length === 0){
      statusData.innerText = "EMPTY!";
      return;
    }
    gun.get(rootkey.val).once((data, key) => {
      console.log("key: ", key);
      console.log("data: ", data);
      if(data==null){
        return;
      }
      nodeData.val = data;
      statusData.innerText = JSON.stringify(data);
    })
  }

  function btnPut(){
    console.log(key.val);
    console.log(value.val);
    if(typeof rootkey.val === 'string' && rootkey.val.length === 0){
      statusData.innerText = "EMPTY!";
      return;
    }
    if(typeof key.val === 'string' && key.val.length === 0){
      statusData.innerText = "EMPTY!";
      return;
    }
    if(typeof value.val === 'string' && value.val.length === 0){
      statusData.innerText = "EMPTY!";
      return;
    }
    let data = {};
    data[key.val] = value.val;
    console.log(data);
    gun.get(rootkey.val).put(data);
  }

  function clearList(){
    nodeData.val = {};
  }
  function btnClear(){
    statusData.innerText = "None";
  }

  function unixToDate(_item, _key){
    //return new Date(_num);
    //console.log(_item[0]['_'])
    let storeDate = [];
    let isFound = false;
    for ( let i=0; i< _item.length;i++ ){
      if(_item[i].key == '_'){//not sure if the array can find if the length is big
        storeDate = _item[i].value;
        isFound=true;
      }
    }
    //console.log(storeDate['>'][_key]);
    //console.log(new Date(storeDate['>'][_key]).toLocaleString());
    let time = new Date(storeDate['>'][_key]).toLocaleString() || "";

    //console.log("__: ",_key);
    return " Last Update: "+time;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  const dataList = van.derive(()=>{
    // const obj = { a: 5, b: 7, c: 9 };
    // for (const [key, value] of Object.entries(obj)) {
    //   console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
    // }
    let objData = [];
    for (const [key, value] of Object.entries(nodeData.val)) {
      objData.push({key,value});
    }
    let objList = objData.map(it =>{
      if(it.key == '_'){//ingore this from object json
        console.log("FOUND...");
        return;
      }
      return div(
        label(' key: '), 
        input({value:it.key,oninput:e=>it.key=e.target.value,placeholder:'key'}),
        label(' value: '),
        input({value:it.value,oninput:e=>it.value=e.target.value,placeholder:'value'}),
        label(unixToDate(objData, it.key)),
      )
    });
    return div(objList);
  })

  return div(
    dom,
    input({value:rootkey,oninput:e=>rootkey.val=e.target.value,placeholder:'root key'}),
    button({onclick:()=>btnGet()},'get'),
    div(
      label("Object Props:"),
    ),
    div(
      label(' key: '), 
      input({value:key,oninput:e=>key.val=e.target.value,placeholder:'key'}),
      label(' value: '), 
      input({value:value,oninput:e=>value.val=e.target.value,placeholder:'value'}),
      button({onclick:()=>btnPut()},'put'),
    ),
    div(
      button({onclick:()=>btnClear()},'Clear'),
      label("Node Data:"),
    ),
    div(statusData,),
    div(
      button({onclick:()=>clearList()},'Clear'),
      label("Object Data:")
    ),
    dataList
  )
}

van.add(document.body, App())

