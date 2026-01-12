// User types
export interface User {
  email: string;
  id: number;
  created_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
}

// Post types
export interface Post {
  title: string;
  content: string;
  published: boolean;
  id: number;
  created_at: string;
  owner_id: number;
  owner: User;
}

export interface PostCreate {
  title: string;
  content: string;
  published?: boolean;
}

export interface PostWithVotes {
  Post: Post;
  votes: number;
}

// Auth types
export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Vote types
export interface Vote {
  post_id: number;
  dir: 0 | 1;
}

// API Response types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// Pagination params
export interface PostsQueryParams {
  limit?: number;
  skip?: number;
  search?: string;
}
