const ChatEngine = require('../../utils/chatEngine');

// 礼物配置
const GIFTS = [
  { id: 'rose', name: '玫瑰花', emoji: '🌹', cost: 20, intimacy: 0.15 },
  { id: 'cake', name: '蛋糕', emoji: '🍰', cost: 30, intimacy: 0.20 },
  { id: 'book', name: '书籍', emoji: '📚', cost: 25, intimacy: 0.18 },
  { id: 'ring', name: '戒指', emoji: '💍', cost: 80, intimacy: 0.40 },
  { id: 'food', name: '美食', emoji: '🍜', cost: 15, intimacy: 0.12 }
];

// 每日礼物亲密度上限
const DAILY_GIFT_INTIMACY_LIMIT = 0.06;
// 礼物总亲密度上限
const TOTAL_GIFT_INTIMACY_LIMIT = 1.0;
// 每日对话目标
const DAILY_CHAT_TARGET = 11;
// 每日积分
const DAILY_POINTS = 100;

Page({
  data: {
    // 游戏数据
    currentDay: 1,
    companionName: '',
    companionGender: '',
    playerName: '',
    companionAppearance: null,
    points: 0,
    todayPointsClaimed: false,
    todayChatCount: 0,
    todayGiftIntimacy: 0,
    giftIntimacy: 0,
    intimacy: 0,
    intimacyText: '0.00',
    intimacyPercent: 0,
    chatPercent: 0,
    chatText: '今日对话：0/11',

    // 聊天
    chatHistory: [],
    inputText: '',
    isTyping: false,
    scrollToBottom: '',

    // 礼物弹窗
    showGiftModal: false,
    gifts: GIFTS,

    // 伴侣形象CSS类名
    faceClass: '',
    skinClass: '',
    hairClass: '',
    eyesClass: '',
    mouthClass: ''
  },

  onLoad() {
    this.loadGameData();
  },

  onShow() {
    this.loadGameData();
  },

  // ==================== 数据管理 ====================

  loadGameData() {
    try {
      const gameData = wx.getStorageSync('21days_game_data');
      if (!gameData) {
        wx.redirectTo({ url: '/pages/index/index' });
        return;
      }

      const intimacy = this.calculateIntimacy(gameData.currentDay, gameData.giftIntimacy || 0);
      const intimacyText = intimacy.toFixed(2);
      const intimacyPercent = (intimacy / 21 * 100).toFixed(1);
      const chatPercent = ((gameData.todayChatCount || 0) / DAILY_CHAT_TARGET * 100).toFixed(1);
      const chatText = '今日对话：' + (gameData.todayChatCount || 0) + '/' + DAILY_CHAT_TARGET;

      // 计算伴侣形象CSS类名
      const appearance = gameData.companionAppearance || {};
      const faceClass = 'face-' + (appearance.faceShape || 0);
      const skinClass = 'skin-' + (appearance.skinColor || 1);
      const hairClass = 'hair-' + (appearance.hairStyle || 0);
      const eyesClass = 'eyes-' + (appearance.eyesType || 0);
      const mouthClass = 'mouth-' + (appearance.mouthType || 0);

      this.setData({
        currentDay: gameData.currentDay || 1,
        companionName: gameData.companionName || '',
        companionGender: gameData.companionGender || 'female',
        playerName: gameData.playerName || '',
        companionAppearance: appearance,
        points: gameData.points || 0,
        todayPointsClaimed: gameData.todayPointsClaimed || false,
        todayChatCount: gameData.todayChatCount || 0,
        todayGiftIntimacy: gameData.todayGiftIntimacy || 0,
        giftIntimacy: gameData.giftIntimacy || 0,
        intimacy: intimacy,
        intimacyText: intimacyText,
        intimacyPercent: intimacyPercent,
        chatPercent: chatPercent,
        chatText: chatText,
        chatHistory: gameData.chatHistory || [],
        faceClass: faceClass,
        skinClass: skinClass,
        hairClass: hairClass,
        eyesClass: eyesClass,
        mouthClass: mouthClass
      });

      // 滚动到底部
      this.scrollToChatBottom();
    } catch (err) {
      console.error('加载游戏数据失败:', err);
      wx.redirectTo({ url: '/pages/index/index' });
    }
  },

  saveGameData() {
    try {
      const gameData = wx.getStorageSync('21days_game_data');
      const updated = Object.assign({}, gameData, {
        points: this.data.points,
        todayPointsClaimed: this.data.todayPointsClaimed,
        todayChatCount: this.data.todayChatCount,
        todayGiftIntimacy: this.data.todayGiftIntimacy,
        giftIntimacy: this.data.giftIntimacy,
        chatHistory: this.data.chatHistory
      });
      wx.setStorageSync('21days_game_data', updated);
    } catch (err) {
      console.error('保存游戏数据失败:', err);
    }
  },

  // ==================== 亲密度计算 ====================

  calculateIntimacy(day, giftIntimacy) {
    const base = day >= 2 ? day - 1 : 0;
    return Math.min(base + giftIntimacy, 21);
  },

  updateIntimacyDisplay() {
    const intimacy = this.calculateIntimacy(this.data.currentDay, this.data.giftIntimacy);
    this.setData({
      intimacy: intimacy,
      intimacyText: intimacy.toFixed(2),
      intimacyPercent: (intimacy / 21 * 100).toFixed(1)
    });
  },

  // ==================== 积分系统 ====================

  claimPoints() {
    if (this.data.todayPointsClaimed) return;

    const newPoints = this.data.points + DAILY_POINTS;
    this.setData({
      points: newPoints,
      todayPointsClaimed: true
    });
    this.saveGameData();
    wx.showToast({ title: '领取成功！+' + DAILY_POINTS + '积分', icon: 'none' });
  },

  // ==================== 聊天系统 ====================

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendMessage() {
    const text = this.data.inputText.trim();
    if (!text || this.data.isTyping) return;

    // 添加用户消息
    const userMsg = {
      type: 'user',
      text: text,
      time: this.formatTime(new Date())
    };
    const chatHistory = this.data.chatHistory.concat([userMsg]);
    const newChatCount = this.data.todayChatCount + 1;

    this.setData({
      chatHistory: chatHistory,
      inputText: '',
      todayChatCount: newChatCount,
      chatPercent: (newChatCount / DAILY_CHAT_TARGET * 100).toFixed(1),
      chatText: '今日对话：' + newChatCount + '/' + DAILY_CHAT_TARGET,
      isTyping: true
    });

    this.saveGameData();
    this.scrollToChatBottom();

    // 调用AI回复
    this.generateAIReply(text);
  },

  async generateAIReply(userText) {
    try {
      const reply = await ChatEngine.generateReply(
        userText,
        this.data.companionGender,
        this.data.companionName,
        this.data.currentDay,
        this.data.todayChatCount,
        this.data.intimacy
      );

      const aiMsg = {
        type: 'ai',
        text: reply,
        time: this.formatTime(new Date())
      };

      const chatHistory = this.data.chatHistory.concat([aiMsg]);
      this.setData({
        chatHistory: chatHistory,
        isTyping: false
      });

      this.saveGameData();
      this.scrollToChatBottom();
    } catch (err) {
      console.error('AI回复失败:', err);
      const errorMsg = {
        type: 'ai',
        text: '网络有点问题，待会再聊吧~',
        time: this.formatTime(new Date())
      };
      const chatHistory = this.data.chatHistory.concat([errorMsg]);
      this.setData({
        chatHistory: chatHistory,
        isTyping: false
      });
      this.saveGameData();
      this.scrollToChatBottom();
    }
  },

  formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
  },

  scrollToChatBottom() {
    setTimeout(() => {
      this.setData({ scrollToBottom: 'bottom' + Date.now() });
    }, 100);
  },

  // ==================== 礼物系统 ====================

  showGiftPanel() {
    this.setData({ showGiftModal: true });
  },

  hideGiftPanel() {
    this.setData({ showGiftModal: false });
  },

  buyGift(e) {
    const giftId = e.currentTarget.dataset.id;
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift) return;

    // 检查积分是否足够
    if (this.data.points < gift.cost) {
      wx.showToast({ title: '积分不足哦~', icon: 'none' });
      return;
    }

    // 检查每日礼物上限
    if (this.data.todayGiftIntimacy + gift.intimacy > DAILY_GIFT_INTIMACY_LIMIT) {
      wx.showToast({ title: '今天送的礼物够多了，明天再送吧~', icon: 'none' });
      return;
    }

    // 检查礼物总上限
    if (this.data.giftIntimacy + gift.intimacy > TOTAL_GIFT_INTIMACY_LIMIT) {
      wx.showToast({ title: '礼物加成已达上限~', icon: 'none' });
      return;
    }

    // 扣除积分，增加亲密度
    const newPoints = this.data.points - gift.cost;
    const newTodayGiftIntimacy = this.data.todayGiftIntimacy + gift.intimacy;
    const newGiftIntimacy = this.data.giftIntimacy + gift.intimacy;

    this.setData({
      points: newPoints,
      todayGiftIntimacy: newTodayGiftIntimacy,
      giftIntimacy: newGiftIntimacy
    });

    // 更新亲密度显示
    this.updateIntimacyDisplay();

    // 添加系统消息到聊天
    const sysMsg = {
      type: 'system',
      text: '你送出了' + gift.emoji + gift.name + '，亲密度+' + gift.intimacy.toFixed(2),
      time: this.formatTime(new Date())
    };
    const chatHistory = this.data.chatHistory.concat([sysMsg]);
    this.setData({ chatHistory: chatHistory });

    this.saveGameData();
    this.scrollToChatBottom();

    this.setData({ showGiftModal: false });
    wx.showToast({ title: '送出' + gift.emoji + gift.name + '！', icon: 'none' });
  },

  // ==================== 结束游戏 ====================

  endGame() {
    wx.showModal({
      title: '结束游戏',
      content: '确定要直接跳到结局吗？',
      confirmText: '确定',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({ url: '/pages/ending/ending' });
        }
      }
    });
  }
});