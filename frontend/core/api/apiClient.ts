export const apiService = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`/api/v1${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`/api/v1${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async patch<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`/api/v1${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async delete<T>(path: string): Promise<T | null> {
    const response = await fetch(`/api/v1${path}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return null; // Handle No Content response
    }
    return response.json();
  }
};
