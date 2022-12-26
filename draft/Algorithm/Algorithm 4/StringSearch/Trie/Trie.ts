class TrieNode<Value> {
  public children: Map<string, TrieNode<Value> | null>;
  public parent: TrieNode<Value> | null;
  public character: string;
  public value?: Value;
  public isWordEnd: boolean; // 标识单词结尾

  public getChildren(): Map<string, TrieNode<Value> | null> {
    return this.children !== undefined
      ? this.children
      : (this.children = new Map());
  }

  constructor(char: string, parent: TrieNode<Value> | null, value?: Value) {
    this.value = value;
    this.parent = parent;
    this.character = char;
  }
}

class Trie<Value> {
  public size: number;
  public root: TrieNode<Value>;

  constructor() {
    this.root = new TrieNode<Value>("", null);
    this.size = 0;
  }

  // 根据字符串获取某个节点
  private _node(key: string) {
    const len = key.length;

    let node: TrieNode<Value> | null | undefined = this.root;

    for (let i = 0; i < len; i++) {
      let char = key.charAt(i);

      node = node.getChildren().get(char);

      if (node == null) {
        return null;
      }
    }

    // 看看它是不是一个单词，还是其他单词的前缀
    return node.isWordEnd ? node : null;
  }

  // 是否以key作为前缀
  public startsWith(key: string) {
    let length = key.length;
    let node = this.root;
    for (let i = 0; i < length; i++) {
      let char = key.charAt(i);

      const children = node.getChildren();

      if (!children.has(char)) {
        return false;
      }

      node = children.get(char);
    }

    return true;
  }

  public contains(key: string) {
    return this._node(key) != null;
  }

  public get(key: string) {
    let node = this._node(key);
    return node == null ? null : node.value;
  }

  public add(key: string, value: Value) {
    let len = key.length;

    let node = this.root;
    for (let i = 0; i < len; i++) {
      let char = key.charAt(i);

      let childNode = node.getChildren().get(char);

      // 找不到就添加
      if (childNode == null) {
        childNode = new TrieNode<Value>(char, node);
        node.getChildren().set(char, childNode);
      }

      // 继续往下找
      node = childNode;
    }

    if (node.isWordEnd) {
      const oldValue = node.value;
      node.value = value;
      return oldValue;
    }

    node.isWordEnd = true;
    node.value = value;
    this.size++;

    return null;
  }

  public remove(key: string) {
    let node = this._node(key);

    if (node == null || (node !== null && node.isWordEnd === false)) {
      return null;
    }

    // node 存在 并且 isWordEnd = true
    this.size--;

    const oldValue = node.value;

    // 有子节点
    if (node.children !== null && node.getChildren().size > 0) {
      node.isWordEnd = false;
      node.value = undefined;
      return oldValue;
    }

    // 没有子节点，挨个往上查
    let parent: null | TrieNode<Value> = null;
    while ((parent = node.parent) !== null) {
      // 删除
      parent.children.set(node.character, null);

      // 如果还有其他元素,停止向上删除
      if (parent.children.size !== 0 || parent.isWordEnd === true) {
        break;
      }

      // 继续往上删除
      node = parent;
    }

    return oldValue;
  }
}
