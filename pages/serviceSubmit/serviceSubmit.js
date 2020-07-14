// pages/recruit/publishJob/publishJob.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDetails: false,
    index: '',
    infos:['故障维修','服务预约','疑难解答']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  //  this.getInfo()
  },
  // //获取配置信息
  // getInfo() {
  //   let self = this;
  //   app._recruit_get('work.job/add', {}, res => {
  //     console.log(res)
  //     let welfareInfos = [];
  //     if (res.data.welfare && res.data.welfare.length > 0) {
  //       res.data.welfare.map(v => {
  //         let obj = {
  //           name: v,
  //           isCheck: false
  //         }
  //         welfareInfos.push(obj)
  //       })
  //     }
  //     self.setData({
  //       welfareInfos: welfareInfos,
  //       infos: res.data
  //     })
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  publish() {
    let self = this;
    if (!self.data.name){
      wx.showToast({
        icon:'none',
        title:'请填写职位名称'
      })
      return
    }
    if (self.data.salary_type == 'money' && self.data.salary_min == 0 || self.data.salary_type == 'money' && self.data.salary_max == 0 ) {
      wx.showToast({
        icon: 'none',
        title: '请填写薪资待遇'
      })
      return
    }
    if (!self.data.education) {
      wx.showToast({
        icon: 'none',
        title: '请选择学历要求'
      })
      return
    }
    if (!self.data.work_age) {
      wx.showToast({
        icon: 'none',
        title: '请选择工作年限'
      })
      return
    }
    if (!self.data.shop_id) {
      wx.showToast({
        icon: 'none',
        title: '请选择工作地点'
      })
      return
    }

  },
  bindKeyInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
    })
  },
  showDetails() {
    this.setData({
      showDetails: true,
    })
  },
  closePop() {
    this.setData({
      showDetails: false,
    })
  },
  selectGroupChange(e) {
    console.log(e)
    this.setData({
      type: e.detail.value
    })
  },
  changeWelfare(e) {
    let index = e.currentTarget.dataset.index;
    let welfareInfos = this.data.welfareInfos;
    welfareInfos[index].isCheck = !welfareInfos[index].isCheck
    this.setData({
      welfareInfos
    }, () => {
      let welfare = [];
      this.data.welfareInfos.map(v => {
        if (v.isCheck) {
          welfare.push(v.name)
        }
      })
      welfare = welfare.join('|')
      this.setData({
        welfare
      })
    })
  },
  cancelAll() {
    let welfareInfos = this.data.welfareInfos;
    welfareInfos.map(v => {
      v.isCheck = false;
    })
    this.setData({
      welfareInfos,
      welfare: [],
      showDetails: false
    })
  },
  chooseWay(e) {
    let way = e.currentTarget.dataset.way;
    if (way == 'face') {
      this.setData({
        salary_min: '',
        salary_max: ''
      })
    }
    this.setData({
      salary_type: way,
    })
  }
})