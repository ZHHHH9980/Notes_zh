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
    BSTTreeNode.prototype._getPresuccessor = function (node) {
        while (node !== null && node.right !== null) {
            node = node.right;
        }
        return node;
    };
    // 获取前驱节点
    BSTTreeNode.prototype.getPresuccessor = function () {
        return this._getPresuccessor(this.left);
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
    // 自己写的，虽然很多，但是暂时测出什么问题
    BST_Interation.prototype._delete = function (node) {
        if (node == null) {
            return null;
        }
        this._size--;
        // 叶子节点
        if (!node.left && !node.right) {
            if (node.isLeftChild()) {
                node.parent.left = null;
            }
            else if (node.isRightChild()) {
                node.parent.right = null;
            }
            else { // 删除的是根节点
                this.root = null;
            }
            console.log("delete leaf");
            return;
        }
        // 有两个子节点
        if (node.left && node.right) {
            var presuccessor = node.getPresuccessor();
            // 覆盖
            node.val = presuccessor.val;
            node.key = presuccessor.key;
            if (presuccessor.isLeftChild()) {
                presuccessor.parent.left = presuccessor.left;
            }
            else if (presuccessor.isRightChild()) {
                presuccessor.parent.right = presuccessor.left;
            }
            console.log("delete two");
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
        else { // 删除的是根节点
            this.root = child;
        }
        child.parent = node.parent;
        console.log("delete one");
    };
    /*
    * @param node: 待删除节点
    */
    BST_Interation.prototype._delete_v2 = function (node) {
        if (node == null) {
            return null;
        }
        this._size--;
        if (node.left && node.right) {
            var presuccessor = node.getPresuccessor();
            // 覆盖
            node.val = presuccessor.val;
            node.key = presuccessor.key;
            node = presuccessor;
        }
        var child = node.left ? node.left : node.right;
        if (child !== null) { // 度为1 
            child.parent = node.parent;
        }
        if (node.isLeftChild()) {
            node.parent.left = child;
        }
        else if (node.isRightChild()) {
            node.parent.right = child;
        }
        else { // 根节点
            this.root = child;
        }
    };
    BST_Interation.prototype["delete"] = function (key) {
        var node = this.get(key);
        return this._delete_v2(node);
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
// 配合 bstCheck.js 使用
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
    var bst = new BST_Interation();
    // 添加随机生成的树
    for (var i = 0; i < arr.length; i++) {
        bst.put(arr[i], i);
    }
    // 概率删除部分key
    Object.keys(unique).forEach(function (key) {
        if ((Math.random() * 100) > 70) {
            bst["delete"](Number(key));
        }
    });
    return bst;
}
