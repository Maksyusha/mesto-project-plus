import { Joi } from 'celebrate';

// eslint-disable-next-line no-useless-escape
export const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/; // TODO: regex

export const createCardJoi = {
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  },
};

export const deleteCardJoi = {
  params: {
    cardId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
  },
};

export const likeCardJoi = {
  params: {
    cardId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  },
};

export const unlikeCardJoi = {
  params: {
    cardId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  },
};

export const getUserByIdJoi = {
  params: {
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  },
};

export const updateProfileJoi = {
  body: {
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  },
};

export const updateAvatarJoi = {
  body: {
    avatar: Joi.string().required().pattern(urlRegex),
  },
};

export const loginJoi = {
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
};

export const createUserJoi = {
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegex),
  },
};
