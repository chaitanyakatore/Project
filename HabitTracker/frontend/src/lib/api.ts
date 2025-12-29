import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
});

export interface Habit {
  id: number;
  userId: string;
  name: string;
  category?: string;
  frequency?: string;
  createdAt: string;
}

export interface Progress {
  totalCompleted: number;
}

export const getHabits = async (userId: string) => {
  const response = await api.get<Habit[]>(`/habits?userId=${userId}`);
  return response.data;
};

export const checkHabit = async (habitId: number, date: string) => {
  const response = await api.post("/logs", { habitId, date });
  return response.data;
};

export const getProgress = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const response = await api.get<Progress>(
    `/progress?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
