<template>
    <div class="content container animate__animated animate__fadeIn">
        <div class="calc__body">
            <input type="text" v-model="result" placeholder="0" class="display" disabled>
            <div class="grid">
                <div class="num-grid">
                    <button @click="inputNum(num)" class="num-item" v-for="num of numbers" :key="num">{{num}}</button>
                </div>
                <div class="op-grid">
                    <button @click="reset()" class="op-item op-top">C</button>
                    <button @click="percent()" class="op-item op-top">%</button>
                    <button @click="getOp(op.name)" class="op-item" v-for="op of operations" :key="op" v-html="op.value"></button>
                    <button @click="calculate()" class="op-item">=</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Animate from 'animate.css'
    export default {
        components: {
            Animate
        },
        data(){
            return{
                result: '',
                numbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'],
                operations: [
                    {name: '-', value: '&minus;'},
                    {name: '*', value: '&times;'},
                    {name: '/', value: '&divide;'},
                    {name: '+', value: '+'}
                ],
                numA: '',
                numB: '',
                operationValue: ''
            }
        },
        methods: {
            // Функция получения цифр калькулятора
            inputNum(item){
                // Если в переменной "В" пусто и не нажат какой либо знак
                if(this.numB === '' && this.operationValue === ''){
                    // Записываем в переменную "А" нажатую кнопку (цыфру)
                    this.numA += item
                    // Проверка есть ли запятая (точка) после первого символа
                    if(this.numA[1] === '.'){
                        // Выводим значение на дисплей
                        this.result = this.numA
                        // Убираем лишние нули перед запятой (если есть)
                        this.result = this.result.toString().replace(/^0+/, '0');
                    }else{ // Если запятой (точки) нет
                        // Выводим значение на дисплей
                        this.result = this.numA
                        // Убираем нули перед числом (если есть)
                        this.result = this.result.toString().replace(/^0+/, '');
                    }
                }else{ // Иначе
                    // Записываем в переменную "B" нажатую кнопку (цыфру)
                    this.numB += item
                    if(this.numB[1] === '.'){
                        // Выводим значение на дисплей
                        this.result = this.numB
                        // Убираем лишние нули перед запятой (если есть)
                        this.result = this.result.toString().replace(/^0+/, '0');
                    }else{ // Если запятой (точки) нет
                        // Выводим значение на дисплей
                        this.result = this.numB
                        // Убираем лишние нули перед запятой (если есть)
                        this.result = this.result.toString().replace(/^0+/, '');
                    }
                }
            },
            // Функция получения операторов калькулятора
            getOp(item){
                // Получаем оператор и записываем в переменную
                this.operationValue = item
            },
            // Функция вычисления
            calculate(){
                // Тут коментарии особо не нужны
                if(this.operationValue === '+'){
                    this.result = (+this.numA) + (+this.numB)
                }
                if(this.operationValue === '-'){
                    this.result = (+this.numA) - (+this.numB)
                }
                if(this.operationValue === '*'){
                    this.result = (+this.numA) * (+this.numB)
                }
                if(this.operationValue === '/'){
                    this.result = (+this.numA) / (+this.numB)
                }
                // Записываем результат в переменную "А"
                this.numA = this.result
                // Очищаем переменную "В"
                this.numB = ''
            },
            // Фуннкция очистки
            reset(){
                // Очищаем все переменные
                this.result = ''
                this.numA = ''
                this.numB = ''
                this.operationValue = ''
            },
            percent(){
                this.result = (+this.numB) * (+this.numA) / 100
                this.numA = this.result
                this.numB = ''
                this.operationValue = ''
            }
        }
    }
</script>
 
<style scoped>

    .content{
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .calc__body{
        margin-top: 20px;
        width: 500px;
        height: 500px;
        background-color: rgb(49, 49, 49);
        box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.603);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .display{
        border: none;
        background-color: rgb(49, 49, 49);
        text-align: end;
        padding-right: 20px;
        color: #D7D7D7;
        width: 90%;
        font-size: 90px;
        margin-top: 20px;
    }
    input::placeholder {
        color:#D7D7D7;
    }
    .grid{
        display: grid;
        grid-template-columns: 3fr 2fr;
        align-items: center;
        height: 100%;
        width: 90%;
    }
    .num-grid{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: space-between;
    }
    .num-item{
        justify-self: center;
        border: none;
        border-radius: 50%;
        background-color: #5D5D5B;
        color: #D7D7D7;
        height: 70px;
        width: 70px;
        font-size: 30px;
        margin-bottom: 15px;
        transition: 0.2s;
    }
    .num-item:nth-last-child(2){
        grid-column-start: 1;
        grid-column-end: 3;
        width: 90%;
        border-radius: 35px;
    }
    .num-item:hover{
        background-color: #7a7a78;
        transition: 0.2s;
    }
    .num-item:active{
        background-color: #9b9b99;
        transform: scale(0.95);
    }
    .op-grid{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
    }
    .op-item{
        justify-self: center;
        border: none;
        border-radius: 50%;
        background-color: #ffa024;
        color: rgb(49, 49, 49);
        height: 70px;
        width: 70px;
        font-size: 30px;
        margin-bottom: 15px;
        transition: 0.2s;
    }
    .op-item:nth-last-child(2){
        grid-row-start: 3;
        grid-row-end: 5;
        height: 90%;
        border-radius: 35px;
    }
    .op-top{
        background-color: #eb5d0b;
        color: #D7D7D7;
    }

    .op-item:hover{
        background-color: #f7b660;
        transition: 0.2s;
    }
    .op-item:active{
        background-color: #f8d2a1;
        transform: scale(0.95);
    }
    .op-top:hover{
        background-color: #e76f2a;
    }
    .op-top:active{
        background-color: #e68046;
        transform: scale(0.95);
    }
</style>