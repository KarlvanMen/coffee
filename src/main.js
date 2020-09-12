import Vue from "vue";
import App from "./App.vue";
import VueCookies from "vue-cookies";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faPlusCircle,
  faFileUpload,
  faFolderOpen,
  faCheckSquare,
  faTimesCircle,
  faChevronLeft,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "./router";
import store from "./store";

library.add(
  faFacebookF,
  faTwitter,
  faInstagram,
  faEdit,
  faPlusCircle,
  faFileUpload,
  faFolderOpen,
  faCheckSquare,
  faTimesCircle,
  faChevronLeft,
  faPlusSquare
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(VueCookies);

Vue.$cookies.config("7d");

new Vue({
  router,
  store: store,
  render: (h) => h(App),
}).$mount("#app");
