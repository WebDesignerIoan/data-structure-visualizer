export class TreeRenderer {
  constructor(svgElement) {
    // Store the SVG element where the tree will be drawn.
    this.svg = svgElement;

    // Radius used for each circular node.
    this.nodeRadius = 22;

    // Controls how far apart nodes are drawn.
    this.horizontalSpacing = 80;
    this.verticalSpacing = 90;

    // Extra space around the outside of the tree.
    this.margin = 40;
  }

  clear() {
    // Remove the previous tree drawing before redrawing.
    this.svg.innerHTML = "";
  }

  /*
   * Draws the current state of a tree on the SVG canvas.
   *
   * The method first calculates the position of each node using
   * an in-order traversal, than draws the connections between nodes
   * and, finally, draws the nodes themselves.
   *
   * highlightedNode is optional and is used to visually mark a
   * specific node (for example, after a successful search).
   */
  render(tree, highlightedNode = null) {
    // Start with a clean SVG canvas.
    this.clear();

    // If the tree is empty, there is nothing to draw.
    if (tree.root === null) {
      this.svg.setAttribute("viewBox", "0 0 600 400");
      return;
    }

    // Map each tree node to a pair of x/y coordinates.
    const positions = new Map();

    let index = 0;
    let maxDepth = 0;

    // Make the SVG wide enough to fit all nodes.
    const treeWidth = Math.max(600, this.margin * 2 + (tree.size - 1) * this.horizontalSpacing);

    const contentWidth = this.margin * 2 + (tree.size - 1) * this.horizontalSpacing;

    // Used to centre smaller trees inside the SVG.
    const horizontalOffset = (treeWidth - contentWidth) / 2;

    /*
     * Assign a position to every node.
     We use an in-order traversal:
     left subtree -> current node -> right subtree.
     
     This ofc places smaller values toward the left
     and larger values toward the right.
     */
    const assignPositions = (node, depth) => {
      if (node === null) {
        return;
      }

      // First position all nodes in the left subtree.
      assignPositions(node.left, depth + 1);

      // Horizontal position depends on the order in which
      // nodes are visited.
      const x = this.margin + horizontalOffset + index * this.horizontalSpacing;

      // Vertical position depends on the depth in the tree.
      const y = this.margin + depth * this.verticalSpacing;

      positions.set(node, {x, y});

      index++;

      // Keep track of the deepest node so the SVG height
      // can be calculated correctly.
      maxDepth = Math.max(maxDepth, depth);

      // Then position the right subtree.
      assignPositions(node.right, depth + 1);
    };

    assignPositions(tree.root, 0);

    // Calculate the required SVG height.
    const treeHeight = Math.max(400, this.margin * 2 + maxDepth * this.verticalSpacing + this.nodeRadius * 2);

    // viewBox defines the coordinate system used by the SVG.
    this.svg.setAttribute("viewBox", `0 0 ${treeWidth} ${treeHeight}`);

    /*
     Draw edges first.
     
     This means the lines appear behind the circular nodes
     instead of being drawn over them.
     */
    for (const [node, position] of positions) {
      if (node.left !== null) {
        this.drawEdge(position, positions.get(node.left));
      }

      if (node.right !== null) {
        this.drawEdge(position, positions.get(node.right));
      }
    }

    // Draw each node after the edges have been drawn.
    for (const [node, position] of positions) {
      this.drawNode(node.value, position.x, position.y, node === highlightedNode);
      /*
      TreeNode objects are compared by reference.
      Only the exact node returned by search() will be highlighted.
       */
    }
  }

  drawEdge(parent, child) {
    /*
     * SVG elements must be created using createElementNS
     */
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    // Start point of the line.
    line.setAttribute("x1", parent.x);
    line.setAttribute("y1", parent.y);

    // End point of the line.
    line.setAttribute("x2", child.x);
    line.setAttribute("y2", child.y);

    line.setAttribute("stroke", "#555");
    line.setAttribute("stroke-width", "2");

    // Add the line to the SVG.
    this.svg.appendChild(line);
  }

  drawNode(value, x, y, highlighted = false) {
    // we also added highlighted that shows if the node is the node searched for (will be drawn different)
    // Create the circular part of the node.
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", this.nodeRadius);

    circle.setAttribute("fill", highlighted ? "lightgreen" : "white"); // if the node is the searched for node
    circle.setAttribute("stroke", "#222");
    circle.setAttribute("stroke-width", "2");

    // Create the text displayed inside the node.
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);

    // Centre the text horizontally.
    text.setAttribute("text-anchor", "middle");

    text.textContent = value;

    // Add both the circle and its value to the SVG.
    this.svg.appendChild(circle);
    this.svg.appendChild(text);
  }
}
