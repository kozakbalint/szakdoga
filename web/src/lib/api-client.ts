import { env } from '@/config/env';

export type APIError = {
  message: string;
  statusCode: number;
  response: unknown;
};

class APIClient {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(url: string, options: RequestInit) {
    const response = await fetch(`${this.baseURL}${url}`, options);
    if (!response.ok) {
      return {
        message: response.statusText,
        statusCode: response.status,
        response: await response.json(),
      } as APIError;
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
