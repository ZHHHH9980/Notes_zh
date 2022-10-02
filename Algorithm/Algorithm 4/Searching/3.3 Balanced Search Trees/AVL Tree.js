var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TreeNode = /** @class */ (function () {
    function TreeNode(key, val) {
        this.key = key;
        this.val = val;
        this.left = null;
        this.right = null;
    }
    return TreeNode;
}());
var BST = /** @class */ (function () {
    function BST() {
        this.root = null;
        this._size = 0;
    }
    BST.prototype.size = function () {
        return this._size;
    };
    BST.prototype._compare = function (a, b) {
        return a - b;
    };
    BST.prototype.get = function (key) {
        if (this.root == null) {
            return null;
        }
        var cur = this.root;
        while (cur != null) {
            var cmp = this._compare(cur.key, key);
            if (cmp > 0) {
                cur = cur.left;
            }
            else if (cmp < 0) {
                cur = cur.right;
            }
            else {
                return cur;
            }
        }
        return null;
    };
    BST.prototype.put = function (key, val) {
        if (this.root == null) {
            this.root = new TreeNode(key, val);
            this._size++;
            return;
        }
        var parent = this.root;
        var cur = this.root;
        while (cur != null) {
            var cmp_1 = this._compare(cur.key, key);
            parent = cur;
            if (cmp_1 > 0) {
                cur = cur.left;
            }
            else if (cmp_1 < 0) {
                cur = cur.right;
            }
            else {
                // 直接更新val
                cur.val = val;
                return;
            }
        }
        var cmp = this._compare(parent.key, key);
        // 父节点上添加
        if (cmp > 0) {
            parent.left = new TreeNode(key, val);
        }
        else {
            parent.right = new TreeNode(key, val);
        }
        this._size++;
    };
    return BST;
}());
function generateBST() {
    var unique = {};
    var arr = [];
    for (var i = 0; i < 100; i++) {
        var val = Math.round(Math.random() * 100);
        if (!unique[val]) {
            unique[val] = true;
            arr.push(val);
        }
    }
    var bst = new BST();
    for (var i = 0; i < arr.length; i++) {
        bst.put(arr[i], i);
    }
    return bst;
}
// AVL TREE
var AVLTreeNode = /** @class */ (function (_super) {
    __extends(AVLTreeNode, _super);
    function AVLTreeNode(key, val, parent) {
        var _this = _super.call(this, key, val) || this;
        _this.parent = parent;
        _this.height = 1;
        return _this;
    }
    AVLTreeNode.prototype.isLeftChild = function () {
        return this.parent !== null && this.parent.left === this;
    };
    AVLTreeNode.prototype.isRightChild = function () {
        return this.parent !== null && this.parent.right === this;
    };
    AVLTreeNode.prototype.tallerChild = function () {
        var leftHeight = this.left ? this.left.height : 0;
        var rightHeight = this.right ? this.right.height : 0;
        return leftHeight > rightHeight ? this.left : this.right;
    };
    return AVLTreeNode;
}(TreeNode));
var AVLBST = /** @class */ (function () {
    function AVLBST() {
        this.root = null;
        this._size = 0;
    }
    AVLBST.prototype.size = function () {
        return this._size;
    };
    AVLBST.prototype._compare = function (a, b) {
        return a - b;
    };
    AVLBST.prototype._getHeight = function (node) {
        return node !== null ? node.height : 0;
    };
    AVLBST.prototype._isBalanced = function (node) {
        var leftHeight = this._getHeight(node.left);
        var rightHeight = this._getHeight(node.right);
        return Math.abs(leftHeight - rightHeight) <= 1;
    };
    AVLBST.prototype._updateHeight = function (node) {
        var leftHeight = this._getHeight(node.left);
        var rightHeight = this._getHeight(node.right);
        node.height = 1 + Math.max(leftHeight, rightHeight);
    };
    AVLBST.prototype._rotateLeft = function (grand) {
        var parent = grand.right;
        var child = parent.left;
        grand.right = child;
        this._updateHeight(grand);
        parent.left = grand;
        this._updateHeight(parent);
        // update parent's parent's left or right
        if (grand.isLeftChild()) {
            grand.parent.left = parent;
        }
        else if (grand.isRightChild()) {
            grand.parent.right = parent;
        }
        else {
            this.root = parent;
        }
        parent.parent = grand.parent;
        grand.parent = parent;
        if (child !== null) {
            child.parent = grand;
        }
    };
    AVLBST.prototype._rotateRight = function (grand) {
        var parent = grand.left;
        var child = parent.right;
        grand.left = child;
        this._updateHeight(grand);
        parent.right = grand;
        this._updateHeight(parent);
        // update parent's parent's left or right
        if (grand.isLeftChild()) {
            grand.parent.left = parent;
        }
        else if (grand.isRightChild()) {
            grand.parent.right = parent;
        }
        else {
            this.root = parent;
        }
        parent.parent = grand.parent;
        grand.parent = parent;
        if (child !== null) {
            child.parent = grand;
        }
    };
    AVLBST.prototype._rebalance = function (grandparent) {
        // 挑出最高的子树
        var parent = grandparent.tallerChild();
        var node = parent.tallerChild();
        if (parent.isLeftChild()) {
            // L
            if (node.isLeftChild()) {
                // LL
                this._rotateRight(grandparent);
            }
            else {
                // LR
                this._rotateLeft(parent);
                this._rotateRight(grandparent);
            }
        }
        else {
            // R
            if (node.isLeftChild()) {
                // RL
                this._rotateRight(parent);
                this._rotateLeft(grandparent);
            }
            else {
                // RR
                this._rotateLeft(grandparent);
            }
        }
    };
    AVLBST.prototype._afterAddNode = function (newNode) {
        // 新添加的节点只会导致父级节点的失衡
        while ((newNode = newNode.parent) !== null) {
            // 新增节点有可能仍然保持平衡，但是需要更新高度
            if (this._isBalanced(newNode)) {
                this._updateHeight(newNode);
            }
            else {
                this._rebalance(newNode);
            }
        }
    };
    AVLBST.prototype.get = function (key) {
        if (this.root == null) {
            return null;
        }
        var cur = this.root;
        while (cur != null) {
            var cmp = this._compare(cur.key, key);
            if (cmp > 0) {
                cur = cur.left;
            }
            else if (cmp < 0) {
                cur = cur.right;
            }
            else {
                return cur;
            }
        }
        return null;
    };
    AVLBST.prototype.put = function (key, val) {
        if (this.root == null) {
            this.root = new AVLTreeNode(key, val, null);
            this._size++;
            this._afterAddNode(this.root);
            return;
        }
        var parent = this.root;
        var cur = this.root;
        while (cur != null) {
            var cmp_2 = this._compare(cur.key, key);
            parent = cur;
            if (cmp_2 > 0) {
                cur = cur.left;
            }
            else if (cmp_2 < 0) {
                cur = cur.right;
            }
            else {
                // 直接更新val
                cur.val = val;
                return;
            }
        }
        var cmp = this._compare(parent.key, key);
        var newNode = new AVLTreeNode(key, val, parent);
        // 父节点上添加
        if (cmp > 0) {
            parent.left = newNode;
        }
        else {
            parent.right = newNode;
        }
        this._afterAddNode(newNode);
        this._size++;
    };
    return AVLBST;
}());
function generateAVLBST() {
    var unique = {};
    var arr = [];
    for (var i = 0; i < 100; i++) {
        var val = Math.round(Math.random() * 100);
        if (!unique[val]) {
            unique[val] = true;
            arr.push(val);
        }
    }
    var bst = new AVLBST();
    for (var i = 0; i < arr.length; i++) {
        bst.put(arr[i], i);
    }
    return bst;
}
console.log("generateAVLBST()", generateAVLBST());
// module.exports = generateBST;
