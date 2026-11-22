// 首页吊牌素材与案例封面独立配置；null 保留灰色占位。
const asset = path => `${import.meta.env.BASE_URL}${path}`;
export const heroMedia = {
  xiaohuasheng: asset('assets/projects/xiaohuasheng-cover-web.webp'),
  flarewild: asset('assets/projects/flarewild-cover-web.webp'),
  everydayIdeas: asset('assets/hero/everyday-ideas-web.webp'),
  connect: asset('assets/hero/connect-web.webp'),
  designExploration: asset('assets/hero/design-exploration-web.webp'),
  curiosity: asset('assets/hero/curiosity-web.webp'),
  visualStories: asset('assets/hero/visual-stories-gradient-web.webp'),
  moreToCome: asset('assets/hero/warm-gradient-web.webp'),
};
export const phonePortrait = asset('assets/phone/portrait.webp');
export const explorationCovers = {
  touchMemory: asset('assets/explorations/touch-memory-cover.png'),
  more: asset('assets/projects/more-explorations-cover-web.webp'),
};
export const media = {
  xiaohuasheng: {
    cover: asset('assets/projects/xiaohuasheng-cover-web.webp'),
    caseBanner: asset('assets/xiaohuasheng/case-overview.webp'),
    chapters: [
      asset('assets/xiaohuasheng/ai-workflow.webp'),
      asset('assets/xiaohuasheng/figma-design.webp'),
      asset('assets/xiaohuasheng/community-needs.webp'),
      asset('assets/xiaohuasheng/book-exchange.webp'),
      asset('assets/xiaohuasheng/design-reflection.webp'),
    ],
  },
  flarewild: { cover: asset('assets/projects/flarewild-cover-web.webp'), video: null, poster: null, chapters: {} },
};
export const profile = {
  name: '张紫晴', english: 'Ziqing Zhang', role: '体验设计 / UI 设计',
  email: '3551194747@qq.com', wechat: 'Z13673185526', phone: '13673185526',
  resume: asset('assets/resume.pdf'), portrait: asset('assets/about/contact-portrait-web.webp'), reflectionVideo: null,
};
export const projects = [
  { id: 'xiaohuasheng', number: '01', name: '小花生', english: 'READING, RECONNECTED.', category: '亲子阅读 · 社区体验', time: '2025.06 — 2026.03', company: '上海慧力信息技术有限公司', role: 'UI/UX 设计实习',
    title: '小花生亲子阅读体验升级', subtitle: '从用户调研、AI 辅助设计，到主动提案并推动「书圈转转」落地。',
    summary: '从家长的闲置童书需求出发，提出并协同推进「书圈转转」，连接原有阅读行为与同城流转。', tags: ['用户洞察', '个性化体验', '社区设计'], color: '#f2c9ac',
    contribution: '我参与了从用户调研、需求分析到设计落地的完整流程。我用 AI 辅助整理反馈、探索方案和验证原型，并在 Figma 中完成交互设计、视觉设计和组件库搭建。',
    status: '从社区反馈中发现闲置童书流转需求，主动提案并推动「书圈转转」落地。',
    sections: [
      { label: '01 / AI WORKFLOW', title: '用 AI 加快方案探索与验证', body: '我用 AI 将多渠道的家长反馈按主题归类，并结合用户场景和业务目标筛选设计方向。在原型阶段，我用生成式 AI 探索多套方案，再用 Codex 搭建可交互的 Demo，提前检查关键流程、验证交互细节。' },
      { label: '02 / FIGMA DESIGN', title: '在 Figma 中完成交互、视觉与组件库', body: '我将选定的方案细化为交互流程和高保真界面，并把重复使用的界面元素整理为可复用组件。组件库帮助不同页面保持一致，也方便后续迭代和开发交接。' },
      { label: '03 / USER INSIGHT', title: '在社区发现闲置童书的换书需求', body: '一位家长在社区提到，孩子读完的绘本堆在家里，放到交易平台又要拍照、写介绍、反复沟通。评论区里，已经有家长开始自行找人换书。我把这些反馈整理成提案，希望让有换书需求的家长更容易在小花生里找到彼此。' },
      { label: '04 / DELIVERY', title: '主动提案并推动「书圈转转」落地', body: '我提出让家长从打卡书架直接导入书籍信息，减少重复填写，并通过同城匹配寻找附近的换书对象。我与产品和开发一起讨论发布规则、定位权限和距离展示，在方便家长找到彼此的同时保护位置隐私，最终推动模块落地。' },
      { label: '05 / REFLECTION', title: '从用户反馈到跨团队协作', body: '这次经历让我学会从用户已经在做的事里发现需求。评论区里的换书行为给了我提案的依据，而与产品、开发逐项确认规则和技术限制，让我积累了把需求推进到落地的经验。' },
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
  { name: '触忆', english: 'TOUCH MEMORY', image: asset('assets/explorations/touch-memory-cover-web.webp'), text: 'App 搭配触感手机壳的多感官情感交互项目', tags: '智能交互 / 软硬件体验', alt: '触忆项目封面', tone: 'warm' },
  { name: '乡音 · 方言交互', english: 'LOCAL VOICES', image: asset('assets/explorations/local-voice-cover-web.webp'), href: 'https://616219zzq-lgtm.github.io/', text: '围绕无锡南长街大窑路智新坊，探索方言的参与式表达。', tags: '在地文化 / 参与式体验', alt: '乡音项目封面', tone: 'green' },
];

// 首页 FlareWild 道具互动的视频播放顺序。
export const motionClips = [
  { id: 'overview', title: '概况', src: asset('assets/flarewild/videos/overview-detail.mp4'), poster: asset('assets/flarewild/videos/overview-poster.jpg') },
  { id: 'treasure-chest', title: '开宝箱', src: asset('assets/flarewild/videos/treasure-chest-detail.mp4'), poster: asset('assets/flarewild/videos/treasure-chest-poster.jpg') },
  { id: 'interactive-props', title: '互动道具', src: asset('assets/flarewild/videos/interactive-props-detail.mp4'), poster: asset('assets/flarewild/videos/interactive-props-poster.jpg') },
  { id: 'broadcast-props', title: '公放道具', src: asset('assets/flarewild/videos/broadcast-props-detail.mp4'), poster: asset('assets/flarewild/videos/broadcast-props-poster.jpg') },
];
