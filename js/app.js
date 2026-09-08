// Import the BST logic.
import {BinarySearchTree} from "./trees/BinarySearchTree.js";

// Import the class responsible for drawing the tree.
import {TreeRenderer} from "./visualizer/TreeRenderer.js";

// Create one BST instance for the application.
const tree = new BinarySearchTree();

// Get the SVG element from index.html.
const svg = document.getElementById("treeCanvas");

// Give that SVG element to the renderer.
const renderer = new TreeRenderer(svg);

// Get references to the input, button and message area
// from index.html.
const valueInput = document.getElementById("valueInput");

const insertButton = document.getElementById("insertButton");

const searchButton = document.getElementById("searchButton");

const message = document.getElementById("message");

function insertValue() {
  /*
   * Convert the value entered by the user from a string
   * into a JavaScript number.
   */
  const value = Number(valueInput.value);

  // Do not attempt an insertion if the input box is empty.
  if (valueInput.value.trim() === "") {
    message.textContent = "Please enter a value.";

    return;
  }

  /*
   * tree.insert(value) returns:
   * true  -> the value was inserted
   * false -> the value already existed
   */
  const inserted = tree.insert(value);

  if (inserted) {
    message.textContent = `Inserted ${value}`;

    // Redraw the tree so the new node becomes visible.
    renderer.render(tree);
  } else {
    message.textContent = `${value} already exists in the tree.`;
  }

  // Clear the input field after each attempt.
  valueInput.value = "";

  // Put the keyboard cursor back into the input box.
  valueInput.focus();
}

/*Function for the behaviour on the press of the searchValue button */
function searchValue() {
  const value = Number(valueInput.value);

  if (valueInput.value.trim() === "") {
    message.textContent = "Please enter a value.";

    return;
  }

  // search() returns the actual TreeNode object if found.
  // The renderer can then use this object to highlight it.
  const foundNode = tree.search(value);

  if (foundNode !== null) {
    message.textContent = `Found ${value}`;

    // Redraw the tree with the searched node highlighted.
    renderer.render(tree, foundNode);
  } else {
    message.textContent = `${value} was not found`;

    renderer.render(tree);
  }

  valueInput.value = "";
  valueInput.focus();
}

// Run insertValue() when the Insert button is clicked.
insertButton.addEventListener("click", insertValue);

// Run searchValue() when the Search button is clicked
searchButton.addEventListener("click", searchValue);

/*
 * Also allow Enter to insert a value.
 *
 * The event object contains information about the
 * keyboard event that occurred.
 */
valueInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    insertValue();
  }
});

// Draw the initial empty tree when the page first loads.
renderer.render(tree);
