// 首页吊牌素材与案例封面独立配置；null 保留灰色占位。
const asset = path => `${import.meta.env.BASE_URL}${path}`;
export const heroMedia = {
  xiaohuasheng: asset('assets/projects/xiaohuasheng-cover.png'),
  flarewild: asset('assets/projects/flarewild-cover.png'),
  everydayIdeas: asset('assets/hero/everyday-ideas.webp'),
  connect: asset('assets/hero/connect.webp'),
  designExploration: asset('assets/hero/design-exploration.webp'),
  curiosity: asset('assets/hero/curiosity.webp'),
  visualStories: asset('assets/hero/visual-stories-gradient.webp'),
  moreToCome: asset('assets/hero/warm-gradient.webp'),
};
export const phonePortrait = asset('assets/phone/portrait.webp');
export const explorationCovers = {
  touchMemory: asset('assets/explorations/touch-memory-cover.png'),
  more: asset('assets/projects/more-explorations-cover.png'),
};
export const media = {
  xiaohuasheng: { cover: asset('assets/projects/xiaohuasheng-cover.png'), chapters: {} },
  flarewild: { cover: asset('assets/projects/flarewild-cover.png'), video: null, poster: null, chapters: {} },
};
export const profile = {
  name: '张紫晴', english: 'Ziqing Zhang', role: '体验设计 / UI 设计',
  email: '3551194747@qq.com', wechat: 'Z13673185526', phone: '13673185526',
  resume: asset('assets/resume.pdf'), portrait: asset('assets/about/contact-portrait.jpg'), reflectionVideo: null,
};
export const projects = [
  { id: 'xiaohuasheng', number: '01', name: '小花生', english: 'READING, RECONNECTED.', category: '亲子阅读 · 社区体验', time: '2025.06 — 2026.03', company: '上海慧力信息技术有限公司', role: 'UI/UX 设计实习', casePdf: asset('assets/xiaohuasheng-case.pdf'),
    title: '让阅读之后的连接，继续发生。', subtitle: '从社群中的真实需求，到书圈转转与个性化阅读体验。',
    summary: '从家长的闲置童书需求出发，提出并协同推进「书圈转转」，连接原有阅读行为与同城流转。', tags: ['用户洞察', '个性化体验', '社区设计'], color: '#f2c9ac',
    contribution: '整理社群反馈并提出书圈转转需求，阐述用户场景与交互方案，与产品和开发讨论业务规则、技术可行性及定位隐私。',
    status: '书圈转转协同落地；行为策略与 AI 推荐在此作为设计探索呈现。',
    sections: [
      { label: '01 / THE OPPORTUNITY', title: '需求，已经在评论区发生。', body: '整理社群反馈时，一位妈妈提到：读完的绘本堆在家里，扔掉可惜，放到交易平台又需要拍照、写介绍、反复沟通。她更想找到附近有换书需求的家长。评论区里，不少家长已经开始自行对接。', insight: '用户愿意彼此连接，但路径分散、发布成本高，缺少一个顺手的入口。' },
      { label: '02 / THE CONNECTION', title: '让换书，顺着阅读发生。', body: '我将反馈整理成需求提案，提出「书圈转转」：依托 LBS 进行同城匹配，支持从打卡书架一键导入书籍信息，减少重复录入。方案承接读完书之后的行为，让阅读与流转形成连接。', type: 'flow' },
      { label: '03 / BEHAVIOR & INTENT', title: '同一个入口，不同的下一步。', body: '行为可以成为判断意图的线索。我探索通过内容推荐与底部面板的变化，帮助找书、换书、发布和探索中的用户找到下一步。这是设计策略，不将其描述为已验证的算法能力。', type: 'strategy' },
      { label: '04 / PERSONALIZATION', title: '不只看年龄，也理解使用阶段。', body: '孩子年龄相同，家庭的需求也不一定相同。新手需要降低选书成本，习惯养成期需要易执行的陪读建议，深度参与者则可能希望流转闲置童书。AI 推荐界面据此探索不同的内容组织方式。', type: 'stages' },
      { label: '05 / WORKING TOGETHER', title: '把隐私放进设计决策。', body: '在可行性讨论中，我说明用户场景与交互，产品补充业务规则，开发共同评估权限与技术条件。定位权限、手动关闭定位、仅展示大致距离、不暴露精确地址，都进入了同城匹配的讨论。', insight: '连接附近的人，不等于暴露精确位置。' },
      { label: '06 / REFLECTION', title: '从发现需求，到共同推进。', body: '这段经历让我更重视设计开始之前的观察，也更重视方案之后的协作。书圈转转从真实反馈出发并协同推进落地；行为策略和推荐逻辑保留为设计探索。没有完整验证依据的业务数字，不作为这个案例的结果。' },
    ] },
  { id: 'flarewild', number: '02', name: 'FlareWild', english: 'A LITTLE SPARK. A REAL CONNECTION.', category: '地图社交 · 互动设计', time: '2025.03 — 2026.09', company: '无锡旋涡动力 Vortex Force', role: '体验设计实习',
    title: '让地图上的互动，成为聊天的开场。', subtitle: '通过地图道具与动效，连接社交破冰和品牌表达。',
    summary: '用地图拾取、互动道具与动效，为陌生用户创造一个自然开启交流的契机。相关地图互动道具功能已上线。', tags: ['地图社交', '互动动效', '商业化探索'], color: '#c9d5fa',
    contribution: '围绕地图互动道具，承担互动玩法、道具视觉、动效、广告融入和落地协作。',
    status: '相关地图互动道具功能已上线；广告道具在此作为设计探索呈现。',
    sections: [
      { label: '01 / THE FIRST HELLO', title: '发现一个人之后，还需要一个理由。', body: '地图让用户发现附近的人，但“看见”与“聊起来”之间还有距离。我围绕地图拾取和道具互动设计体验，让共同发生的小事件，成为交流的第一个钩子。', insight: '先一起发生一点什么，再开始说话。' },
      { label: '02 / MY CONTRIBUTION', title: '从互动想法，到可感知的反馈。', body: '我参与地图社交产品从 0 到 1 的设计，围绕道具完成玩法、视觉、动效与落地协作。设计时关注：用户是否理解发生了什么，反馈是否回应了操作，互动是否留下继续交流的空间。', type: 'motion' },
      { label: '03 / MOTION WITH PURPOSE', title: '让每一次反馈，都有它的作用。', body: '动效不只是装饰。拾取时需要确认感，使用时需要表达道具特征，收到互动时则要让用户感受到对方的参与。', type: 'demo' },
      { label: '04 / BRAND IN PLAY', title: '让品牌，成为可以参与的体验。', body: '以番茄酱广告道具为例，探索将产品元素融入道具视觉与反馈。先让道具有趣、好用，再让品牌在互动中被看见。品牌记忆与广告效果是设计目标，广告道具是否随功能上线不在这里预作判断。', insight: '商业化与用户的互动目标，应当形成连接。' },
      { label: '05 / REFLECTION', title: '有趣，也要让人看得懂。', body: '相关地图互动道具功能已经上线。这个案例关注玩法、视觉、反馈与协作之间的连接；在缺少效果数据的情况下，我不将互动率、品牌记忆或商业收益描述为已验证成果。' },
    ] },
];
export const explorations = [
  { name: '触忆', english: 'TOUCH MEMORY', image: asset('assets/explorations/touch-memory-cover.jpg'), text: '将回忆转化为可感知的体验，探索多模态 AI 与软硬件交互。', tags: '智能交互 / 软硬件体验', alt: '触忆项目封面', tone: 'warm' },
  { name: '乡音 · 方言交互', english: 'LOCAL VOICES', image: asset('assets/explorations/local-voice-cover.png'), href: 'https://616219zzq-lgtm.github.io/', text: '围绕无锡南长街大窑路智新坊，探索方言的参与式表达。', tags: '在地文化 / 参与式体验', alt: '乡音项目封面', tone: 'green' },
];

// 首页 FlareWild 道具互动的视频播放顺序。
export const motionClips = [
  { id: 'overview', title: '概况', src: asset('assets/flarewild/videos/overview.mp4'), poster: null },
  { id: 'treasure-chest', title: '开宝箱', src: asset('assets/flarewild/videos/treasure-chest.mp4'), poster: null },
  { id: 'interactive-props', title: '互动道具', src: asset('assets/flarewild/videos/interactive-props.mp4'), poster: null },
  { id: 'broadcast-props', title: '公放道具', src: asset('assets/flarewild/videos/broadcast-props.mp4'), poster: null },
];
