import { array, object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
      .email('Your email format is invalid')
      .transform((val) => val.toLowerCase()),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password should have 6 min characters',
    ),
    passwordConfirmation: string({
      required_error: 'Password Confirmation is required',
    }),
    firstname: string({
      required_error: 'Firstname is required',
    }),
  }).refine((body) => body.password === body.passwordConfirmation, {
    path: ['password', 'passwordConfirmation'],
    message: 'Password and password confirmation is not match',
  }),
});

export const userSignInSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
      .email('Your email format is invalid')
      .transform((val) => val.toLowerCase()),
    password: string({ required_error: 'Password is required' }),
  }),
});

export const updateUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
      .email('Your email format is invalid')
      .transform((val) => val.toLowerCase()),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password should have 6 min characters',
    ),
    passwordConfirmation: string({
      required_error: 'Password Confirmation is required',
    }),
    firstname: string({
      required_error: 'Firstname is required',
    }),
    lastname: string().optional(),
  }).refine((body) => body.password === body.passwordConfirmation, {
    path: ['password', 'passwordConfirmation'],
    message: 'Password and password confirmation is not match',
  }),
});
