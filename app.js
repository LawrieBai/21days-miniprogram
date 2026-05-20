App({
  globalData: {
    gameData: null,
    aiConfig: {
      enabled: true,
      provider: 'doubao-ep',
      apiKey: 'ark-db3f5fc8-e21b-4cd8-917e-3fdaa0bcd1f9-4fc76',
      model: 'ep-20260518165945-7tk9g'
    },
    // 多语言配置
    language: 'zh',
    I18N: {
      zh: {
        appName: '21天陪伴',
        navTitle: '21天陪伴'
      },
      en: {
        appName: '21 Days Together',
        navTitle: '21 Days Together'
      }
    }
  },
  
  onLaunch() {
    console.log('21天陪伴养成游戏启动');
    // 初始化语言设置
    const savedLang = wx.getStorageSync('21days_language');
    if (savedLang) {
      this.globalData.language = savedLang;
    }
  },

  // 获取当前语言文本
  t(key) {
    const lang = this.globalData.language;
    return this.globalData.I18N[lang][key] || key;
  },

  // 切换语言
  setLanguage(lang) {
    this.globalData.language = lang;
    wx.setStorageSync('21days_language', lang);
  }
});
