# Data Structure Explorer

Data Structure Explorer is a web application built to explore and visualize three binary-tree data structures:

- Binary Search Trees (BST)
- AVL Trees
- Treaps

The project implements these structures from scratch in JavaScript and combines them with an interactive SVG visualizer and a theory section containing explanations and worked examples.

The goal of the project is to make the differences between these structures easier to understand by allowing users to see how operations such as insertion, searching, and deletion affect the tree.

---

## Demo

Live version:
https://webdesignerioan.github.io/data-structure-visualizer/

# Features

## Interactive Visualizer

The visualizer allows users to:

- switch between BST, AVL Tree, and Treap;
- insert values;
- search for values;
- delete values;
- observe the resulting tree structure.

The visualization is implemented using SVG without external visualization libraries.

AVL nodes display:

- height;
- balance factor.

Treap nodes display:

- randomly generated priority.

---

## Search Visualization

The search operation also shows the path followed by the algorithm.

During a search:

- visited nodes are highlighted in yellow;
- the found node is highlighted in green;
- the complete search path is displayed.

Example:

```
Search for 40:

50 -> 30 -> 40
```

This helps demonstrate the BST ordering property and how the algorithm avoids searching irrelevant subtrees.

The search-path information is handled by the visualizer rather than stored inside the tree nodes, keeping the data structures independent from the user interface.

---

## Educational Section

The project includes a theory page explaining:

- BST ordering;
- AVL balancing;
- Treap priorities;
- insertion;
- searching;
- deletion;
- AVL rotations.

The theory page also contains interactive examples that open directly in the visualizer.

For AVL examples, the visualizer can show the difference between:

- the original BST created from the insertion order;
- the final balanced AVL tree.

---

# Data Structures

## Binary Search Tree

A Binary Search Tree follows:

```
left subtree < node < right subtree
```

The implementation supports:

- insertion;
- searching;
- deletion;
- duplicate prevention.

Deletion handles:

- leaf nodes;
- nodes with one child;
- nodes with two children;
- root deletion.

A normal BST does not perform balancing, meaning that certain insertion orders can create highly unbalanced trees.

---

## AVL Tree

An AVL tree extends the BST property by maintaining:

```
-1 <= balance factor <= 1
```

where:

```
balance factor = height(left subtree) - height(right subtree)
```

When an insertion or deletion causes an imbalance, rotations are performed to restore the AVL property.

Implemented cases:

- LL rotation;
- RR rotation;
- LR rotation;
- RL rotation.

The visualizer displays AVL-specific information such as height and balance factor.

---

## Treap

A Treap combines two properties:

BST ordering:

```
left.value < node.value < right.value
```

and max-heap ordering based on priority:

```
parent.priority >= child.priority
```

Each node receives a random priority when created.

Insertion first follows normal BST insertion, then rotations are used to restore the heap property.

During deletion, the target node is rotated downward until it can be removed while preserving the Treap properties.

Because priorities are random, the exact shape of a Treap may differ between runs.

---

## Architecture

The project separates the data structure implementations from the visualization layer.

```text
              HTML pages
                  |
               app.js
                  |
      -------------------------
      |           |           |
     BST         AVL       Treap
      |           |           |
      -------------------------
                  |
           TreeRenderer
                  |
                 SVG
```

The tree classes contain only the data structure logic, while `TreeRenderer` is responsible for displaying the structures using SVG.

## Tree Classes

The tree classes contain only the data structure logic:

- `BinarySearchTree.js`
- `AVLTree.js`
- `Treap.js`

They do not depend on HTML or SVG.

---

## TreeRenderer

`TreeRenderer` is responsible for:

- calculating node positions;
- drawing edges;
- drawing nodes;
- displaying AVL information;
- displaying Treap priorities;
- highlighting search results.

The same renderer works with all three structures because they share the same basic node structure:

- value;
- left child;
- right child.

---

## Application Logic

`app.js` connects the tree implementations with the webpage.

It handles:

- user interactions;
- tree switching;
- rendering;
- search-path tracking;
- loading examples from the theory page.

Examples are loaded using URL parameters:

```
visualizer.html?tree=avl&values=30,10,20
```

The visualizer reads the tree type and insertion order and creates the example automatically.

---

# Testing

The project uses Node.js' built-in test runner.

The tests verify both functionality and the properties that define each data structure.

## Binary Search Tree Tests

Tests include:

- insertion;
- searching;
- duplicate handling;
- deletion cases;
- root deletion.

---

## AVL Tree Tests

Tests include:

- left and right rotations;
- LL, RR, LR and RL balancing;
- insertion;
- searching;
- duplicate handling;
- deletion;
- maintaining balance after operations;
- stress tests.

AVL tests verify that the balance property is preserved.

---

## Treap Tests

Tests include:

- insertion;
- searching;
- duplicate handling;
- deletion;
- random insertions;
- property checking.

Treap tests verify:

- BST ordering;
- heap priority ordering.

Instead of checking only one expected shape, tests verify that the rules defining the data structure remain true.

---

# Running the Project

## Requirements

- Web browser
- Node.js (only required for running tests and local development tools)

## Running the Application

The project can be served locally using:

```bash
npx serve .
```

or:

```
scripts/runServe.cmd
```

## Running Tests

Using npm:

```bash
npm test
```

or:

```
scripts/runTests.cmd
```

---

# Technologies Used

- JavaScript
- HTML
- CSS
- SVG
- Node.js (testing and development tools)
- Git

The project uses vanilla JavaScript to keep the implementation of the algorithms and visualization logic explicit.

---

# Development Notes

One of the main goals of the project was keeping the data structures independent from the visualization.

For example, information such as whether a node was visited during a search is not stored inside the tree nodes. Instead, the visualizer receives this information temporarily when rendering.

Implementing AVL Trees and Treaps together also highlighted an important difference:

```
AVL:
rotations restore height balance

Treap:
rotations restore heap priority ordering
```

Although both structures use rotations, they solve different balancing problems.

---

# Author

**Ioan Schipor**

Computer Science student  
University College Dublin
