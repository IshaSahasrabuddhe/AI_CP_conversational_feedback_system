import api from "./client";
import type { AuthResponse } from "../types";

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", { email, password });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
}
