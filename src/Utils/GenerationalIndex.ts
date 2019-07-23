export default class GenerationalIndex {
  private _index: number;
  private _generation: number;

  get index(): number {
    return this._index;
  }

  get generation(): number {
    return this._generation;
  }

  constructor(index: number, generation: number) {
    this._index = index;
    this._generation = generation;
  }
}
