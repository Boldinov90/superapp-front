<template>
   <div class="container welcome animate__animated animate__fadeIn">
      <h1 class="welcome-title animate__animated animate__fadeInLeft">
         Привет!
      </h1>
      <p
         class="welcome-subtitle animate__animated animate__fadeIn animate__delay-1s"
      >
         Эй, {{ SUPERAPP.user.name }}, добро пожаловать в мое первое приложение,
         не имеющее абсолютно никакой смысловой нагрузки, созданное
         исключительно ради практики, демонстрации навыков и на потеху опытным
         разработчикам.
      </p>
      <p
         class="welcome-subtitle animate__animated animate__fadeIn animate__delay-2s"
      >
         Back End написан на Nest.js с помощью NEST/CLI. Применены инструменты:
         typeScript, jwt, passport, mongoose/typegoose, bcrypt, validator. В
         качестве BD используется MongoDB.<br />
         Front End написан на Vue.js с помощью VUE/CLI. Применены инструменты:
         VUEX, VUE-Router, SASS/SCSS, Axios, Animate.css и Google естественно,
         куда же без него &#128521;
      </p>
      <div
         class="travolta-and-google-img-wrapper animate__animated animate__fadeIn animate__delay-3s"
      >
         <img src="@/img/Google-logo.png" alt="picture" class="google-logo" />
         <img src="@/img/travolta.gif" alt="picture" class="travolta" />
      </div>
   </div>
</template>

<script>
import 'animate.css'
import { mapGetters } from 'vuex'
export default {
   computed: {
      ...mapGetters(['SUPERAPP']),
   },
}
</script>

<style scoped lang="scss">
* {
   display: flex;
   justify-content: center;
   align-items: center;
   font-family: Arial, Helvetica, sans-serif;
   .welcome {
      margin-top: 100px;
      flex-direction: column;
      @media (max-width: 1060px) {
         margin-top: 150px;
      }
      .welcome-title {
         color: blanchedalmond;
      }
      .welcome-subtitle {
         width: 800px;
         line-height: 1.6;
         letter-spacing: 1.1px;
         color: rgba(163, 159, 151, 0.863);
         --animate-delay: 0.5s;
         @media (max-width: 860px) {
            width: 700px;
         }
      }
      .travolta-and-google-img-wrapper {
         margin-top: 30px;
         --animate-delay: 0.5s;
         .google-logo {
            width: 400px;
         }
      }
   }
}
</style>
