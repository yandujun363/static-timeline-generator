import utilities from './utilities.js';

/**
 * 星光Kirarin 活动时间轴内容
 *
 * 数据来源（截至 2026-11-07）：
 * - 萌娘百科「星光Kirarin」条目（出道、百舰、千舰、生日回等历程）
 * - bilibili 个人空间（粉丝数、投稿、动态、直播信息）
 * - bilibili 视频投稿与公开切片（二周年、3D 新衣装、联动等）
 *
 * 条目字段说明见 README.md「内容结构」。
 */

const SPACE = 'https://space.bilibili.com/3546653883632229';
const LIVE = 'https://live.bilibili.com/32378653';
const MOEGIRL = 'https://mzh.moegirl.org.cn/%E6%98%9F%E5%85%89Kirarin';

/** 生成 bilibili 全站搜索链接，便于追溯单条作品或事件。 */
const bili = (query) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;

const rawEntries = [
  {
    id: 'debut-teaser',
    date: '2024-06-04',
    categories: ['里程碑'],
    icon: 'sparkles',
    title: '出道预告：第一条动态',
    body: '星光Kirarin 在 bilibili 发布第一条动态，正式公布出道回消息。星光妖精的故事，从这条动态开始。',
    links: [{ label: 'B站主页', href: SPACE }],
  },
  {
    id: 'debut',
    date: '2024-06-07',
    time: '20:00',
    categories: ['里程碑', '直播'],
    icon: 'star',
    title: '出道回：星光妖精正式降临',
    body: '作为妖精管理局·三光五色企划的「星光」在 bilibili 出道。设定是「璀璨星河中唯一被选中的星光妖精」，代表色 <strong>#F8B2BB</strong>，粉丝名「KIRA碳」。',
    links: [
      { label: '萌娘百科', href: MOEGIRL },
      { label: 'B站主页', href: SPACE },
    ],
  },
  {
    id: 'hundred-guards',
    date: '2024-06-19',
    categories: ['里程碑'],
    icon: 'award',
    title: '达成百舰',
    body: '出道不到两周达成百舰，成为 bilibili 百人舰队主播。对刚起步的小偶像来说，这是第一份来自 KIRA碳 的「舰队」应援。',
    links: [
      { label: '萌娘百科', href: MOEGIRL },
      { label: '相关视频', href: bili('星光Kirarin 百舰') },
    ],
  },
  {
    id: 'endurance-stream',
    date: '2024-06-20',
    categories: ['直播'],
    icon: 'clock',
    title: '35 小时 53 分的耐久结算',
    body: '一次超长耐久直播结算，总时长 <strong>35 小时 53 分</strong>。从此「卷王」成了星光身上撕不掉的标签之一。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'five-thousand',
    date: '2024-08-13',
    categories: ['里程碑'],
    icon: 'heart',
    title: '粉丝数突破 5000',
    body: '出道两个月，bilibili 粉丝数突破 5000。喜欢甜点、毛茸茸和「所有喜欢星光的人」的星光妖精，被越来越多人看见。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'qiaodong-fm-guest',
    date: '2024-09-05',
    categories: ['直播', '联动'],
    icon: 'radio',
    title: '作为嘉宾参加桥洞 FM',
    body: '星光作为嘉宾参与桥洞 FM，这是她较早的一次跨企划电台活动，也让更多听众认识了这位话很多、梗也很多的星光妖精。',
    links: [{ label: '相关视频', href: bili('桥洞FM 星光Kirarin') }],
  },
  {
    id: 'birthday-2024',
    date: '2024-11-29',
    time: '20:00',
    categories: ['生日与周年', '直播'],
    icon: 'cake',
    title: '第一个生日回',
    body: '11 月 28 日是星光的生日。出道后的第一个生日回，星光和 KIRA碳 一起吹蜡烛、切蛋糕，也留下了「不要体检」的名场面。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'qiaodong-fm-host',
    date: '2024-12-23',
    categories: ['直播', '联动'],
    icon: 'mic',
    title: '成为桥洞 FM 代班主持人',
    body: '从嘉宾到代班主持，星光开始以主持人的身份参与桥洞 FM。稳定的临场感和接梗能力，让她成为同事口中「好用的同事」。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'ten-thousand',
    date: '2025-01-24',
    categories: ['里程碑'],
    icon: 'heart',
    title: '粉丝数突破 1 万',
    body: '出道半年多，bilibili 粉丝数突破 1 万。星光在直播里感谢了每一位 KIRA碳，也继续把「王道偶像」当作目标。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'yaoguan-second-mmd',
    date: '2025-02-07',
    categories: ['作品', '联动'],
    icon: 'music',
    title: '妖精管理局二周年 MMD「爱派 Dancehall」',
    body: '参与妖精管理局二周年纪念，与企划内的同伴合作「爱派 Dancehall」MMD。三光五色的偶像们在同一支舞里集合。',
    links: [{ label: '相关视频', href: bili('妖精管理局二周年 爱派Dancehall') }],
  },
  {
    id: 'twenty-thousand',
    date: '2025-06-23',
    categories: ['里程碑'],
    icon: 'heart',
    title: '粉丝数突破 2 万',
    body: '粉丝数突破 2 万。此时距离出道刚过一年，星光已经拥有了稳定的直播节奏和一批长期陪伴的 KIRA碳。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'thousand-guards',
    date: '2025-07-23',
    categories: ['里程碑'],
    icon: 'award',
    title: '达成千舰',
    body: '星光达成千舰，成为 bilibili 千人舰队主播。从百舰到千舰，用了一年多的时间，也把「小偶像」的舞台撑得更大。',
    links: [
      { label: '萌娘百科', href: MOEGIRL },
      { label: '相关视频', href: bili('星光Kirarin 千舰') },
    ],
  },
  {
    id: 'thirteen-hundred-guards',
    date: '2025-07-28',
    categories: ['里程碑'],
    icon: 'flame',
    title: '舰长数达到 1300',
    body: '千舰之后热度继续攀升，舰长数达到 1300。星光在直播中感谢了所有舰长与 KIRA碳，也留下了「冲舰」相关的经典切片。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'outfit-first',
    date: '2025-10-18',
    categories: ['周边'],
    icon: 'bag',
    title: '首套个人装扮发售',
    body: '「星光Kirarin装扮第一弹」正式发售，包含专属表情包、粉丝卡片与个性化装扮。星光选择了「装扮」而不是收藏集，理由是担心大家抽不到，「不如直接买」。',
    links: [{ label: '相关视频', href: bili('星光Kirarin装扮第一弹') }],
  },
  {
    id: 'birthday-2025',
    date: '2025-11-28',
    time: '20:00',
    categories: ['生日与周年', '直播'],
    icon: 'cake',
    title: '第二次生日回',
    body: '第二次生日回。此时的星光已经拥有千舰与 2 万粉丝，生日回也变成了一年一度和 KIRA碳 的固定约定。',
    links: [{ label: '萌娘百科', href: MOEGIRL }],
  },
  {
    id: 'original-pv',
    date: '2026-05-20',
    categories: ['作品'],
    icon: 'music',
    title: '原创 PV 翻唱「破晓前绝不分离」',
    body: '发布原创 PV 翻唱《破晓前绝不分离》，以魔性少女的声线完成超还原演绎。声乐课上的练习，开始变成可以单独拿出来看的作品。',
    links: [{ label: '相关视频', href: bili('破晓前绝不分离 星光Kirarin') }],
  },
  {
    id: 'second-anniversary-teaser',
    date: '2026-07-01',
    categories: ['作品', '生日与周年'],
    icon: 'megaphone',
    title: '二周年预热「站住！打劫！」',
    body: '二周年预热短片「站住！打劫！」上线，为 7 月 5 日的二周年新衣回倒计时。星光用一支短片把「打劫 KIRA碳」的梗玩到了周年。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 7月5日二周年') }],
  },
  {
    id: 'second-anniversary',
    date: '2026-07-05',
    time: '20:00',
    categories: ['生日与周年', '直播'],
    icon: 'star',
    title: '二周年纪念回 & 新衣装「兔兔仪仗队」',
    body: '出道两周年纪念回，星光披露新衣装「兔兔仪仗队」，并带来二周年特别直播。从 2024 年的出道回走到这里，小偶像的第二个年头正式收官。',
    links: [
      { label: '相关视频', href: bili('星光Kirarin 二周年 兔兔仪仗队') },
      { label: 'B站主页', href: SPACE },
    ],
  },
  {
    id: 'second-anniversary-song',
    date: '2026-07-05',
    categories: ['作品'],
    icon: 'music',
    title: '两周年原创曲「耀眼的光〜光の物語〜」',
    body: '两周年原创曲《耀眼的光〜光の物語〜》正式发布，作为送给 KIRA碳 的纪念作品。歌名里的「光」，既是星光，也是台下每一束应援色。',
    links: [{ label: '相关视频', href: bili('耀眼的光 光の物語 星光Kirarin') }],
  },
  {
    id: 'live2d-2026',
    date: '2026-07-13',
    categories: ['作品'],
    icon: 'sparkles',
    title: 'Live2D 新模型展示「目标是！征服世界！」',
    body: '新的 Live2D 模型展示公开。标题写着「目标是！征服世界！」，配上星光一贯的自信发言，很难不让人期待她接下来的舞台。',
    links: [{ label: '相关视频', href: bili('Live2D模型展示 目标是征服世界 星光Kirarin') }],
  },
  {
    id: 'two-thousand-challenge',
    date: '2026-07-21',
    categories: ['直播'],
    icon: 'flame',
    title: '「老师，我也要冲两千舰吗？」',
    body: '在千舰与 1300 舰之后，星光在 7 月的直播里聊到「冲两千舰」的话题，留下「老师，我也要冲两千舰吗？」的切片。对星光和 KIRA碳 来说，冲舰从来不只是数字，而是一起完成一件事。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 两千舰') }],
  },
  {
    id: 'mmd-2026',
    date: '2026-09-11',
    categories: ['作品'],
    icon: 'music',
    title: 'MMD「想要成为你的恋人」',
    body: '发布 MMD《想要成为你的恋人》。从翻唱、原创曲到 MMD，星光的内容线越来越完整，也让「偶像」这件事有了更多可视化表达。',
    links: [{ label: '相关视频', href: bili('MMD 想要成为你的恋人 星光Kirarin') }],
  },
  {
    id: '3d-outfit',
    date: '2026-10-14',
    categories: ['3D', '里程碑'],
    icon: 'cube',
    title: '3D 新衣装「iLiFE! 偶像生活豪华包」',
    body: '3D 新衣装「iLiFE! 偶像生活豪华包」披露。10 月中旬起，星光连续发布 3D 相关内容，并在 3D 直播中带来摸摸头与握手会——「3D 还是太方便了」。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 3D新衣装 iLiFE') }],
  },
  {
    id: '3d-collab',
    date: '2026-10-23',
    categories: ['3D', '联动'],
    icon: 'users',
    title: '与赵狮虎的 3D 联动系列',
    body: '10 月下旬，星光与赵狮虎连续进行多场 3D 联动直播。「大小姐训猫」「上膛毙猫」等切片成为名场面，也让 3D 舞台变成了同事之间的游乐场。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 赵狮虎 3D联动') }],
  },
  {
    id: 'birthday-month-2026',
    date: '2026-11-02',
    categories: ['生日与周年'],
    icon: 'calendar',
    title: '生日月开启：11.2–11.8 周表与生日倒计时',
    body: '公布 11.2–11.8 周表，并预告 11 月 28 日生日回、冲舰与生日限定舰礼。本月 1–27 日还会增加一份额外的虚拟礼物，生日气氛从月初就开始升温。',
    links: [{ label: 'B站动态', href: `${SPACE}/dynamic` }],
  },
  {
    id: 'cover-zhuyu',
    date: '2026-11-05',
    categories: ['作品'],
    icon: 'music',
    title: '翻唱「珠玉」：声乐课阶段性展示',
    body: '翻唱《珠玉》上线，被星光自己称为「声乐课阶段性展示」。这是一次不那么擅长的风格尝试，也是小偶像在声乐课上交出的阶段作业。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 珠玉 翻唱') }],
  },
  {
    id: '3d-dance-2026',
    date: '2026-11-06',
    categories: ['作品', '3D'],
    icon: 'sparkles',
    title: '3D 翻跳「反乌托邦+拼接遗憾」',
    body: '发布 3D 翻跳《反乌托邦+拼接遗憾》，尝试舞台直拍式的一镜到底。没有额外运镜，靠的是编舞、表情和「人生本该如花绚烂」的那股劲。',
    links: [{ label: '相关视频', href: bili('星光Kirarin 反乌托邦 拼接遗憾') }],
  },
  {
    id: 'birthday-2026',
    date: '2026-11-28',
    time: '20:00',
    categories: ['生日与周年'],
    icon: 'cake',
    status: 'upcoming',
    title: '第三次生日回（预定）',
    body: '第三次生日回预定在 11 月 28 日举行，生日限定舰礼与冲舰活动将同步解锁。星光在周表里写下「生日倒计时」，而 KIRA碳 要做的，就是准时到场。',
    links: [
      { label: '直播间', href: LIVE },
      { label: 'B站动态', href: `${SPACE}/dynamic` },
    ],
  },
];

const site = {
  title: '星光Kirarin 活动时间轴',
  description:
    '星光Kirarin（妖精管理局·三光五色）2024–2026 活动时间轴：出道、百舰与千舰、生日回、二周年、3D 新衣装与作品记录。',
  author: 'KIRA碳',
};

const profile = {
  name: '星光Kirarin',
  latin: 'Hoshikari Kirarin',
  role: '妖精管理局 · 三光五色 所属',
  tagline: 'KiraKira~Kirarin! 璀璨星河中唯一被选中的星光妖精',
  intro:
    '来自秘密花园的星光妖精，梦想成为更加完美的王道偶像。2024 年 6 月 7 日在 bilibili 出道，喜欢甜点、毛茸茸，以及所有喜欢她的人。',
  facts: [
    { label: '所属企划', value: '妖精管理局 · 三光五色' },
    { label: '出道日期', value: '2024.06.07' },
    { label: '生日', value: '11.28（射手座）' },
    { label: '代表色', value: '#F8B2BB' },
    { label: '粉丝名', value: 'KIRA碳' },
    { label: '设定', value: '可以被他人强大愿望赋予任何身份的意识体' },
    { label: '梦想', value: '成为更加完美的王道偶像' },
    { label: '喜欢', value: '甜点、毛茸茸、所有喜欢她的人' },
  ],
  stats: [
    { value: '2.78 万', label: 'B站粉丝' },
    { value: '1300+', label: '最高舰长' },
    { value: '899', label: 'B站投稿' },
    { value: '2024—2026', label: '记录跨度' },
  ],
  links: [
    { label: 'B站主页', href: SPACE },
    { label: '直播间', href: LIVE },
    { label: '萌娘百科', href: MOEGIRL },
  ],
};

const sources = [
  {
    label: '萌娘百科 · 星光Kirarin',
    href: MOEGIRL,
    note: '出道、历程、形象与逸闻',
  },
  {
    label: 'bilibili 个人空间',
    href: SPACE,
    note: '动态、投稿、粉丝与直播信息',
  },
  {
    label: 'bilibili 直播间 32378653',
    href: LIVE,
    note: '直播活动与舰长记录',
  },
];

const lastUpdated = '2026-11-07';

const entries = utilities.decorateEntries(rawEntries);

export default {
  site,
  profile,
  sources,
  entries,
  filters: utilities.buildFilters(entries),
  years: utilities.groupByYear(entries),
  lastUpdated,
  lastUpdatedLabel: utilities.formatDate(lastUpdated),
  footerNote:
    '本站为粉丝整理的非官方时间轴，资料来自萌娘百科与 bilibili 公开信息，仅供交流与存档；如有错漏，欢迎指正。',
};
