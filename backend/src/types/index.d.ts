import { User } from './api/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
