import { env } from '@/config/env';

export type APIError = {
  message: string;
  statusCode: number;
  response: {
    error: string | { email?: string; name?: string; password?: string };
  };
};

class APIClient {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(url: string, options: RequestInit): Promise<unknown> {
    const response = await fetch(`${this.baseURL}${url}`, options);
    if (!response.ok) {
      const error: APIError = {
        message: response.statusText,
        statusCode: response.status,
        response: await response.json(),
      };
      return Promise.reject(error);
    }
    return response.json();
  }

  get(url: string) {
    return this.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getWithToken(url: string, token: string) {
    return this.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  post(url: string, data: unknown) {
    return this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient(env.API_URL);
