// pages/login/index.js

const RSA = require('../../utils/wx_rsa.js')
// const RSA = require('../../utils/jsencrypt.min.js')
const Base64 = require('../../utils/base64')
//获取应用实例
const app = getApp()
const privateKey = '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQCivpq5oFBkQLDRfLGhsvymsfTJiVJb4FGZDJHE6tVnxDtVjoXzZw6B0pPHNRvqaOewtU0of/HgrjMSdNsKSGTRes03XRpE6GFoDEIx+CTiCI4Hp2WvQajMa6HpNt532CV02uE9qHkM6IV2OFF6BMhVaOM9YyibTZliF633Z3bfBQIDAQABAoGAOBOhUNDyoni/9I8YzfTUpcOv6znMDShwNWJlYAri2cx9/W8MrOAX2Zfrn7qnEdBv9S2jlo7vk1Gy+2sUhqiHRDH8ixlnGSk5qQW8+iM+XXU4vGLcLXNuDUhdx6GKYyaOeujjiHn83tYm4rZ2QR5pcewj9TMKCaBm0iR+27svwYECQQDdu7+NadIlBdvTZxCvpcyayIHsailwbFl5tNL4+78TgZEtnGSSIUnUGZjf5miQHc3JaykHfNA+6vc23ntFIfH1AkEAu+UhUI9W5PjlISPdvPBZhTDFD3plmoJjC+t/81wJZ691ZyL1jBc5vP9pBJuvBma744MJvGE24oJnNoC3cis+0QJBANOiV3pJ/mGH7gEg5jRAM8GojxlvWo4LXHtls9ghsIaVrFO0aelwDF987wUFjdfAGqKcvVSANONYsQyV3WJmu+ECQB583Vz/BTB+Gl+4PCCON1hfQ3pxd88MXRnwCoDobDZAyCIGECW9FwdNwjKXOF0nilEuUAQbGhbC5hB37kw+LCECQA053Q5Qu7UVD/C/tlAUqjj3VI/ryfxjY9Rh/vVhqaYnfpxjLFYG0Ccq1wpKsIa6C63Z3LiVbCesJFGpWyDlICE=-----END RSA PRIVATE KEY-----'
const publicKey = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCivpq5oFBkQLDRfLGhsvymsfTJ\niVJb4FGZDJHE6tVnxDtVjoXzZw6B0pPHNRvqaOewtU0of/HgrjMSdNsKSGTRes03\nXRpE6GFoDEIx+CTiCI4Hp2WvQajMa6HpNt532CV02uE9qHkM6IV2OFF6BMhVaOM9\nYyibTZliF633Z3bfBQIDAQAB\n-----END PUBLIC KEY-----"
// const publicKey = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCivpq5oFBkQLDRfLGhsvymsfTJ\niVJb4FGZDJHE6tVnxDtVjoXzZw6B0pPHNRvqaOewtU0of/HgrjMSdNsKSGTRes03\nXRpE6GFoDEIx+CTiCI4Hp2WvQajMa6HpNt532CV02uE9qHkM6IV2OFF6BMhVaOM9\nYyibTZliF633Z3bfBQIDAQAB\n-----END PUBLIC KEY-----"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '12345',

    // 显示/隐藏密码
    pwdType: true,

    pubKeyS: '等待请求中……', // 服务器公钥
    pubKeyC: publicKey,   // 小程序公钥
    piKeyC: privateKey,    // 小程序私钥
    encodePwd: '输入密码后显示',

    sslToken: '登录成功后显示',
    token: '登录成功后显示'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取公钥
    that.getSPublicKey()

    // 显示小程序密钥
    that.setData({
      pubKeyC: publicKey,
      piKeyC: privateKey
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
    let that = this
    that.getSPublicKey()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 获取服务器端的公钥
  getSPublicKey() {
    let that = this
    wx.request({
      url: 'https://ytt.dtpark.top/v1/public_key',
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        // 接口错误
        if (res.statusCode != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2500,
            mask: true,
            complete: () => {
              wx.navigateBack({
                delta: 1
              })
              return false
            }
          })
        }
        // console.log(res)
        let pk = that.clearBr(res.data.data.public_key)
        // console.log(pk)
        // 存储服务器公钥
        that.setData({
          pubKeyS: pk
        })
        wx.setStorageSync('pubKeyS', pk)
        wx.setStorageSync('keyId', res.data.data.key_id)
      },
      fail: (err) => {
        console.log(err)
      },
      complete: () => { }
    })
  },

  // 加密
  rsaencode(input_rsa, publicKey) {
    let encrypt_rsa = new RSA.RSAKey();
    encrypt_rsa = RSA.KEYUTIL.getKey(publicKey)
    let encStr = encrypt_rsa.encrypt(input_rsa)
    encStr = RSA.hex2b64(encStr)
    return encStr
  },

  //解密
  rsadecode(encStr,privateKey) {
    let decrypt_rsa = new RSA.RSAKey();
    decrypt_rsa = RSA.KEYUTIL.getKey(privateKey);
    if (encStr.length <= 0) {
      wx.showToast({
        title: '请先加密',
        icon: 'loading',
        duration: 2500
      })
    } else {
      encStr = RSA.b64tohex(encStr);
      var decStr = decrypt_rsa.decrypt(encStr)
      return decStr
    }
  },

  // 登录
  login(e) {
    let that = this
    // 前台校验数据
    if (e.detail.value.username == '' || e.detail.value.password == '') {
      wx.showModal({
        content: '输入不能为空！',
        showCancel: false
      })
      return false
    }
    let keyId = wx.getStorageSync('keyId');
    let pk = wx.getStorageSync('pubKeyS');
    // 组合数据
    let param = {
      username: e.detail.value.username,
      password: that.rsaencode(e.detail.value.password, pk),
      key_id: keyId,
      public_key: Base64.encode(publicKey)
    }

    wx.showLoading({
      title: '登录中',
      mask: true,
    });

    wx.request({
      url: 'https://ytt.dtpark.top/v1/token',
      data: param,
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            image: '',
            duration: 2500,
            mask: true,
          })
        }

        let ssltoken = res.data.data.token
        let token = that.rsadecode(res.data.data.token,privateKey)
        wx.showToast({
          title: '登录成功',
          icon: 'none',
          image: '',
          duration: 2500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        })
        that.setData({
          sslToken: ssltoken,
          token: token
        })

        // 记录token和sessionID
        wx.setStorageSync('sessionId', res.data.data.session_id)
        wx.setStorageSync('toke', token);
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    });


  },

  // 加密密码
  encodePwd(e){
    let that = this
    let pwd = e.detail.value
    let sslPwd = that.rsaencode(pwd,that.data.pubKeyS)
    that.setData({
      encodePwd: sslPwd
    })
  },

  // 显示/隐藏密码
  showOrHide() {
    let that = this
    let status = that.data.pwdType
    if (status) {
      // 已经隐藏，要显示密码
      that.setData({
        pwdType: false
      })
    } else {
      // 已经显示，要隐藏密码
      that.setData({
        pwdType: true
      })
    }
  },


  // 去除换行符
  clearBr(key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
  }
})