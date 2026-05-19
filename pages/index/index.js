const app = getApp()

Page({
  data: {
    
  },
  
  onLoad() {
    // 检查是否有存档
    const gameData = wx.getStorageSync('21days_game_data')
    if (gameData && gameData.phase === 'main') {
      // 有存档，直接进入主游戏
      wx.redirectTo({
        url: '/pages/main/main'
      })
    }
  },
  
  startGame() {
    // 初始化游戏数据
    const gameData = {
      phase: 'setup',
      playerGender: '',
      companionGender: '',
      companionName: '',
      companionAppearance: {
        hairStyle: 0,
        skinColor: 0,
        faceShape: 0,
        eyesType: 0,
        mouthType: 0
      },
      currentDay: 1,
      intimacy: 0,
      giftIntimacy: 0,
      points: 100,
      todayPointsClaimed: true,
      todayChatCount: 0,
      todayGiftIntimacy: 0,
      lastInteractionTime: Date.now(),
      chatHistory: [],
      language: 'zh'
    }
    
    wx.setStorageSync('21days_game_data', gameData)
    
    // 进入设置流程
    wx.navigateTo({
      url: '/pages/main/main?setup=true'
    })
  },
  
  showTips() {
    wx.showModal({
      title: '游戏说明',
      content: '这是一个21天的陪伴养成游戏。每天与AI伴侣聊天、赠送礼物，培养感情。21天后将看到你们的最终结局。',
      showCancel: false
    })
  }
})
