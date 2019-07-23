import { GenerationalIndex } from "./index";

interface AllocEntry {
  generation: number;
  is_alive: boolean;
}

export default class GenerationalIndexAllocator {
  private _entries: Array<AllocEntry>;
  private _free: Array<number>;

  constructor() {
    this._entries = [];
    this._free = [];
  }

  public allocate(): GenerationalIndex {
    if (this._free.length) {
      const index = this._free.pop()!;
      const entry = this._entries[index];

      entry.generation += 1;
      entry.is_alive = true;

      return new GenerationalIndex(index, entry.generation);
    }

    const index = this._entries.length;
    const entry = <AllocEntry>{ generation: 0, is_alive: true };

    this._entries.push(entry);

    return new GenerationalIndex(index, 0);
  }

  public deallocate({ index, generation }: GenerationalIndex): boolean {
    const entry = this._entries[index];

    if (!entry.is_alive || entry.generation !== generation) {
      return false;
    }

    entry.is_alive = false;
    this._free.push(index);

    return true;
  }

  public is_alive({ index, generation }: GenerationalIndex): boolean {
    const entry = this._entries[index];
    return generation === entry.generation && entry.is_alive;
  }
}
