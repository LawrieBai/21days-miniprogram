Page({
  data: {
    companionName: '',
    playerName: '',
    companionAppearance: null,
    giftIntimacy: 0,
    intimacy: 0,
    intimacyText: '0.00',
    intimacyPercent: 0,
    chatHistory: [],

    // 告别诗
    farewellPoem: '',
    poemFullText: '',

    // 留言
    messageText: '',
    messageLength: 0,
    messageSubmitted: false,

    // 导出
    showExportBtn: false,
    showPayModal: false,

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

  // ==================== 数据管理 ====================

  loadGameData() {
    try {
      const gameData = wx.getStorageSync('21days_game_data');
      if (!gameData) {
        wx.redirectTo({ url: '/pages/index/index' });
        return;
      }

      const giftIntimacy = gameData.giftIntimacy || 0;
      const intimacy = this.calculateIntimacy(21, giftIntimacy);
      const intimacyText = intimacy.toFixed(2);
      const intimacyPercent = (intimacy / 21 * 100).toFixed(1);

      // 计算伴侣形象CSS类名
      const appearance = gameData.companionAppearance || {};
      const faceClass = 'face-' + (appearance.faceShape || 0);
      const skinClass = 'skin-' + (appearance.skinColor || 1);
      const hairClass = 'hair-' + (appearance.hairStyle || 0);
      const eyesClass = 'eyes-' + (appearance.eyesType || 0);
      const mouthClass = 'mouth-' + (appearance.mouthType || 0);

      this.setData({
        companionName: gameData.companionName || '',
        playerName: gameData.playerName || '',
        companionAppearance: appearance,
        giftIntimacy: giftIntimacy,
        intimacy: intimacy,
        intimacyText: intimacyText,
        intimacyPercent: intimacyPercent,
        chatHistory: gameData.chatHistory || [],
        faceClass: faceClass,
        skinClass: skinClass,
        hairClass: hairClass,
        eyesClass: eyesClass,
        mouthClass: mouthClass
      });

      // 开始打字动画
      this.startPoemAnimation(gameData.companionName || '');
    } catch (err) {
      console.error('加载游戏数据失败:', err);
      wx.redirectTo({ url: '/pages/index/index' });
    }
  },

  // ==================== 亲密度计算 ====================

  calculateIntimacy(day, giftIntimacy) {
    const base = day >= 2 ? day - 1 : 0;
    return Math.min(base + giftIntimacy, 21);
  },

  // ==================== 告别诗打字动画 ====================

  startPoemAnimation(companionName) {
    const fullText = '感谢你21天的陪伴\n这是我一生中\n过的最快乐的21天\n\n愿你安好\n所遇皆坦途\n所期皆如愿\n\n—— ' + companionName;
    this.setData({ poemFullText: fullText });

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < fullText.length) {
        this.setData({
          farewellPoem: fullText.substring(0, currentIndex + 1)
        });
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 80);
  },

  // ==================== 留言功能 ====================

  onMessageInput(e) {
    const text = e.detail.value;
    this.setData({
      messageText: text,
      messageLength: text.length
    });
  },

  submitMessage() {
    const text = this.data.messageText.trim();
    if (!text) {
      wx.showToast({ title: '请输入留言内容', icon: 'none' });
      return;
    }
    if (text.length > 500) {
      wx.showToast({ title: '留言不能超过500字', icon: 'none' });
      return;
    }

    this.setData({
      messageSubmitted: true,
      showExportBtn: true
    });

    wx.showToast({ title: '留言已提交', icon: 'success' });
  },

  // ==================== 导出功能 ====================

  showPayConfirm() {
    this.setData({ showPayModal: true });
  },

  hidePayModal() {
    this.setData({ showPayModal: false });
  },

  confirmPay() {
    this.setData({ showPayModal: false });
    this.generatePDF();
  },

  generatePDF() {
    wx.showLoading({ title: '正在生成PDF...', mask: true });

    // 延迟模拟生成过程
    setTimeout(() => {
      try {
        const text = this.formatChatAsText();
        wx.setClipboardData({
          data: text,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '对话内容已复制', icon: 'none' });
            wx.showModal({
              title: '导出成功',
              content: '对话内容已复制到剪贴板。您可以粘贴到任何文档中，另存为PDF文件。\n\n建议：打开备忘录或Word，粘贴内容后导出为PDF。',
              showCancel: false,
              confirmText: '我知道了'
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '复制失败，请重试', icon: 'none' });
          }
        });
      } catch (err) {
        wx.hideLoading();
        console.error('生成PDF失败:', err);
        wx.showToast({ title: '导出失败，请重试', icon: 'none' });
      }
    }, 1500);
  },

  formatChatAsText() {
    const data = this.data;
    let text = '';
    const line = '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550';
    const thinLine = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500';

    text += line + '\n';
    text += '    21天陪伴养成游戏 - 对话记录\n';
    text += line + '\n\n';
    text += '伴侣：' + data.companionName + '\n';
    text += '玩家：' + data.playerName + '\n';
    text += '最终亲密度：' + data.intimacyText + '\n\n';
    text += thinLine + '\n\n';

    // 遍历聊天记录
    let dialogIndex = 0;
    const chatHistory = data.chatHistory || [];
    for (let i = 0; i < chatHistory.length; i++) {
      const msg = chatHistory[i];
      if (msg.type === 'user') {
        dialogIndex++;
        text += '【第' + dialogIndex + '句对话】\n';
        text += '你：' + msg.text + '\n';
        // 查找下一条AI回复
        for (let j = i + 1; j < chatHistory.length; j++) {
          if (chatHistory[j].type === 'ai') {
            text += data.companionName + '：' + chatHistory[j].text + '\n';
            i = j; // 跳过已处理的AI消息
            break;
          }
        }
        text += '\n';
      } else if (msg.type === 'system') {
        // 系统消息（礼物等）
        text += '【礼物】' + msg.text + '\n\n';
      }
    }

    text += thinLine + '\n\n';

    // 用户留言
    if (data.messageText) {
      text += '【你的留言】\n';
      text += data.messageText + '\n\n';
    }

    text += line + '\n';
    text += '         —— 21天陪伴养成游戏\n';
    text += line + '\n';

    return text;
  },

  // ==================== 重新开始 ====================

  restartGame() {
    wx.showModal({
      title: '重新开始',
      content: '确定要重新开始游戏吗？所有进度将会被清除。',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('21days_game_data');
          wx.reLaunch({ url: '/pages/index/index' });
        }
      }
    });
  }
});
