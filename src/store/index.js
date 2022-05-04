import axios from "axios";
import { createStore } from "vuex";
import { server } from "../utils/helper";

export default createStore({
  state: {
    superApp: {
      logInStatus: false,
      user: {
        id: "",
        name: "",
      },
      toDo: [],
      toDoSandBox: [],
    },
  },
  mutations: {
    // Переключение статуса активации приложения
    TOGGLE_LOGIN_STATUS_IN_STATE(state) {
      state.superApp.logInStatus = !state.superApp.logInStatus;
    },
    // Очистка информации о пользователе
    CLEAR_SUPERAPP_IN_STATE(state) {
      (state.superApp.user = {
        id: "",
        name: "",
      }),
        (state.superApp.toDo = []),
        (state.superApp.toDoSandBox = []);
    },
    // Запись инвормации о пользователе
    SET_USER_TO_STATE(state, response) {
      state.superApp.user.id = response.data.user._id;
      state.superApp.user.name = response.data.user.name;
    },
    // Получение и запись списка задач с сервера
    SET_TODO_TO_STATE(state, response) {
      state.superApp.toDo = response.data.user.toDo;
    },
    // Получение и запись данных из localStorage
    SET_DATA_FROM_LOCALSTORAGE_TO_STATE(state, lS) {
      state.superApp.logInStatus = lS.logInStatus;
      state.superApp.user = lS.user;
    },
    // Получение списка задач с сервера по ID
    GET_USERTODO_BY_ID_AND_SAVE_TO_STATE(state, response) {
      state.superApp.toDo = response.data.toDo;
      state.superApp.toDoSandBox = state.superApp.toDo;
    },
    // Обновление списка задач (песочницы)
    UPDATE_TODOSANDBOX_IN_STATE(state, arr) {
      state.superApp.toDoSandBox = arr;
    },
    // Фильтрация списка задач (песочницы)
    FILTER_TODOSANDBOX_IN_STATE(state, boolean) {
      state.superApp.toDoSandBox = state.superApp.toDoSandBox.filter(
        (item) => item.checkbox !== boolean
      );
    },
    // Добавление новой задачи
    ADD_NEWTASK_TO_STATE(state, task) {
      state.superApp.toDo.unshift(task);
    },
    // Удаление задачи
    DELETE_TASK_FROM_STATE(state, task) {
      state.superApp.toDo = state.superApp.toDo.filter((item) => item !== task);
    },
    // Изменение даты задачи при редактировании
    CHANGING_DATE_OF_UPDATED_TASK(state, id) {
      state.superApp.toDo[id].createDate = new Date().toLocaleString();
    },
    // Изменение текста задачи при редактировании
    CHANGING_TASKNAME_OF_UPDATED_TASK(state, task) {
      state.superApp.toDo[task.id].taskName = task.taskName;
    },
  },
  actions: {
    TOGGLE_LOGIN_STATUS_IN_STATE({ commit }) {
      commit("TOGGLE_LOGIN_STATUS_IN_STATE");
    },
    CLEAR_SUPERAPP_IN_STATE({ commit }) {
      commit("CLEAR_SUPERAPP_IN_STATE");
    },
    SET_USER_TO_STATE({ commit }, response) {
      commit("SET_USER_TO_STATE", response);
    },
    SET_TODO_TO_STATE({ commit }, response) {
      commit("SET_TODO_TO_STATE", response);
    },
    SET_DATA_FROM_LOCALSTORAGE_TO_STATE({ commit }) {
      let lS = JSON.parse(localStorage.getItem("superApp"));
      if (!lS) {
        lS = {
          logInStatus: false,
          user: {
            name: "",
            id: "",
          },
        };
        localStorage.setItem("superApp", JSON.stringify(lS));
      } else {
        commit("SET_DATA_FROM_LOCALSTORAGE_TO_STATE", lS);
        return lS;
      }
    },
    async GET_USERTODO_BY_ID_AND_SAVE_TO_STATE({ commit }) {
      let lS = JSON.parse(localStorage.getItem("superApp"));
      const response = await axios.get(`${server.BASE_URL}/auth/${lS.user.id}`);
      commit("GET_USERTODO_BY_ID_AND_SAVE_TO_STATE", response);
      return response;
    },
    UPDATE_TODOSANDBOX_IN_STATE({ commit }, arr) {
      commit("UPDATE_TODOSANDBOX_IN_STATE", arr);
    },
    FILTER_TODOSANDBOX_IN_STATE({ commit }, boolean) {
      commit("FILTER_TODOSANDBOX_IN_STATE", boolean);
    },
    ADD_NEWTASK_TO_STATE({ commit }, task) {
      commit("ADD_NEWTASK_TO_STATE", task);
    },
    DELETE_TASK_FROM_STATE({ commit }, task) {
      commit("DELETE_TASK_FROM_STATE", task);
    },
    CHANGING_DATE_OF_UPDATED_TASK({ commit }, id) {
      commit("CHANGING_DATE_OF_UPDATED_TASK", id);
    },
    CHANGING_TASKNAME_OF_UPDATED_TASK({ commit }, task) {
      commit("CHANGING_TASKNAME_OF_UPDATED_TASK", task);
    },
  },
  getters: {
    LOGINSTATUS(state) {
      return state.superApp.logInStatus;
    },
    SUPERAPP(state) {
      return state.superApp;
    },
  },
  modules: {},
});
