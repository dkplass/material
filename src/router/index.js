import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { requiresAuth: false },
    component: () => import("@/views/login.vue")
  },
  {
    path: "/main",
    redirect: "/main",
    component: () => import("@/layout/main.vue"),
    meta: { requiresAuth: false },
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
    meta: { requiresAuth: false },
    component: () => import("@/views/sample/sample.vue"),
    props: route => ({
      ...route.params
    })
  },
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
  // {
  //   path: "/admin",
  //   name: "admin",
  //   redirect: "/admin/list",
  //   component: () => import("@/views/admin_v1/admin_demo.vue"),
  //   children: [
  //     {
  //       path: "list",
  //       name: "list",
  //       component: () => import("@/views/admin_v1/list_demo.vue")
  //     },
  //     {
  //       path: "detail",
  //       name: "detail",
  //       component: () => import("@/views/admin_v1/detail_demo.vue")
  //     }
  //   ]
  // }
  {
    path: "/admin",
    redirect: "/admin",
    component: () => import("@/layout/admin/index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "admin",
        component: () => import("@/views/admin/index.vue")
      },
      {
        path: "SampleImage",
        name: "SampleImage",
        component: () => import("@/views/admin/SampleImage/index.vue")
      },
      {
        path: "/SampleImage/detail",
        name: "SampleImageDetail",
        component: () => import("@/views/admin/SampleImage/detail.vue")
      },
      {
        path: "SampleColor",
        name: "SampleColor",
        component: () => import("@/views/admin/SampleColor/index.vue")
      },
      {
        path: "SampleModel",
        name: "SampleModel",
        component: () => import("@/views/admin/SampleModel/index.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: "/login"
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/materialball/",
  routes
});

router.beforeEach((to, from, next) => {
  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果沒有 token
    const token = store.state.Authenticate.token;

    if (token === "") {
      // 轉跳到 login page
      next({ path: "/login" });
    } else {
      next(); // 往下繼續執行
    }
  } else {
    next();
  }
});

export default router;
