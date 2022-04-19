<template>
    <div class="content__form-wrapper">
        <Loading v-if="loading === true" />
        <form class="content__form" 
            @submit.prevent="setNewUser" 
            v-else-if="!registrationDone"
            >
            <div class="form-title">
                Регистрация
            </div>
            <!-- ============Email ========================== -->
            <label 
                for="email" 
                class="input-label" 
                :class="{label_error: errors.email}"
                >{{emailLabel}}
            </label>
            <input 
                v-model="email" 
                type="email" 
                id="email" 
                class="input" 
                placeholder="Укажите Ваш Email"
                :class="{input_error: errors.email}"
            >
            <!-- ============= Name ======================-->
            <label 
                for="name" 
                class="input-label" 
                :class="{label_error: errors.name}"
                >{{nameLabel}}
            </label>
            <input 
                v-model="name" 
                type="text" 
                id="name" 
                class="input" 
                placeholder="Укажите Ваше имя"
                :class="{input_error: errors.name}"
            >
            <!-- =============== Password ======================= -->
            <label 
                for="password" 
                class="input-label" 
                :class="{label_error: errors.password}"
                >{{passwordLabel}}
            </label>
            <input 
                v-model="password" 
                type="password" 
                id="password" 
                class="input" 
                placeholder="Введите Ваш пароль"
                :class="{input_error: errors.password}"
            >
            <!-- ============== PassswordConfirm ================= -->
            <label 
                for="passwordСonfirm" 
                class="input-label" 
                :class="{label_error: errors.passwordСonfirm}"
                >{{passwordСonfirmLabel}}
            </label>
            <input 
                v-model="passwordСonfirm"
                type="password"
                id="passwordСonfirm"
                class="input"
                placeholder="Введите пароль ещё раз"
                :class="{input_error: errors.passwordСonfirm}"
            >
            <div class="btns">
                <button class="btn">ОТПРАВИТЬ</button>
                <button class="btn" @click.prevent="goToLogin">ОТМЕНА</button>
            </div>
        </form>
        <div class="response" v-else>
            <h1>Регистрация успешно выполнена. <br/>Перейти на страницу авторизации.</h1>
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
            Loading
        },
        data(){
            return{
                email: '',
                emailLabel: 'Логин*',
                name: '',
                nameLabel: 'Имя*',
                password: '',
                passwordLabel: 'Пароль*',
                passwordСonfirm: '',
                passwordСonfirmLabel: 'Подтверждение пароля*',
                registrationDone: false,
                errors: {
                    email: null,
                    name: null,
                    password: null,
                    passwordСonfirm: null
                },
                loading: false
            }
        },
        methods: {
            goToLogin(){
                this.$router.push('/login')
            },
            async setNewUser(){
                this.loading = true
                const response = await axios.post(`${server.BASE_URL}/auth/register`, {
                    email: this.email,
                    name: this.name,
                    password: this.password,
                    passwordConfirm: this.passwordСonfirm
                })
                this.loading = false
                console.log(response.data)
                if(response.data.email){
                    this.errors.email = true
                    this.emailLabel = response.data.email
                }
                if(response.data.name){
                    this.errors.name = true
                    this.nameLabel = response.data.name
                }
                if(response.data.password){
                    this.errors.password = true
                    this.passwordLabel = response.data.password
                }
                if(response.data.passwordConfirm){
                    this.errors.passwordСonfirm = true
                    this.passwordСonfirmLabel = response.data.passwordConfirm
                }
                if(response.data.user){
                    this.registrationDone = true
                }
            }
        },
        watch:{
            email(){
                // Отменяем ошибку
                this.errors.email = null
                // Возвращаем лейбл в исходное состояние
                this.emailLabel = 'Логин*'
            },
            name(){
                // Отменяем ошибку
                this.errors.name = null
                // Возвращаем лейбл в исходное состояние
                this.nameLabel = 'Имя*'
            },
            password(){
                // Отменяем ошибку
                this.errors.password = null
                // Возвращаем лейбл в исходное состояние
                this.passwordLabel = 'Пароль*'
            },
            passwordСonfirm(){
                // Отменяем ошибку
                this.errors.passwordСonfirm = null
                // Возвращаем лейбл в исходное состояние
                this.passwordСonfirmLabel = 'Подтверждение пароля*'
            }
        }
    }
</script>

<style scoped>
    .content__form-wrapper{
        width: 100%;
        height: 100vh;
        display: grid;
        justify-content: center;
        align-items: center;
    }
    .content__form{
        margin-top: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
    }
    .input{
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
    .label_error{
        color: red;
    }
    .input_error{
        border: 2px solid red;
    }
    .btns{
        display: flex;
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
    }
    .btn:hover{
        transition: 0.2s;
        background-color: #f8e003;
        transform: scale(1.1);
    }
    .btn:active{
        transform: scale(1);
    }
    .response{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .response h1 {
        color: #BFBFBF;
        font-family: Arial, Helvetica, sans-serif; 
        line-height: 1.6;
    }
</style>>

