export class YearModel {
  name: string;
  active: boolean;
  id?: number;
  semesters: Array<{}>;
  constructor( name ) {
    this.name = name;
    this.active = false;
  }
}
