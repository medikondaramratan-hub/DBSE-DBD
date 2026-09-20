import axios from 'axios';
import { mockService } from './mockService';
import { MOCK_USER } from './mockData';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

export async function routeMockRequest(config) {
  let url = config.url || '';
  if (url.startsWith('/api')) {
    url = url.substring(4);
  }
  let data = {};
  if (config.data) {
    try {
      data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      data = config.data;
    }
  }

  // Auth routes
  if (url.includes('/auth/login')) {
    const res = await mockService.login(data.email, data.password);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.includes('/auth/register')) {
    const res = await mockService.register(data.name, data.email, data.password);
    return { data: res, status: 201, statusText: 'Created', headers: {}, config };
  }

  // Subjects & Topics
  if (url.match(/\/subjects\/\d+\/topics/)) {
    const parts = url.split('/');
    const subjectId = parts[2];
    const res = await mockService.getTopicsBySubject(subjectId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.match(/\/subjects\/\d+/)) {
    const parts = url.split('/');
    const subjectId = parts[2];
    const res = await mockService.getSubjectById(subjectId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url === '/subjects' || url.endsWith('/subjects')) {
    const res = await mockService.getSubjects();
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.match(/\/topics\/\d+/)) {
    const parts = url.split('/');
    const topicId = parts[2];
    const res = await mockService.getTopicById(topicId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Quizzes
  if (url.includes('/quizzes/start')) {
    const res = await mockService.startQuiz(data.topicId);
    return { data: res, status: 201, statusText: 'Created', headers: {}, config };
  }
  if (url.match(/\/quizzes\/\d+\/next-question/)) {
    const parts = url.split('/');
    const attemptId = parts[2];
    const res = await mockService.getNextQuestion(attemptId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.match(/\/quizzes\/\d+\/answer/)) {
    const parts = url.split('/');
    const attemptId = parts[2];
    const res = await mockService.submitAnswer(attemptId, data.questionId, data.selectedOption);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.match(/\/quizzes\/\d+\/finish/)) {
    const parts = url.split('/');
    const attemptId = parts[2];
    const res = await mockService.finishQuiz(attemptId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.match(/\/quizzes\/\d+(\/result)?/)) {
    const parts = url.split('/');
    const attemptId = parts[2];
    const res = await mockService.getQuizResult(attemptId);
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.includes('/quizzes/history')) {
    return { data: [], status: 200, statusText: 'OK', headers: {}, config };
  }

  // Performance
  if (url.includes('/performance/me/topics')) {
    const res = await mockService.getTopicPerformances();
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.includes('/performance/me/recommendations')) {
    const res = await mockService.getRecommendations();
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (url.includes('/performance/me')) {
    const res = await mockService.getPerformance();
    return { data: res, status: 200, statusText: 'OK', headers: {}, config };
  }

  // User
  if (url.includes('/users/me')) {
    const saved = localStorage.getItem('user');
    const user = saved ? JSON.parse(saved) : MOCK_USER;
    return { data: user, status: 200, statusText: 'OK', headers: {}, config };
  }

  return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
}

// Request Interceptor: Attach JWT Bearer Token or redirect to Mock in demo mode
axiosClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem('demo_mode') === 'true') {
      config.adapter = async () => routeMockRequest(config);
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch errors, handle 401, or fallback to mock when server is offline
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isOffline =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500);

    if (isOffline && error.config) {
      console.warn('Backend server offline. Automatically activating Mock Data simulation for:', error.config.url);
      localStorage.setItem('demo_mode', 'true');
      return routeMockRequest(error.config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
