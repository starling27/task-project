import { UseCase } from '../../../../core/application/UseCase.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { UserOutput } from '../dtos/UserDTOs.js';

export class GetAllUsersUseCase implements UseCase<void, UserOutput[]> {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => ({
      id: user.id!,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      providerId: user.providerId
    }));
  }
}
