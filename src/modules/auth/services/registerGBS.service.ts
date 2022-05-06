import axios from 'axios';

import CustomerGBS from '../types/customerGBS.type';
import UserGBS from '../types/userGBS.type';

/* ––
 * –––– Class declaration
 * –––––––––––––––––––––––––––––––––– */
class RegisterGBSDataService {
  instance = axios.create({
    baseURL: `${import.meta.env.VITE_GBS_REGISTER_URL}`,
    headers: {
      'Content-type': 'application/json',
    },
  });
  create(data: UserGBS) {
    return this.instance.post<UserGBS>('/Api/Signup.asmx/CreateMyAccountExternal', data);
  }
  getToken() {
    return this.instance.post('/Api/Login.asmx/TemporalTokenExternal', { customerId: null });
  }
  getUserToken(data: CustomerGBS) {
    return this.instance.post<CustomerGBS>('/Api/Integrations.asmx/GenerateToken', data);
  }
}

export default new RegisterGBSDataService();
