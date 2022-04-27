<template>
    <div class="wrapper">
        <div class="ball-pendulum" v-for="ball of animationThree.sumBalls" :key="ball"></div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                animationThree: {
                    sumBalls: 7
                }
            }
        }
    }
</script>

<style scoped>
    .wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 50%;
    }

    .ball-pendulum {
        background-color: #d6a812;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        margin-left: 10px;
        margin-right: 10px;
        transform-origin: 500% center;
        position: absolute;
        animation: pendulum 2.5s infinite ease-in-out;
    }
    .ball-pendulum:nth-child(2) {
        animation-delay: 250ms;
        background-color: #d61212;
    }
    .ball-pendulum:nth-child(3) {
        animation-delay: 500ms;
        background-color: #169b07;
    }
    .ball-pendulum:nth-child(4) {
        animation-delay: 750ms;
        background-color: #1512d6;
    }
    .ball-pendulum:nth-child(5) {
        animation-delay: 1000ms;
        background-color: #ffffff;
    }
    .ball-pendulum:nth-child(6) {
        animation-delay: 1250ms;
        background-color: #d612bc;
    }
    .ball-pendulum:nth-child(7) {
        animation-delay: 1500ms;
        background-color: #12c9d6;
    }
    @keyframes pendulum {
        to {
            transform: rotate(1turn);
        }
    }
</style>