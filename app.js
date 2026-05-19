App({
  globalData: {
    gameData: null,
    aiConfig: {
      enabled: true,
      provider: 'doubao-ep',
      apiKey: 'ark-db3f5fc8-e21b-4cd8-917e-3fdaa0bcd1f9-4fc76',
      model: 'ep-20260518165945-7tk9g'
    }
  },
  onLaunch() {
    // 初始化云开发（如需要）
    // wx.cloud.init({
    //   env: 'your-env-id',
    //   traceUser: true
    // })
  }
})
