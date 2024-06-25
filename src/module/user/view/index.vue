<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="userController.headers"
          :items="users"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>CRUD de usuários</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="openDialog('add')"
                variant="outlined"
                >Adicionar</v-btn
              >
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="openDialog('edit', item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="removeUser(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ dialogMode === "add" ? "Adicionar" : "Editar" }} Usuário</span
          >
        </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
          <v-card-text>
            <v-text-field
              v-model="userController.user.name"
              :rules="[(v) => !!v || 'Name é obrigatório']"
              label="Nome"
              required
            />
            <v-text-field
              v-model="userController.user.email"
              :rules="[
                (v) => !!v || 'Email é obrigatório',
                (v) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
              ]"
              label="E-mail"
              required
            />
            <v-btn
              v-if="dialogMode === 'edit'"
              color="primary"
              @click="toggleChangePassword"
              variant="outlined"
              >Alterar senha</v-btn
            >
            <v-text-field
              v-if="changePassword"
              v-model="userController.user.current_password"
              :rules="[(v) => !!v || 'Senha atual é obrigatória']"
              label="Senha atual"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              v-if="dialogMode === 'add' || changePassword"
              v-model="userController.user.password"
              :rules="[
                (v) => !!v || 'Senha é obrigatório',
                (v) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
              ]"
              label="Senha"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              v-if="dialogMode === 'add' || changePassword"
              v-model="userController.user.password_confirmation"
              :rules="[
                (v) => !!v || 'Confirmação de senaha é obrigatória',
                (v) =>
                  v === userController.user.password || 'Senhas não conferem',
              ]"
              label="Confirmação de senha"
              type="password"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="saveUser"
              variant="outlined"
              type="submit"
              >Salvar</v-btn
            >
            <v-btn color="red" text @click="closeDialog" variant="outlined"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-snackbar
      :multi-line="true"
      v-model="userController.snackbar.show"
      timeout="4000"
      :color="userController.snackbar.color"
    >
      <p v-html="userController.snackbar.text"></p>

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="userController.snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserController } from "../controller/userController"; // Certifique-se de que o caminho está correto
import type { UserType as User } from "../types/UserType";
import { User as UserModel } from "../model/User";

const userController = new UserController();
const showDialog = ref(false);
const valid = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const changePassword = ref(false);

const users = ref<User[]>([]);

const fetchUsers = async () => {
  users.value = await userController.getAllUsers();
};

onMounted(fetchUsers);

const openDialog = (mode: "add" | "edit", user: User = new UserModel()) => {
  dialogMode.value = mode;
  userController.user.id = user.id;
  userController.user.name = user.name;
  userController.user.email = user.email;
  userController.user.password = "";
  userController.user.password_confirmation = "";
  userController.user.current_password = "";
  changePassword.value = false;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const toggleChangePassword = () => {
  changePassword.value = !changePassword.value;
};

const saveUser = async () => {
  if (valid.value) {
    if (dialogMode.value === "add") {
      await userController.createUser();
    } else {
      await userController.updateUser();
    }
    await fetchUsers();
    closeDialog();
  }
};

const removeUser = async (user: User) => {
  await userController.deleteUser(user.id!);
  await fetchUsers();
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
