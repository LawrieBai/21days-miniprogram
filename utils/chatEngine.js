const app = getApp();

const ChatEngine = {
  async generateReply(text, companionGender, companionName, day, chatCount, intimacy) {
    const config = app.globalData.aiConfig;
    const genderText = companionGender === 'male' ? '男生' : '女生';

    const systemPrompt = `你是${companionName}，一个温柔体贴的${genderText}。这是你们相识的第${day}天，当前亲密度为${intimacy}/21。
请用自然、亲切的语气回复，适当使用emoji表情。回复要简短（50字以内），像日常聊天一样自然。
根据亲密度调整语气：
- 亲密度0-5：礼貌友好，略带害羞
- 亲密度6-15：亲近自然，偶尔撒娇
- 亲密度16-21：甜蜜温暖，表达关心`;

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey
          },
          data: {
            model: config.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            temperature: 0.8,
            max_tokens: 150
          },
          success: resolve,
          fail: reject
        });
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content;
      }
      return '嗯嗯，我在听呢~';
    } catch (error) {
      console.error('AI请求失败:', error);
      return '网络有点问题，待会再聊吧~';
    }
  }
};

module.exports = ChatEngine;
