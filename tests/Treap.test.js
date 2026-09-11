import test from "node:test";
import assert from "node:assert/strict";

import {Treap, TreapNode} from "../js/trees/Treap.js";

/*
 Recursively checks that the Treap still satisfies
 the Binary Search Tree ordering property.
 
 Every node must stay within the valid min/max range
 inherited from its ancestors.
 */
function checkBSTProperty(node, min = -Infinity, max = Infinity) {
  if (node === null) {
    return true;
  }

  if (node.value <= min || node.value >= max) {
    return false;
  }

  return checkBSTProperty(node.left, min, node.value) && checkBSTProperty(node.right, node.value, max);
}

/*
 Recursively checks the Treap's max-heap priority property.

 Every parent must have a priority greater than or equal
 to the priorities of its children.
 */
function checkHeapProperty(node) {
  if (node === null) {
    return true;
  }

  if (node.left !== null && node.left.priority > node.priority) {
    return false;
  }

  if (node.right !== null && node.right.priority > node.priority) {
    return false;
  }

  return checkHeapProperty(node.left) && checkHeapProperty(node.right);
}

// TESTS

test("creates a Treap node correctly", () => {
  const node = new TreapNode(10);

  assert.equal(node.value, 10);
  assert.ok(node.priority >= 0);
  assert.ok(node.priority < 100);

  assert.equal(node.left, null);
  assert.equal(node.right, null);
});

test("creates an empty Treap", () => {
  const tree = new Treap();

  assert.equal(tree.root, null);
  assert.equal(tree.size, 0);
});

test("inserts values into Treap", () => {
  const tree = new Treap();

  assert.equal(tree.insert(50), true);
  assert.equal(tree.insert(30), true);
  assert.equal(tree.insert(70), true);

  assert.equal(tree.size, 3);
});

test("maintains BST and heap properties after insertion", () => {
  const tree = new Treap();

  const values = [50, 20, 70, 10, 30, 60, 80];

  for (const value of values) {
    tree.insert(value);
  }

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

test("does not insert duplicate values", () => {
  const tree = new Treap();

  assert.equal(tree.insert(50), true);
  assert.equal(tree.insert(50), false);

  assert.equal(tree.size, 1);
});

/*
 * Shuffle the insertion order.
 *
 * Treaps are randomized structures, so inserting values
 * in a random order helps test different possible tree shapes.
 *
 * Array.sort() uses a comparison function that receives two
 * elements (a and b) and decides their relative order:
 *
 *   negative value -> a comes before b
 *   positive value -> b comes before a
 *   zero           -> keep their current order
 *
 * Here we intentionally ignore the actual values of a and b.
 * Instead, Math.random() generates a random number between 0 and 1.
 *
 * Subtracting 0.5 gives a value between -0.5 and 0.5:
 *
 *   negative -> place a before b
 *   positive -> place b before a
 *
 * This creates a simple random ordering of the array,
 * preventing the stress test from always inserting values
 * in sorted order.
 */
test("maintains properties after random insertions", () => {
  const tree = new Treap();

  const values = [];

  // Create values 0-99
  for (let i = 0; i < 100; i++) {
    values.push(i);
  }

  // Shuffle insertion order !!!
  values.sort((a, b) => Math.random() - 0.5); // OBS: values.sort "sorts" values in pairs, and in our implementation the result is successive shuffles

  for (const value of values) {
    tree.insert(value);
  }

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
  assert.equal(tree.size, 100);
});

test("does not insert duplicate values", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(20);

  assert.equal(tree.insert(30), false);

  assert.equal(tree.size, 4);
  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

test("search finds an existing value", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  const node = tree.search(30);

  assert.notEqual(node, null);
  assert.equal(node.value, 30);
});

test("search returns the correct node object", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  const node = tree.search(70);

  assert.equal(node, tree.search(70));
});

// DELETION functionality tests

test("deletes a leaf from Treap", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  assert.equal(tree.delete(30), true);

  assert.equal(tree.search(30), null);
  assert.equal(tree.size, 2);

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

test("deletes a node with one child from Treap", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);

  const rootValue = tree.root.value;

  assert.equal(tree.delete(rootValue), true);

  assert.equal(tree.size, 1);
  assert.equal(tree.search(rootValue), null);

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

// IMPORTANT TEST
test("deletes a node with two children from Treap", () => {
  const tree = new Treap();

  const values = [50, 30, 70, 20, 40, 60, 80];

  for (const value of values) {
    tree.insert(value);
  }

  let target = null;

  // Find any node that currently has two children - FUNCTION to help
  function findNodeWithTwoChildren(node) {
    if (node === null) {
      return null;
    }

    if (node.left !== null && node.right !== null) {
      return node;
    }

    return findNodeWithTwoChildren(node.left) || findNodeWithTwoChildren(node.right); // recursive calls
  }

  target = findNodeWithTwoChildren(tree.root); // we start from the root and look for node with two children

  assert.notEqual(target, null); // we check if there actually exists a node like this

  const valueToDelete = target.value;

  assert.equal(tree.delete(valueToDelete), true);

  assert.equal(tree.search(valueToDelete), null);
  assert.equal(tree.size, values.length - 1);

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

test("returns false when deleting a missing Treap value", () => {
  const tree = new Treap();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  assert.equal(tree.delete(99), false);

  assert.equal(tree.size, 3);
  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});

// VERY IMPORTANT TEST!
test("maintains Treap properties after multiple deletions", () => {
  const tree = new Treap();

  const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];

  for (const value of values) {
    tree.insert(value);
  }

  tree.delete(20);
  tree.delete(70);
  tree.delete(50);

  assert.equal(tree.search(20), null);
  assert.equal(tree.search(70), null);
  assert.equal(tree.search(50), null);

  assert.equal(tree.size, values.length - 3);

  assert.equal(checkBSTProperty(tree.root), true);
  assert.equal(checkHeapProperty(tree.root), true);
});
