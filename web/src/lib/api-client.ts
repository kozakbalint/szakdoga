import { env } from '@/config/env';

type Headers = {
  'Content-Type': string;
  Authorization?: string;
};

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

      if (error.statusCode === 401) {
        localStorage.removeItem('auth');
        window.location.href = `/auth/login`;
      }

      return Promise.reject(error);
    }
    return response.json();
  }

  get(url: string, auth?: boolean) {
    let headers: Headers = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      const authObject = JSON.parse(localStorage.getItem('auth') ?? '');
      headers = {
        ...headers,
        Authorization: `Bearer ${authObject.token}`,
      };
    }
    return this.request(url, {
      method: 'GET',
      headers: headers,
    });
  }

  post(url: string, data: unknown, auth?: boolean) {
    let headers: Headers = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      const authObject = JSON.parse(localStorage.getItem('auth') ?? '');
      headers = {
        ...headers,
        Authorization: `Bearer ${authObject.token}`,
      };
    }
    return this.request(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  }

  delete(url: string, auth?: boolean) {
    let headers: Headers = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      const authObject = JSON.parse(localStorage.getItem('auth') ?? '');
      headers = {
        ...headers,
        Authorization: `Bearer ${authObject.token}`,
      };
    }
    return this.request(url, {
      method: 'DELETE',
      headers: headers,
    });
  }

  appendQueryParams(url: string, params: Record<string, string>) {
    const searchParams = new URLSearchParams(params).toString();
    return `${url}?${searchParams}`;
  }
}

export const apiClient = new APIClient(env.API_URL);
