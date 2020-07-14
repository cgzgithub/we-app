// pages/auth/auth.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    userValue: '',
    psdValue: '',
    siteInfo: App.siteinfo,
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          let datas = {
            code: res.code,
            // iv: e.detail.iv,
            // encryptedData: e.detail.encryptedData,
          }
          App._post_form('user/code2session', datas, function (res) {
            console.log('login')
            console.log(res)
            self.setData({
              token: res.data.token
            })
          })

        }
      }
    })
  },
  getPhoneNumber: function (e) {
    let self = this
    console.log(e)
    if (!e.detail.encryptedData) {
      return
    }
    let datas = {
      token: self.data.token,
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
    }
    App._post_form('login/phoneLogin', datas, function (res) {
      console.log(res)
      if(res.data.user){
        wx.setStorageSync("sessionId", res.data.user.sessionId)
      wx.setStorageSync("authKey", res.data.user.authKey)
      // wx.setStorageSync("shop_id", res.data.user.user.shop_id)
      wx.setStorageSync("userInfo", res.data.user.user)
      wx.switchTab({
        url: '/pages/index/index',
      })
      }else{
        wx.showToast({
          title: '非员工手机号，无法登录',
          icon:'none'
        })
      }
    })
  },
  checkTab: function (e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      current: id
    })
  },
  login: function () {
    // 登录
    let _this = this;
    if (!_this.data.userValue) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      })
      return;
    }
    if (!_this.data.psdValue) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    App._post_form('login/login/w/10001', {
      user_name: _this.data.userValue,
      password: _this.data.psdValue,
      wxapp_id: App.getWxappId()
    }, (res) => {
      console.log(res);
      wx.setStorageSync("sessionId", res.data.sessionId)
      wx.setStorageSync("authKey", res.data.authKey)
      // wx.setStorageSync("shop_id", res.data.user.shop_id)
      wx.setStorageSync("userInfo", res.data.user)
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, null, () => {
      wx.hideLoading();
    });
  },
  userInp: function (e) {
    let value = e.detail.value;
    this.setData({
      userValue: value
    })
  },
  psdInp: function (e) {
    let value = e.detail.value;
    this.setData({
      psdValue: value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})