var app = getApp()
let isLoading = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [{"article_id":10115,"article_title":"线上直播|七月，从杭博小讲杭博小讲杭博小讲杭博小讲杭博小讲堂开始","article_subtitle":"","show_type":10,"category_id":10001,"image_id":0,"article_digest":"杭博小讲堂- 七月 \/ 你好 -01 上期回顾如何使用杭博内控手册开展部门内部有效控制——张俊上期杭博小讲堂","article_sort":0,"article_status":1,"virtual_views":0,"actual_views":14,"jump_url":"http:\/\/mp.weixin.qq.com\/s?__biz=Mzg3ODI5NjQ0MA==&mid=100000684&idx=1&sn=1dae8812beb9e9f9a3fc4ee2b013b484&chksm=4f14afbb786326addc965c554431cea37bd586406ad6f2ec26d67e3093f7db2bbea71f4fe894#rd","shop_id":0,"source_id":"kweNuhGZ5Gi-XzQxoZ0DZpZDw-01upItjcIK8g4sAGo","source":"wx","image_url":"http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/BP4z7dl0bmrp0mtgorRf1ZJDrZqX2mpRiaia6M3sKicI85ozaHTAGcTG1mrib3K7flkTZ7Yiac2XIQnTfM9DITtcJMA\/0?wx_fmt=jpeg","like":0,"unlike":0,"keywords":"","my_collect":1,"image":null,"category":{"category_id":10001,"name":"杭博小讲堂","sort":1,"wxapp_id":10001,"create_time":"2020-06-08 18:20:39","update_time":"2020-06-23 10:02:02","shop_id":0,"type":""},"show_views":14,"view_time":"2020-07-01"},{"article_id":10115,"article_title":"线上直播|七月，从杭博小讲堂开始","article_subtitle":"","show_type":10,"category_id":10001,"image_id":0,"article_digest":"杭博小讲堂- 七月 \/ 你好 -01 上期回顾如何使用杭博内控手册开展部门内部有效控制——张俊上期杭博小讲堂","article_sort":0,"article_status":1,"virtual_views":0,"actual_views":14,"jump_url":"http:\/\/mp.weixin.qq.com\/s?__biz=Mzg3ODI5NjQ0MA==&mid=100000684&idx=1&sn=1dae8812beb9e9f9a3fc4ee2b013b484&chksm=4f14afbb786326addc965c554431cea37bd586406ad6f2ec26d67e3093f7db2bbea71f4fe894#rd","shop_id":0,"source_id":"kweNuhGZ5Gi-XzQxoZ0DZpZDw-01upItjcIK8g4sAGo","source":"wx","image_url":"http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/BP4z7dl0bmrp0mtgorRf1ZJDrZqX2mpRiaia6M3sKicI85ozaHTAGcTG1mrib3K7flkTZ7Yiac2XIQnTfM9DITtcJMA\/0?wx_fmt=jpeg","like":0,"unlike":0,"keywords":"","my_collect":1,"image":null,"category":{"category_id":10001,"name":"杭博小讲堂","sort":1,"wxapp_id":10001,"create_time":"2020-06-08 18:20:39","update_time":"2020-06-23 10:02:02","shop_id":0,"type":""},"show_views":14,"view_time":"2020-07-01"}],
   
    page:1,
    // cateList:[],
    // selectedNav:0,
    selectCate:1,
    search:''
  },
  //改变类别
  changeCate(e){
    this.setData({
      selectCate:e.currentTarget.dataset.cate
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCate()
  },

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
    if(!isLoading){
        this.getGoodsInfo(this.data.selectedNavId)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  showPop(e) {
    this.setData({
      popIndex:e.currentTarget.dataset.index,
      showPop2: true
    })
  },
  closePop() {
    this.setData({
      showPop2: false
    })
  },
   //获得分类信息
   getCate() {
    let _this = this;
    app._get('article/index', {
    }, function(res) {
      console.log(res)
let arr = [{category_id:0,name:'全部'}]

      _this.setData({
        cateList: arr.concat(res.data.categoryList),
        lists:[],
        page:1,
      },()=>{
        _this.getGoodsInfo(0)
      })
    });
  },
  //获得列表信息
  getGoodsInfo(category_id) {
    let _this = this;
    isLoading = true;
    app._get('article/lists', {
      search:_this.data.search,
      page: _this.data.page,
      category_id:category_id,
      sortType: 'all',
      sortType: 0,
      listRows: 20,
    }, function(res) {
      console.log(res)
      let lists = res.data.list.data || [];

      isLoading = false;
      _this.setData({
        lists: _this.data.lists.concat(lists),
        page: lists.length > 0 ? _this.data.page + 1 : _this.data.page
      })
    });
  },
  checkNav: function (e) {
    let $index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    
    this.setData({
      selectedNav: $index,
      selectedNavId: id,
      lists:[],
        page:1,
    },()=>{
      this.getGoodsInfo(id);
    })
  },
  searchInput(e){
    this.setData({
      search:e.detail.value
    })
  },
  searchShop(){
    this.setData({
      lists:[],
        page:1,
    },()=>{
      this.getGoodsInfo(this.data.selectedNavId);
    })
   
  },
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetail/articleDetail?id=' + id,
    })
  }
})