Page({
  data: {
    intimacy: 0,
    companionGender: 'female',
    userMessage: ''
  },
  
  onLoad() {
    const gameData = wx.getStorageSync('21days_game_data')
    if (gameData) {
      this.setData({
        intimacy: (gameData.intimacy || 0) + (gameData.giftIntimacy || 0),
        companionGender: gameData.companionGender || 'female'
      })
    }
  },
  
  onMessageInput(e) {
    this.setData({ userMessage: e.detail.value })
  },
  
  submitMessage() {
    const message = this.data.userMessage.trim()
    if (!message) {
      wx.showToast({
        title: '请输入留言',
        icon: 'none'
      })
      return
    }
    
    // 保存留言
    const gameData = wx.getStorageSync('21days_game_data')
    gameData.userMessage = message
    wx.setStorageSync('21days_game_data', gameData)
    
    wx.showToast({
      title: '留言已保存',
      icon: 'success'
    })
  },
  
  restartGame() {
    wx.showModal({
      title: '确认重新开始',
      content: '这将清空当前进度，开始新的21天旅程',
      success: (res) => {
        if (res.confirm) {
          // 清除存档
          wx.removeStorageSync('21days_game_data')
          // 返回首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  }
})
