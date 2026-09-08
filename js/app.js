// Import the BST logic.
import {BinarySearchTree} from "./trees/BinarySearchTree.js";

// Import the AVL logic
import {AVLTree} from "./trees/AVLTree.js";

// Import the class responsible for drawing the tree.
import {TreeRenderer} from "./visualizer/TreeRenderer.js";

// The application works with one active tree instance.
// It can be replaced with either a BST or AVL tree. (that is why we use let)
let tree = new BinarySearchTree();

// Get the tree type from index.html
const treeType = document.getElementById("treeType");

// Get the SVG element from index.html.
const svg = document.getElementById("treeCanvas");

/*
 * The renderer only depends on the tree structure:
 * value, left child and right child.
 * Therefore it can visualize both BST and AVL trees.
 */
// Give that SVG element to the renderer.
const renderer = new TreeRenderer(svg);

// Get references to the input, button (insert,search,delete) and message area
// from index.html.
const valueInput = document.getElementById("valueInput");

const insertButton = document.getElementById("insertButton");

const searchButton = document.getElementById("searchButton");

const deleteButton = document.getElementById("deleteButton");

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

/*
 * Removes a value from the current tree and redraws the visualization.
 *
 * The deletion logic is handled by the tree implementation
 * (BinarySearchTree or AVLTree). This function only connects
 * the UI with the data structure.
 */
function deleteValue() {
  const value = Number(valueInput.value);

  if (valueInput.value.trim() === "") {
    message.textContent = "Please enter a value.";

    return;
  }

  const deleted = tree.delete(value);

  if (deleted) {
    message.textContent = `Deleted ${value}`;

    renderer.render(tree);
  } else {
    message.textContent = `${value} was not found`;
  }

  valueInput.value = "";
  valueInput.focus();
}

// Tree type switching based on what is received from html

function changeTreeType() {
  if (treeType.value === "avl") {
    tree = new AVLTree();
  } else {
    tree = new BinarySearchTree();
  }

  renderer.render(tree);

  message.textContent = "Switched tree type";
}

// Run insertValue() when the Insert button is clicked.
insertButton.addEventListener("click", insertValue);

// Run searchValue() when the Search button is clicked
searchButton.addEventListener("click", searchValue);

// Run deleteValue() when the Delete button is clicked
deleteButton.addEventListener("click", deleteValue);

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

// Run changeTreeType() when the selected tree type changes. (which also renders the tree)
treeType.addEventListener("change", changeTreeType);
// Draw the initial empty tree when the page first loads. - default
renderer.render(tree);
