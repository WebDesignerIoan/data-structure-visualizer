import test from "node:test";
import assert from "node:assert/strict";

import {BinarySearchTree} from "../js/trees/BinarySearchTree.js";

test("inserts and searches for values", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  assert.equal(tree.search(50).value, 50);
  assert.equal(tree.search(30).value, 30);
  assert.equal(tree.search(70).value, 70);
  assert.equal(tree.search(100), null);
});

test("does not insert duplicate values", () => {
  const tree = new BinarySearchTree();

  assert.equal(tree.insert(50), true);
  assert.equal(tree.insert(50), false);
  assert.equal(tree.size, 1);
});

test("deletes a leaf node", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  assert.equal(tree.delete(30), true);
  assert.equal(tree.search(30), null);
  assert.equal(tree.size, 2);
});

test("deletes a node with one child", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(20);

  assert.equal(tree.delete(30), true);

  assert.equal(tree.search(30), null);
  assert.equal(tree.root.left.value, 20);
  assert.equal(tree.size, 2);
});

test("deletes a node with two children", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(60);
  tree.insert(80);

  assert.equal(tree.delete(50), true);

  assert.equal(tree.search(50), null);
  assert.equal(tree.root.value, 60);
  assert.equal(tree.size, 4);
});

test("deletes the root when it has one child", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);

  assert.equal(tree.delete(50), true);

  assert.equal(tree.root.value, 30);
  assert.equal(tree.size, 1);
});

test("returns false when deleting a value that does not exist", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);

  assert.equal(tree.delete(99), false);
  assert.equal(tree.size, 1);
});

test("search returns the correct node object", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);

  const result = tree.search(30);

  assert.equal(result.value, 30);
  assert.equal(result, tree.root.left);
});

test("inserts nodes in the correct BST positions", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(20);
  tree.insert(40);

  assert.equal(tree.root.value, 50);

  assert.equal(tree.root.left.value, 30);
  assert.equal(tree.root.right.value, 70);

  assert.equal(tree.root.left.left.value, 20);
  assert.equal(tree.root.left.right.value, 40);
});

test("deletes root with two children", () => {
  const tree = new BinarySearchTree();

  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(60);
  tree.insert(80);

  tree.delete(50);

  assert.equal(tree.root.value, 60);
  assert.equal(tree.size, 4);
});
