import { IComponent } from "../types";

export default class DataComponent implements IComponent {
  public data: { [key: string]: any } = {};
}
