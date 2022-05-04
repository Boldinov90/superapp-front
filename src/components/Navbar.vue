<template>
   <div class="header">
      <div class="header-wrapper container">
         <div class="header-logo">SUPERAPP</div>
         <div class="header-nav" v-if="SUPERAPP.logInStatus">
            <ul class="header-navItemsList">
               <li class="header-navItem">
                  <router-link class="navItem" to="/">Главная</router-link>
               </li>
               <li class="header-navItem">
                  <router-link class="navItem" to="/todo">ToDo</router-link>
               </li>
               <li class="header-navItem">
                  <router-link class="navItem" to="/css-animate"
                     >CSS Анимации</router-link
                  >
               </li>
               <li class="header-navItem">
                  <router-link class="navItem" to="/calculate"
                     >Калькулятор</router-link
                  >
               </li>
               <li class="header-navItem">
                  <router-link
                     class="navItem btn"
                     to="/login"
                     @click.prevent="logOut"
                     >Выйти</router-link
                  >
               </li>
               <div class="header-navItem">
                  <div class="navItem user">{{ SUPERAPP.user.name }}</div>
               </div>
            </ul>
         </div>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
   data() {
      return {
         user: {},
      }
   },
   computed: {
      ...mapGetters(['SUPERAPP']),
   },
   methods: {
      ...mapActions([
         'CLEAR_SUPERAPP_IN_STATE',
         'TOGGLE_LOGIN_STATUS_IN_STATE',
      ]),
      logOut() {
         // Меняем статус авторизации приложения
         this.TOGGLE_LOGIN_STATUS_IN_STATE()
         // Удаляем данные о пользователе из VUEX
         this.CLEAR_SUPERAPP_IN_STATE()
         // Обновляем Local Storage
         localStorage.setItem('superApp', JSON.stringify(this.SUPERAPP))
         this.$router.push('/login')
      },
   },
}
</script>

<style scoped lang="scss">
.header {
   height: 100px;
   display: flex;
   justify-content: center;
   padding-left: 10px;
   padding-right: 10px;
   background-color: #1e1f1c;
   @media (max-width: 1060px) {
      height: 150px;
   }
   .header-wrapper {
      display: flex;
      justify-content: space-around;
      @media (max-width: 1060px) {
         display: grid;
         grid-template-columns: 1fr;
      }
      .header-logo {
         align-self: center;
         color: #d6a812;
         font-family: Arial, Helvetica, sans-serif;
         letter-spacing: 6px;
         font-size: 29px;
         @media (max-width: 1060px) {
            display: flex;
            align-items: center;
            justify-content: center;
         }
      }
      .header-nav {
         display: flex;
         justify-content: center;
         align-items: center;
         @media (max-width: 1060px) {
         }
         .header-navItemsList {
            display: flex;
            justify-content: center;
            align-items: center;
            @media (max-width: 860px) {
               padding-left: 0;
            }
            .header-navItem {
               list-style-type: none;
               .navItem {
                  text-decoration: none;
                  color: #bfbfbf;
                  margin-left: 30px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 18px;
                  letter-spacing: 2px;
                  @media (max-width: 860px) {
                     font-size: 14px;
                  }
               }
               .active {
                  transition: 0.5s;
                  color: #d6a812;
               }
               .btn {
                  height: 20px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 14px;
                  text-decoration: none;
                  padding: 5px 9px 5px 9px;
                  border: 0;
                  border-radius: 8px;
                  background-color: #d6a812;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #1e1f1c;
                  transition: 0.1s;
               }
               .btn:hover {
                  transition: 0.2s;
                  background-color: #f8e003;
                  transform: scale(1.05);
               }
               .btn:active {
                  transform: scale(1);
               }
               .user {
                  font-size: 14px;
                  border-bottom: 1px solid rgb(192, 192, 192);
               }
            }
         }
      }
   }
}
</style>
