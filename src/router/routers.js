import Main from '_v/Main.vue'

const tabIndex =[
  {
    path: '/tabIndex/placeDetail',
    name: 'placeDetail',
    meta: {
      keepAlive:false,
      title: '景区详情'
    },
    component: () => import('_v/tabIndex/placeDetail.vue')
  },
  {
    path: '/tabIndex/placeDetail/around',
    name: 'around',
    meta: {
      keepAlive:false,
      title: '周边服务'
    },
    component: () => import('_v/tabIndex/around.vue')
  },
  {
    path: '/tabIndex/weather',
    name: 'weather',
    meta: {
      keepAlive:true,
      title: '天气预报'
    },
    component: () => import('_v/tabIndex/Weather.vue')
  },
  {
    path: '/tabIndex/guideInside',
    name: 'guideInside',
    meta: {
      keepAlive:false,
      title: '附近展台'
    },
    component: () => import('_v/tabIndex/guideInside.vue')
  },
  {
    path: '/tabIndex/guideBoothList',
    name: 'guideBoothList',
    meta: {
      keepAlive:false,
      title: '所有展台'
    },
    component: () => import('_v/tabIndex/guideBoothList.vue')
  },
  {
    path: '/tabIndex/guideBoothListDetail',
    name: 'guideBoothListDetail',
    meta: {
      keepAlive:false,
      title: '展台详情'
    },
    component: () => import('_v/tabIndex/guideBoothListDetail.vue')
  },
];
const tabActivity =[
  {
    path: '/tabActivity/activityDetail',
    name: 'activityDetail',
    meta: {
      keepAlive:false,
      title: '活动详情'
    },
    component: () => import('_v/tabActivity/activityDetail.vue')
  }
];
const tabKnowledge=[
  {
    path: '/tabKnowledge/knowledgeDetail',
    name: 'knowledgeDetail',
    meta: {
      keepAlive:false,
      title: '知识详情'
    },
    component: () => import('_v/tabKnowledge/knowledgeDetail.vue')
  },
  {
    path: '/tabKnowledge/knowledgeGame',
    name: 'knowledgeGame',
    meta: {
      keepAlive:false,
      title: '知识游戏'
    },
    component: () => import('_v/tabKnowledge/knowledgeGame.vue')
  }
];

const tabMine = [
  {
    path: '/mine/personInfo',
    name: 'personInfo',
    meta: {
      keepAlive:false,
      title: '个人信息'
    },
    component: () => import('_v/tabMine/personInfo.vue')
  },
  {
    path: '/mine/collection',
    name: 'collection',
    meta: {
      keepAlive:false,
      title: '我的收藏'
    },
    component: () => import('_v/tabMine/collection.vue')
  },
  {
    path: '/mine/bindCard',
    name: 'bindCard',
    meta: {
      keepAlive:false,
      title: '绑定卡牌'
    },
    component: () => import('_v/tabMine/bindCard.vue')
  },
  {
    path: '/mine/question',
    name: 'question',
    meta: {
      keepAlive:true,
      title: '问题咨询'
    },
    component: () => import('_v/tabMine/question.vue')
  },
  {
    path: '/mine/newQuestion',
    name: 'newQuestion',
    meta: {
      keepAlive:false,
      title: '问题咨询'
    },
    component: () => import('_v/tabMine/newQuestion.vue')
  },
  {
    path: '/mine/about',
    name: 'about',
    meta: {
      keepAlive:false,
      title: '关于我们'
    },
    component: () => import('_v/tabMine/about.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      keepAlive:false,
      title: '登录'
    },
    component: () => import('_v/login/index.vue')
  }
]
export const mainRouters = [
  {
    path: '/',
    name: 'main',
    component: Main,
    meta: {
      keepAlive:false,
      title: '红色旅游'
    },
    redirect: '/tabIndex',
    children: [
      {
        path: '/tabIndex',
        name: 'tabIndex',
        meta: {
          keepAlive:true,
          navBar:false,
          title: '首页'
        },
        component: () => import('_v/tabIndex/index.vue')
      },
      {
        path: '/tabActivity',
        name: 'tabActivity',
        meta: {
          title: '活动',
          keepAlive:true,
        },
        component: () => import('_v/tabActivity/index.vue')
      }, {
        path: '/tabGuide',
        name: 'tabGuide',
        meta: {
          title: '导览',
          keepAlive:true,
        },
        component: () => import('_v/tabGuide/index.vue')
      },{
        path: '/tabKnowledge',
        name: 'tabKnowledge',
        meta: {
          title: '知识',
          keepAlive:true,
        },
        component: () => import('_v/tabKnowledge/index.vue')
      }, {
        path: '/tabMine',
        name: 'tabMine',
        meta: {
          title: '我的',
          keepAlive:true,
        },
        component: () => import('_v/tabMine/index.vue')
      },
    ],
  },
  ...tabIndex,
  ...tabActivity,
  ...tabKnowledge,
  ...tabMine
];

export const routers = [
  ...mainRouters,
];
