import axios from "axios";

export const postLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/user/login', { username, password });

    if (response.status === 200) {
      return {
        token: response.data.token,
        message: response.data.message
      }
    }
  } catch (error) {
    console.log('Error in post Login from backend', error);
  }
}

export const postRegister = async (username: string, password: string, name: string, city: string, state: string, country: string, phone: string) => {
  try {
    const response = await axios.post('/api/user/register', { username, password, name, city, state, country, phone });

    if (response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    console.log('Error in post Register from backend', error);
  }
}