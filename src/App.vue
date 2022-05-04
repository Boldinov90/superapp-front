<template>
   <Navbar class="navbar" />
   <router-view />
</template>

<script>
import Navbar from './components/Navbar.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
   components: {
      Navbar,
   },
   computed: {
      ...mapGetters(['SUPERAPP']),
   },
   methods: {
      ...mapActions([
         'SET_DATA_FROM_LOCALSTORAGE_TO_STATE',
         'GET_USERTODO_BY_ID_AND_SAVE_TO_STATE',
      ]),
   },
   beforeMount() {
      // Записываем данные из LocalStorage во VUEX
      this.SET_DATA_FROM_LOCALSTORAGE_TO_STATE()
      // // Если вход выполнен
      if (this.SUPERAPP.logInStatus) {
         // Записываем список задач с сервера во VUEX
         this.GET_USERTODO_BY_ID_AND_SAVE_TO_STATE()
      } else {
         // Отображаем страницу логина
         this.$router.push('/login')
      }
   },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700&display=swap');
* {
   -ms-user-select: none;
   -moz-user-select: none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   user-select: none;
}
.navbar {
   position: fixed;
   left: 0;
   right: 0;
   top: 0;
   background-color: #1e1f1c;
   z-index: 99;
}
body {
   background-color: #1e1f1c;
   margin: 0;
   padding: 0;
}
.container {
   margin: 0 auto;
   max-width: 1200px;
   padding-left: 10px;
   padding-right: 10px;
}
</style>
