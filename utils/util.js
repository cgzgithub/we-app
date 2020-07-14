/**
 * 工具类
 */
module.exports = {
   formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute].map(this.formatNumber).join(':')
    // return [hour, minute].map(this.formatNumber).join(':')
  },
  
   formatNumber (n ) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  //数组去重
   contains(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },
  
  getWindowSize(that) {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        let hei = res.windowHeight
        if (res.model.indexOf('Plus') > 0 || res.model.indexOf('xus 5x') > 0 || res.model.indexOf('xus 6') > 0){
          hei = res.windowHeight - 50
        } else if (res.model.indexOf('IX 3') > 0){
          hei = res.windowHeight - 25
        }
        console.log(res.model.indexOf('hone'))
        if (res.model.indexOf('X') > 0 && res.model.indexOf('hone') > 0){
          res.model = 'iPhone X'
        }
        that.setData({
          width: res.windowWidth,
          height: hei,
          model:res.model
        })
      },
    })
  },
  navTo(e) {
    let type = e.currentTarget.dataset.type
    let names = e.currentTarget.dataset.names
    let path = e.currentTarget.dataset.path
    let nav = 'navigateTo'
    if (type == 1) {
      nav = 'navigateTo'
    } else if (type == 2) {
      nav = 'redirectTo'
    } else if (type == 3) {
      nav = 'switchTab'
    }
    let url = path
    let _names = []
    if (names) {
      _names = names.split(',')
    }
    if (_names.length > 0) {
      url += '?'
      for (let i in _names) {
        if (i == 0) {
          url += _names[i] + '=' + e.currentTarget.dataset[_names[i]]
        } else {
          url += '&' + _names[i] + '=' + e.currentTarget.dataset[_names[i]]
        }
      }
    }
    wx[nav]({
      url: url,
    })
  },
  /**
   * scene解码
   */
  scene_decode: function(e) {
    if (e === undefined)
      return {};
    let scene = decodeURIComponent(e),
      params = scene.split(','),
      data = {};
    for (let i in params) {
      var val = params[i].split(':');
      val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
    }
    return data;
  },

  /**
   * 格式化日期格式 (用于兼容ios Date对象)
   */
  format_date: function(time) {
    // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    return time.replace(/\-/g, "/");
  },
  /**
   * 对象转URL
   */
  urlEncode(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(_value => {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },

  /**
   * 遍历对象
   */
  objForEach(obj, callback) {
    Object.keys(obj).forEach((key) => {
      callback(obj[key], key);
    });
  },

  /**
   * 是否在数组内
   */
  inArray(search, array) {
    for (var i in array) {
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  },

  /**
   * 判断是否为正整数
   */
  isPositiveInteger(value) {
    return /(^[0-9]\d*$)/.test(value);
  },

};