import { Component } from '../types';

export default class DataComponent implements Component {
  readonly name = 'data';
  public data: { [key: string]: any } = {};
}
