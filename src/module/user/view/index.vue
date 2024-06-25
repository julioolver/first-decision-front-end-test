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
        <user-form
          :controller="userController"
          :dialogMode="dialogMode"
          @submit="saveUser"
          @close="closeDialog"
        />
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
import UserForm from "../components/userForm.vue";

const userController = new UserController();
const showDialog = ref(false);
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

const saveUser = async () => {
  if (userController.valid) {
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
