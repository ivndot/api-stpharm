class RoutesMessage {
  /**
   * Constructor of class RoutesMessage
   * @param {number} code The code number of the response
   * @param {string} message A message to the user
   */
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

module.exports = RoutesMessage;
