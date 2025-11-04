export class BiMap<K, V> {
  private forwardMap: Map<K, V>;
  private reverseMap: Map<V, K>;
  constructor() {
    this.forwardMap = new Map<K, V>();
    this.reverseMap = new Map<V, K>();
  }
  set(key: K, value: V): void {
    if (this.forwardMap.has(key)) {
      const oldValue = this.forwardMap.get(key)!;
      this.reverseMap.delete(oldValue);
    }
    if (this.reverseMap.has(value)) {
      const oldKey = this.reverseMap.get(value)!;
      this.forwardMap.delete(oldKey);
    }
    this.forwardMap.set(key, value);
    this.reverseMap.set(value, key);
  }

  getValue(key: K): V | undefined {
    return this.forwardMap.get(key);
  }
  getKey(value: V): K | undefined {
    return this.reverseMap.get(value);
  }

  getPairByKey(key: K): [K, V] | undefined {
    const value = this.forwardMap.get(key);
    if (value !== undefined) {
      return [key, value];
    }
    return undefined;
  }

  getPairByValue(value: V): [K, V] | undefined {
    const key = this.reverseMap.get(value);
    if (key !== undefined) {
      return [key, value];
    }
    return undefined;
  }

  deleteByKey(key: K): void {
    const value = this.forwardMap.get(key);
    if (value !== undefined) {
      this.forwardMap.delete(key);
      this.reverseMap.delete(value);
    }
  }
  deleteByValue(value: V): void {
    const key = this.reverseMap.get(value);
    if (key !== undefined) {
      this.reverseMap.delete(value);
      this.forwardMap.delete(key);
    }
  }
  hasKey(key: K): boolean {
    return this.forwardMap.has(key);
  }
  hasValue(value: V): boolean {
    return this.reverseMap.has(value);
  }

  [Symbol.iterator]() {
    return this.forwardMap[Symbol.iterator]();
  }
}
