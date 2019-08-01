import { Component } from '../types';

export default class VelocityComponent implements Component {
  readonly name = 'velocity';
  public x: number = 0;
  public y: number = 0;
}
