import { Component } from '../types';

export default class LabelComponent implements Component {
  readonly name = 'label';
  public text: string = '';
  public alignment: 'top' | 'middle' | 'bottom' | 'left' | 'right' = 'bottom';
}
