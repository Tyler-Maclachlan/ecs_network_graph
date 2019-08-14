import { GenerationalIndex as Entity } from '../Utils/index';
import { Component } from './Component';

export default class SpringComponent extends Component {
  public from: Entity;
  public to: Entity;
}
