import test from "node:test";
import assert from "node:assert/strict";

import {AVLTree, AVLNode} from "../js/trees/AVLTree.js"; // we need to import both!

// TESTS COVERING INDIVIDUAL ROTATIONS

test("performs right rotation correctly", () => {
  const tree = new AVLTree();

  let root = new AVLNode(30);

  root.left = new AVLNode(20);
  root.left.left = new AVLNode(10);

  // update heights before rotation
  tree.updateHeight(root.left);
  tree.updateHeight(root);

  root = tree.rotateRight(root);

  assert.equal(root.value, 20);

  assert.equal(root.left.value, 10);

  assert.equal(root.right.value, 30);

  // check heights
  assert.equal(root.left.height, 1);
  assert.equal(root.right.height, 1);
  assert.equal(root.height, 2);
});

test("performs left rotation correctly", () => {
  const tree = new AVLTree();

  let root = new AVLNode(10);

  root.right = new AVLNode(20);
  root.right.right = new AVLNode(30);

  // OBS: we update the heights from the lower levels towards the root (in this order, because they are based on the previous ones)
  tree.updateHeight(root.right);
  tree.updateHeight(root);

  root = tree.rotateLeft(root);

  assert.equal(root.value, 20);

  assert.equal(root.left.value, 10);

  assert.equal(root.right.value, 30);

  // check heights
  assert.equal(root.left.height, 1);
  assert.equal(root.right.height, 1);
  assert.equal(root.height, 2);
});

// TESTS COVERING MULTIPLE ROTATION CASES

test("performs LR rotation correctly", () => {
  const tree = new AVLTree();

  let root = new AVLNode(30);

  root.left = new AVLNode(10);
  root.left.right = new AVLNode(20);

  tree.updateHeight(root.left);
  tree.updateHeight(root);

  root.left = tree.rotateLeft(root.left);

  root = tree.rotateRight(root);

  assert.equal(root.value, 20);

  assert.equal(root.left.value, 10);

  assert.equal(root.right.value, 30);

  assert.equal(root.height, 2);
});

test("performs RL rotation correctly", () => {
  const tree = new AVLTree();

  let root = new AVLNode(10);

  root.right = new AVLNode(30);
  root.right.left = new AVLNode(20);

  tree.updateHeight(root.right);
  tree.updateHeight(root);

  root.right = tree.rotateRight(root.right);

  root = tree.rotateLeft(root);

  assert.equal(root.value, 20);

  assert.equal(root.left.value, 10);

  assert.equal(root.right.value, 30);

  assert.equal(root.height, 2);
});

// TESTS FOR THE AUTOMATIC BALANCING PROPERTY OF THE INSERT FUNCTION

test("balances LL case during insertion", () => {
  const tree = new AVLTree();

  tree.insert(30);
  tree.insert(20);
  tree.insert(10);

  assert.equal(tree.root.value, 20);

  assert.equal(tree.root.left.value, 10);

  assert.equal(tree.root.right.value, 30);

  assert.ok(tree.getBalanceFactor(tree.root) >= -1 && tree.getBalanceFactor(tree.root) <= 1);
});

test("balances RR case during insertion", () => {
  const tree = new AVLTree();

  tree.insert(10);
  tree.insert(20);
  tree.insert(30);

  assert.equal(tree.root.value, 20);

  assert.equal(tree.root.left.value, 10);

  assert.equal(tree.root.right.value, 30);

  assert.ok(tree.getBalanceFactor(tree.root) >= -1 && tree.getBalanceFactor(tree.root) <= 1);
});

test("balances LR case during insertion", () => {
  const tree = new AVLTree();

  tree.insert(30);
  tree.insert(10);
  tree.insert(20);

  assert.equal(tree.root.value, 20);

  assert.equal(tree.root.left.value, 10);

  assert.equal(tree.root.right.value, 30);

  assert.ok(tree.getBalanceFactor(tree.root) >= -1 && tree.getBalanceFactor(tree.root) <= 1);
});

test("balances RL case during insertion", () => {
  const tree = new AVLTree();

  tree.insert(10);
  tree.insert(30);
  tree.insert(20);

  assert.equal(tree.root.value, 20);

  assert.equal(tree.root.left.value, 10);

  assert.equal(tree.root.right.value, 30);

  assert.ok(tree.getBalanceFactor(tree.root) >= -1 && tree.getBalanceFactor(tree.root) <= 1);
});

// OTHER TESTS

test("does not insert duplicate values", () => {
  const tree = new AVLTree();

  assert.equal(tree.insert(50), true);

  assert.equal(tree.insert(50), false);

  assert.equal(tree.size, 1);
});

test("updates size after insertion", () => {
  const tree = new AVLTree();

  tree.insert(30);
  tree.insert(20);
  tree.insert(10);

  assert.equal(tree.size, 3);
});

// SEARCH TESTS FOR AVL

test("search finds existing AVL value", () => {
  const tree = new AVLTree();

  tree.insert(30);
  tree.insert(20);
  tree.insert(10);

  const node = tree.search(10);

  assert.equal(node.value, 10);
});

test("search returns the correct node object", () => {
  const tree = new AVLTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  const result = tree.search(30);

  assert.equal(result.value, 30);
  assert.equal(result, tree.root.left);
});

test("inserts and searches for values in AVL tree", () => {
  const tree = new AVLTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  assert.equal(tree.search(50).value, 50);
  assert.equal(tree.search(30).value, 30);
  assert.equal(tree.search(70).value, 70);
  assert.equal(tree.search(100), null);
});

// specific bug encountered test
test("keeps all nodes after large RR rebalance", () => {
  const tree = new AVLTree();

  [55, 33, 77, 11, 44, 66, 88, 87, 99, 100].forEach(value => tree.insert(value));

  assert.equal(tree.search(66).value, 66);
  assert.equal(tree.search(87).value, 87);
  assert.equal(tree.search(88).value, 88);
  assert.equal(tree.search(99).value, 99);
  assert.equal(tree.search(100).value, 100);
});

// BIG BUG FUNCTION AND TEST

/*
 * Recursively verifies that a tree satisfies the AVL balance condition.
 *
 * For every node in an AVL tree, the difference between the height of
 * the left subtree and the height of the right subtree must be at most 1.
 *
 * The function returns the height of the current subtree so that parent
 * nodes can also be checked recursively.
 */
function checkAVLBalance(node) {
  if (node === null) {
    return 0;
  }

  const leftHeight = checkAVLBalance(node.left);
  const rightHeight = checkAVLBalance(node.right);

  assert.ok(Math.abs(leftHeight - rightHeight) <= 1);

  return 1 + Math.max(leftHeight, rightHeight);
}

/*
 * Stress test for the AVL balancing property.
 *
 * Instead of checking only specific rotation examples (LL, RR, LR, RL),
 * this test inserts many random values and verifies that the AVL invariant
 * is maintained after a larger number of operations.
 *
 * This helps detect cases where multiple rotations happen in sequence
 * and where a small example-based test might not reveal a problem.
 */
test("maintains AVL balance after random insertions", () => {
  const tree = new AVLTree();

  const values = new Set();

  while (values.size < 100) {
    values.add(Math.floor(Math.random() * 1000));
  }

  for (const value of values) {
    tree.insert(value);
  }

  checkAVLBalance(tree.root);
});

/*
 * Stress test to ensure that insertions do not lose nodes.
 *
 * AVL rotations change the structure of the tree, but every inserted value
 * must remain reachable afterwards.
 *
 * This test is particularly useful for detecting incorrect pointer updates
 * during rotations, where an entire subtree could accidentally become
 * disconnected from the tree.
 */
test("handles random insertions without losing nodes", () => {
  const tree = new AVLTree();

  const values = new Set();

  while (values.size < 100) {
    values.add(Math.floor(Math.random() * 1000));
  }

  for (const value of values) {
    tree.insert(value);
  }

  for (const value of values) {
    assert.notEqual(tree.search(value), null);
  }
});

// DELETE functionality TESTS

test("deletes a leaf from AVL tree", () => {
  const tree = new AVLTree();

  tree.insert(20);
  tree.insert(10);
  tree.insert(30);

  assert.equal(tree.delete(10), true);

  assert.equal(tree.search(10), null);
  assert.equal(tree.size, 2);
});

test("deletes a node with one child from AVL tree", () => {
  const tree = new AVLTree();

  tree.insert(30);
  tree.insert(20);
  tree.insert(40);
  tree.insert(10);

  assert.equal(tree.delete(20), true);

  assert.equal(tree.search(20), null);
  assert.equal(tree.size, 3);
});

test("deletes a node with two children from AVL tree", () => {
  const tree = new AVLTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(60);
  tree.insert(80);

  assert.equal(tree.delete(70), true);

  assert.equal(tree.search(70), null);
  assert.equal(tree.size, 4);
});

test("returns false when deleting a missing AVL value", () => {
  const tree = new AVLTree();

  tree.insert(20);
  tree.insert(10);
  tree.insert(30);

  assert.equal(tree.delete(99), false);
  assert.equal(tree.size, 3);
});

// IMPORTANT
test("maintains AVL balance after deletions", () => {
  const tree = new AVLTree();

  const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];

  for (const value of values) {
    tree.insert(value);
  }

  tree.delete(80);
  tree.delete(70);
  tree.delete(60);

  checkAVLBalance(tree.root);

  assert.equal(tree.search(80), null);
  assert.equal(tree.search(70), null);
  assert.equal(tree.search(60), null);
  assert.equal(tree.size, values.length - 3);
});
