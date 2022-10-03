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
var BSTTreeNode = /** @class */ (function (_super) {
    __extends(BSTTreeNode, _super);
    function BSTTreeNode(key, value, parent) {
        var _this = _super.call(this, key, value) || this;
        _this.parent = parent;
        return _this;
    }
    BSTTreeNode.prototype.isLeftChild = function () {
        return this.parent !== null && this.parent.left === this;
    };
    BSTTreeNode.prototype.isRightChild = function () {
        return this.parent !== null && this.parent.right === this;
    };
    // 找到左子树最右的节点就是前驱节点
    BSTTreeNode.prototype._getSuccessor = function (node) {
        while (node !== null && node.right !== null) {
            node = node.right;
        }
        return node;
    };
    // 获取前驱节点
    BSTTreeNode.prototype.getSuccessor = function () {
        return this._getSuccessor(this.left);
    };
    return BSTTreeNode;
}(TreeNode));
var BST_Interation = /** @class */ (function () {
    function BST_Interation() {
        this.root = null;
        this._size = 0;
    }
    BST_Interation.prototype._compare = function (a, b) {
        return a - b;
    };
    BST_Interation.prototype.size = function () {
        return this._size;
    };
    BST_Interation.prototype._delete = function (node) {
        if (node == null) {
            return null;
        }
        console.log("node", node);
        // 叶子节点
        if (!node.left && !node.right) {
            if (node.isLeftChild()) {
                node.parent.left = null;
            }
            else if (node.isRightChild()) {
                node.parent.right = null;
            }
            else {
                this.root = null;
            }
            this._size--;
            console.log("delete leaf");
            return;
        }
        // 有两个子节点
        if (node.left && node.right) {
            var successor = node.getSuccessor();
            // 覆盖
            node.val = successor.val;
            node.key = successor.key;
            if (successor.isLeftChild()) {
                successor.parent.left = successor.left;
            }
            else if (successor.isRightChild()) {
                successor.parent.right = successor.left;
            }
            console.log("delete two");
            this._size--;
            return;
        }
        // 只有一个子节点
        var child = node.left ? node.left : node.right;
        if (node.isLeftChild()) {
            node.parent.left = child;
        }
        else if (node.isRightChild()) {
            node.parent.right = child;
        }
        child.parent = node.parent;
        console.log("delete one");
        this._size--;
    };
    BST_Interation.prototype["delete"] = function (key) {
        var node = this.get(key);
        return this._delete(node);
    };
    BST_Interation.prototype.get = function (key) {
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
    BST_Interation.prototype.put = function (key, val) {
        if (this.root == null) {
            this.root = new BSTTreeNode(key, val, null);
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
            parent.left = new BSTTreeNode(key, val, parent);
        }
        else {
            parent.right = new BSTTreeNode(key, val, parent);
        }
        this._size++;
    };
    return BST_Interation;
}());
