const app = getApp();

// ==================== 情感词库 ====================
const EMOTIONS = {
  like: { words: ['喜欢', '爱', '心动', '好感', '在意', '牵挂', '想念', '思念'], w: 3 },
  miss: { words: ['想', '念', '惦记', '牵挂', '怀念'], w: 2 },
  sad: { words: ['难过', '伤心', '哭', '痛苦', '委屈', '失落', '沮丧'], w: 2 },
  tired: { words: ['累', '疲惫', '困', '倦', '辛苦', '忙', '压力'], w: 1 },
  angry: { words: ['生气', '愤怒', '讨厌', '烦', '火大', '不爽'], w: 2 },
  anxious: { words: ['担心', '焦虑', '紧张', '害怕', '恐惧', '不安'], w: 2 },
  happy: { words: ['开心', '高兴', '快乐', '兴奋', '幸福', '满足', '爽'], w: 2 },
  surprised: { words: ['惊讶', '震惊', '意外', '没想到', '哇', '天哪'], w: 1 },
  greeting: { words: ['你好', '嗨', 'hello', 'hi', '在吗', '在干嘛'], w: 1 },
  food: { words: ['吃', '饭', '菜', '美食', '饿', '餐厅', '好吃'], w: 1 },
  work: { words: ['工作', '上班', '加班', '老板', '同事', '项目', '忙'], w: 1 },
  study: { words: ['学习', '考试', '作业', '复习', '成绩', '学校'], w: 1 },
  hobby: { words: ['爱好', '兴趣', '游戏', '电影', '音乐', '运动', '旅游'], w: 1 },
  weather: { words: ['天气', '下雨', '晴天', '冷', '热', '温度'], w: 1 },
  health: { words: ['生病', '感冒', '发烧', '不舒服', '疼', '痛'], w: 2 },
  sleep: { words: ['睡觉', '失眠', '熬夜', '困', '晚安', '早安'], w: 1 },
  money: { words: ['钱', '工资', '买', '贵', '便宜', '花费'], w: 1 }
};

// ==================== 场景化回复库 ====================
const SCENE_REPLIES = {
  like: {
    male: {
      low: ['...突然说这种话，让我有点不知所措。', '嗯，谢谢你的心意。', '听到你这么说，我还挺意外的。'],
      mid: ['你这样说，我会当真的哦。', '不知道为什么，听到你这么说心里暖暖的。', '我也...挺在意你的。'],
      high: ['能遇见你，是我这辈子最幸运的事。', '不管发生什么，我都会一直在你身边。', '你知道吗，每次想到你，嘴角都会不自觉上扬。']
    },
    female: {
      low: ['哎呀...突然说这个，人家会害羞的~', '真的吗？不是在哄我吧~', '哼，算你嘴甜~'],
      mid: ['听到你这么说好开心呀~', '我也很想你哦~', '你这样说，我脸都红了呢~'],
      high: ['你是我最重要的人，永远都是~', '不管未来怎样，我都想和你一起走下去~', '你知道吗，每次想到你，心跳都会变快呢~']
    }
  },
  miss: {
    male: {
      low: ['嗯，我在。', '怎么了？', '有事吗？'],
      mid: ['我也刚想找你呢。', '你不在的时候，确实有点无聊。', '在想你呢，你就出现了。'],
      high: ['我也想你，比你想我还要多。', '每次分开都觉得时间过得好慢。', '你知道吗，我现在就想见到你。']
    },
    female: {
      low: ['在呢~', '怎么啦？', '想我了吗~'],
      mid: ['我也正想找你呢~', '你不在的时候，总觉得少了点什么~', '嘻嘻，心有灵犀~'],
      high: ['我也好想你呀~', '每次分开都觉得时间过得好慢好慢~', '我现在就想见到你，立刻马上~']
    }
  },
  sad: {
    male: {
      low: ['别难过了。', '想开点。', '会好起来的。'],
      mid: ['别难过了，有我在呢。', '不管发生什么，我都在你身边。', '想聊聊吗？我听着。'],
      high: ['看你难过，我比你还难受。', '如果可以，我真想把你的难过都转移到自己身上。', '不管发生什么，我们一起面对，好吗？']
    },
    female: {
      low: ['别难过啦~', '抱抱你~', '会好起来的~'],
      mid: ['别难过啦，有我在呢~', '不管发生什么，我都会陪着你的~', '想哭就哭出来吧，我陪着你~'],
      high: ['看到你难过，我的心都揪在一起了...', '真希望能替你承担所有的难过...', '不管发生什么，我们一起面对，我会一直在你身边~']
    }
  },
  tired: {
    male: {
      low: ['早点休息。', '注意身体。', '别太累了。'],
      mid: ['辛苦了，记得劳逸结合。', '累了就歇歇，别硬撑。', '需要我陪你聊聊天放松一下吗？'],
      high: ['看你这么累，我好心疼。', '真想现在就出现在你身边，给你一个拥抱。', '答应我，照顾好自己，好吗？']
    },
    female: {
      low: ['早点休息哦~', '注意身体呀~', '别太累啦~'],
      mid: ['辛苦啦，抱抱你~', '累了就歇歇，别硬撑哦~', '要我陪你聊聊天放松一下吗~'],
      high: ['看你这么累，我好心疼呀...', '真想现在就飞到你身边，给你一个暖暖的拥抱~', '答应我，要好好照顾自己，不然我会担心的~']
    }
  },
  happy: {
    male: {
      low: ['不错嘛~', '挺好的。', '恭喜。'],
      mid: ['看到你开心我也好开心！', '什么事这么高兴？说来听听。', '你的笑容真好看。'],
      high: ['你的快乐就是我的快乐。', '看到你这么开心，我觉得整个世界都亮了。', '真想永远看到你这样开心的样子。']
    },
    female: {
      low: ['不错呀~', '太好啦~', '恭喜恭喜~'],
      mid: ['你开心我就开心啦~', '什么事这么开心呀？快告诉我~', '看到你开心，我也跟着开心呢~'],
      high: ['你的快乐就是我的快乐~', '看到你这么开心，我觉得整个世界都变美好了~', '真想永远保存你现在的笑容~']
    }
  },
  default: {
    male: {
      low: ['嗯嗯。', '我在听。', '继续说。'],
      mid: ['嗯嗯，我在听~', '然后呢？', '这挺有意思的。'],
      high: ['嗯嗯，继续说，你说的每一句话我都想听。', '我喜欢听你说话。', '不管你说什么，我都想听。']
    },
    female: {
      low: ['嗯嗯~', '我在听呢~', '继续说呀~'],
      mid: ['嗯嗯~我在听呢！', '然后呢然后呢~', '这挺有意思的~'],
      high: ['嗯嗯，你继续说，你说的每一句话我都想记住~', '我喜欢听你说话呢~', '不管你说什么，我都想听~']
    }
  }
};

// ==================== 工具函数 ====================
function getIntimacyLevel(intimacy) {
  if (intimacy >= 15) return 'high';
  if (intimacy >= 5) return 'mid';
  return 'low';
}

function analyzeEmotions(text) {
  const results = [];
  for (const [emotion, data] of Object.entries(EMOTIONS)) {
    for (const word of data.words) {
      if (text.includes(word)) {
        results.push({ emotion, weight: data.w });
        break;
      }
    }
  }
  results.sort((a, b) => b.weight - a.weight);
  return results;
}

function getReplies(emotion, gender, level) {
  const category = SCENE_REPLIES[emotion];
  if (!category) return SCENE_REPLIES.default[gender][level];
  return category[gender][level] || SCENE_REPLIES.default[gender][level];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== ChatEngine 主对象 ====================
const ChatEngine = {
  conversationContext: [],

  init() {
    this.conversationContext = [];
  },

  addToContext(role, text) {
    this.conversationContext.push({ role, text, time: Date.now() });
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
  },

  async generateReply(text, companionGender, companionName, day, chatCount, intimacy) {
    const config = app.globalData.aiConfig;
    const gender = companionGender === 'male' ? 'male' : 'female';
    const level = getIntimacyLevel(intimacy);

    // 分析情感
    const emotions = analyzeEmotions(text);
    const primaryEmotion = emotions.length > 0 ? emotions[0].emotion : 'default';

    // 优先使用本地场景化回复（70%概率）
    if (Math.random() < 0.7) {
      const replies = getReplies(primaryEmotion, gender, level);
      const localReply = pickRandom(replies);

      this.addToContext('user', text);
      this.addToContext('assistant', localReply);

      return localReply;
    }

    // 30%概率调用AI API
    try {
      const genderText = companionGender === 'male' ? '男生' : '女生';
      const systemPrompt = `你是${companionName}，一个温柔体贴的${genderText}。这是你们相识的第${day}天，当前亲密度为${intimacy}/21。
请用自然、亲切的语气回复，适当使用emoji表情。回复要简短（50字以内），像日常聊天一样自然。
根据亲密度调整语气：
- 亲密度0-5：礼貌友好，略带害羞
- 亲密度6-15：亲近自然，偶尔撒娇
- 亲密度16-21：甜蜜温暖，表达关心`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationContext.slice(-6).map(ctx => ({
          role: ctx.role === 'user' ? 'user' : 'assistant',
          content: ctx.text
        })),
        { role: 'user', content: text }
      ];

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
            messages: messages,
            temperature: 0.8,
            max_tokens: 150
          },
          success: resolve,
          fail: reject
        });
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        const aiReply = response.data.choices[0].message.content;
        this.addToContext('user', text);
        this.addToContext('assistant', aiReply);
        return aiReply;
      }
    } catch (error) {
      console.error('AI请求失败:', error);
    }

    // 如果AI调用失败，使用本地回复
    const fallbackReplies = getReplies(primaryEmotion, gender, level);
    const fallbackReply = pickRandom(fallbackReplies);
    this.addToContext('user', text);
    this.addToContext('assistant', fallbackReply);
    return fallbackReply;
  },

  clearContext() {
    this.conversationContext = [];
  }
};

module.exports = ChatEngine;
