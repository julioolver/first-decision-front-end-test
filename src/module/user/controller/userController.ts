import { reactive } from 'vue';
import axios from '@/plugins/axios';
import { UserType } from '../types/UserType';


class UserController {
  user = reactive<UserType>({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  snackbar = reactive({
    show: false,
    text: '',
    color: 'green'
  })

  headers = [
    { title: "Código", key: "id" },
    { title: "Nome", key: "name" },
    { title: "E-mail", key: "email" },
    { title: "Ações", key: "actions", sortable: false },
  ];

  async createUser() {
    try {
      const response = await axios.post('/users', this.user);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        console.error('Validation errors:', error.response.data.errors);

        this.snackbar.show = true;
        this.snackbar.text = Object.values(error.response.data.errors).flat().join("<br>");
        this.snackbar.color = 'red'

        return error.response.data.errors;
      }
      console.error('Error creating user:', error);
    }
  }

  async updateUser() {
    try {
      const response = await axios.put(`/users/${this.user.id}`, this.user);

      this.snackbar.color = 'green';
      this.snackbar.show = true;
      this.snackbar.text = 'Usuário atualizado com sucesso!';
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async deleteUser(userId: number) {
    try {
      const response = await axios.delete(`/users/${userId}`);
      console.log('User deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async getAllUsers() {
    try {
      const response = await axios.get('/users');

      return response.data.data;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
}

export { UserController };
