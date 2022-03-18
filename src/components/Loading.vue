<template>
    <div class="loader">
        <img src="../assets/gifs/wait-load.gif" alt="gif">
        <p>Загрузка...</p>
    </div>
</template>

<style scoped>
    .loader{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .loader img {
        width: 500px;
    }
    .loader p {
        color: #BFBFBF;
        position: absolute;
        margin: 0 auto;
    }
</style>