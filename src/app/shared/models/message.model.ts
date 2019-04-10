export class MessageModel {
  message: string;
  type: string;
  constructor(message, type = 'danger') {
    this.message = message;
    this.type = type;
  }
}
