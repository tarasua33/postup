export class SubjectModel {
  name: string;
  key: string;
  id?: number;
  constructor(key, name = 'Невідомий') {
    this.key = key;
    this.name = name;
  }
}
