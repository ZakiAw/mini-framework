# Mini-Framework Documentation

## Overview
This framework is to create, render, and manage UI

- Creating elements (`createElement`)
- Rendering vDOM elements into actual DOM elements (`render`)
- Mounting elements to the DOM (`mount`)
- Compares old and new vDOM nodes to minimize DOM updates (`diff`)
- Automatically re-renders the UI when the state changes (`initState` & `setState`)

-------------------------

### `createElement()`
Creates a virtual DOM node object

### Syntax
```js
createElement(tagName, { attrs = {}, children = [] } = {})
```

### Parameters
- `tagName` (string): The html tag ('div', 'h1')
- `attrs` (object): An object containing HTML attributes (`{ class: "note" }`)
- `children` (array): An array containing child elements or text

### Example
``` js
  createElment("button", {
    attrs: { id: "submit", onclick: "sub(event)" },
    children: ["Add Task "],
    }),
```

---

## `render()`
Converts a virtual DOM node into an actual DOM node.

### Syntax
```js
render(vNode)
```

### Example
```js
const vNode = createElement("h1", { children: ["Welcome!"] });
const $node = render(vNode);
document.body.appendChild($node);
```

---

## `mount()`
### Description
Replaces an existing DOM node with a new one.

### Syntax
```js
mount($node, $target)
```

### Example
```js
const $app = render(vApp);
mount($app, document.getElementById("app"));
```

## `diff()`
Compares two virtual DOM trees and applies only the necessary changes to the real DOM.

### Syntax
```js
diff(oldVNode, newVNode)
```

### Example
```js
let oldApp = createVApp();
let $app = render(oldApp);
mount($app, document.getElementById("app"));

function reRend() {
  const vNewApp = createVApp();
  const patch = diff(oldApp, vNewApp);
  patch($app);
  oldApp = vNewApp;
}
```

---

## `initState()` & `setState()`
`initState` initializes the state, and `setState` updates it and triggers UI re-rendering.

### Syntax
```js
initState(initialState, renderCallback)
setState(newState)
```

### Example
```js
const state = { toDoList: [] };

initState(state, reRend);

window.sub = function (event) {
  const inputEl = document.querySelector(".input");
  const userInput = inputEl.value;
  if (userInput === "") return;

  setState({
    toDoList: [...state.toDoList, { text: userInput, com: false }],
  });

  inputEl.value = "";
};
```

---

## Example Project: To-Do List App
To-Do list application:
- Adding tasks
- Marking tasks as complete
- Deleting individual or all tasks
- Filtering tasks by "All", "Active", or "Complete"

### Sample Code Snippet
```js
createElement("div", {
  attrs: { class: "list", id: "noteL" },
  children: getState(window.location.hash).map((t, i) =>
    createElement("h1", {
      attrs: { class: t.com ? "completed" : "note", onclick: `togle(${i})` },
      children: [
        t.text,
        createElement("i", {
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
});
```

The `diff` function does efficient updates, and `setState` simplifies state management.

