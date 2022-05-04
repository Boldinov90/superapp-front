<template>
   <section class="content container">
      <div class="content-text">
         <div class="text-title">
            Welcome to my test application and make yourself at home.
         </div>
         <div class="text-subtitle">
            Войдите под своей учетной записью, если таковая отсутствует -
            зарегистрируйтесь. При регистрации используйте любой выдуманный
            электронный адрес. Данный функционал создан для ознакомления и
            демонстрации навыка и не нацелен на безопасность. В качестве базы
            данных задействован MongoDB.
         </div>
      </div>
      <div class="content-form-wrapper">
         <!-- Компонент лоадера -->
         <Loading v-if="loading === true" />
         <form v-else class="content-form" @submit.prevent="logIn">
            <div class="form-title">Авторизация</div>
            <label
               for="login"
               class="input-label"
               :class="{ label_error: errors.login == true }"
               >{{ loginInputLabel }}</label
            >
            <input
               id="login"
               v-model="loginInput"
               type="email"
               class="input"
               :class="{ input_error: errors.login == true }"
               placeholder="Введите Ваш Email"
            />
            <label
               for="password"
               class="input-label"
               :class="{ label_error: errors.password == true }"
               >{{ passwordInputLabel }}</label
            >
            <input
               id="password"
               v-model="passwordInput"
               type="password"
               class="input"
               :class="{ input_error: errors.password == true }"
               placeholder="Введите Ваш пароль"
            />
            <div class="btns">
               <button class="btn">ВОЙТИ</button>
               <button class="btn" @click.prevent="goToRegistration">
                  РЕГИСТРАЦИЯ
               </button>
            </div>
         </form>
      </div>
   </section>
</template>

<script>
import axios from 'axios'
import Loading from '../components/Loading.vue'
import { server } from '../utils/helper'
import { mapActions, mapGetters } from 'vuex'
export default {
   components: {
      Loading,
   },
   data() {
      return {
         loginInput: '',
         loginInputLabel: 'Логин*',
         passwordInput: '',
         passwordInputLabel: 'Пароль*',
         errors: {
            login: null,
            password: null,
         },
         loading: false,
      }
   },
   computed: {
      ...mapGetters(['SUPERAPP']),
   },
   methods: {
      ...mapActions([
         'SET_USER_TO_STATE',
         'TOGGLE_LOGIN_STATUS_IN_STATE',
         'SET_TODO_TO_STATE',
      ]),
      // Функция входа в систему
      async logIn() {
         // Запускаем лоадер
         this.loading = true
         // Отправляем логин и пароль, введенные в форме, на сервер (валидация происходить на стороне сервера)
         const response = await axios.post(`${server.BASE_URL}/auth/login`, {
            email: this.loginInput,
            password: this.passwordInput,
         })
         setTimeout(() => {
            // После получения ответа с сервера отключаем лоадер
            this.loading = false
         }, 2000)

         // Если в ответе есть ошибка валидации Email
         if (response.data.email) {
            // Записываем ошибку
            this.errors.login = true
            // Передаем текст ошибки в label формы
            this.loginInputLabel = response.data.email
         }
         // Если в ответе есть ошибка валидации пароля
         if (response.data.password) {
            // Записываем ошибку
            this.errors.password = true
            // Передаем текст ошибки в label формы
            this.passwordInputLabel = response.data.password
         }
         // Если ответ пришел с успешной валидацией
         if (response.data.user) {
            // Фиксируем успешный вход в систему
            this.registrationDone = true
            // Записываем во VUEX статус входа в систему
            this.TOGGLE_LOGIN_STATUS_IN_STATE()
            // Записываем во VUEX данные пользователя (id и name)
            this.SET_USER_TO_STATE(response)
            // Записываем во VUEX список задач пользователя
            this.SET_TODO_TO_STATE(response)
            // Создаем модель для localStorage, записываем данные пользователя и статус входа в систему
            const lS = {
               logInStatus: this.SUPERAPP.logInStatus,
               user: {
                  id: this.SUPERAPP.user.id,
                  name: this.SUPERAPP.user.name,
               },
            }
            // Записываем данные в LocalStorage
            localStorage.setItem('superApp', JSON.stringify(lS))
            // Переходим на главную страницу приложения
            this.$router.push('/')
         }
      },
      // Функция перехода на страницу регистрации (один из вариантов, можно сделать в html через "<router-link to=...")
      goToRegistration() {
         this.$router.push('/registration')
      },
   },
   watch: {
      loginInput() {
         // Отменяем ошибку
         this.errors.login = null
         // Возвращаем лейбл в исходное состояние
         this.loginInputLabel = 'Логин*'
      },
      passwordInput() {
         // Отменяем ошибку
         this.errors.password = null
         // Возвращаем лейбл в исходное состояние
         this.passwordInputLabel = 'Пароль*'
      },
   },
}
</script>

<style scoped lang="scss">
.content {
   margin: 0 auto;
   height: 700px;
   margin-top: 100px;
   display: grid;
   grid-template-columns: 1fr 1fr;
   justify-content: center;
   align-items: center;
   @media (max-width: 1025px) {
      display: grid;
      grid-template-columns: 1fr;
   }
   .content-text {
      @media (max-width: 1025px) {
         margin-top: 100px;
      }
      @media (max-width: 769px) {
         margin-top: 20px;
      }
      .text-title {
         padding: 15px;
         color: #bfbfbf;
         font-family: Arial, Helvetica, sans-serif;
         letter-spacing: 2px;
         font-weight: bold;
         font-size: 40px;
         text-transform: uppercase;
         @media (max-width: 1200px) {
            font-size: 30px;
         }
         @media (max-width: 1025px) {
            font-size: 46px;
            text-align: center;
         }
         @media (max-width: 769px) {
            font-size: 44px;
            padding: 15px;
         }
      }
      .text-subtitle {
         padding: 15px;
         margin-top: 20px;
         color: #bfbfbf;
         font-family: Arial, Helvetica, sans-serif;
         letter-spacing: 1px;
         font-size: 18px;
         line-height: 24px;
         padding-right: 50px;
         @media (max-width: 1200px) {
            font-size: 14px;
            line-height: 20px;
         }
         @media (max-width: 1025px) {
            padding-left: 80px;
            padding-right: 80px;
            font-size: 24px;
            line-height: 30px;
            text-align: center;
         }
         @media (max-width: 769px) {
            margin-left: 30px;
            margin-right: 30px;
            padding-left: 40px;
            padding-right: 40px;
            font-size: 18px;
            line-height: 24px;
         }
      }
   }
   .content-form-wrapper {
      padding-left: 15px;
      padding-right: 15px;
      @media (max-width: 1025px) {
         display: grid;
         align-self: flex-start;
         padding-left: 200px;
         padding-right: 200px;
      }
      @media (max-width: 769px) {
         margin-left: 150px;
         margin-right: 150px;
         display: grid;
         align-self: flex-start;
         padding-left: 0px;
         padding-right: 0px;
      }
      .content-form {
         display: grid;
         grid-template-columns: 1fr;
         align-items: center;
         box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.603);
         border-radius: 10px;
         padding: 30px;
         @media (max-width: 1025px) {
            margin-top: 100px;
         }
         @media (max-width: 769px) {
            margin-top: 10px;
            padding: 10px;
         }
         .form-title {
            color: #bfbfbf;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 2px;
            font-size: 26px;
            text-transform: uppercase;
            text-align: center;
         }
         .input-label {
            margin-top: 30px;
            color: #bfbfbf;
            font-family: Arial, Helvetica, sans-serif;
            align-self: flex-start;
         }
         .input {
            margin-top: 7px;
            padding: 10px;
            border: 0;
            border-radius: 8px;
            align-self: flex-start;
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
            justify-content: center;
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
               margin-left: 15px;
               margin-right: 15px;
               transition: 0.1s;
            }
            .btn:hover {
               transition: 0.2s;
               background-color: #f8e003;
               transform: scale(1.1);
            }
            .btn:active {
               transform: scale(1);
            }
         }
      }
   }
}
</style>
