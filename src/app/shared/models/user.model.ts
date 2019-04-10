export class UserModel {
  email: string;
  password: string;
  name: string;
  type: Array<string>;
  phone: [];
  classes?: Array<number>;
  confirm?: boolean;
  access?: Array<number>;
  subjects?: Array<{class, subject}>;
  id?: number;
  constructor(email, password, name, type: [any], phone, classes = [] ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.type = type;
    this.phone = phone;
    this.classes = classes;
    this.confirm = false;
    this.access = [];
    this.subjects = [];
    this.access = [];
  }
}
