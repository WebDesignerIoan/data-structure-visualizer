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
