import { UseCase } from '../../../../core/application/UseCase.js';
import { User } from '../../domain/entities/User.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { RegisterWithProviderInput, UserOutput } from '../dtos/UserDTOs.js';

export class RegisterWithProviderUseCase implements UseCase<RegisterWithProviderInput, UserOutput> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: RegisterWithProviderInput): Promise<UserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    
    if (existingUser) {
      const updatedUser = new User(
        existingUser.email,
        existingUser.name,
        existingUser.role,
        input.provider,
        input.providerId,
        existingUser.avatarUrl || input.avatarUrl,
        existingUser.id,
        existingUser.createdAt,
        new Date(),
        existingUser.deletedAt
      );
      const saved = await this.userRepository.save(updatedUser);
      return this.mapToOutput(saved);
    }

    const newUser = new User(
      input.email,
      input.name,
      'member',
      input.provider,
      input.providerId,
      input.avatarUrl
    );
    const saved = await this.userRepository.save(newUser);
    return this.mapToOutput(saved);
  }

  private mapToOutput(user: User): UserOutput {
    return {
      id: user.id!,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      providerId: user.providerId
    };
  }
}
