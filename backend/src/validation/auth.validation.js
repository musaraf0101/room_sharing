import joi from "joi";

export const validateRegistration = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(6).trim().required(),
    phoneNumber: joi.string().max(10).trim().optional(),
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(6).trim().required(),
  });
  return schema.validate(data);
};
