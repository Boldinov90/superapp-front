<template>
    <Navbar class="navbar"/>
    <router-view/>
</template>

<script>
    import Navbar from './components/Navbar.vue'
    import {mapActions} from 'vuex'
    export default {
        components: {
            Navbar
        },
        methods: {
            ...mapActions([
                'SET_DATA_FROM_LOCALSTORAGE_TO_STATE'
            ]),
        },
        // При загрузке страницы
        beforeMount(){
            this.SET_DATA_FROM_LOCALSTORAGE_TO_STATE()
        }
    }
</script>

<style>
    *{ 
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .navbar{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background-color: #1E1F1C;
        z-index: 99;
    }
    
    body{
        background-color: #1E1F1C;
        margin: 0;
        padding: 0;
    }
    .container{
        margin: 0 auto;
        max-width: 1200px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>