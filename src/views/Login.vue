<template>
    <section class="content container">
        <div class="content__text">
            <div class="text-title">
                Welcome to my test application and make yourself at home. 
            </div>
            <div class="text-subtitle">
                Войдите под своей учетной записью, если таковая отсутствует - зарегистрируйтесь. При регистрации используйте любой выдуманный электронный адрес. Данный функционал создан для ознакомления и демонстрации навыка и не нацелен на безопасность. В качестве базы данных задействован Firebase.
            </div>
        </div>
        <div class="content__form-wrapper">
            <!-- Компонент лоадера -->
            <Loading v-if="loading === true" />
            <form class="content__form" @submit.prevent="logIn" v-else>
                <div class="form-title">
                    Авторизация
                </div>
                <label for="login" class="input-label" :class="{label_error: errors.login == true}">{{loginInputLabel}}</label>
                <input v-model="loginInput" type="email" id="login" class="input" :class="{input_error: errors.login == true}" placeholder="Введите Ваш Email">
                <label for="password" class="input-label" :class="{label_error: errors.password == true}">{{passwordInputLabel}}</label>
                <input v-model="passwordInput" type="password" id="password" class="input" :class="{input_error: errors.password == true}" placeholder="Введите Ваш пароль">
                <div class="btns">
                    <button class="btn">ВОЙТИ</button>
                    <button class="btn" @click.prevent="goToRegistration">РЕГИСТРАЦИЯ</button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
    import axios from 'axios'
    import Loading from '../components/Loading.vue'
    export default {
        components: {
            Loading
        },
        data(){
            return{
                loginInput: '',
                loginInputLabel: 'Логин*',
                passwordInput: '',
                passwordInputLabel: 'Пароль*',
                errors: {
                    login: null,
                    password: null
                },
                loading: false
            }
        },
        methods: {
            // Функция входа в систему
            async logIn(){
                this.loading = true
                // Запрос на сервер и получение массива с пользователями
                const {data} = await axios.get('https://superapp-boldinov-default-rtdb.firebaseio.com/Arr/users.json')
                const arreyUsers = Object.keys(data).map(key => {
                    return {
                        id: key,
                        ...data[key]
                    }
                })
                this.loading = false

                // ================= Валидация EMAIL =====================
                // Проверка введено ли что нибудь в поле email
                if(this.loginInput.length === 0){  
                    // Записываем ошибку
                    this.errors.login = true
                    // Выводим в лейбле сообщение об ошибке
                    this.loginInputLabel = 'Поле не может быть пустым*'
                }else{
                    // Отменяем ошибку
                    this.errors.login = null
                    // Возвращаем лейбл в исходное состояние
                    this.loginInputLabel = 'Логин*'
                    // Проверка есть ли данный пользователь на сервере
                    // Если пользователь отсутствует
                    if(arreyUsers.find(user => user.email === this.loginInput) === undefined){
                        // Записываем ошибку
                        this.errors.login = true
                        // Выводим в лейбле сообщение об ошибке
                        this.loginInputLabel = 'Пользователь не найден. Зарегистрируйтесь*'
                    }else{
                        // Поиск пользователя в массиве с логином из инпута и запись объекта во vuex
                        this.$store.state.superApp = arreyUsers.find(user => user.email === this.loginInput)
                    }
                }

                // ================= Валидация PASSWORD =====================
                // Проверка введено ли что нибудь в поле password
                if(this.passwordInput.length === 0){
                    // Записываем ошибку
                    this.errors.password = true
                    // Выводим в лейбле сообщение об ошибке
                    this.passwordInputLabel = 'Поле не может быть пустым*'
                }else{
                    // Отменяем ошибку
                    this.errors.password = null
                    // Возвращаем лейбл в исходное состояние
                    this.passwordLabel = 'Пароль*'
                    if(this.$store.state.superApp.password !== this.passwordInput){
                        // Записываем ошибку
                        this.errors.password = true
                        // Выводим в лейбле сообщение об ошибке
                        this.passwordInputLabel = 'Пароль неверный*'
                    }else{
                        // Обозначение во vuex, что авторизация произведена
                        this.$store.state.superApp.logInTrue = true
                        // Обозначение в localstorage данные пользователя, и что авторизация произведена
                        localStorage.setItem('superApp', JSON.stringify(this.$store.state.superApp))
                        // Переход на главную страницу
                        this.$router.push('/')
                    }
                }
            },
            // Функция перехода на страницу регистрации (просто образец, можно сделать в html через "<router-link to=...")
            goToRegistration(){
                this.$router.push('/registration')
            }
        },
        watch: {
            loginInput(){
                // Отменяем ошибку
                this.errors.login = null
                // Возвращаем лейбл в исходное состояние
                this.loginInputLabel = 'Логин*'
            },
            passwordInput(){
                // Отменяем ошибку
                this.errors.password = null
                // Возвращаем лейбл в исходное состояние
                this.passwordInputLabel = 'Пароль*'
            }
        }
    }
</script>


<style scoped>
    .content{
        margin: 0 auto;
    }
    .content{
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin-top: 50px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: center;
        align-items: center;
    }

    .text-title{
        color: #BFBFBF;
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 40px;
        text-transform: uppercase;
    }
    .text-subtitle{
        margin-top: 20px;
        color: #BFBFBF;
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: 1px;
        font-size: 18px;
        line-height: 24px;
        padding-right: 50px;
    }
    .login-info{
        color: #d6a812;
    }
    .content__form-wrapper{
        padding-left: 70px;
        padding-right: 70px;
    }
    .content__form{
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.603);
        border-radius: 10px;
        padding: 20px;
    }
    .form-title{
        color: #BFBFBF;
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: 2px;
        font-size: 26px;
        text-transform: uppercase;
    }
    .input-label{
        margin-top: 30px;
        color: #BFBFBF;
        font-family: Arial, Helvetica, sans-serif;
        align-self: flex-start;
    }
    .input{
        margin-top: 7px;
        padding: 10px;
        border: 0;
        border-radius: 8px;
        align-self: flex-start;
        width: 400px;
        height: 30px;
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 18px;
        box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.67) inset;  
    }
    .label_error{
        color: red;
    }
    .input_error{
        border: 2px solid red;
    }
    .btns{
        display: flex;
        align-self: flex-start;
    }
    .btn{
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
        color: #1E1F1C;
        margin-right: 30px;
        transition: 0.1s;
    }
    .btn:hover{
        transition: 0.2s;
        background-color: #f8e003;
        transform: scale(1.1);
    }
    .btn:active{
        transform: scale(1);
    }
</style>
