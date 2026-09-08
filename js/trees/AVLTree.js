export class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // Height of this subtree. - in this case only one node so 1
  }
}

// AVL tree is a BST tree (already having rule: left<node<right) AND having the rule (-1 <= rule balance factor <= 1)
/*
 * AVL imbalance cases:
 *
 * Left-heavy subtree (balance > 1)
 *
 *        node
 *        /
 *       x
 *      /
 *     y
 *
 *     LL case:
 *     -> Single right rotation
 *
 *
 *        node
 *        /
 *       x
 *        \
 *         y
 *
 *     LR case:
 *     -> Left rotation on child
 *     -> Right rotation on node
 *
 *
 * Right-heavy subtree (balance < -1)
 *
 *     node
 *        \
 *         x
 *          \
 *           y
 *
 *     RR case:
 *     -> Single left rotation
 *
 *
 *     node
 *        \
 *         x
 *        /
 *       y
 *
 *     RL case:
 *     -> Right rotation on child
 *     -> Left rotation on node
 */
export class AVLTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  /*
   * Returns the height of a subtree.
   *
   * An empty subtree has height 0, while a leaf node has height 1.
   * This convention makes height calculations easier throughout the AVL tree.
   */
  getHeight(node) {
    if (node === null) {
      return 0;
    }

    return node.height;
  }

  getBalanceFactor(node) {
    if (node === null) {
      return 0;
    }

    return this.getHeight(node.left) - this.getHeight(node.right); // if result is in the interval [-1,1] tree is balanced
  }

  /*
   * Updates the height of a node based on the heights of its children.
   *
   * This method only updates one node. During AVL insertion/deletion,
   * it is called while returning back up the tree after the recursive
   * modification of a subtree. This ensures that all ancestors have
   * their heights updated before checking for imbalances.
   */
  updateHeight(node) {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  rotateRight(y) {
    /*
     * Right rotation:
     *
     * Before:
     *
     *        y
     *       /
     *      x
     *       \
     *        T2
     *
     * After:
     *
     *        x
     *       / \
     *     T1   y
     *         /
     *        T2
     *
     * The rotation keeps the BST ordering while reducing
     * the height imbalance on the left side.
     */

    if (y.left === null) {
      // safety check
      return y;
    }

    let x = y.left;
    let T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights from bottom to top
    this.updateHeight(y);
    this.updateHeight(x);

    // Return new root of this subtree !
    return x;
  }

  rotateLeft(x) {
    /*
     * Left rotation:
     *
     * Before:
     *
     *      x
     *       \
     *        y
     *       /
     *      T2
     *
     * After:
     *
     *        y
     *       / \
     *      x   T3
     *       \
     *        T2
     *
     * The rotation keeps the BST ordering while reducing
     * the height imbalance on the right side.
     */
    if (x.right === null) {
      return x;
    }

    let y = x.right;
    let T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights from bottom to top
    this.updateHeight(x);
    this.updateHeight(y);

    // Return new root of this subtree !
    return y;
  }

  insert(value) {
    const result = this.insertNode(this.root, value);

    if (result.inserted) {
      this.root = result.node;
      this.size++;
      return true;
    }

    return false;
  }

  insertNode(node, value) {
    // Empty position found: create new node
    if (node === null) {
      return {
        node: new AVLNode(value),
        inserted: true,
      };
    }

    if (value < node.value) {
      const result = this.insertNode(node.left, value);

      node.left = result.node;

      // duplicate found below
      if (!result.inserted) {
        return result;
      }
    } else if (value > node.value) {
      const result = this.insertNode(node.right, value);

      node.right = result.node;

      // duplicate found below
      if (!result.inserted) {
        return result;
      }
    } else {
      // Duplicate value
      return {
        node: node,
        inserted: false,
      };
    }

    // Update height before checking balance
    this.updateHeight(node);

    // Check balance factor and perform rotation if needed
    const newRoot = this.rebalance(node);

    return {
      node: newRoot,
      inserted: true,
    };
  }

  rebalance(node) {
    // The balance factors of the node and its children determine the rotation case.
    let balance = this.getBalanceFactor(node);

    /*
     * Left-heavy cases
     *
     * LL:
     *        node
     *        /
     *       x
     *      /
     *     y
     *
     * LR:
     *        node
     *        /
     *       x
     *        \
     *         y
     *
     * Obs: y <-> value
     */

    if (balance > 1) {
      // LL case:
      // left subtree is also left-heavy or balanced
      if (this.getBalanceFactor(node.left) >= 0) {
        return this.rotateRight(node);
      }

      // LR case:
      // left subtree is right-heavy
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left);

        return this.rotateRight(node);
      }
    }

    /*
     * Right-heavy cases
     *
     * RR:
     *     node
     *        \
     *         x
     *          \
     *           y
     *
     * RL:
     *     node
     *        \
     *         x
     *        /
     *       y
     *
     * Obs: y <-> value
     */

    if (balance < -1) {
      // RR case:
      // right subtree is also right-heavy or balanced
      if (this.getBalanceFactor(node.right) <= 0) {
        return this.rotateLeft(node);
      }

      // RL case:
      // right subtree is left-heavy
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right);

        return this.rotateLeft(node);
      }
    }

    // Already balanced
    return node;
  }

  /*
   * Searches for a value in the AVL tree.
   
   AVL trees keep the same ordering property as binary search trees,
   so searching works exactly the same way as in a normal BST.
   The balancing rotations do not affect the search logic.
   */
  search(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.value) {
        return current;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }
}
