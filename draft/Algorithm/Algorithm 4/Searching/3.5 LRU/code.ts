class DoubleListNode<Key, Value> {
  public prev: DoubleListNode<Key, Value>;
  public next: DoubleListNode<Key, Value>;
  public key: Key;
  public value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }
}

// 新增的排在队尾，久未使用的排在队头
class DoubleLinkedList<Key, Value> {
  public head: DoubleListNode<Key, Value>;
  public tail: DoubleListNode<Key, Value>;

  constructor() {
    this.head = new DoubleListNode<Key, Value>(0, 0);
    this.tail = new DoubleListNode<Key, Value>(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // O(1),队尾添加最新节点
  addLast(node: DoubleListNode<Key, Value>) {
    node.prev = this.tail.prev;
    node.prev.next = node;

    node.next = this.tail;
    this.tail.prev = node;
  }

  // O(1) node一定存在
  remove(node: DoubleListNode<Key, Value>) {
    const prev = node.prev;
    const next = node.next;
    next.prev = prev;
    prev.next = next;
  }

  // O(1)
  removeFirst() {
    const node = this.head.next;
    const next = this.head.next.next;

    next.prev = this.head;
    this.head.next = next;

    return node;
  }
}

class LRUCache<Key, Value> {
  public map: Map<Key, DoubleListNode<Key, Value>>;
  public cache: DoubleLinkedList<Key, Value>;
  public size: number;
  private _capacity: number;

  constructor(capacity: number) {
    this.size = 0;
    this.map = new Map();
    this.cache = new DoubleLinkedList();
    this._capacity = capacity;
  }

  // 把某个key的优先级提升到最高
  private _makeRecently(key: Key) {
    const node = this.map.get(key);

    this.cache.remove(node as DoubleListNode<Key, Value>);
    this.cache.addLast(node as DoubleListNode<Key, Value>);
  }

  // 删除用的最少的node
  private _removeLeast() {
    this.size--;

    const node = this.cache.removeFirst();
    this.map.delete(node.key);
  }

  private _addRecently(key: Key, value: Value) {
    this.size++;
    const node = new DoubleListNode<Key, Value>(key, value);
    this.map.set(key, node);
    this.cache.addLast(node);
  }

  public get(key: Key) {
    if (!this.map.has(key)) {
      return -1;
    }

    this._makeRecently(key);
    return (this.map.get(key) as DoubleListNode<Key, Value>).value;
  }

  public put(key: Key, value: Value) {
    // 已经存在
    if (this.map.has(key)) {
      this._makeRecently(key);
      const node = this.map.get(key) as DoubleListNode<Key, Value>;
      node.value = value;
      return;
    }

    // 不存在,加入新的node

    // 超出容量
    if (this.size === this._capacity) {
      this._removeLeast();
    }

    this._addRecently(key, value);
  }

  public delete(key: Key) {
    if (!this.map.has(key)) {
      return -1;
    }

    const node = this.map.get(key) as DoubleListNode<Key, Value>;
    const value = node.value;

    this.cache.remove(node);
    this.map.delete(key);
    return value;
  }
}
