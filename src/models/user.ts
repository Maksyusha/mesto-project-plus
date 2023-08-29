import {
  model, Schema, Model, Document,
} from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcryptjs from 'bcryptjs';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_EMAIL_OR_PASSWORD_MESSAGE,
} from '../utils/errors/error-messages';
import AuthenticationError from '../utils/errors/classes/authentication-error';
import { urlRegex } from '../utils/validation';

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string, // eslint-disable-line no-unused-vars
    password: string // eslint-disable-line no-unused-vars
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: INVALID_EMAIL_MESSAGE,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректная ссылка',
    },
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user: IUser) => {
        if (!user) {
          return Promise.reject(
            new AuthenticationError(INVALID_EMAIL_OR_PASSWORD_MESSAGE),
          );
        }

        return bcryptjs.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              new AuthenticationError(INVALID_EMAIL_OR_PASSWORD_MESSAGE),
            );
          }

          return user;
        });
      });
  },
);

export default model<IUser, UserModel>('user', userSchema);
