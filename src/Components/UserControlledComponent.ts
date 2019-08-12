import { Component } from '../types';

export default class UserControlledComponent implements Component {
  name: 'usercontrolled';
  isControlled: boolean = false;
}
