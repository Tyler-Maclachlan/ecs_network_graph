import { Component } from '../types';

export default class AccelerationComponent implements Component {
  readonly name = 'acceleration';
  public x: number = 0;
  public y: number = 0;
}
