class RoutesError {
  /**
   * Constructor of class Error
   * @param {number} code The code of the error
   * @param {string} error The message of the given error
   */
  constructor(code, error) {
    this.code = code;
    this.error = error;
  }
}

module.exports = RoutesError;
