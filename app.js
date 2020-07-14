

//app.js
// 站点配置文件
import siteinfo from './siteinfo.js';
// 工具类
const util = require('./utils/util.js');
App({
  com: util,
  timer: null, //倒计时定时器
  // api地址
  api_root: siteinfo.siteroot + 'index.php?s=/api/',
  /**
   * 获取商城ID
   */
  getWxappId() {
    return wx.getStorageSync("wxapp_id") || '10001';
  },
  /**
   * 获取场景值(scene)
   */
  getSceneData(query) {
    return query.scene ? util.scene_decode(query.scene) : {};
  },
  /**
   * 当前shop_id
   */
  getShopId: function () {
    return wx.getStorageSync('shop_id');
  },
  /**
   * 当前用户id
   */
  getUserId: function () {
    return wx.getStorageSync('user_id');
  },
  onLaunch: function (e) {


    let _this = this;
    _this.updateManager();
    // 小程序启动场景
    this.onStartupScene(e.query);
  },
  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },

  /**
   * get请求
   */
  _get(url, data, success, fail, complete, check_login) {
    wx.showNavigationBarLoading();
    let _this = this;
    // 构造请求参数
    data = data || {};
    data.wxapp_id = _this.getWxappId();
    // data.shop_id = _this.getShopId()
    // 构造get请求
    let request = function () {
      data.token = wx.getStorageSync('token');
      wx.request({
        url: _this.api_root + url,
        header: {
          'content-type': 'application/json',
          'sessionId': wx.getStorageSync("sessionId") || '',
          'authKey': wx.getStorageSync("authKey") || ''
        },
        data: data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            console.log(res);
            _this.showError('网络请求出错');
            return false;
          }
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            wx.hideNavigationBarLoading();
            _this.doLogin();
          } else if (res.data.code === 0) {
            _this.showError(res.data.msg, function () {
              fail && fail(res);
            });
            return false;
          } else if (res.data.code === 100){
            wx.setStorageSync('student_id', 0)
            wx.navigateBack({
              delta:1
            })
          } else {
            success && success(res.data);
          }
        },
        fail(res) {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        },
        complete(res) {
          wx.hideNavigationBarLoading();
          complete && complete(res);
        },
      });
    };
    // 判断是否需要验证登录
    check_login ? _this.doLogin(request) : request();
  },

  /**
   * post提交
   */
  _post_form(url, data, success, fail, complete, isShowNavBarLoading) {
    let _this = this;

    isShowNavBarLoading || true;
    data.wxapp_id = _this.getWxappId();
    // data.token = wx.getStorageSync('token');
    // data.shop_id = _this.getShopId()
    // 在当前页面显示导航条加载动画
    if (isShowNavBarLoading == true) {
      wx.showNavigationBarLoading();
    }
    wx.request({
      url: _this.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionId': wx.getStorageSync("sessionId") || '',
        'authKey': wx.getStorageSync("authKey") || ''
      },
      method: 'POST',
      data: data,
      success(res) {
        console.log(res)
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          console.log(res, '网络请求出错')
          _this.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          wx.hideNavigationBarLoading();
          _this.doLogin();
          return false;
        } else if (res.data.code === 0) {
          _this.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        // console.log(res);
        _this.showError(res.errMsg, function () {
          fail && fail(res);
        });
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        // wx.hideLoading();
        complete && complete(res);
      }
    });
  },
  /**
   * 显示成功提示框
   */
  showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success() {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },
  /**
   * 执行用户登录
   */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/auth/auth" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/auth/auth"
    });
  },
  globalData: {
    userInfo: null
  },
  /**
   * 记录formId
   */
  saveFormId(formId) {
    let _this = this;
    console.log('saveFormId');
    if (formId === 'the formId is a mock one') {
      return false;
    }
    _this._post_form('wxapp.formId/save', {
      formId: formId
    }, null, null, null, false);
  },

  /**
   * 生成转发的url参数
   */
  getShareUrlParams(params) {
    let _this = this;
    return util.urlEncode(Object.assign({
      referee_id: _this.getUserId()
    }, params));
  },

  /**
   * 发起微信支付
   */
  wxPayment(option) {
    let options = Object.assign({
      payment: {},
      success: () => {},
      fail: () => {},
      complete: () => {},
    }, option);
    wx.requestPayment({
      timeStamp: options.payment.timeStamp,
      nonceStr: options.payment.nonceStr,
      package: 'prepay_id=' + options.payment.prepay_id,
      signType: 'MD5',
      paySign: options.payment.paySign,
      success(res) {
        options.success(res);
      },
      fail(res) {
        options.fail(res);
      },
      complete(res) {
        options.complete(res);
      }
    });
  },
  /**
   * 小程序启动场景
   */
  onStartupScene: function (query) {

    // 获取场景值
    let scene = this.getSceneData(query);
    // 记录推荐人id
    let refereeId = query.referee_id ? query.referee_id : scene.uid;
    refereeId > 0 && (this.saveRefereeId(refereeId));
  },

  /**
   * 记录推荐人id
   */
  saveRefereeId: function (refereeId) {
    if (!wx.getStorageSync('referee_id'))
      wx.setStorageSync('referee_id', refereeId);
  },

  /**
   * 获取场景值(scene)
   */
  getSceneData: function (query) {
    return query.scene ? util.scene_decode(query.scene) : {};
  },
  //时分秒
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';

    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  },
  //年月日
  timestampToYear: function (timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
  },
  //倒计时
  countDownTime(timestamp) {
    var nowTime = new Date().getTime();
    if (timestamp <= nowTime) {
      return {
        day: 0,
        hour: 0,
        minutes: 0,
        seconds: 0,
        isFinish: true
      }
    } else {
      let time = timestamp - nowTime;
      let day = parseInt(time / (24 * 60 * 60 * 1000));
      let hour = parseInt(time / (60 * 60 * 1000)) % 24;
      let minutes = parseInt(time / (60 * 1000)) % 60;
      let seconds = parseInt(time / (1000)) % 60;
      return {
        day: day < 10 ? '0' + day : day,
        hour: hour < 10 ? '0' + hour : hour,
        minutes: minutes < 10 ? '0' + minutes : minutes,
        seconds: seconds < 10 ? '0' + seconds : seconds,
        isFinish: false
      }
    }
  }
})