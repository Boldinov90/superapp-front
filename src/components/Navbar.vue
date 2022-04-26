<template>
    <div class="header">
        <div class="header__wrapper container">
            <div class="header__logo">
                SUPERAPP
            </div>
            <div class="header__nav" v-if="SUPERAPP.logInStatus">
                <ul class="header__navItemsList">
                    <li class="header__navItem">
                        <router-link class="navItem" to="/">Главная</router-link>
                    </li>
                    <li class="header__navItem">
                        <router-link class="navItem" to="/todo">ToDo</router-link>
                    </li>
                    <li class="header__navItem">
                        <router-link class="navItem" to="/css-animate">CSS Анимации</router-link>
                    </li>
                    <li class="header__navItem">
                        <router-link class="navItem" to="/calculate">Калькулятор</router-link>
                    </li>
                    <li class="header__navItem">
                        <router-link class="navItem btn" to="/login" @click.prevent="logOut">Выйти</router-link>
                    </li>
                    <div class="header__navItem">
                        <div class="navItem user">{{SUPERAPP.user.name}}</div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        data(){
            return{
                user: {}
            }
        },
        computed: {
            ...mapGetters([
                'LOGINSTATUS'
            ])
        },
        methods: {
            ...mapActions([
                'CLEAR_SUPERAPP_IN_STATE',
                'TOGGLE_LOGIN_STATUS_IN_STATE'
            ]),
            logOut(){
                // Меняем статус авторизации приложения
                this.TOGGLE_LOGIN_STATUS_IN_STATE()
                // Удаляем данные о пользователе из VUEX
                this.CLEAR_SUPERAPP_IN_STATE()
                // Обновляем Local Storage
                localStorage.setItem('superApp', JSON.stringify(this.SUPERAPP))
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped lang="scss">
    .header{
        height: 100px;
        display: flex;
        justify-content: center;
        padding-left: 10px;
        padding-right: 10px;
        .header__wrapper{
            width: 100%;
            display: flex;
            justify-content: space-around;
            .header__logo{
                align-self: center;
                color: #d6a812;
                font-family: Arial, Helvetica, sans-serif;
                letter-spacing: 6px;
                font-size: 29px;
            }
            .header__nav{
                display: flex;
                justify-content: center;
                align-items: center;
                .header__navItemsList{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .header__navItem{
                        list-style-type: none;
                        .navItem{
                            text-decoration: none;
                            color: #BFBFBF;
                            margin-left: 30px;
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 18px;
                            letter-spacing: 2px;
                        }
                        .active{
                            transition: 0.5s;
                            color: #d6a812;
                        }
                        .btn{
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
                            color: #1E1F1C;
                            transition: 0.1s;
                        }
                        .btn:hover{
                            transition: 0.2s;
                            background-color: #f8e003;
                            transform: scale(1.05);
                        }
                        .btn:active{
                            transform: scale(1);
                        }
                        .user{
                            font-size: 14px;
                            border-bottom: 1px solid rgb(192, 192, 192);
                        }
                    }
                }
            }
        }
    }
</style>