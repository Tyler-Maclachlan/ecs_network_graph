import { Component } from '../types';

export default class PositionComponent implements Component {
  readonly name = 'position';
  public x: number = 0;
  public y: number = 0;
}
