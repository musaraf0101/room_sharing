import joi from "joi";

export const createRoomValidation = (data) => {
  const schema = joi.object({
    roomType: joi.string().required(),
    location: joi.string().required(),
    price: joi.number().required(),
    securityDeposit: joi.number().optional(),
    waterIncluded: joi.string().optional(),
    electricityIncluded: joi.string().optional(),
    wifiIncluded: joi.string().optional(),
    mealsIncluded: joi.string().optional(),
    genderPreference: joi.string().optional(),
    suitableFor: joi.string().optional(),
    availableFrom: joi.string().optional(),
    houseRules: joi.string().optional(),
    whatsapp: joi.string().required(),
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
    securityDeposit: joi.number().optional(),
    waterIncluded: joi.string().optional(),
    electricityIncluded: joi.string().optional(),
    wifiIncluded: joi.string().optional(),
    mealsIncluded: joi.string().optional(),
    genderPreference: joi.string().optional(),
    suitableFor: joi.string().optional(),
    availableFrom: joi.string().optional(),
    houseRules: joi.string().optional(),
    whatsapp: joi.string().optional(),
    title: joi.string().max(100).optional(),
    description: joi.string().optional(),
  });
  return schema.validate(data);
};
