export class ClassModel {
  name: string;
  key: string;
  year: number;
  subjects: Array<string>;
  students?: Array<number>;
  id?: number;
  constructor(key, year, name = 'Невідомий', subjects = []) {
    this.key = key;
    this.year = year;
    this.name = name;
    this.subjects = subjects;
    this.students = [];
  }
}
