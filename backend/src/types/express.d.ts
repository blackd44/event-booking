import { User } from 'src/api/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
