class Mail {
  constructor(to, subject, text) {
    this.from = process.env.EMAIL;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}

export default Mail;
