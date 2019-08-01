import { Component } from '../types';

export default class SizeComponent implements Component {
  readonly name = 'size';
  height: number = 20;
  width: number = 20;
}
