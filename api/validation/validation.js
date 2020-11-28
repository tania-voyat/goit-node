const Joi = require("joi");
const { HttpCode } = require("../helpers/status");

validateCreateContact = (req, res, next) => {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string().optional(),
  });

  const validation = createContactRules.validate(req.body);
  if (validation.error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: "Missing required fields" });
  }
  next();
};

validateUpdateContact = (req, res, next) => {
  const updateContactRules = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    subscription: Joi.string().optional(),
    password: Joi.string().optional(),
    token: Joi.string().optional(),
  }).min(1);
  const result = updateContactRules.validate(req.body);
  if (result.error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: "Missing required fields" });
  }
  next();
};

module.exports = {
  validateCreateContact,
  validateUpdateContact,
};
