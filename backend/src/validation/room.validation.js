import joi from "joi";

export const createRoomValidation = (data) => {
  const schema = joi.object({
    roomType: joi.string().required(),
    location: joi.string().required(),
    price: joi.number().required(),
    title: joi.string().max(100).optional(),
    description: joi.string().optional(),
  });
  return schema.validate(data);
};
export const updateRoomValidation = (data) => {
  const schema = joi.object({
    roomType: joi.string().optional(),
    location: joi.string().optional(),
    price: joi.number().optional(),
    title: joi.string().max(100).optional(),
    description: joi.string().optional(),
  });
  return schema.validate(data);
};
