import { Joi, Segments } from "celebrate";
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().trim().allow("")
  }),
};
// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра studentId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};
export const createNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
};
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string()
      .custom(objectIdValidator, 'ObjectID validation')
      .required(),
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(1).optional(),
      content: Joi.string().allow('').optional(),
      tag: Joi.string()
        .valid(...TAGS)
        .optional(),
    })
    .or('title', 'content', 'tag'),
};
