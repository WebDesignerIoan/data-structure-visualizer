// Import the BST logic.
import {BinarySearchTree} from "./trees/BinarySearchTree.js";

// Import the AVL logic
import {AVLTree} from "./trees/AVLTree.js";

// Import the Treap logic
import {Treap} from "./trees/Treap.js";

// Import the class responsible for drawing the tree.
import {TreeRenderer} from "./visualizer/TreeRenderer.js";

// The application works with one active tree instance.
// It can be replaced with either a BST or AVL tree or Treap. (that is why we use let)
let tree = new BinarySearchTree();

/*
 * OBSERVATION: These elements are used only for examples opened from the theory page
 *
 * The comparison section contains two SVG canvases:
 * one for the tree before balancing and one for the result
 * after AVL balancing.
 */
const exampleComparison = document.getElementById("exampleComparison");

const beforeSvg = document.getElementById("beforeTreeCanvas");

const afterSvg = document.getElementById("afterTreeCanvas");

/*
 * We reuse the same TreeRenderer class for both example trees.
 *
 * No new drawing algorithm -> each renderer simply draws onto a different SVG element
 */
const beforeRenderer = new TreeRenderer(beforeSvg);
const afterRenderer = new TreeRenderer(afterSvg);

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

const searchLegend = document.getElementById("searchLegend"); // Used to show legend when search button is pressed

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

/*
  HELPER!
  Searches through the active tree while also recording
  every node that was visited.
 
  All three tree types follow BST ordering by value,
  so the same search-path logic works for BST, AVL and Treap.
 
  The function returns:
  foundNode    -> the node if the value exists, otherwise null
  visitedNodes -> every node checked during the search
 */
function searchWithPath(value) {
  let current = tree.root;

  const visitedNodes = [];

  while (current !== null) {
    // Record this node before deciding which direction to take.
    visitedNodes.push(current);

    if (value === current.value) {
      return {
        foundNode: current,
        visitedNodes: visitedNodes,
      };
    }

    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  // Reaching null means the value does not exist in the tree.
  return {
    foundNode: null,
    visitedNodes: visitedNodes,
  };
}

/*Function for the behaviour on the press of the searchValue button */
function searchValue() {
  const value = Number(valueInput.value);

  if (valueInput.value.trim() === "") {
    message.textContent = "Please enter a value.";

    return;
  }

  // The renderer can then use this object to highlight the found node
  const result = searchWithPath(value);

  // Show the colour legend once a search has been performed
  searchLegend.classList.remove("hidden");

  const foundNode = result.foundNode;
  const visitedNodes = result.visitedNodes;

  // Convert the visited node objects into their values so
  // the search path can also be shown as text
  const pathText = visitedNodes.map(node => node.value).join(" → ");

  if (foundNode !== null) {
    message.textContent = `Found ${value}. Search path: ${pathText}. ` + `Visited ${visitedNodes.length} node(s).`;

    /*
     * The renderer receives both:
     * - the final node, which will be green
     * - the complete search path, which will be yellow
     */
    renderer.render(tree, foundNode, visitedNodes);
  } else {
    message.textContent =
      `${value} was not found. Search path: ${pathText}. ` + `Visited ${visitedNodes.length} node(s).`;

    renderer.render(tree, null, visitedNodes);
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
  } else if (treeType.value === "treap") {
    tree = new Treap();
  } else {
    tree = new BinarySearchTree();
  }

  searchLegend.classList.add("hidden"); // hide search node legend when the tree type is changed

  renderer.render(tree);

  message.textContent = "Switched tree type";
}

// EXAMPLE TREE LOADING FUNCTIONALITY !
/*
  this loads an example passed from the theory page through the URL (automatically)
 
  Example URL: visualizer.html?tree=avl&values=30,10,20
 
  The part after ? contains query parameters:
  tree   -> tells us which tree implementation to create
  values -> tells us which values to insert
 */
function loadExampleFromURL() {
  /*
    window.location.search contains the query-string part
    of the current URL
   
    For the example above it would be:
    "?tree=avl&values=30,10,20"
   
    URLSearchParams is a built-in browser class that makes
    it easier to read individual parameters from that string
    Here we create an object that "understands" the query string
   */
  const params = new URLSearchParams(window.location.search); // window.location.search gives us the query-string part of the current page URL (?tree=avl&values=30,10,20)

  // Read the two parameters by their names
  const requestedTree = params.get("tree");
  const valuesParameter = params.get("values");

  /*
   If the page was opened normally rather than from one
   of the theory examples, these parameters will not exist
   
   Returning false tells the rest of the program that
   there was no example to load
   */
  if (requestedTree === null || valuesParameter === null) {
    return false;
  }
  // Here we create the requested type of tree

  if (requestedTree === "avl") {
    tree = new AVLTree();
  } else if (requestedTree === "treap") {
    tree = new Treap();
  } else if (requestedTree === "bst") {
    tree = new BinarySearchTree();
  } else {
    // Unknown tree type in the URL
    return false;
  }

  // Update the dropdown so it displays the tree type
  // that was loaded from the URL
  treeType.value = requestedTree;

  /*
  valuesParameter is currently one string: "30,10,20"
  split(",") separates it into: ["30", "10", "20"]
   */
  const values = valuesParameter
    .split(",")

    // Remove unnecessary spaces around each value
    .map(value => value.trim())

    // Ignore any empty entries.
    .filter(value => value !== "")

    // URL parameters are strings => convert them to numbers
    .map(value => Number(value))

    // Ignore anything that could not be converted to a number
    .filter(value => !Number.isNaN(value));

  /*
   Build a normal Binary Search Tree using the same values
   and the same insertion order as the AVL example
   
   This shows what the structure would look like if no
   balancing rotations were performed!
   */
  const beforeTree = new BinarySearchTree();

  for (const value of values) {
    beforeTree.insert(value);
  }

  /*
   Insert the same values into the selected tree.
   
   If the selected tree is AVL, its insertion logic will
   automatically update heights and perform rotations when needed.
   */
  for (const value of values) {
    tree.insert(value);
  }

  /*
   AVL examples are shown as a before/after comparison:
  
   beforeTree -> normal BST structure without balancing
   tree       -> AVL result after balancing
  
   remove("hidden") makes the comparison section visible.
   */
  if (requestedTree === "avl") {
    /*
     * classList gives JavaScript access to an element's CSS classes.
     *
     * The section initially has: class="example-comparison hidden"
     *
     * Removing "hidden" means display:none no longer applies, so the comparison becomes visible.
     */
    exampleComparison.classList.remove("hidden");

    beforeRenderer.render(beforeTree);
    afterRenderer.render(tree);
  }

  // Draw the selected tree in the normal interactive visualizer as well.
  renderer.render(tree);

  message.textContent = `Loaded example with ${values.length} values`;

  return true;
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
/*
  First check whether the visualizer was opened from
  an example on the theory page.
 
  If loadExampleFromURL() returns false, no example was
  supplied, so we simply draw the NORMAL empty tree.
 */
if (!loadExampleFromURL()) {
  renderer.render(tree);
}
