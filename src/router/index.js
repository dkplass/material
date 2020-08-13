import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/main"
  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/views/index.vue")
  },
  {
    path: "/sample",
    name: "sample",
    component: () => import("@/views/sample/sample.vue"),
    // props: { name: 'sample' }
    props: route => ({
      ...route.params
    })
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/materialball/",
  routes
});

export default router;
