import createElment from "./src/vdom/createElment.js";
import render from "./src/vdom/render.js";
import mount from "./src/vdom/mount.js";
import { initState, setState } from "./src/vdom/state.js";
import diff from "./src/vdom/diff.js";
const state = {
  toDoList: [],
  active: [],
  comp: [],
};


const createVApp = () =>
  createElment("div", {
    attrs: {
      class: "app",
    },
    children: [
      createElment("h1", {
        attrs: {
          class: "header",
        },
        children: ["To Do List APP"],
      }),

      createElment("div", {
        attrs: { class: "input-box" },
        children: [
          createElment("input", {
            attrs: {
              class: "input",
            },
            children: [],
          }),
          createElment("button", {
            attrs: { id: "submit", onclick: "sub(event)" },
            children: ["Add Task "],
          }),
        state.toDoList.length > 0 ? nav() : createElment('p',{}),
        ],
      }),

      createElment("div", {
        attrs: { class: "list", id: "noteL" },
        children: getState(window.location.hash).map((t, i) =>
          createElment("h1", {
            attrs: {
              class: t.com ? "completed" : "note",
              ondblclick : `editNote(${i})`,
               
              },
              children: [
                createElment("p", {
                  attrs : {
                  onclick: `togle(${i})`,
                  onblur: `updateNote(${i}, this.innerText);`
                },
                children : [
                  t.text ,
                ]
              }),
              createElment("i", {
                attrs: {
                  id: "tra",
                  class: "fa-solid fa-trash fa-2xs",
                  onclick: `delet(${i})`,
                },
                children: [],
              }),
            ],
          })
        ),
      }),
    ],
  });

  const nav  = () =>
    createElment("div", {
      attrs: {
        class: "nav",
      },
      children: [
        createElment("button", {
          attrs: {
            class: "all",
            onclick: "pushStat(event)",
          },
          children: [`All Task ${state.toDoList.length}`],
        }),
        createElment("button", {
          attrs: {
            class: "active",
            onclick: "pushStat(event)",
          },
          children: [`Active ${state.active.length}`],
        }),
        createElment("button", {
          attrs: {
            class: "complete",
            onclick: "pushStat(event)",
          },
          children: [`Completed ${state.comp.length}`],
        }),
        createElment("button", {
          attrs: {
            class: "del",
            onclick: "deletAll()",
          },
          children: ["Delete All"],
        }),
        createElment("button", {
          attrs: {
            class: "del",
            onclick: "deletComplete()",
          },
          children: ["Delete Complete"],
        }),
      ],
    });


let oldApp = createVApp();
let $app = render(oldApp);
mount($app, document.getElementById("app"));

function reRend() {
console.log("len",state.toDoList,length);

  const vNewApp = createVApp();
  const patch = diff(oldApp, vNewApp);
  patch($app);
  oldApp = vNewApp;
}
initState(state, reRend);

window.sub = function () {
  const inputEl = document.querySelector(".input");
  const userInput = inputEl.value;
  if (userInput === "") return;

  setState({
    toDoList: [...state.toDoList, { text: userInput, com: false }],
  });
  updatecounter()

  inputEl.value = "";


};

window.editNote = function (i){
  const note = document.querySelectorAll(".note p")[i];
  console.log('class',note);
  note.contentEditable = true;
  note.focus()
  }

  window.updateNote = function(index, newText) {
  const note = document.querySelectorAll(".note p")[index];
  note.contentEditable = false;
  state.toDoList[index].text = newText;
  console.log(state.toDoList[index]); 
}

  

window.togle = function (index) {
  if (state.toDoList[index]) {
    state.toDoList[index].com = !state.toDoList[index].com;
    setState({ toDoList: state.toDoList });
  }
  const taskElements = document.querySelectorAll(".note, .completed");
  const taskElement = taskElements[index];

  if (taskElement) {
    if (state.toDoList[index].com) {
      taskElement.classList.add("completed");
      taskElement.classList.remove("note");
    } else {
      taskElement.classList.add("note");
      taskElement.classList.remove("completed");
    }
  }
  updatecounter()
};
window.delet = function (i) {
      state.toDoList.splice(i, 1);
    setState({ toDoList: [...state.toDoList] });
  updatecounter()
};

window.deletAll = function delet() {
  state.toDoList = [];
  setState({ toDoList: [] });
  updatecounter()
};


window.deletComplete = function deletComplete() {
  state.toDoList = state.toDoList.filter((task) => !task.com);
  setState({ toDoList: [...state.toDoList] });
  updatecounter()
}

window.pushStat = function (event) {
  let path = "/#/";
  path += event.target.classList;
  history.pushState(null, null, path);
  reRend();
};
function getState(route) {
  console.log(route);
  if (route === "#/all" || route === "") {
    return state.toDoList;
  } else if (route === "#/active") {
    return state.toDoList.filter((task) => !task.com);
  } else if (route === "#/complete") {
    return state.toDoList.filter((task) => task.com);
  }
  return [];
}

function updatecounter(){
  state.active = state.toDoList.filter((task) => !task.com);
  setState({ active: [...state.active] });
  state.comp = state.toDoList.filter((task) => task.com);
  setState({ comp: [...state.comp] });
}