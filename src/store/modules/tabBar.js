const tabBar = {
  state: {
    tabBarName: '首页',
    ifHasRightArrow:false,
    activeTabBar:0,
    showLoading:false
  },
  mutations: {
    changeTabBarName(state,value) {
      state.tabBarName = value;
    },
    changeActiveTabBar(state,value){
      state.activeTabBar = value;
    },
    ChangeIffHasRightArrow(state,value){
      state.ifHasRightArrow = value;
    }
  }
};

export default tabBar;
