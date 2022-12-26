var RED = true;
var BLACK = false;
var RedBlackTreeNode = /** @class */ (function () {
    function RedBlackTreeNode(key, val, parent) {
        this.key = key;
        this.val = val;
        this.left = null;
        this.right = null;
        this.parent = parent;
        this.color = RED;
    }
    RedBlackTreeNode.prototype.isLeftChild = function () {
        return this.parent !== null && this.parent.left === this;
    };
    RedBlackTreeNode.prototype.isRightChild = function () {
        return this.parent !== null && this.parent.right === this;
    };
    RedBlackTreeNode.prototype.sibling = function () {
        var _a;
        return this === ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.left)
            ? this.parent.right
            : this.parent.left;
    };
    RedBlackTreeNode.prototype.getPresuccessor = function () {
        var node = this.left;
        if (!node) {
            return null;
        }
        while (node.right) {
            node = node.right;
        }
        return node;
    };
    return RedBlackTreeNode;
}());
var RedBlackTree = /** @class */ (function () {
    function RedBlackTree() {
        this.root = null;
        this._size = 0;
    }
    RedBlackTree.prototype.size = function () {
        return this._size;
    };
    RedBlackTree.prototype.get = function (key) {
        if (this.root == null) {
            return null;
        }
        var cur = this.root;
        while (cur != null) {
            if (cur.key > key) {
                cur = cur.left;
            }
            else if (cur.key < key) {
                cur = cur.right;
            }
            else {
                return cur;
            }
        }
        return null;
    };
    RedBlackTree.prototype.put = function (key, val) {
        if (this.root == null) {
            this.root = new RedBlackTreeNode(key, val, null);
            this._size++;
            this._afterAddNode(this.root);
            return;
        }
        var parent = this.root;
        var cur = this.root;
        // 找到当前节点要挂载的parent
        while (cur != null) {
            parent = cur;
            if (cur.key > key) {
                cur = cur.left;
            }
            else if (cur.key < key) {
                cur = cur.right;
            }
            else {
                // 直接更新val
                cur.val = val;
                return;
            }
        }
        var newNode = new RedBlackTreeNode(key, val, parent);
        // 父节点上添加新节点
        if (parent.key > key) {
            parent.left = newNode;
        }
        else {
            parent.right = newNode;
        }
        this._afterAddNode(newNode);
        this._size++;
    };
    RedBlackTree.prototype["delete"] = function (key) {
        var node = this.get(key);
        return node && this._delete(node);
    };
    /*
     * @param node: 待删除节点
     */
    RedBlackTree.prototype._delete = function (node) {
        if (node == null) {
            return null;
        }
        this._size--;
        // 度为2，找到前驱节点，覆盖要被删除的节点
        // 这样要被删除的节点就变为度 = 1 或者 = 0
        if (node.left && node.right) {
            var presuccessor = node.getPresuccessor();
            // 覆盖
            node.val = presuccessor.val;
            node.key = presuccessor.key;
            // 将删除前驱节点
            node = presuccessor;
        }
        var child = node.left ? node.left : node.right;
        if (child !== null) {
            // node是度为1的节点
            // 更改parent指针
            child.parent = node.parent;
            if (node.parent === null) {
                // node 是根节点，但不是叶子节点
                this.root = child;
            }
            else if (node == node.parent.left) {
                node.parent.left = child;
            }
            else if (node === node.parent.right) {
                node.parent.right = child;
            }
            this._afterDelete(node, child);
        }
        else if (node.parent === null) {
            // node是度为0的叶子节点，也是根节点
            this.root = null;
            this._afterDelete(node, null);
        }
        else {
            // node是度为0的叶子节点，不是根节点
            if (node == node.parent.left) {
                node.parent.left = null;
            }
            else if (node === node.parent.right) {
                node.parent.right = null;
            }
            this._afterDelete(node, null);
        }
    };
    RedBlackTree.prototype._isBlack = function (node) {
        return node === null || node.color === BLACK;
    };
    RedBlackTree.prototype._isRed = function (node) {
        return node && node.color === RED;
    };
    RedBlackTree.prototype._black = function (node) {
        if (node)
            node.color = BLACK;
        return node;
    };
    RedBlackTree.prototype._red = function (node) {
        if (node)
            node.color = RED;
        return node;
    };
    /*
     * 左旋是 parent 位于 grand 右侧， parent需要成为新的最高级节点
     * grand 的右侧是 parent ，parent.left的位置将会变成grand
     * 那么对应就需要取 parent.left的位置的child 作为 grand.right
     *
     **        grand                  parent
     *              \                /
     *             parent   ->     grand
     *             /                 \
     *           child               child
     */
    RedBlackTree.prototype._rotateLeft = function (grand) {
        var parent = grand.right;
        var child = parent.left;
        grand.right = child;
        parent.left = grand;
        this._afterRotate(grand, parent, child);
    };
    /*
     * 右旋是 parent 位于 grand 左侧， parent需要成为新的最高级节点
     *
     *         grand              parent
     *         /                       \
     *     parent           ->         grand
     *        |                        /
     *        child                   child
     */
    RedBlackTree.prototype._rotateRight = function (grand) {
        var parent = grand.left;
        var child = parent.right;
        grand.left = child;
        parent.right = grand;
        this._afterRotate(grand, parent, child);
    };
    RedBlackTree.prototype._afterRotate = function (grand, parent, child) {
        // update grand's parent's child
        if (grand.isLeftChild()) {
            grand.parent.left = parent;
        }
        else if (grand.isRightChild()) {
            grand.parent.right = parent;
        }
        else {
            // grand == this.root
            this.root = parent;
        }
        // 1. parent 继承 grand的 parent
        // 2. parent 成为 grand parent
        parent.parent = grand.parent;
        grand.parent = parent;
        // child possibly will be null
        if (child !== null) {
            child.parent = grand;
        }
    };
    // @param node 添加的新节点
    RedBlackTree.prototype._afterAddNode = function (node) {
        var parent = node.parent;
        // 添加的是根节点(根节点一定是黑色）
        // 或者 上溢到根节点
        if (parent === null) {
            this._black(node);
            return;
        }
        // 父节点是黑色， 直接返回
        if (this._isBlack(parent)) {
            return;
        }
        // 接下来是父节点为红色节点的情况
        // 叔叔节点
        var uncle = parent.sibling();
        // 祖父节点
        var grandparent = parent.parent;
        // 叔叔节点是红色
        if (this._isRed(uncle)) {
            this._black(parent);
            this._black(uncle);
            // 染红组父节点，
            // 在B树中相当于向上添加的新节点
            // 在红黑树中可能会产生双红相连的现象。
            this._red(grandparent);
            this._afterAddNode(grandparent);
            return;
        }
        // 叔叔节点不是红色
        if (parent.isLeftChild()) {
            // L
            if (node.isLeftChild()) {
                // LL
                this._black(parent);
                this._red(grandparent);
                this._rotateRight(grandparent);
            }
            else {
                // LR
                this._red(grandparent);
                this._black(node);
                this._rotateLeft(parent);
                this._rotateRight(grandparent);
            }
        }
        else {
            // R
            if (node.isLeftChild()) {
                // RL
                this._red(grandparent);
                this._black(node);
                this._rotateRight(parent);
                this._rotateLeft(grandparent);
            }
            else {
                // RR
                this._black(parent);
                this._red(grandparent);
                this._rotateLeft(grandparent);
            }
        }
    };
    RedBlackTree.prototype._afterDelete = function (deleteNode, replacement) {
        // 删除的节点是红色
        if (this._isRed(deleteNode)) {
            return;
        }
        // 删除的节点是黑色
        // 用于取代的节点是红色
        if (this._isRed(replacement)) {
            this._black(replacement);
            return;
        }
        var parent = deleteNode.parent;
        // 删除的是根节点（边界情况）
        if (parent == null) {
            return;
        }
        // 删除的是黑色叶子节点
        // 两种情况【这里要严谨！】
        // 1. parent -(left)-> child -> null =>  parent -(left)-> null 的删除方式
        // 2. parent 下溢进入这里的情况，并没有真正删除
        // isLeftChild => parent.left !== null && this === parent.left
        var left = parent.left == null || deleteNode.isLeftChild();
        var sibling = left ? parent.right : parent.left;
        if (left) {
            // 被删除节点位于左侧，兄弟节点位于右侧
            if (this._isRed(sibling)) {
                // 兄弟节点为红色，转成黑色
                this._black(sibling);
                this._red(parent);
                this._rotateLeft(parent);
                // 旋转后更换兄弟
                sibling = parent.right;
            }
            // 处理兄弟节点为黑色的情况
            if (this._isBlack(sibling.left) && this._isBlack(sibling.right)) {
                var parentIsBlack = this._isBlack(parent);
                this._black(parent);
                this._red(sibling);
                // 原来的节点被删除，父节点成为新的黑色叶子节点，也会发生下溢
                if (parentIsBlack) {
                    this._afterDelete(parent, null);
                }
            }
            else {
                if (this._isBlack(sibling.right)) {
                    this._rotateRight(sibling);
                    sibling = parent.right;
                }
                // 借上去的兄弟节点成为了中心节点，那么要继承parent的颜色
                sibling.color = parent.color;
                this._black(sibling.right);
                this._black(parent);
                this._rotateLeft(parent);
            }
        }
        else {
            // 被删除节点位于右侧，兄弟节点位于左侧
            if (this._isRed(sibling)) {
                // 兄弟节点为红色，转成黑色
                this._black(sibling);
                this._red(parent);
                this._rotateRight(parent);
                // 旋转后更换兄弟
                sibling = parent.left;
            }
            // 处理兄弟节点为黑色的情况
            if (this._isBlack(sibling.left) && this._isBlack(sibling.right)) {
                // 兄弟节点没有一个红色子节点，兄弟节点染红，父节点需要染黑（向下合并）
                var parentIsBlack = this._isBlack(parent);
                this._black(parent);
                this._red(sibling);
                // 原来的节点被删除，父节点成为新的黑色叶子节点，也会发生下溢
                if (parentIsBlack) {
                    this._afterDelete(parent, null);
                }
            }
            else {
                // 「处理兄弟节点为黑色，并且至少有一个红色子节点的情况」
                // 兄弟节点至少有一个红色子节点，向兄弟节点借元素
                if (this._isBlack(sibling.left)) {
                    // 兄弟节点左边是黑色，先旋转兄弟节点
                    this._rotateLeft(sibling);
                    // 需要更新新的兄弟节点
                    sibling = parent.left;
                }
                // 借上去的兄弟节点成为了中心节点，那么要继承parent的颜色
                sibling.color = parent.color;
                this._black(sibling.left);
                this._black(parent);
                // 右旋后就会让被删除的节点借到parent节点
                this._rotateRight(parent);
            }
        }
    };
    return RedBlackTree;
}());
