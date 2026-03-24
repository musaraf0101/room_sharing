import joi from "joi";

export const createRequestValidation = (data) => {
  const schema = joi.object({
    whoAmI: joi.string().required(),
    lookingIn: joi.string().required(),
    maxBudget: joi.number().required(),
    roomTypePreferred: joi.string().optional(),
    moveInDate: joi.string().optional(),
    gender: joi.string().required(),
    mealsNeeded: joi.boolean().optional(),
    duration: joi.string().optional(),
    bio: joi.string().optional(),
    whatsapp: joi.string().required(),
  });
  return schema.validate(data);
};

export const updateRequestValidation = (data) => {
  const schema = joi.object({
    whoAmI: joi.string().optional(),
    lookingIn: joi.string().optional(),
    maxBudget: joi.number().optional(),
    roomTypePreferred: joi.string().optional(),
    moveInDate: joi.string().optional(),
    gender: joi.string().optional(),
    mealsNeeded: joi.boolean().optional(),
    duration: joi.string().optional(),
    bio: joi.string().optional(),
    whatsapp: joi.string().optional(),
  });
  return schema.validate(data);
};
