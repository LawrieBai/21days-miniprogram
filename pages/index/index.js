Page({
  data: {
    step: 0, // 0=开场动画, 1=玩家性别, 2=伴侣性别, 3=外观, 4=伴侣名字
    playerGender: '',
    companionGender: '',
    companionName: '',
    playerName: '',
    appearance: {
      hairStyle: 0,
      skinColor: 1,
      faceShape: 0,
      eyesType: 0,
      mouthType: 0
    },
    particles: [],
    // 开场动画相关
    introLineIndex: 0,
    introCharIndex: 0,
    introLine1: '',
    introLine2: '',
    introLine3: '',
    showSkipBtn: false,
    showStartBtn: false,
    showCursor: true,
    // 温馨提示弹窗
    showTipsModal: false,
    // 多语言
    currentLang: 'zh',
    i18n: {}
  },

  // ==================== 多语言配置 ====================
  I18N: {
    zh: {
      subtitle: '一段关于陪伴的故事',
      skip: '跳过',
      start: '开始旅程 →',
      step0_title: '你是...',
      step0_desc: '选择你自己的性别',
      male: '男生',
      female: '女生',
      step1_title: '你想让谁陪伴你？',
      step1_desc: '选择陪伴你的游戏角色',
      step2_title: '定制我的样子',
      step3_title: '给我取个名字吧',
      step3_desc: '这个名字将陪伴我们21天',
      name_placeholder: '输入我的名字',
      name_empty: '请给我取个名字',
      prev_step: '上一步',
      confirm_look: '确认外观',
      restart_custom: '重新定制',
      start_journey: '开始21天旅程 ✨',
      hair: '发型',
      skin: '肤色',
      face: '脸型',
      eyes: '眼睛',
      mouth: '嘴巴',
      tips_title: '温馨提示',
      tips_1: '超过24小时不与选择的游戏角色进行互动，则游戏角色会离开，游戏需要重新开始',
      tips_2: '每天与游戏角色进行互动，至少要进行11句话的沟通，内容不限，但不能违反法律法规',
      tips_3: '每天登陆都可以领取100虚拟积分，积分可以用来购买虚拟礼物或餐食送给游戏角色，从而增加两人之间的亲密度',
      tips_confirm: '我知道了',
      intro_lines: [
        '也许，你听过关于数字21的各种寓意和说法',
        '但我只希望，接下来的21天',
        '你，能认真的对待我'
      ]
    },
    en: {
      subtitle: 'A Story About Companionship',
      skip: 'Skip',
      start: 'Start Journey →',
      step0_title: 'You are...',
      step0_desc: 'Choose your gender',
      male: 'Boy',
      female: 'Girl',
      step1_title: 'Who will accompany you?',
      step1_desc: 'Choose your companion',
      step2_title: 'Customize My Appearance',
      step3_title: 'Give me a name',
      step3_desc: 'This name will be with us for 21 days',
      name_placeholder: 'Enter my name',
      name_empty: 'Please give me a name',
      prev_step: 'Previous',
      confirm_look: 'Confirm Look',
      restart_custom: 'Redesign',
      start_journey: 'Start 21-Day Journey ✨',
      hair: 'Hair',
      skin: 'Skin',
      face: 'Face',
      eyes: 'Eyes',
      mouth: 'Mouth',
      tips_title: 'Tips',
      tips_1: 'If you don\'t interact with the character for more than 24 hours, the character will leave and the game needs to restart',
      tips_2: 'Interact with the character daily, at least 11 conversations. Content is unlimited but must comply with laws',
      tips_3: 'Claim 100 virtual points daily. Points can buy gifts or food for the character to increase intimacy',
      tips_confirm: 'Got it',
      intro_lines: [
        'Perhaps you\'ve heard various meanings of the number 21',
        'But I only hope that in the next 21 days',
        'You will take me seriously'
      ]
    }
  },

  // ==================== 生命周期 ====================
  onLoad() {
    // 检查存档
    try {
      const gameData = wx.getStorageSync('21days_game_data');
      if (gameData && gameData.phase === 'main') {
        wx.navigateTo({ 
          url: '/pages/main/main',
          success: () => console.log('跳转到主页面成功'),
          fail: (err) => {
            console.error('跳转失败:', err);
            this.initPage();
          }
        });
        return;
      }
    } catch (err) {
      console.error('读取存档失败:', err);
    }
    this.initPage();
  },

  initPage() {
    // 初始化多语言
    const lang = wx.getStorageSync('21days_language') || 'zh';
    this.setData({ 
      currentLang: lang,
      i18n: this.I18N[lang]
    });
    
    // 生成粒子
    this.generateParticles();
    
    // 开始开场动画
    this.startIntro();
  },

  // ==================== 开场动画 ====================
  startIntro() {
    const lines = this.data.i18n.intro_lines || this.I18N.zh.intro_lines;
    let lineIndex = 0;
    let charIndex = 0;
    
    // 计算打字速度：5秒打完所有文字
    const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
    const typingSpeed = 5000 / totalChars;
    
    // 显示跳过按钮
    setTimeout(() => {
      this.setData({ showSkipBtn: true });
    }, 500);
    
    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        // 动画完成
        this.setData({ 
          showCursor: false,
          showStartBtn: true 
        });
        return;
      }
      
      const currentLine = lines[lineIndex];
      if (charIndex < currentLine.length) {
        // 继续打字
        const key = `introLine${lineIndex + 1}`;
        this.setData({ 
          [key]: currentLine.substring(0, charIndex + 1)
        });
        charIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // 当前行完成，换行
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, typingSpeed);
      }
    };
    
    typeNextChar();
  },

  skipIntro() {
    const lines = this.data.i18n.intro_lines || this.I18N.zh.intro_lines;
    this.setData({
      introLine1: lines[0],
      introLine2: lines[1],
      introLine3: lines[2],
      showCursor: false,
      showSkipBtn: false,
      showStartBtn: true
    });
  },

  // ==================== 粒子动画 ====================
  generateParticles() {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100 + 50,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 5
      });
    }
    this.setData({ particles });
  },

  // ==================== 温馨提示 ====================
  showTips() {
    this.setData({ showTipsModal: true });
  },

  closeTips() {
    this.setData({ showTipsModal: false });
  },

  // ==================== 步骤导航 ====================
  goToStep1() {
    this.setData({ step: 1 });
  },

  selectPlayerGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ playerGender: gender });
  },

  goToStep2() {
    if (!this.data.playerGender) return;
    this.setData({ step: 2 });
  },

  selectCompanionGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ companionGender: gender });
  },

  goToStep3() {
    if (!this.data.companionGender) return;
    this.setData({ step: 3 });
  },

  setAppearance(e) {
    const key = e.currentTarget.dataset.key;
    const value = parseInt(e.currentTarget.dataset.value);
    const appearance = { ...this.data.appearance };
    appearance[key] = value;
    this.setData({ appearance });
  },

  goToStep4() {
    this.setData({ step: 4 });
  },

  prevStep() {
    const currentStep = this.data.step;
    if (currentStep > 1) {
      this.setData({ step: currentStep - 1 });
    }
  },

  onNameInput(e) {
    this.setData({ companionName: e.detail.value });
  },

  // ==================== 开始游戏 ====================
  startGame() {
    const name = this.data.companionName.trim();
    if (!name) {
      wx.showToast({ 
        title: this.data.i18n.name_empty || '请给我取个名字', 
        icon: 'none' 
      });
      return;
    }

    const gameData = {
      phase: 'main',
      playerGender: this.data.playerGender,
      companionGender: this.data.companionGender,
      companionName: name,
      playerName: this.data.playerName || '玩家',
      companionAppearance: { ...this.data.appearance },
      currentDay: 1,
      intimacy: 0,
      giftIntimacy: 0,
      points: 100, // 初始积分100
      todayPointsClaimed: true, // 已领取
      todayChatCount: 0,
      todayGiftIntimacy: 0,
      chatHistory: [],
      conversationContext: [], // 对话上下文
      language: this.data.currentLang,
      lastInteractionTime: Date.now()
    };

    wx.setStorageSync('21days_game_data', gameData);
    wx.setStorageSync('21days_language', this.data.currentLang);

    wx.navigateTo({
      url: '/pages/main/main',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  // ==================== 语言切换 ====================
  toggleLanguage() {
    const newLang = this.data.currentLang === 'zh' ? 'en' : 'zh';
    this.setData({
      currentLang: newLang,
      i18n: this.I18N[newLang]
    });
    wx.setStorageSync('21days_language', newLang);
    
    // 如果正在开场动画，重新开始
    if (this.data.step === 0 && !this.data.showStartBtn) {
      this.setData({
        introLine1: '',
        introLine2: '',
        introLine3: ''
      });
      this.startIntro();
    }
  }
});
