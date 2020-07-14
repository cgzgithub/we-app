// pages/productDetail/productDetail.js
const App = getApp()
const wxParse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsCollect:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
    this.setData({
      id: options.id
    })
  },

  getDetail:function(id){
    let _this=this;
    // App._get('article/detail', {
    //   article_id:id || 10001
    // }, (res) => {
      let resData = '{"code":1,"msg":"success","data":{"detail":{"article_id":10115,"article_title":"线上直播|七月，从杭博小讲堂开始","article_subtitle":"","show_type":10,"category_id":10001,"image_id":0,"article_digest":"杭博小讲堂- 七月 \/ 你好 -01 上期回顾如何使用杭博内控手册开展部门内部有效控制——张俊上期杭博小讲堂","article_content":"123","article_sort":0,"article_status":1,"virtual_views":0,"actual_views":31,"jump_url":"http:\/\/mp.weixin.qq.com\/s?__biz=Mzg3ODI5NjQ0MA==&mid=100000684&idx=1&sn=1dae8812beb9e9f9a3fc4ee2b013b484&chksm=4f14afbb786326addc965c554431cea37bd586406ad6f2ec26d67e3093f7db2bbea71f4fe894#rd","shop_id":0,"source_id":"kweNuhGZ5Gi-XzQxoZ0DZpZDw-01upItjcIK8g4sAGo","source":"wx","image_url":"http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/BP4z7dl0bmrp0mtgorRf1ZJDrZqX2mpRiaia6M3sKicI85ozaHTAGcTG1mrib3K7flkTZ7Yiac2XIQnTfM9DITtcJMA\/0?wx_fmt=jpeg","like":0,"unlike":0,"keywords":"","my_collect":1,"image":null,"category":{"category_id":10001,"name":"杭博小讲堂","sort":1,"wxapp_id":10001,"create_time":"2020-06-08 18:20:39","update_time":"2020-06-23 10:02:02","shop_id":0,"type":""},"show_views":31,"view_time":"2020-07-01"}}}'
      let res = JSON.parse(resData)
      wxParse.wxParse('contentT', 'html', res.data.detail.article_content, _this, 0);

      //details要处理的内容

      const replaceDetail = function (details) {

        var texts = '';//待拼接的内容

        while (details.indexOf('<img') != -1) {//寻找img 循环

          texts += details.substring('0', details.indexOf('<img') + 4);//截取到<img前面的内容

          details = details.substring(details.indexOf('<img') + 4);//<img 后面的内容

          if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {

            texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%!important;height:auto;margin:0 auto;";//从 <img 后面的内容 截取到style= 加上自己要加的内容

            details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接

          } else {

            texts += ' style="max-width:100%!important;height:auto;margin:0 auto;" ';

          }



        }

        texts += details;//最后拼接的内容

        return texts

      }
      _this.setData({
        detail:res.data.detail,
        nodes: replaceDetail(res.data.detail.article_content),
        title: res.data.detail.article_title,
        IsCollect:res.data.detail.my_collect
      })
    // })
  },
  //收藏
  collect:function(){
    let _this = this;
    App._get('article/collect', {
      article_id: _this.data.id
    }, (res) => {
      console.log(res)
      // this.getDetail(_this.data.id)
      let collect = !_this.data.IsCollect;
      _this.setData({
        IsCollect: collect
      })
      wx.showToast({
        title: '收藏成功',
        icon:'none'
      })
    })
  },
  //取消收藏
  canelCollect:function(){
    let _this = this;
    App._get('article/unCollect', {
      article_id: _this.data.id
    }, (res) => {
      console.log(res)
      let collect = !_this.data.IsCollect;
      _this.setData({
        IsCollect: collect
      })
      wx.showToast({
        title: '取消收藏成功',
        icon: 'none'
      })
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
    let _this=this;
    return {
      title: _this.data.detail.article_title,
      path: '/pages/articleDetail/articleDetail?id='+_this.data.id,
    }
  }
})