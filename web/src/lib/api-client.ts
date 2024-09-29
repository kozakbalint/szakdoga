import { env } from '@/config/env';

class APIError extends Error {
  statusCode: number;
  response: any;

  constructor(message: string, statusCode: number, response: any) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}

class APIClient {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(url: string, options: RequestInit) {
    const response = await fetch(`${this.baseURL}${url}`, options);
    if (!response.ok) {
      throw new APIError(
        response.statusText,
        response.status,
        await response.json(),
      );
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

  post(url: string, data: any) {
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
