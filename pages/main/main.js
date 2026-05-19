const app = getApp()

// AI对话引擎
const ChatEngine = {
  async generateReply(text, companionGender, day, chatCount, intimacy) {
    const config = app.globalData.aiConfig
    
    const companionName = companionGender === 'male' ? '小明' : '小花'
    const systemPrompt = `你是${companionName}，一个温柔体贴的${companionGender === 'male' ? '男生' : '女生'}。今天是你们认识的第${day}天，亲密度${intimacy}。请用自然、亲切的语气回复，可以适当使用emoji。回复要简短（50字以内），像日常聊天一样。`
    
    try {
      const response = await wx.request({
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: 0.8,
          max_tokens: 150
        }
      })
      
      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content
      }
      return '嗯嗯，我在听呢~'
    } catch (error) {
      console.error('AI请求失败:', error)
      return '网络有点问题，待会再聊吧~'
    }
  }
}

Page({
  data: {
    isSetup: false,
    currentStep: 0,
    setupSteps: [
      { title: '你是...' },
      { title: '你想陪伴的人是...' },
      { title: '你的名字是...' }
    ],
    playerGender: '',
    companionGender: '',
    playerName: '',
    canProceed: false,
    
    // 游戏数据
    currentDay: 1,
    intimacy: 0,
    companionName: '',
    chatHistory: [],
    inputText: '',
    isTyping: false,
    lastMessageId: ''
  },
  
  onLoad(options) {
    if (options.setup) {
      this.setData({ isSetup: true })
    } else {
      this.loadGameData()
    }
  },
  
  loadGameData() {
    const gameData = wx.getStorageSync('21days_game_data')
    if (gameData) {
      this.setData({
        currentDay: gameData.currentDay || 1,
        intimacy: (gameData.intimacy || 0) + (gameData.giftIntimacy || 0),
        companionName: gameData.companionName || '小花',
        companionGender: gameData.companionGender || 'female',
        chatHistory: gameData.chatHistory || []
      })
    }
  },
  
  // 设置流程
  selectPlayerGender(e) {
    this.setData({
      playerGender: e.currentTarget.dataset.gender,
      canProceed: true
    })
  },
  
  selectCompanionGender(e) {
    this.setData({
      companionGender: e.currentTarget.dataset.gender,
      canProceed: true
    })
  },
  
  onNameInput(e) {
    this.setData({
      playerName: e.detail.value,
      canProceed: e.detail.value.length > 0
    })
  },
  
  prevStep() {
    this.setData({
      currentStep: this.data.currentStep - 1,
      canProceed: true
    })
  },
  
  nextStep() {
    if (this.data.currentStep < 2) {
      this.setData({
        currentStep: this.data.currentStep + 1,
        canProceed: false
      })
    } else {
      // 完成设置，进入游戏
      const gameData = wx.getStorageSync('21days_game_data')
      gameData.phase = 'main'
      gameData.playerGender = this.data.playerGender
      gameData.companionGender = this.data.companionGender
      gameData.companionName = this.data.companionGender === 'male' ? '小明' : '小花'
      wx.setStorageSync('21days_game_data', gameData)
      
      this.setData({
        isSetup: false,
        companionName: gameData.companionName,
        companionGender: gameData.companionGender
      })
    }
  },
  
  // 聊天功能
  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },
  
  async sendMessage() {
    const text = this.data.inputText.trim()
    if (!text || this.data.isTyping) return
    
    // 添加用户消息
    const chatHistory = this.data.chatHistory
    chatHistory.push({ role: 'user', text })
    
    this.setData({
      chatHistory,
      inputText: '',
      isTyping: true,
      lastMessageId: `msg-${chatHistory.length - 1}`
    })
    
    // 获取AI回复
    const reply = await ChatEngine.generateReply(
      text,
      this.data.companionGender,
      this.data.currentDay,
      chatHistory.length,
      this.data.intimacy
    )
    
    // 添加AI回复
    chatHistory.push({ role: 'ai', text: reply })
    
    // 更新亲密度
    const newIntimacy = this.data.intimacy + 1
    
    // 保存游戏数据
    const gameData = wx.getStorageSync('21days_game_data')
    gameData.chatHistory = chatHistory
    gameData.intimacy = newIntimacy
    gameData.todayChatCount = (gameData.todayChatCount || 0) + 1
    wx.setStorageSync('21days_game_data', gameData)
    
    this.setData({
      chatHistory,
      intimacy: newIntimacy,
      isTyping: false,
      lastMessageId: `msg-${chatHistory.length - 1}`
    })
  },
  
  // 赠送礼物
  giveGift() {
    wx.showActionSheet({
      itemList: ['🌹 玫瑰 (+3)', '🍫 巧克力 (+2)', '📚 书籍 (+2)', '🎵 音乐盒 (+3)'],
      success: (res) => {
        const gifts = [
          { name: '玫瑰', intimacy: 3 },
          { name: '巧克力', intimacy: 2 },
          { name: '书籍', intimacy: 2 },
          { name: '音乐盒', intimacy: 3 }
        ]
        const gift = gifts[res.tapIndex]
        
        // 添加礼物消息
        const chatHistory = this.data.chatHistory
        chatHistory.push({ role: 'user', text: `送你一份礼物：${gift.name}` })
        chatHistory.push({ role: 'ai', text: `哇！谢谢你送的${gift.name}，我好喜欢~❤️` })
        
        // 更新亲密度
        const newIntimacy = this.data.intimacy + gift.intimacy
        
        // 保存
        const gameData = wx.getStorageSync('21days_game_data')
        gameData.chatHistory = chatHistory
        gameData.giftIntimacy = (gameData.giftIntimacy || 0) + gift.intimacy
        wx.setStorageSync('21days_game_data', gameData)
        
        this.setData({
          chatHistory,
          intimacy: newIntimacy,
          lastMessageId: `msg-${chatHistory.length - 1}`
        })
      }
    })
  },
  
  // 前往结局
  goToEnding() {
    wx.navigateTo({
      url: '/pages/ending/ending'
    })
  }
})
