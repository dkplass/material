import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/components/layout/main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/main"
  },
  {
    path: "/main",
    component: Layout,
    children: [
      {
        path: "/:tagName?",
        name: "content",
        component: () => import("@/views/content/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/materialball/",
  routes
});

export default router;
