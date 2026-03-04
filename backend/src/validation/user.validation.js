import joi from "joi";

export const updateProfileUser = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).trim().optional(),
    email: joi.string().email().trim().optional(),
    password: joi.string().min(6).trim().optional(),
    phoneNumber: joi.string().max(10).trim().optional(),
  });
  return schema.validate(data);
};
