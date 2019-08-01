import { Component } from '../types';

export default class ColorComponent implements Component {
  readonly name = 'color';
  public textColor: string = '#000000';
  public fillColor: string = '#fefefe';
}
