const app = getApp()

Page({
    data: {
        logs: [],
        encryptedData:null,
        iv:null,
        sessionId:null,
        step:null
    },
    onLoad: function () {
        let that = this;
        wx.login({
              success: function (res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: 'https://www.zhenzhezixun.com/login.php',
                    data: {
                      code: res.code
                    },
                    method:"GET",
                    success:function (res){
                        console.log(res.data);
                        var sessionId = res.data;
                        that.setData({ sessionId: sessionId })
                        wx.setStorageSync('sessionId', sessionId)
                      //console.log(res.data)
                        wx.getWeRunData({
                            success(res) {
                                console.log(res);
                                that.setData({
                                    encryptedData: res.encryptedData,
                                    iv:res.iv,
                                    session: wx.getStorageSync('sessionId')
                                });
                                that.decodeUserInfo();
                            }
                        })
                    }
                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
        })
    },
    decodeUserInfo: function () {
        let that = this;

        wx.request({
            url: 'https://www.zhenzhezixun.com/decrypt.php',
            data: {
                encryptedData: that.data.encryptedData,
                iv: that.data.iv,
                sessionKey: wx.getStorageSync('sessionId')
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                console.log(res.data);
                let todayStep = res.data.stepInfoList[0];
                that.setData({
                     step: todayStep.step
                 });
                 console.log(todayStep);
            }
        })

    }
})