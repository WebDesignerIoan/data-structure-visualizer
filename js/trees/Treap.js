export class TreapNode {
  constructor(value) {
    this.value = value;

    /*
     * Priority determines the heap ordering.
     *
     * We use a max-heap:
     * parent priority >= child priority
     *
     * Random priorities give the tree its balancing behaviour.
     */
    this.priority = Math.floor(Math.random() * 100);

    this.left = null;
    this.right = null;
  }
}

export class Treap {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  rotateRight(y) {
    /*
     * Right rotation:
     *
     * Used when the left child has a higher priority
     * than the current node and violates the heap property.
     *
     * Before:
     *
     *          y
     *         / \
     *        x   T3
     *       / \
     *      T1  T2
     *
     *
     * After:
     *
     *          x
     *         / \
     *        T1  y
     *           / \
     *          T2  T3
     *
     *
     * The rotation:
     * - keeps the BST ordering property
     * - moves the higher-priority node upwards
     * - restores the heap property
     */

    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    return x;
  }

  rotateLeft(x) {
    /*
     * Left rotation:
     *
     * Used when the right child has a higher priority
     * than the current node and violates the heap property.
     *
     * Before:
     *
     *        x
     *       / \
     *      T1  y
     *         / \
     *        T2  T3
     *
     *
     * After:
     *
     *          y
     *         / \
     *        x   T3
     *       / \
     *      T1  T2
     *
     *
     * The rotation:
     * - keeps the BST ordering property
     * - moves the higher-priority node upwards
     * - restores the heap property
     */

    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    return y;
  }

  insert(value) {
    const result = this.insertNode(this.root, value);

    // Rotations may change the root of the tree.
    this.root = result.node;

    if (result.inserted) {
      this.size++;
      return true;
    }

    return false;
  }

  insertNode(node, value) {
    // Empty position found - create a new Treap node.
    if (node === null) {
      return {
        node: new TreapNode(value),
        inserted: true,
      };
    }

    // Normal BST insertion.
    if (value < node.value) {
      const result = this.insertNode(node.left, value);

      // Keep the returned subtree connected to this node.
      node.left = result.node;

      /*
       * If the value already existed deeper in the tree,
       * no structural change is needed.
       */
      if (!result.inserted) {
        return {
          node: node,
          inserted: false,
        };
      }

      /*
       * Restore the max-heap property.
       *
       * If the left child has a higher priority than its
       * parent, move it upwards using a right rotation.
       */
      if (node.left.priority > node.priority) {
        node = this.rotateRight(node);
      }
    } else if (value > node.value) {
      const result = this.insertNode(node.right, value);

      // Keep the returned subtree connected to this node.
      node.right = result.node;

      if (!result.inserted) {
        return {
          node: node,
          inserted: false,
        };
      }

      /*
       * If the right child has a higher priority than its
       * parent, move it upwards using a left rotation.
       */
      if (node.right.priority > node.priority) {
        node = this.rotateLeft(node);
      }
    } else {
      // Treaps do not allow duplicate values.
      return {
        node: node,
        inserted: false,
      };
      /*
       * Important:
       * A duplicate must return the existing node, not null.
       *
       * Returning null would be assigned back to the parent as
       * node.left or node.right, which could accidentally disconnect
       * an existing subtree.
       */
    }

    return {
      node: node,
      inserted: true,
    };
  }
  search(value) {
    let current = this.root;

    /*
     * A Treap still follows the Binary Search Tree ordering rule,
     * so searching works exactly like in a normal BST.
     */
    while (current !== null) {
      if (value === current.value) {
        return current;
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  /*
   * Treap deletion:
   *
   * Searching for the value works exactly like in a BST.
   *
   * Once the node is found:
   * - if it has 0 or 1 child, it can be removed directly;
   * - if it has 2 children, we cannot simply remove it because
   *   that could break the heap-priority property.
   *
   * Instead, we rotate the node downward.
   * The child with the higher priority is promoted, preserving
   * the max-heap property.
   *
   * We keep rotating the target node downward until it has
   * at most one child, then remove it normally.
   */

  // We delete (initiate the process) and also check (and validate) if we deleted anything
  delete(value) {
    const result = this.deleteNode(this.root, value);

    this.root = result.node;

    if (result.deleted) {
      this.size--;
      return true;
    }

    return false;
  }

  /*
    0 children → remove node
    1 child    → promote that child directly
    2 children → rotate higher-priority child up, then continue deleting target lower down 
  */
  deleteNode(node, value) {
    // Value was not found.
    if (node === null) {
      return {
        node: null,
        deleted: false,
      };
    }

    // Search using the normal BST ordering property.
    if (value < node.value) {
      const result = this.deleteNode(node.left, value); // recursive call (left side)

      node.left = result.node;
      // if we get to this point, the recursive we havent found the node through the recursive calls, so we "abort"
      return {
        node: node,
        deleted: result.deleted,
      };
    } else if (value > node.value) {
      const result = this.deleteNode(node.right, value); // recursive call (right side)

      node.right = result.node;
      // if we get to this point, the recursive we havent found the node through the recursive calls, so we "abort"
      return {
        node: node,
        deleted: result.deleted,
      };
    }

    /*
     * The node to delete has been found.
     *
     * If it has no left child, its right child can replace it.
     */
    if (node.left === null) {
      return {
        node: node.right,
        deleted: true,
      };
    }

    /*
     * If it has no right child, its left child can replace it.
     */
    if (node.right === null) {
      return {
        node: node.left,
        deleted: true,
      };
    }

    /*
     * The node has two children.
     *
     * Promote the child with the higher priority so the
     * max-heap property remains valid, while moving the
     * node we want to delete one level further down.
     */
    if (node.left.priority >= node.right.priority) {
      node = this.rotateRight(node);

      const result = this.deleteNode(node.right, value); // recursive call after we rotate node (call is on it also)

      node.right = result.node;
    } else {
      node = this.rotateLeft(node);

      const result = this.deleteNode(node.left, value); // recursive call after we rotate node (same)

      node.left = result.node;
    }

    return {
      node: node,
      deleted: true,
    };
  }
}
