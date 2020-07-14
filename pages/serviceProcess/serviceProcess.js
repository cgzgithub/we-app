var app = getApp()
let isLoading = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [1, 2],
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getGoodsInfo()
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
    if (!isLoading) {
      this.getGoodsInfo()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //获得列表信息
  getGoodsInfo() {
    let _this = this;
    isLoading = true;
    app._get('article/lists', {
      search: _this.data.search,
      page: _this.data.page,
      sortType: 'all',
      sortType: 0,
      listRows: 20,
    }, function (res) {
      console.log(res)
      let lists = res.data.list.data || [];

      isLoading = false;
      _this.setData({
        lists: _this.data.lists.concat(lists),
        page: lists.length > 0 ? _this.data.page + 1 : _this.data.page
      })
    });
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetail/articleDetail?id=' + id,
    })
  }
})