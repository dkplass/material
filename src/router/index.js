import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  // {
  //   path: "/main",
  //   name: "main",
  //   component: () => import("@/views/index.vue")
  // },
  {
    path: "/",
    redirect: "/main",
    component: () => import("@/layout/main.vue"),
    children: [
      {
        path: "/main",
        name: "main",
        component: () => import("@/views/index.vue")
      },
      {
        path: "/favorite",
        name: "favorite",
        component: () => import("@/views/favorite/index.vue")
      }
    ]
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
  //   path: "/favorite",
  //   name: "favorite",
  //   component: () => import("@/views/favorite/index.vue")
  // },
  // {
  //   path: "/3D_Demo",
  //   name: "3d",
  //   component: () => import("@/views/three/testbox.vue")
  // },
  // {
  //   path: "/chair",
  //   name: "chair",
  //   component: () => import("@/views/three/chair.vue")
  // },
  // {
  //   path: "/upload",
  //   name: "upload",
  //   component: () => import("@/views/upload/upload.vue")
  // }
  {
    path: "/admin",
    name: "admin",
    redirect: "/admin/list",
    component: () => import("@/views/admin_v1/admin_demo.vue"),
    children: [
      {
        path: "list",
        name: "list",
        component: () => import("@/views/admin_v1/list_demo.vue")
      },
      {
        path: "detail",
        name: "detail",
        component: () => import("@/views/admin_v1/detail_demo.vue")
      }
    ]
  }
  // {
  //   path: "/admin",
  //   component: () => import("@/layout/admin/index.vue"),
  //   children: []
  // }
];

const router = new VueRouter({
  mode: "history",
  base: "/materialball/",
  routes
});

export default router;
