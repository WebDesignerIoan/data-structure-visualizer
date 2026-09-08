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
    const inserted = this.insertNode(this.root, value);

    if (inserted !== null) {
      // if no duplicate found
      this.root = inserted;
      this.size++;
      return true;
    }

    return false;
  }

  insertNode(node, value) {
    // Normal BST insertion
    if (node === null) {
      return new AVLNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      // AVL tree does not allow duplicates
      return null;
    }

    // Update height after insertion
    this.updateHeight(node);

    // Check whether this node became unbalanced
    let balance = this.getBalanceFactor(node);

    // Rebalance if necessary
    return this.rebalance(node, value);
  }

  rebalance(node, value) {
    // value is used to determine what case (rr,rl etc.) we are in
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
      // LL
      if (value < node.left.value) {
        return this.rotateRight(node);
      }

      // LR
      if (value > node.left.value) {
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
      // RR
      if (value > node.right.value) {
        return this.rotateLeft(node);
      }

      // RL
      if (value < node.right.value) {
        node.right = this.rotateRight(node.right);

        return this.rotateLeft(node);
      }
    }

    // Already balanced
    return node;
  }
}
