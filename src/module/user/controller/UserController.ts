import { reactive, ref } from 'vue';
import axios from '@/plugins/axios';
import { UserType } from '../types/UserType';


class UserController {
  valid = ref(false);
  showDialog = ref(false);

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
      
      this.snackbarInit({
        show: true,
        text: 'Usuário cadastrado com sucesso!'
      })

      this.showDialog.value = false;
      return response.data;
    } catch (error: any) {
      this.catchErrors(error)
    }
  }

  async updateUser() {
    try {
      const response = await axios.put(`/users/${this.user.id}`, this.user);

      this.snackbarInit({
        show: true,
        text: 'Usuário atualizado com sucesso!'
      })

      this.showDialog.value = false;

      return response.data;
    } catch (error) {
      this.catchErrors(error);
    }
  }

  async deleteUser(userId: number) {
    try {
      const response = await axios.delete(`/users/${userId}`);

      this.snackbarInit({
        show: true,
        text: 'Usuário excluído com sucesso!'
      })

      return response.data;
    } catch (error) {
      this.catchErrors(error);
    }
  }

  async getAllUsers() {
    try {
      const response = await axios.get('/users');

      return response.data.data;
    } catch (error) {
      this.catchErrors(error);
      return [];
    }
  }

  snackbarInit({
      color = 'green',
      text = '',
      show = false

    }) {
    this.snackbar.color = color;
    this.snackbar.show = show;
    this.snackbar.text = text;
  }

  catchErrors(error: any) {
    let messageError = this.catchStatusCodeErrors(error);

      this.snackbarInit({
        show: true,
        text: messageError,
        color: 'red'
      })
  }

  catchStatusCodeErrors(error: any): string {
    if (error.response && error.response.status === 422) {
      return Object.values(error.response.data.errors).flat().join("<br>");
    }

    if (error.code === "ERR_NETWORK") {
      return 'Ocorreu uma inconsistência oa estabelecer a conexão com o servidor.'
    }

    return error.message
  }
}

export { UserController };
