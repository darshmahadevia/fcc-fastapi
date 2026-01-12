import axios from 'axios';
import type {
  User,
  UserCreate,
  Post,
  PostCreate,
  PostWithVotes,
  Token,
  LoginCredentials,
  Vote,
  PostsQueryParams,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with timeout for faster failure detection
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-GET requests or when trying to access protected resources
    if (error.response?.status === 401) {
      const isGetRequest = error.config?.method?.toLowerCase() === 'get';
      const isPostsEndpoint = error.config?.url?.includes('/posts');
      
      // Don't redirect for GET requests to posts (allow unauthenticated viewing)
      if (!(isGetRequest && isPostsEndpoint)) {
        localStorage.removeItem('access_token');
        // Only redirect if we were trying to do something that requires auth
        if (!isGetRequest) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post<User>('/users/', userData);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getUser: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

// Posts API
export const postsApi = {
  getPosts: async (params?: PostsQueryParams): Promise<PostWithVotes[]> => {
    const response = await api.get<PostWithVotes[]>('/posts/', { params });
    return response.data;
  },

  getPost: async (id: number): Promise<PostWithVotes> => {
    const response = await api.get<PostWithVotes>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData: PostCreate): Promise<Post> => {
    const response = await api.post<Post>('/posts/', postData);
    return response.data;
  },

  updatePost: async (id: number, postData: PostCreate): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Vote API
export const voteApi = {
  vote: async (voteData: Vote): Promise<void> => {
    await api.post('/vote/', voteData);
  },
};
