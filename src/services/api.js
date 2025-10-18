import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обработчик ошибок
const handleError = (error) => {
  if (error.response) {
    // Сервер ответил с ошибкой
    console.error('Ошибка сервера:', error.response.status, error.response.data);
    throw new Error(`Ошибка ${error.response.status}: ${error.response.statusText}`);
  } else if (error.request) {
    // Запрос был отправлен, но ответа не получено
    console.error('Ошибка сети: нет ответа от сервера');
    throw new Error('Ошибка сети: проверьте подключение к интернету');
  } else {
    // Ошибка при настройке запроса
    console.error('Ошибка запроса:', error.message);
    throw new Error('Ошибка при отправке запроса');
  }
};

// GET - Получение всех отзывов
export const getReviews = async () => {
  try {
    const response = await apiClient.get('/comments?_limit=10');
    // Трансформируем данные JSONPlaceholder в формат наших отзывов
    return response.data.map(comment => ({
      id: comment.id,
      name: comment.name,
      text: comment.body,
      rating: Math.floor(Math.random() * 2) + 4, // Случайная оценка 4 или 5
      email: comment.email
    }));
  } catch (error) {
    handleError(error);
  }
};

// GET - Получение одного отзыва по ID
export const getReviewById = async (id) => {
  try {
    const response = await apiClient.get(`/comments/${id}`);
    return {
      id: response.data.id,
      name: response.data.name,
      text: response.data.body,
      rating: 5,
      email: response.data.email
    };
  } catch (error) {
    handleError(error);
  }
};

// POST - Добавление нового отзыва
export const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/comments', {
      name: reviewData.name,
      body: reviewData.text,
      email: reviewData.email || 'user@example.com',
      postId: 1
    });
    
    return {
      id: response.data.id,
      name: reviewData.name,
      text: reviewData.text,
      rating: reviewData.rating,
      email: reviewData.email
    };
  } catch (error) {
    handleError(error);
  }
};

// PUT - Полное обновление отзыва
export const updateReview = async (id, reviewData) => {
  try {
    const response = await apiClient.put(`/comments/${id}`, {
      name: reviewData.name,
      body: reviewData.text,
      email: reviewData.email || 'user@example.com',
      postId: 1
    });
    
    return {
      id: response.data.id,
      name: reviewData.name,
      text: reviewData.text,
      rating: reviewData.rating,
      email: reviewData.email
    };
  } catch (error) {
    handleError(error);
  }
};

// PATCH - Частичное обновление отзыва
export const patchReview = async (id, updates) => {
  try {
    const response = await apiClient.patch(`/comments/${id}`, updates);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// DELETE - Удаление отзыва
export const deleteReview = async (id) => {
  try {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  patchReview,
  deleteReview
};
