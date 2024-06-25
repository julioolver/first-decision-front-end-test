<template>
  <v-form ref="form" v-model="controller.valid" lazy-validation @submit.prevent>
    <v-card-text>
      <v-text-field
        v-model="controller.user.name"
        :rules="[(v) => !!v || 'Name é obrigatório']"
        label="Nome"
        required
      />
      <v-text-field
        v-model="controller.user.email"
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
        v-model="controller.user.current_password"
        :rules="[(v) => !!v || 'Senha atual é obrigatória']"
        label="Senha atual"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        v-if="dialogMode === 'add' || changePassword"
        v-model="controller.user.password"
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
        v-model="controller.user.password_confirmation"
        :rules="[
          (v) => !!v || 'Confirmação de senaha é obrigatória',
          (v) => v === controller.user.password || 'Senhas não conferem',
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
        @click="handleSubmit"
        variant="outlined"
        type="submit"
        >Salvar</v-btn
      >
      <v-btn color="red" text @click="closeDialog" variant="outlined"
        >Cancelar</v-btn
      >
    </v-card-actions>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  controller: {
    type: Object,
    required: true,
  },
  dialogMode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["submit", "close"]);
const changePassword = ref(false);

const handleSubmit = () => {
  emit("submit");
};

const closeDialog = () => {
  emit("close");
};

const toggleChangePassword = () => {
  changePassword.value = !changePassword.value;
};
</script>
