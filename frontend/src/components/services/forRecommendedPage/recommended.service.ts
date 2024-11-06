import axios from "axios";

export const getUsers = async (username: string | undefined) => {
  try {
    const response = await axios.get(`/api/recommended/users/${username}`, { params: { 
        username: username,
      }
    });

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.log('Error in get users from backend', error);
  }
} 