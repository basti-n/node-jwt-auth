const USER_ERROR_IDENTIFIER = 'user validation failed: ';
const DUPLICATE_ERROR_CODE = 11000;

function isDuplicateError(error) {
  return error && error.code === DUPLICATE_ERROR_CODE;
}

function isUserValidationError(error) {
  return error && error.message.includes(USER_ERROR_IDENTIFIER);
}

module.exports.isDuplicateError = isDuplicateError;
module.exports.isUserValidationError = isUserValidationError;
