import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/products",
    redirect: "/",
  },
  {
    path: "/products/:product",
    name: "Product",
    component: () => import("../views/Product.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
  },
  {
    path: "/admin/edit/product/",
    redirect: "/admin",
  },
  {
    path: "/admin/edit/product/:product",
    name: "Edit Product",
    component: () => import("../components/admin/edit/edit_product.vue"),
  },
  {
    path: "/admin/edit/category/",
    redirect: "/admin",
  },
  {
    path: "/admin/edit/category/:category",
    name: "Edit Category",
    component: () => import("../components/admin/edit/edit_category.vue"),
  },
  {
    path: "/admin/edit/mainpage/",
    name: "Edit Main page",
    component: () => import("../components/admin/edit/edit_mainpage.vue"),
  },
  {
    path: "/admin/edit/terms/",
    name: "Edit Terms",
    component: () => import("../components/admin/edit/edit_terms.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
