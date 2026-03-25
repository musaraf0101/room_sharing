import joi from "joi";
import { SRI_LANKA_CITIES } from "../constants/cities.js";

export const createRequestValidation = (data) => {
  const schema = joi.object({
    whoAmI: joi.string().required(),
    lookingIn: joi.string().valid(...SRI_LANKA_CITIES).required(),
    subArea: joi.string().optional(),
    maxBudget: joi.number().required(),
    roomTypePreferred: joi.string().optional(),
    moveInDate: joi.string().optional(),
    gender: joi.string().required(),
    mealsNeeded: joi.boolean().optional(),
    duration: joi.string().optional(),
    bio: joi.string().optional(),
    whatsapp: joi.string().pattern(/^\+?[0-9]{7,15}$/).required(),
  });
  return schema.validate(data);
};

export const updateRequestValidation = (data) => {
  const schema = joi.object({
    whoAmI: joi.string().optional(),
    lookingIn: joi.string().valid(...SRI_LANKA_CITIES).optional(),
    subArea: joi.string().optional(),
    maxBudget: joi.number().optional(),
    roomTypePreferred: joi.string().optional(),
    moveInDate: joi.string().optional(),
    gender: joi.string().optional(),
    mealsNeeded: joi.boolean().optional(),
    duration: joi.string().optional(),
    bio: joi.string().optional(),
    whatsapp: joi.string().pattern(/^\+?[0-9]{7,15}$/).optional(),
  });
  return schema.validate(data);
};
