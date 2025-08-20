import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin","agent","user").optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const articleSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid("draft","published").default("draft")
});

export const ticketCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid("billing","tech","shipping","other").optional(),
  attachments: Joi.array().items(Joi.string().uri()).optional()
});

export const configSchema = Joi.object({
  autoCloseEnabled: Joi.boolean().required(),
  confidenceThreshold: Joi.number().min(0).max(1).required(),
  slaHours: Joi.number().min(1).max(168).required()
});
