import { Component } from './Component';
import { Text } from 'pixi.js';

export default class LabelComponent extends Component {
  public text: Text = new Text('');
  public alignment: 'top' | 'middle' | 'bottom' | 'left' | 'right' = 'bottom';
}
