<template>
    <div class="tasks-wrapper container animate__animated animate__fadeIn">
        <div class="tasks-sidebar-wrapper animate__animated animate__fadeInLeft">
            <div class="tasks-sidebar">
                <ul class="tasks-nav">
                    <li 
                        class="tasks-nav-item" 
                        v-for="taskNav of tasksNav" 
                        :key="taskNav"
                        @click="tasksFilter(taskNav)"
                        :class="[taskNav.isActive ? 'tasks_nav_item_active' : '']"
                        >{{taskNav.value}}
                        <div 
                            class="count-tasks"
                            :class="[taskNav.name == 'allTasks' ? 'all-tasks' : '',
                                     taskNav.name == 'activeTasks' ? 'active-tasks' : '',
                                     taskNav.name == 'doneTasks' ? 'done-tasks' : ''
                                    ]"
                            >{{taskNav.count}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="tasks-list">
            <div class="add-task-form"> 
                <div class="add-task-form-input">
                    <input type="text" v-model="NewTaskText" placeholder="Введите текст новой задачи" @keyup.enter="addTask">
                </div>
                <button class="btn" @click.prevent="addTask">Добавить задачу</button>
            </div>
            <div class="task-item-wrapper" v-if="tasks.length !== 0">
                <div class="task-item" v-for="task of tasks" :key="task">
                    <input
                        class="task-item-check_box" 
                        type="checkbox" 
                        v-model="task.checkbox" 
                        :checked="task.checkbox"
                        @click="changeStatusTask(task)"
                    >
                    <div class="task-item-title" :class="{task_done: task.checkbox}">{{task.taskName}}</div>
                    <div class="task-item-date" :class="{task_done: task.checkbox}">{{task.createDate}}</div>
                    <button class="task-item-edit" @click.prevent="getChangeTextTask(task)">&#9998;</button>
                    <button class="task-item-delete" @click.prevent="deleteTask(task)">&otimes;</button>
                    <transition name="fade">
                        <div class="changeTaskText-overlay" v-if="isCorrectionTextTask" name="fade">
                            <div class="changeTaskText-body container">
                                <textarea cols="30" rows="10" v-model="correctionTextTask" @keyup.enter="saveChangeTextTask"></textarea>
                                <div class="btns-changeTaskText">
                                    <button class="btn" @click.prevent="saveChangeTextTask">Сохранить</button>
                                    <button class="btn" @click.prevent="isCorrectionTextTask = false">Отмена</button>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="task-item-if-null" v-else>
                <div v-if="!$store.state.superApp.toDo.length">
                    Список задач пуст. Добавьте новую задачу!
                </div>
                <div v-else-if="isActiveTasksZero">
                    Нет активных задач.
                </div>
                <div v-else-if="isDoneTasksZero">
                    Нет завершенных задач.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Animate from 'animate.css'
    export default {
        components: {
            Animate
        },
        data() {
            return { 
                isCorrectionTextTask: false,
                correctionTextTask: '',
                currentTaskId: '',
                tasksNav: [
                    {
                        name: 'allTasks',
                        value: 'Все задачи',
                        isActive: true,
                        count: ''
                    },
                    {
                        name: 'activeTasks',
                        value: 'Активные задачи',
                        isActive: '',
                        count: ''
                    },
                    {
                        name: 'doneTasks',
                        value: 'Завершенные',
                        isActive: '',
                        count: ''
                    }
                ],
                toDo:[],
                tasks: [],
                isAllTasksZero: null,
                isActiveTasksZero: null,
                isDoneTasksZero: null,
                NewTaskText: '',
                activeNav: {}
            }
        },
        methods: {
            // Функция обновления DataBase
            async updateDataBase(){
                // Запрос на сервер и получение массива с пользователями
                const {data} = await axios.get('https://superapp-boldinov-default-rtdb.firebaseio.com/Arr/users.json')
                const arreyUsers = Object.keys(data).map(key => {
                    return {
                        id: key,
                        ...data[key]
                    }
                })
                // Находим нужного пользователя по ID
                const user = arreyUsers.find(user => user.id === this.$store.state.superApp.id).id
                // Записываем/Обновляем наш список задач
                data[user].toDo = this.$store.state.superApp.toDo
                // Обновляем данные на сервере
                await axios.put('https://superapp-boldinov-default-rtdb.firebaseio.com/Arr.json', {
                    users: data
                })
            },

            // Функция обновления LocalStorage
            updateLocalStorage(){
                localStorage.setItem('superApp', JSON.stringify(this.$store.state.superApp))
            },

            // Функция добавления задачи
            addTask(){
                // Делаем проверку введено ли что нибудь в поле ввода
                if(this.NewTaskText !== ''){
                    // Если да, то
                    // Создаем объект с задачей
                    const newTask = {
                        checkbox: false,
                        taskName: this.NewTaskText,
                        createDate: new Date().toLocaleString()
                    }
                    // Добавляем задачу в начало массива с задачами
                    this.$store.state.superApp.toDo.unshift(newTask)
                    // Возвращаем настройки фильтра
                    this.tasksFilter(this.activeNav) 
                    // Обновляем счетчик задач
                    this.countTasks()
                    // Обновляем LocalStorage
                    this.updateLocalStorage()
                    // Обновляем данные на сервере
                    this.updateDataBase()
                    // Очищаем инпут
                    this.NewTaskText = ''
                // Если нет
                }else{
                    // Говорим пользователю, что поле не может быть пустым
                    alert('Поле не может быть пустым, введите текст новой задачи!!!')
                }
            },

            // Функция удаления задачи
            deleteTask(task){
                // Находим и удаляем выбранную задачу
                this.$store.state.superApp.toDo = this.$store.state.superApp.toDo.filter(item => item !== task)
                // Записываем обновленный массив в переменную 'TASKS'
                this.tasks = this.$store.state.superApp.toDo
                // Возвращаем настройки фильтра
                this.tasksFilter(this.activeNav) 
                // Обновляем счетчик задач
                this.countTasks()
                // Обновляем LocalStorage
                this.updateLocalStorage()
                // Обновляем данные на сервере
                this.updateDataBase()
            },

            // Обновление статуса задачи
            changeStatusTask(task){
                // Меняем статус на противоположное значение (true/false)
                task.checkbox = !task.checkbox
                // Обновляем LocalStorage
                this.updateLocalStorage()
                // Обновляем данные на сервере
                this.updateDataBase()
                // Обновляем фильтры с небольшой задержкой для удобства восприятия
                // console.log(task.checkbox)
                setTimeout(() => {  
                    this.tasksFilter(this.activeNav) 
                    // Обновляем счетчик задач
                    this.countTasks()
                }, 300)
            },

            // Функция сортировки задач
            tasksFilter(nav){ 
                // Записываем массив с задачами в песочницу
                this.tasks = this.$store.state.superApp.toDo
                // Записываем в переменную активного фильтра
                this.activeNav = nav
                // Обновляем VUEX
                this.$store.state.superApp.activeNav = this.activeNav
                // Обновляем LocalStorage
                // this.updateLocalStorage()
                // Если выбрано 'Все задачи'
                if(nav.name === 'allTasks'){
                    // Удаляем активный класс у всего массива навигации
                    for(let task in this.tasksNav){
                        this.tasksNav[task].isActive = false
                    }
                    // Присваиваем активный класс актуальной категории
                    nav.isActive = true
                    // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
                    this.isActiveTasksZero = false
                    this.isDoneTasksZero = false
                    this.isAllTasksZero = true
                }
                // Если выбрано 'Активные задачи'
                if(nav.name === 'activeTasks'){
                    // Удаляем активный класс у всего массива навигации
                    for(let task in this.tasksNav){
                        this.tasksNav[task].isActive = false
                    }
                    // Присваиваем активный класс актуальной категории
                    nav.isActive = true
                    // Удаляем из песочницы все кроме активных задач
                    this.tasks = this.tasks.filter(item => item.checkbox !== true)
                    // Если массив-песочница пуста
                    if(this.tasks.length === 0){
                        // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
                        this.isActiveTasksZero = true
                        this.isDoneTasksZero = false
                        this.isAllTasksZero = false
                    }
                }
                // Если выбрано 'Завершенные задачи'
                if(nav.name === 'doneTasks'){
                    // Удаляем активный класс у всего массива навигации
                    for(let task in this.tasksNav){
                        this.tasksNav[task].isActive = false
                    }
                    // Присваиваем активный класс актуальной категории
                    nav.isActive = true
                    // Удаляем из песочницы все кроме завершенных задач
                    this.tasks = this.tasks.filter(item => item.checkbox !== false)
                    // Если массив-песочница пуста
                    if(this.tasks.length === 0){
                        // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
                        this.isActiveTasksZero = false
                        this.isDoneTasksZero = true
                        this.isAllTasksZero = false
                    }
                }
            },

            // Функция подсчета задач
            countTasks(){
                // Перебираем массив с навигацией по задачам
                this.tasksNav.forEach(item => {
                    // Записываем массив с задачами в песочницу
                    let arr = this.$store.state.superApp.toDo
                    // Если "Все задачи"
                    if(item.name === 'allTasks'){
                        // Записываем в переменную колличество всех задач
                        item.count = this.$store.state.superApp.toDo.length
                    }
                    // Если "Активные задачи"
                    if(item.name === 'activeTasks'){
                        // Записываем в переменную колличество активных задач
                        item.count = arr.filter(item => item.checkbox !== true).length
                    }
                    // Если "Завершенные задачи"
                    if(item.name === 'doneTasks'){
                        // Записываем в переменную колличество завершенных задач
                        item.count = arr.filter(item => item.checkbox !== false).length
                    }
                })
            },

            // Функция получения данных редактироваемой задачи
            getChangeTextTask(task){
                // Открываем форму редактирования текста задачи
                this.isCorrectionTextTask = true
                // Вводим d форму редактирования актуальный текст из базы данных
                this.correctionTextTask = task.taskName
                // Находим и записываем в переменную ID выбранной задачи
                this.currentTaskId = this.$store.state.superApp.toDo.indexOf(task)
            },

            // Функция редактирования и сохранения текста и даты задачи
            saveChangeTextTask(){
                // Находим по ID редактируемую задачу и записываем обновленный текст
                this.$store.state.superApp.toDo[this.currentTaskId].taskName = this.correctionTextTask
                // Находим по ID редактируемую задачу и записываем обновленную дату
                this.$store.state.superApp.toDo[this.currentTaskId].createDate = new Date().toLocaleString()
                // Обновляем LocalStorage
                this.updateLocalStorage()
                // Обновляем данные на сервере
                this.updateDataBase()
                // Закрываем форму
                this.isCorrectionTextTask = false
            }
        },
        watch: {
        },
        // При загрузке/обновлении страницы......
        beforeMount(){
            // Создаем пустой массив с дачами, в случае отсутствия его на сервере
            if(!this.$store.state.superApp.toDo){
                this.$store.state.superApp.toDo = []
            }else{
                // Обновляем массив-песочницу с задачами
                this.tasks = this.$store.state.superApp.toDo
            }
            // Обновляем счетчик задач
            this.countTasks()
            // Обновляем LocalStorage
            this.updateLocalStorage()
        }
    }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700&display=swap');
    *{
        font-family: 'Montserrat', sans-serif;
    }
    .loading img{
        height: 5px;
        width: 5px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .changeTaskText-overlay{
        background-color: #1e1f1ce7;
        z-index: 99;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .changeTaskText-body{
        position: absolute;
        left: 100px;
        right: 100px;
        top: 30%;
        width: 500px;
        height: 170px;
        background-color: #1E1F1C;
        box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.993);
        border-radius: 8px;
        display: grid;
        justify-content: center;
        padding: 20px;
    }
    .changeTaskText-body textarea{
        resize: none;
        padding: 20px;
        border: 0;
        border-radius: 8px;
        align-self: flex-start;
        width: 450px;
        height: 55px;
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 18px;
        box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.67) inset;  
    }
    .btns-changeTaskText{
        display: flex;
        justify-content: space-around;
    }
    .btns-changeTaskText button{
        min-width: 200px;
        font-size: 20px;
    }
    .tasks-wrapper{
        width: 100%;
        display: grid;
        grid-template-columns: 2fr 6fr;
    }
    .tasks-sidebar-wrapper{
        position: relative;
    }
    .tasks-sidebar{
        position: fixed;
        top: 130px;
    }
    .tasks-nav-item{
        color: blanchedalmond;
        list-style-type: none;
        cursor: pointer;
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: 200;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
    }
    .count-tasks{
        width: 25px;
        height: 25px;
        border-radius: 50%;
        color: #ffffff;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        font-weight: 400;
        text-shadow: 1px 1px 2px black
    }
    .all-tasks{
        background-color: rgb(38, 47, 180);
    }
    .active-tasks{
        background-color: rgb(54, 172, 43);
    }
    .done-tasks{
        background-color: rgb(177, 41, 41);
    }
    .tasks_nav_item_active{
        color: #d6a812;
        transition: 0.2s;
    }
    .tasks-list{
        margin-top: 130px;
        color: blanchedalmond;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .task-item-wrapper{
        width: 90%;
    }
    .add-task-form{
        display: grid;
        grid-template-columns: 5fr 1fr;
        justify-content: space-between;
        margin-bottom: 30px;
        width: 90%;
    }
    .add-task-form-input{
        width: 95%;
    }
    .add-task-form-input input{
        margin-top: 7px;
        padding: 10px;
        border: 0;
        border-radius: 8px;
        align-self: flex-start;
        width: 100%;
        height: 26px;
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 18px;
        box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.67) inset;  
    }
    .btn{
        height: 46px;
        font-family: Arial, Helvetica, sans-serif; 
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
        align-self: flex-end;
    }
    .btn:hover{
        transition: 0.2s;
        background-color: #f8e003;
        transform: scale(1.03);
    }
    .btn:active{
        transform: scale(1);
    }
    .task-item{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #1E1F1C;
        box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.603);
        border-radius: 8px;
        display: grid;
        grid-template-columns: 1fr 10fr 3fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }
    .task-item-title,
    .task-item-date{
        font-size: 14px;
        letter-spacing: 2px;
    }
    .task_done{
        text-decoration: line-through;
        color: rgba(170, 170, 170, 0.459);
    }
    .task-item-edit,
    .task-item-delete{
        border-radius: 50%;
        border: none;
        width: 30px;
        height: 30px;
        justify-self: end;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1E1F1C;
        cursor: pointer;
        transition: 0.1s;
    }
    .task-item-edit{
        font-size: 30px;
        color: rgb(59, 235, 103);
    }
    .task-item-delete{
        font-size: 39px;
        color: red;
    }
    .task-item-edit:hover,
    .task-item-delete:hover{
        transform: scale(1.2);
        transition: 0.3s;
    }
    .task-item-edit:active,
    .task-item-delete:active{
        transform: scale(1);
    }
    .task-item-if-null{
        margin-top: 100px;
    }

</style>