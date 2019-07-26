import { IComponent } from "../types";

export default class GravitationalComponent implements IComponent {
  public g_constant = 9.8;
  public active = true;
}
