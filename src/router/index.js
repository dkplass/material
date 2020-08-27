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
    props: route => ({
      ...route.params
    })
  },
  // {
  //   path: "/upload",
  //   name: "upload",
  //   component: () => import("@/views/upload/upload.vue")
  // }
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin_v1/admin_demo.vue"),
    children: [
      {
        path: "/",
        name: "list",
        component: () => import("@/views/admin_v1/list_demo.vue")
      },
      {
        path: "detail/:SampleNo?",
        name: "detail",
        component: () => import("@/views/admin_v1/detail_demo.vue")
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
