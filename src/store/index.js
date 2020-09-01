import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    jwt: "",
    baseUrl: "https://kmcoffee.herokuapp.com",
    general: {},
    products: null,
    categories: null,
    loaded: {
      general: false,
      categories: false,
      jwt: false,
      products: false,
    },
    loading: {
      general: false,
      categories: false,
      jwt: false,
      products: false,
    },
  },
  mutations: {
    setJwt(state, data) {
      state.jwt = data;
      state.loading["jwt"] = false;
      Vue.$cookies.set("jwt", data);
      state.loaded.jwt = true;
    },
    setData(state, data) {
      state.general = data;
      state.loading["general"] = false;
      state.loaded.general = true;
    },
    setCategories(state, data) {
      state.categories = data;
      state.loaded.categories = true;
      state.loading["categories"] = false;
    },
    setProducts(state, data) {
      state.products = data;
      state.loaded.products = true;
      state.loading["products"] = false;
    },
    setLoading(state, data) {
      state.loading[data] = true;
    },
    setNotLoaded(state, data) {
      state.loading[data] = false;
      state.loaded[data] = false;
    },
  },
  getters: {
    isJwtSet: (state) => {
      if (state.jwt == "" && Vue.$cookies.get("jwt") !== null) {
        state.jwt = Vue.$cookies.get("jwt");
        state.loaded.jwt = true;
      }
      return state.loaded.jwt;
    },
    getJwt: (state) => {
      return state.jwt;
    },
    getBaseUrl: (state) => {
      return state.baseUrl;
    },
    getData: (state) => {
      return state.general;
    },
    getDataLoaded: (state) => {
      return state.loaded.general;
    },
    getHeader: (state) => {
      return state.general.Navigation ? state.general.Navigation : false;
    },
    getForm: (state) => {
      return state.general.ContactUs ? state.general.ContactUs : false;
    },
    getCoordinates: (state) => {
      return state.general.AboutUs ? state.general.AboutUs : false;
    },
    getCopyright: (state) => {
      return state.general.Disclaimer ? state.general.Disclaimer : false;
    },
    getBackground: (state) => {
      return state.general.Background ? state.general.Background : false;
    },
    getSections: (state) => {
      return state.general.Categories ? state.general.Categories : false;
    },
    getSectionsLoaded: (state) => {
      return state.loaded.general;
    },
    getCategories: (state) => {
      return state.categories ? state.categories : false;
    },
    getCategory: (state) => (id) => {
      return state.categories.find((category) => category.id == id);
    },
    getCategoriesLoaded: (state) => {
      return state.loaded.categories;
    },
    getNavigation: (state) => {
      return state.general.Navigation;
    },
    getProducts: (state) => {
      return state.products ? state.products : false;
    },
    getProduct: (state) => (id) => {
      return state.products.find((product) => product.id == id);
    },
    getLoaded: (state) => (data) => {
      return state.loaded[data];
    },
    getLoading: (state) => (data) => {
      return state.loading[data];
    },
  },
});

export default store;
