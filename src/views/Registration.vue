<template>
   <div class="content-form-wrapper">
      <Loading v-if="loading === true" class="loader" />
      <form
         v-else-if="!registrationDone"
         class="content-form"
         @submit.prevent="setNewUser"
      >
         <div class="form-title">Регистрация</div>
         <!-- ============Email ========================== -->
         <label
            for="email"
            class="input-label"
            :class="{ label_error: errors.email }"
            >{{ emailLabel }}
         </label>
         <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="Укажите Ваш Email"
            :class="{ input_error: errors.email }"
         />
         <!-- ============= Name ======================-->
         <label
            for="name"
            class="input-label"
            :class="{ label_error: errors.name }"
            >{{ nameLabel }}
         </label>
         <input
            id="name"
            v-model="name"
            type="text"
            class="input"
            placeholder="Укажите Ваше имя"
            :class="{ input_error: errors.name }"
         />
         <!-- =============== Password ======================= -->
         <label
            for="password"
            class="input-label"
            :class="{ label_error: errors.password }"
            >{{ passwordLabel }}
         </label>
         <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="Введите Ваш пароль"
            :class="{ input_error: errors.password }"
         />
         <!-- ============== PassswordConfirm ================= -->
         <label
            for="passwordСonfirm"
            class="input-label"
            :class="{ label_error: errors.passwordConfirm }"
            >{{ passwordConfirmLabel }}
         </label>
         <input
            id="passwordСonfirm"
            v-model="passwordConfirm"
            type="password"
            class="input"
            placeholder="Введите пароль ещё раз"
            :class="{ input_error: errors.passwordConfirm }"
         />
         <div class="btns">
            <button class="btn">ОТПРАВИТЬ</button>
            <button class="btn" @click.prevent="goToLogin">ОТМЕНА</button>
         </div>
      </form>
      <div v-else class="response">
         <h1>
            Регистрация успешно выполнена. <br />Перейти на страницу
            авторизации.
         </h1>
         <button class="btn" @click.prevent="goToLogin">ПЕРЕЙТИ</button>
      </div>
   </div>
</template>

<script>
import axios from 'axios'
import Loading from '../components/Loading.vue'
import { server } from '../utils/helper'
export default {
   components: {
      Loading,
   },
   data() {
      return {
         email: '',
         emailLabel: 'Логин*',
         name: '',
         nameLabel: 'Имя*',
         password: '',
         passwordLabel: 'Пароль*',
         passwordConfirm: '',
         passwordConfirmLabel: 'Подтверждение пароля*',
         registrationDone: false,
         errors: {
            email: null,
            name: null,
            password: null,
            passwordConfirm: null,
         },
         loading: false,
      }
   },
   watch: {
      email() {
         // Отменяем ошибку
         this.errors.email = null
         // Возвращаем лейбл в исходное состояние
         this.emailLabel = 'Логин*'
      },
      name() {
         // Отменяем ошибку
         this.errors.name = null
         // Возвращаем лейбл в исходное состояние
         this.nameLabel = 'Имя*'
      },
      password() {
         // Отменяем ошибку
         this.errors.password = null
         // Возвращаем лейбл в исходное состояние
         this.passwordLabel = 'Пароль*'
      },
      passwordСonfirm() {
         // Отменяем ошибку
         this.errors.passwordConfirm = null
         // Возвращаем лейбл в исходное состояние
         this.passwordConfirmLabel = 'Подтверждение пароля*'
      },
   },
   methods: {
      // Переход на страницу логина
      goToLogin() {
         this.$router.push('/login')
      },
      // Регистрация
      async setNewUser() {
         // Запускаем loader
         this.loading = true
         // Отправляем введенную информацию на сервер
         const response = await axios.post(`${server.BASE_URL}/auth/register`, {
            email: this.email,
            name: this.name,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
         })
         setTimeout(() => {
            // После получения ответа с сервера отключаем лоадер
            this.loading = false
         }, 2000)
         // Если в ответе с сервера есть ошибка Email
         if (response.data.email) {
            // Записываем ошибку
            this.errors.email = true
            // Передаем текст ошибки в label формы
            this.emailLabel = response.data.email
         }
         // Если в ответе с сервера есть ошибка Name
         if (response.data.name) {
            // Записываем ошибку
            this.errors.name = true
            // Передаем текст ошибки в label формы
            this.nameLabel = response.data.name
         }
         // Если в ответе с сервера есть ошибка Password
         if (response.data.password) {
            // Записываем ошибку
            this.errors.password = true
            // Передаем текст ошибки в label формы
            this.passwordLabel = response.data.password
         }
         // Если в ответе с сервера есть ошибка PasswordConfirm
         if (response.data.passwordConfirm) {
            // Записываем ошибку
            this.errors.passwordConfirm = true
            // Передаем текст ошибки в label формы
            this.passwordConfirmLabel = response.data.passwordConfirm
         }
         // Если в ответе с сервера ошибок нет
         if (response.data.user) {
            // Фиксируем успешную регистрацию
            this.registrationDone = true
         }
      },
   },
}
</script>

<style scoped lang="scss">
@mixin btn {
   .btn {
      text-decoration: none;
      margin-top: 30px;
      border: 0;
      border-radius: 8px;
      background-color: #d6a812;
      width: 150px;
      height: 40px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      letter-spacing: 1px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1e1f1c;
      margin-right: 30px;
   }
   .btn:active {
      transform: scale(1);
   }
   .btn:hover {
      transition: 0.2s;
      background-color: #f8e003;
      transform: scale(1.1);
   }
}

.content-form-wrapper {
   width: 100%;
   height: 100vh;
   display: grid;
   justify-content: center;
   align-items: center;
   .loader {
      margin-right: 190px;
   }
   .content-form {
      margin-top: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.603);
      border-radius: 10px;
      padding: 20px;
      .form-title {
         color: #bfbfbf;
         font-family: Arial, Helvetica, sans-serif;
         letter-spacing: 2px;
         font-size: 26px;
         text-transform: uppercase;
      }
      .input-label {
         margin-top: 30px;
         color: #bfbfbf;
         font-family: Arial, Helvetica, sans-serif;
      }
      .input {
         margin-top: 7px;
         padding: 10px;
         border: 0;
         border-radius: 8px;
         width: 400px;
         height: 30px;
         font-family: Arial, Helvetica, sans-serif;
         font-size: 18px;
         box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.67) inset;
      }
      .label_error {
         color: red;
      }
      .input_error {
         border: 2px solid red;
      }
      .btns {
         display: flex;
         @include btn;
      }
   }
   .response {
      @include btn;
   }
   .response h1 {
      color: #bfbfbf;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
   }
}
</style>
>
