//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  //事件处理函数
  login: function() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
  },
  onLoad: function () {
    
  },
})
