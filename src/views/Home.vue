<template>
   <div class="container welcome animate__animated animate__fadeIn">
      <h1 class="welcome-title animate__animated animate__fadeInLeft">
         Привет!
      </h1>
      <p
         class="welcome-subtitle animate__animated animate__fadeIn animate__delay-1s"
      >
         Эй, {{ $store.state.superApp.user.name }}, добро пожаловать в мое
         первое приложение, не имеющее абсолютно никакой смысловой нагрузки,
         созданное исключительно ради практики, демонстрации навыков и на потеху
         опытным разработчикам.
      </p>
      <p
         class="welcome-subtitle animate__animated animate__fadeIn animate__delay-2s"
      >
         Работа написана на VUEJS с помощью VUE CLI. Применены инструменты:
         VUEX, VUE-Router, Firebase, Axios, Animate.css и Google естественно,
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
import Animate from 'animate.css'
export default {
   components: {
      Animate,
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
      margin-top: 120px;
      flex-direction: column;
      .welcome-title {
         color: blanchedalmond;
      }
      .welcome-subtitle {
         width: 800px;
         line-height: 1.6;
         letter-spacing: 1.1px;
         color: rgba(163, 159, 151, 0.863);
         --animate-delay: 0.5s;
      }
      .travolta-and-google-img-wrapper {
         margin-top: 70px;
         --animate-delay: 0.5s;
         .google-logo {
            width: 400px;
         }
      }
   }
}
</style>
