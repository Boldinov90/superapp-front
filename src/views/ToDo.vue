<template>
   <div class="tasks-wrapper container animate__animated animate__fadeIn">
      <div class="tasks-sidebar-wrapper animate__animated animate__fadeInLeft">
         <div class="tasks-sidebar">
            <ul class="tasks-nav">
               <li
                  v-for="taskNav of tasksNav"
                  :key="taskNav"
                  class="tasks-nav-item"
                  :class="[taskNav.isActive ? 'tasks_nav_item_active' : '']"
                  @click="tasksFilter(taskNav)"
               >
                  {{ taskNav.value }}
                  <div
                     class="count-tasks"
                     :class="[
                        taskNav.name == 'allTasks' ? 'all-tasks' : '',
                        taskNav.name == 'activeTasks' ? 'active-tasks' : '',
                        taskNav.name == 'doneTasks' ? 'done-tasks' : '',
                     ]"
                  >
                     {{ taskNav.count }}
                  </div>
               </li>
            </ul>
         </div>
      </div>
      <div class="tasks-list">
         <div class="add-task-form">
            <div class="add-task-form-input">
               <input
                  v-model="newTaskText"
                  type="text"
                  placeholder="Введите текст новой задачи"
                  @keyup.enter="addTask"
               />
            </div>
            <button class="btn" @click.prevent="addTask">
               Добавить задачу
            </button>
         </div>
         <div
            v-if="SUPERAPP.toDoSandBox.length !== 0"
            class="task-item-wrapper"
         >
            <div
               v-for="task of SUPERAPP.toDoSandBox"
               :key="task"
               class="task-item"
            >
               <input
                  v-model="task.checkbox"
                  class="task-item-check_box"
                  type="checkbox"
                  :checked="task.checkbox"
                  @click="changeStatusTask(task)"
               />
               <div
                  class="task-item-title"
                  :class="{ task_done: task.checkbox }"
               >
                  {{ task.taskName }}
               </div>
               <div
                  class="task-item-date"
                  :class="{ task_done: task.checkbox }"
               >
                  {{ task.createDate }}
               </div>
               <button
                  class="task-item-edit"
                  @click.prevent="getChangeTextTask(task)"
               >
                  &#9998;
               </button>
               <button
                  class="task-item-delete"
                  @click.prevent="deleteTask(task)"
               >
                  &otimes;
               </button>
               <transition name="fade" class="transition">
                  <div
                     v-if="isCorrectionTextTask"
                     class="change-task-text-overlay"
                     name="fade"
                  >
                     <div class="change-task-text-body container">
                        <textarea
                           v-model="correctionTextTask"
                           cols="30"
                           rows="10"
                           @keyup.enter="saveChangeTextTask"
                        />
                        <div class="btns-change-task-text">
                           <button
                              class="btn"
                              @click.prevent="saveChangeTextTask"
                           >
                              Сохранить
                           </button>
                           <button
                              class="btn"
                              @click.prevent="isCorrectionTextTask = false"
                           >
                              Отмена
                           </button>
                        </div>
                     </div>
                  </div>
               </transition>
            </div>
         </div>
         <div v-else class="task-item-if-null">
            <div v-if="!SUPERAPP.toDo.length">
               Список задач пуст. Добавьте новую задачу!
            </div>
            <div v-else-if="isActiveTasksZero">Нет активных задач.</div>
            <div v-else-if="isDoneTasksZero">Нет завершенных задач.</div>
         </div>
      </div>
   </div>
</template>

<script>
import axios from 'axios'
import Animate from 'animate.css'
import { server } from '../utils/helper'
import { mapActions, mapGetters } from 'vuex'
export default {
   components: {
      Animate,
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
               count: '',
            },
            {
               name: 'activeTasks',
               value: 'Активные задачи',
               isActive: '',
               count: '',
            },
            {
               name: 'doneTasks',
               value: 'Завершенные',
               isActive: '',
               count: '',
            },
         ],
         tasks: [],
         isAllTasksZero: null,
         isActiveTasksZero: null,
         isDoneTasksZero: null,
         newTaskText: '',
         activeNav: {},
      }
   },
   computed: {
      ...mapGetters(['SUPERAPP']),
   },
   methods: {
      ...mapActions([
         'UPDATE_TODOSANDBOX_IN_STATE',
         'FILTER_TODOSANDBOX_IN_STATE',
         'ADD_NEWTASK_TO_STATE',
         'DELETE_TASK_FROM_STATE',
         'CHANGING_DATE_OF_UPDATED_TASK',
         'CHANGING_TASKNAME_OF_UPDATED_TASK',
      ]),
      // Функция обновления DataBase
      async updateDataBase() {
         // Получаем ID пользователя из LocalStorage
         let lS = JSON.parse(localStorage.getItem('superApp'))
         // Обновляем данные на сервере
         await axios.put(`${server.BASE_URL}/auth/${lS.user.id}`, {
            toDo: this.SUPERAPP.toDo,
         })
      },

      // Функция добавления задачи
      addTask() {
         // Делаем проверку введено ли что нибудь в поле ввода
         if (this.newTaskText !== '') {
            // Если да, то
            // Создаем объект с задачей
            const newTask = {
               checkbox: false,
               taskName: this.newTaskText,
               createDate: new Date().toLocaleString(),
            }
            // Добавляем задачу в начало массива с задачами
            this.ADD_NEWTASK_TO_STATE(newTask)
            // Возвращаем настройки фильтра
            this.tasksFilter(this.activeNav)
            // Обновляем счетчик задач
            this.countTasks()
            // Обновляем данные на сервере
            this.updateDataBase()
            // Очищаем инпут
            this.newTaskText = ''
            // Если нет
         } else {
            // Говорим пользователю, что поле не может быть пустым
            alert('Поле не может быть пустым, введите текст новой задачи!!!')
         }
      },

      // Функция удаления задачи
      deleteTask(task) {
         // Находим и удаляем выбранную задачу
         this.DELETE_TASK_FROM_STATE(task)
         // Возвращаем настройки фильтра
         this.tasksFilter(this.activeNav)
         // Обновляем счетчик задач
         this.countTasks()
         // Обновляем данные на сервере
         this.updateDataBase()
      },

      // Обновление статуса задачи
      changeStatusTask(task) {
         // Меняем статус на противоположное значение (true/false)
         task.checkbox = !task.checkbox
         // Обновляем данные на сервере
         this.updateDataBase()
         // Обновляем фильтры с небольшой задержкой для удобства восприятия
         setTimeout(() => {
            this.tasksFilter(this.activeNav)
            // Обновляем счетчик задач
            this.countTasks()
         }, 300)
      },

      // Функция сортировки задач
      tasksFilter(nav) {
         // Записываем в переменную активный фильтр
         this.activeNav = nav
         // Записываем массив с задачами в песочницу во VUEX
         this.UPDATE_TODOSANDBOX_IN_STATE(this.SUPERAPP.toDo)
         // Если выбрано 'Все задачи'
         if (nav.name === 'allTasks') {
            // Удаляем активный класс у всего массива навигации
            this.deleteNavActiveClass()
            // Присваиваем активный класс актуальной категории
            nav.isActive = true
            // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
            this.isActiveTasksZero = false
            this.isDoneTasksZero = false
            this.isAllTasksZero = true
         }
         // Если выбрано 'Активные задачи'
         if (nav.name === 'activeTasks') {
            // Удаляем активный класс у всего массива навигации
            this.deleteNavActiveClass()
            // Присваиваем активный класс актуальной категории
            nav.isActive = true
            // Удаляем из песочницы все кроме активных задач
            this.FILTER_TODOSANDBOX_IN_STATE(true)
            // Если массив-песочница пуст
            if (this.SUPERAPP.toDoSandBox.length === 0) {
               // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
               this.isActiveTasksZero = true
               this.isDoneTasksZero = false
               this.isAllTasksZero = false
            }
         }
         // Если выбрано 'Завершенные задачи'
         if (nav.name === 'doneTasks') {
            // Удаляем активный класс у всего массива навигации
            this.deleteNavActiveClass()
            // Присваиваем активный класс актуальной категории
            nav.isActive = true
            // Удаляем из песочницы все кроме завершенных задач
            this.FILTER_TODOSANDBOX_IN_STATE(false)
            // Если массив-песочница пуста
            if (this.SUPERAPP.toDoSandBox.length === 0) {
               // Присваеваем логические значения переменным для отображения сообщений в случае отсутсвия задач
               this.isActiveTasksZero = false
               this.isDoneTasksZero = true
               this.isAllTasksZero = false
            }
         }
      },

      // Функция подсчета задач
      countTasks() {
         // Перебираем массив с навигацией по задачам
         this.tasksNav.forEach((item) => {
            // Записываем массив с задачами в песочницу
            let arr = this.SUPERAPP.toDo
            // Если "Все задачи"
            if (item.name === 'allTasks') {
               // Записываем в переменную колличество всех задач
               item.count = this.SUPERAPP.toDo.length
            }
            // Если "Активные задачи"
            if (item.name === 'activeTasks') {
               // Записываем в переменную колличество активных задач
               item.count = arr.filter((item) => item.checkbox !== true).length
            }
            // Если "Завершенные задачи"
            if (item.name === 'doneTasks') {
               // Записываем в переменную колличество завершенных задач
               item.count = arr.filter((item) => item.checkbox !== false).length
            }
         })
      },

      // Функция получения данных редактироваемой задачи
      getChangeTextTask(task) {
         // Открываем форму редактирования текста задачи
         this.isCorrectionTextTask = true
         // Вводим в форму редактирования актуальный текст из базы данных
         this.correctionTextTask = task.taskName
         // Находим и записываем в переменную ID выбранной задачи
         this.currentTaskId = this.SUPERAPP.toDo.indexOf(task)
      },

      // Функция редактирования и сохранения текста и даты задачи
      saveChangeTextTask() {
         // Объединяем в объект измененные поля задачи
         const updatedTask = {
            id: this.currentTaskId,
            taskName: this.correctionTextTask,
         }
         // Находим по ID редактируемую задачу и записываем обновленный текст
         this.CHANGING_TASKNAME_OF_UPDATED_TASK(updatedTask)
         // Находим по ID редактируемую задачу и записываем обновленную дату
         this.CHANGING_DATE_OF_UPDATED_TASK(this.currentTaskId)
         // Обновляем данные на сервере
         this.updateDataBase()
         // Закрываем форму
         this.isCorrectionTextTask = false
      },

      // Удаление активного класса у всего массива навигации
      deleteNavActiveClass() {
         for (let task in this.tasksNav) {
            this.tasksNav[task].isActive = false
         }
      },
   },
   watch: {},
   beforeMount() {
      this.countTasks()
      this.tasksFilter(this.activeNav)
   },
   beforeUpdate() {
      this.countTasks()
   },
}
</script>

<style scoped lang="scss">
@mixin btn {
   .btn {
      font-family: Arial, Helvetica, sans-serif;
      height: 46px;
      text-decoration: none;
      padding: 5px 9px 5px 9px;
      border: 0;
      border-radius: 8px;
      background-color: #d6a812;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1e1f1c;
      transition: 0.1s;
      align-self: flex-end;
   }
}

* {
   font-family: 'Montserrat', sans-serif;
   .tasks-wrapper {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 6fr;
      @media (max-width: 1061px) {
         margin-top: 50px;
      }
      @media (max-width: 970px) {
         grid-template-columns: 1fr;
      }
      .tasks-sidebar-wrapper {
         position: relative;
         .tasks-sidebar {
            position: fixed;
            top: 130px;
            @media (max-width: 970px) {
               position: static;
               margin-top: 150px;
            }
            .tasks-nav {
               @media (max-width: 970px) {
                  display: flex;
                  justify-content: space-around;
               }
               .tasks-nav-item {
                  color: blanchedalmond;
                  list-style-type: none;
                  cursor: pointer;
                  margin-bottom: 15px;
                  font-size: 20px;
                  font-weight: 200;
                  letter-spacing: 1px;
                  display: flex;
                  align-items: center;
                  @media (max-width: 1110px) {
                     font-size: 16px;
                  }
                  .count-tasks {
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
                     text-shadow: 1px 1px 2px black;
                  }
                  .all-tasks {
                     background-color: rgb(38, 47, 180);
                  }
                  .active-tasks {
                     background-color: rgb(54, 172, 43);
                  }
                  .done-tasks {
                     background-color: rgb(177, 41, 41);
                  }
               }
               .tasks_nav_item_active {
                  color: #d6a812;
                  transition: 0.2s;
               }
            }
         }
      }
      .tasks-list {
         margin-top: 130px;
         color: blanchedalmond;
         display: flex;
         flex-direction: column;
         align-items: center;
         @media (max-width: 970px) {
            margin-top: 20px;
         }
         .add-task-form {
            display: grid;
            grid-template-columns: 5fr 1fr;
            justify-content: space-between;
            margin-bottom: 30px;
            width: 90%;
            .add-task-form-input {
               width: 95%;
               input {
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
            }
            @include btn;
            .btn:hover {
               transition: 0.2s;
               background-color: #f8e003;
               transform: scale(1.03);
            }
            .btn:active {
               transform: scale(1);
            }
         }
         .task-item-wrapper {
            width: 90%;
            .task-item {
               padding-left: 20px;
               padding-right: 20px;
               padding-top: 5px;
               padding-bottom: 5px;
               background-color: #1e1f1c;
               box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.603);
               border-radius: 8px;
               display: grid;
               grid-template-columns: 1fr 10fr 3fr 1fr 1fr;
               justify-content: center;
               align-items: center;
               margin-bottom: 20px;
               .task-item-title,
               .task-item-date {
                  font-size: 14px;
                  letter-spacing: 2px;
               }
               .task_done {
                  text-decoration: line-through;
                  color: rgba(170, 170, 170, 0.459);
               }
               .task-item-edit,
               .task-item-delete {
                  border-radius: 50%;
                  border: none;
                  width: 30px;
                  height: 30px;
                  justify-self: end;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: #1e1f1c;
                  cursor: pointer;
                  transition: 0.1s;
               }
               .task-item-edit {
                  font-size: 30px;
                  color: rgb(59, 235, 103);
               }
               .task-item-delete {
                  font-size: 39px;
                  color: red;
               }
               .task-item-edit:hover,
               .task-item-delete:hover {
                  transform: scale(1.2);
                  transition: 0.3s;
               }
               .task-item-edit:active,
               .task-item-delete:active {
                  transform: scale(1);
               }
               .fade-enter-active,
               .fade-leave-active {
                  transition: opacity 0.4s ease;
               }
               .fade-enter-from,
               .fade-leave-to {
                  opacity: 0;
               }
               .change-task-text-overlay {
                  background-color: #1e1f1c9a;
                  z-index: 99;
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 0;
                  .change-task-text-body {
                     position: absolute;
                     left: 100px;
                     right: 100px;
                     top: 30%;
                     width: 500px;
                     height: 170px;
                     background-color: #1e1f1c;
                     box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.993);
                     border-radius: 8px;
                     display: grid;
                     justify-content: center;
                     padding: 20px;
                     textarea {
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
                     .btns-change-task-text {
                        display: flex;
                        justify-content: space-around;
                     }
                     @include btn;
                     .btn {
                        min-width: 200px;
                        font-size: 20px;
                     }
                  }
               }
            }
         }
         .task-item-if-null {
            margin-top: 100px;
         }
      }
   }
}
</style>
