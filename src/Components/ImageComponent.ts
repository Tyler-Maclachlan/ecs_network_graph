import { Component } from '../types';

export default class ImageComponent implements Component {
  readonly name = 'image';
  public image: string = '';
}
