import {Affectation} from "./affectation";
export class Planning {

  constructor(public idCollaborateur: string, public name: string, public serviceTraitement: string,
  public affectationsMap: Map<string, Array<Affectation>>) {

  }
}
