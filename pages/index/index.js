Page({
  data: {
    step: 0, // 0=封面, 1=玩家性别, 2=伴侣性别, 3=外观, 4=名字
    playerGender: '',
    companionGender: '',
    playerName: '',
    appearance: {
      hairStyle: 0,
      skinColor: 1,
      faceShape: 0,
      eyesType: 0,
      mouthType: 0
    },
    particles: []
  },

  onLoad() {
    // 延迟检查，避免启动时的问题
    setTimeout(() => {
      const gameData = wx.getStorageSync('21days_game_data');
      if (gameData && gameData.phase === 'main') {
        wx.navigateTo({ url: '/pages/main/main' });
      } else {
        this.generateParticles();
      }
    }, 100);
  },

  // 生成粒子数据
  generateParticles() {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100 + 50, // 从下半部分开始
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 5
      });
    }
    this.setData({ particles });
  },

  // 封面 -> 选择玩家性别
  goToStep1() {
    this.setData({ step: 1 });
  },

  // 选择玩家性别
  selectPlayerGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ playerGender: gender });
  },

  // 玩家性别 -> 伴侣性别
  goToStep2() {
    if (!this.data.playerGender) return;
    this.setData({ step: 2 });
  },

  // 选择伴侣性别
  selectCompanionGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ companionGender: gender });
  },

  // 伴侣性别 -> 外观自定义
  goToStep3() {
    if (!this.data.companionGender) return;
    this.setData({ step: 3 });
  },

  // 设置外观属性
  setAppearance(e) {
    const key = e.currentTarget.dataset.key;
    const value = parseInt(e.currentTarget.dataset.value);
    const appearance = { ...this.data.appearance };
    appearance[key] = value;
    this.setData({ appearance });
  },

  // 外观 -> 输入名字
  goToStep4() {
    this.setData({ step: 4 });
  },

  // 名字输入
  onNameInput(e) {
    this.setData({ playerName: e.detail.value });
  },

  // 开始游戏
  startGame() {
    const name = this.data.playerName.trim();
    if (!name) {
      wx.showToast({ title: '请输入名字', icon: 'none' });
      return;
    }

    const companionName = this.data.companionGender === 'male' ? '小明' : '小花';
    
    const gameData = {
      phase: 'main',
      playerGender: this.data.playerGender,
      companionGender: this.data.companionGender,
      companionName: companionName,
      playerName: name,
      companionAppearance: { ...this.data.appearance },
      currentDay: 1,
      intimacy: 0,
      giftIntimacy: 0,
      points: 0,
      todayPointsClaimed: false,
      todayChatCount: 0,
      todayGiftIntimacy: 0,
      chatHistory: []
    };

    wx.setStorageSync('21days_game_data', gameData);
    
    wx.navigateTo({
      url: '/pages/main/main',
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  }
});