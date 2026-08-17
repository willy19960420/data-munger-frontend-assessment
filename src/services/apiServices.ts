import stockServices from './stockServices';
import UserService from './userService';

export const apiService = {
  stock: stockServices,
  user: UserService,
};

export default apiService;
