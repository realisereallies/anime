// Утилита для правильного декодирования JWT токенов с поддержкой кириллических символов
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Утилита для получения данных пользователя из JWT токена
export function getUserFromToken(token: string) {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }
  
  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name || payload.email || 'Пользователь'
  };
}
