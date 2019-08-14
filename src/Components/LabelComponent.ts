import { Component } from './Component';

export default class LabelComponent extends Component {
  public text: string = '';
  public alignment: 'top' | 'middle' | 'bottom' | 'left' | 'right' = 'bottom';
}
