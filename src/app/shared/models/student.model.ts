export class StudentModel {
  name: string;
  contacts: Array<any>;
  date: string;
  place: string;
  parents?: Array<number>;
  id?: number;
  register: Array<{subject, semesterOne: {rates: [number], final: number}, semesterSecond: {rates: [number], final: number}}>;
  constructor( name, place, date, register, contacts = [] ) {
    this.name = name;
    this.contacts = contacts;
    this.place = place;
    this.date = date;
    this.register = register;
    this.parents = [];
  }
}
