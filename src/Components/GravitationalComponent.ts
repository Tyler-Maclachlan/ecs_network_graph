import { Component } from '../types';

export default class GravitationalComponent implements Component {
  readonly name = 'gravitational';
  public g_constant = 9.8;
  public active = true;
}
