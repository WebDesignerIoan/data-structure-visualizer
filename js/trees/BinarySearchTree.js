export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  search(value) {
    let current = this.root; // current node

    while (current !== null) {
      if (value === current.value) {
        // if found
        return current;
      } else if (value < current.value) {
        // if not found, we use an iterative approach to navigate the tree structure
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null; // value not found
  }

  insert(value) {
    // if the tree is empty, the new node becomes the root
    if (this.root === null) {
      this.root = new TreeNode(value);
      this.size++;
      return true;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) {
        // no duplicate values in this tree
        return false; // there already is a node with this value in the tree
      } else if (value < current.value) {
        // LEFT
        if (current.left === null) {
          // if there is space to insert (empty child position found)
          current.left = new TreeNode(value);
          this.size++;
          return true;
        }
        // if there is no space to insert we continue navigating to the left
        current = current.left;
      } else {
        // RIGHT
        if (current.right === null) {
          // if there is space to insert (empty child position found)
          current.right = new TreeNode(value);
          this.size++;
          return true;
        }
        // if there is no space to insert we continue navigating to the right
        current = current.right;
      }
    }
  }

  findMin(node) {
    // helper method (BST TREE => smallest is always at the maximum left)
    let current = node;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }

  delete(value) {
    let current = this.root;
    let parent = null;

    // 1. Find node and its parent
    while (current !== null) {
      if (value === current.value) {
        break; // node found
      } else if (value < current.value) {
        parent = current;
        current = current.left;
      } else {
        parent = current;
        current = current.right;
      }
    }

    // value not found
    if (current === null) {
      return false;
    }

    // 2. Two children case
    if (current.left !== null && current.right !== null) {
      // Find the successor: smallest node in the right subtree
      let successorParent = current;
      let successor = current.right;

      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
      }

      // Copy the successor's value into the node being deleted
      current.value = successor.value;

      // Remove the original successor.
      // The successor cannot have a left child, but may have a right child.
      if (successorParent.left === successor) {
        successorParent.left = successor.right;
      } else {
        successorParent.right = successor.right;
      }

      this.size--;
      return true;
    }

    // 3. Zero or one child case
    let child;

    if (current.left !== null) {
      child = current.left;
    } else {
      child = current.right;
    }

    // Current node is the root
    if (parent === null) {
      this.root = child;
    } else if (parent.left === current) {
      parent.left = child;
    } else {
      parent.right = child;
    }

    this.size--;
    return true;
  }
}
