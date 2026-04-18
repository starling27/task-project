import axios from 'axios';
import { FastifyInstance } from 'fastify';
import { UserRepository } from '../user/domain/repositories/UserRepository.js';
import { User } from '../user/domain/entities/User.js';

export class AuthService {
  constructor(
    private fastify: FastifyInstance,
    private userRepository: UserRepository
  ) {}

  getGoogleAuthUrl() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  async googleCallback(code: string) {
    const { id_token, access_token } = await this.getGoogleTokens(code);

    const googleUser = await axios
      .get(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      })
      .then((res) => res.data);

    if (!googleUser) {
      throw new Error('Failed to fetch user info from Google');
    }

    if (!googleUser.email) {
      return {
        partialSuccess: true,
        message: 'Email not provided by Google',
        provider: 'google',
        providerId: googleUser.id,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
      };
    }

    let user = await this.userRepository.findByProvider('google', googleUser.id);
    if (!user) {
        user = new User(
            googleUser.email,
            googleUser.name,
            'member',
            'google',
            googleUser.id,
            googleUser.picture
        );
        user = await this.userRepository.save(user);
    }

    const token = this.fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '1h' }
    );

    return { token, user };
  }

  private async getGoogleTokens(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    };

    try {
      const res = await axios.post(url, new URLSearchParams(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Failed to fetch Google OAuth Tokens');
      throw new Error(error.message);
    }
  }
}
