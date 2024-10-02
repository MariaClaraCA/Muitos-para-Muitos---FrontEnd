
class AuthService {
  login(token) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  getToken() {
    const token = localStorage.getItem('token');
    console.log('Token obtido do localStorage:', token);
    return token;
  }
}

const authService = new AuthService();
export default authService;
