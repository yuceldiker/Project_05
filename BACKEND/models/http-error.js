class HttpError extends Error {
  constructor(message, errorCode) {
    // we add 'super' to call the constructor of the base class which is 'Error' class.
    super(message); // Add a "message" property. //Bu class'tan oluşturulacak instance'ların property'si "message" olacaktır.
    this.code = errorCode; // Adds a "code" property. //Bu class'tan oluşturulacak instance'ların property'si "code" olacaktır.
  }
}

module.exports = HttpError;
