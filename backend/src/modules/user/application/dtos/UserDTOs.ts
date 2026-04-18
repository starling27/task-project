export interface UserOutput {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  provider?: string;
  providerId?: string;
}

export interface RegisterWithProviderInput {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  avatarUrl?: string;
}
