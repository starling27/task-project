const TOKEN_KEY = 'auth_token';

class ApiService {
  private async request(path: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(path, { ...options, headers });

    if (response.status === 401) {
      // Clear token and potentially session storage
      sessionStorage.removeItem(TOKEN_KEY);
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback to default message
      }
      throw new Error(errorMessage);
    }

    return response;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) return null as any;
    
    const text = await response.text();
    if (!text) return null as any;
    
    try {
      return JSON.parse(text);
    } catch (e) {
      return null as any;
    }
  }

  /**
   * Performs a GET request.
   * Caches the result in sessionStorage as per GEMINI.md mandate.
   */
  async get<T>(path: string, options: { useCache?: boolean } = {}): Promise<T> {
    const { useCache = true } = options;
    const cacheKey = `api_cache_${path}`;
    
    if (useCache) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          sessionStorage.removeItem(cacheKey);
        }
      }
    }

    const response = await this.request(path, { method: 'GET' });
    const data = await this.parseResponse<T>(response);

    if (useCache) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    }

    return data;
  }

  async post<T>(path: string, body?: any): Promise<T> {
    this.clearCache();
    const response = await this.request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.parseResponse<T>(response);
  }

  async put<T>(path: string, body?: any): Promise<T> {
    this.clearCache();
    const response = await this.request(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.parseResponse<T>(response);
  }

  async patch<T>(path: string, body?: any): Promise<T> {
    this.clearCache();
    const response = await this.request(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.parseResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    this.clearCache();
    const response = await this.request(path, { method: 'DELETE' });
    return this.parseResponse<T>(response);
  }

  private clearCache() {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('api_cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const apiService = new ApiService();
