import { Repository } from '../../../../core/domain/Repository.js';
import { User } from '../entities/User.js';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByProvider(provider: string, providerId: string): Promise<User | null>;
  softDelete(id: string): Promise<void>;
}
