import { IComponent } from "../types";

export default class LabelComponent implements IComponent {
  public text: string = '';
  public alignment: 'top' | 'middle' | 'bottom' | 'left' | 'right' = 'bottom';
}
