import { GenerationalIndex as Entity } from '../Utils/index';
import { Component } from '../types';

export default class SpringComponent implements Component {
  readonly name = 'spring';
  public from: Entity;
  public to: Entity;
}
