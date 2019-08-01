import { Component, Shape } from '../types';

export default class ShapeComponent implements Component {
  readonly name = 'shape';
  public shape: Shape = 'rectangle';
}
