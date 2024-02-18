const isValidObjectId = (id) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  const isValid = ObjectId.isValid(id);

  if (!isValid) {
    return false;
  }
  // check if converting id back to a string results in same value
  const isStringEqual = new ObjectId(id).toString() === id;
  return isValid && isStringEqual;
};
module.exports = { isValidObjectId };
