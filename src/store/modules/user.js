let userInfo = {};
if(localStorage.getItem('userInfo')){
  userInfo = JSON.parse(localStorage.getItem('userInfo'))
}
let cardNo = null;
if(localStorage.getItem('cardNo')){
  cardNo = JSON.parse(localStorage.getItem('cardNo'))
}
const user = {
    state: {
      cardNo:cardNo,
      token:userInfo.id,
      headerImg:userInfo.headimgurl,
      userName:userInfo.userName,
      provinceCity:userInfo.provinceCity,
      sex:userInfo.NewSex,
      currentPosition:{
        latitude:0,
        longitude:0,
      }
    },
    getters:{
      getPos(state){

      }
    },
    mutations: {
        logOut (state, vm) {
            state.cardNo = null;
            state.token = null;
            state.headerImg = null;
            state.userName = null;
            state.provinceCity = null;
            state.sex = null;
        },
        setCurrentPos(state,value){
          state.currentPosition = Object.assign({}, state.currentPosition,value)
        },
        setCardNo(state,value){
          state.cardNo = value;
        },
        setheaderImg(state,value){
          state.headerImg = value;
        },
        setUserName(state,value){
          state.userName = value;
        },
        setProvinceCity(state,value){
          state.provinceCity = value;
        },
        setSex(state,value){
          state.sex = value;
        },
    }
};

export default user;
