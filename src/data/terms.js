/**
 * 二十四节气数据源
 * ------------------------------------------------------------
 * 这是整个网站的"数据层"，和 Vue 没有直接关系：它只是一个普通的 JS 模块，
 * 导出一个数组和一个对象。组件通过 `import` 使用它，再用 v-for 渲染成列表。
 * 这样做的好处：视图（页面）和数据分离，改数据不用改组件代码。
 *
 * 字段说明：
 *  id        唯一标识，用作路由参数 /terms/:id 和列表 key
 *  name      节气名
 *  pinyin    拼音（国际音标风格，仅作展示）
 *  order     在一年中的次序（1 = 立春，24 = 大寒）
 *  season    季节：spring / summer / autumn / winter
 *  month/day 常年日期（受地球公转影响每年会 ±1 天，所以是"常年日期"）
 *  emoji     图标（避免引入外部图片，保证离线可用）
 *  colors    该节气的主题渐变（绑定到 style 上，演示"绑定内联样式"）
 *  tagline   一句话物候
 *  intro     简介
 *  hou       三候（古人把每个节气分为三候，每候 5 天）
 *  customs   传统习俗
 *  foods     时令食材
 *  health    养生提示
 *  poem      对应的古诗词（诗句 / 作者 / 出处）
 */

/** 季节元数据：颜色、名称、图标 */
export const SEASONS = {
  spring: { key: 'spring', name: '春', full: '春季', emoji: '🌱', color: '#4c9a5f' },
  summer: { key: 'summer', name: '夏', full: '夏季', emoji: '🌻', color: '#d1603d' },
  autumn: { key: 'autumn', name: '秋', full: '秋季', emoji: '🍁', color: '#c9a227' },
  winter: { key: 'winter', name: '冬', full: '冬季', emoji: '❄️', color: '#4a7ea8' }
}

export const TERMS = [
  {
    id: 'lichun',
    name: '立春',
    pinyin: 'Lì Chūn',
    order: 1,
    season: 'spring',
    month: 2,
    day: 4,
    emoji: '🌱',
    colors: ['#7cc07a', '#3f7d4a'],
    tagline: '东风解冻，蛰虫始振',
    intro:
      '立春是二十四节气之首，"立"是开始的意思。自秦代以来，中国就一直以立春作为春季的开始。此时太阳到达黄经 315°，气温开始回升，万物复苏，农事活动由此展开。',
    hou: ['东风解冻', '蛰虫始振', '鱼陟负冰'],
    customs: ['咬春（吃春饼、萝卜）', '打春牛', '贴"宜春"二字', '踏青探春'],
    foods: ['春饼', '萝卜', '春芽', '韭菜'],
    health: '宜养肝，早睡早起，少酸多甘，注意"春捂"不要过早减衣。',
    poem: { text: '律回岁晚冰霜少，春到人间草木知。', author: '张栻', title: '立春偶成' }
  },
  {
    id: 'yushui',
    name: '雨水',
    pinyin: 'Yǔ Shuǐ',
    order: 2,
    season: 'spring',
    month: 2,
    day: 19,
    emoji: '🌧️',
    colors: ['#8ec5d6', '#3c7a94'],
    tagline: '獭祭鱼，鸿雁来',
    intro:
      '雨水节气前后，气温回升、冰雪融化、降水增多，故取名为雨水。此时太阳到达黄经 330°，是全年寒潮过程出现最多的时节之一，天气变化不定。',
    hou: ['獭祭鱼', '候雁北', '草木萌动'],
    customs: ['回娘家送罐罐肉', '拉保保（认干爹）', '占稻色'],
    foods: ['春笋', '荠菜', '蜂蜜', '红枣'],
    health: '雨水时节湿气渐重，宜健脾祛湿，少食生冷，可用薏米、山药煮粥。',
    poem: { text: '好雨知时节，当春乃发生。', author: '杜甫', title: '春夜喜雨' }
  },
  {
    id: 'jingzhe',
    name: '惊蛰',
    pinyin: 'Jīng Zhé',
    order: 3,
    season: 'spring',
    month: 3,
    day: 5,
    emoji: '🐛',
    colors: ['#9fbf6a', '#4e7a35'],
    tagline: '桃始华，仓庚鸣',
    intro:
      '惊蛰古称"启蛰"。古人认为春雷惊醒了蛰伏于地下冬眠的昆虫，故称惊蛰。此时太阳到达黄经 345°，中国大部分地区进入春耕季节。',
    hou: ['桃始华', '仓庚鸣', '鹰化为鸠'],
    customs: ['吃梨润肺', '祭白虎化解是非', '打小人', '蒙鼓皮'],
    foods: ['梨', '菠菜', '山药', '春笋'],
    health: '气候干燥易口干舌燥，民间有"惊蛰吃梨"的习俗；宜清淡饮食、防春困。',
    poem: { text: '微雨众卉新，一雷惊蛰始。', author: '韦应物', title: '观田家' }
  },
  {
    id: 'chunfen',
    name: '春分',
    pinyin: 'Chūn Fēn',
    order: 4,
    season: 'spring',
    month: 3,
    day: 20,
    emoji: '🌸',
    colors: ['#f0a6b8', '#b3546f'],
    tagline: '玄鸟至，雷乃发声',
    intro:
      '春分之日太阳直射赤道，全球昼夜几乎等长，"分"即一半。过了这一天，北半球白昼渐长。春分也是伊朗、土耳其等国的传统新年。',
    hou: ['玄鸟至', '雷乃发声', '始电'],
    customs: ['竖蛋', '吃春菜', '送春牛', '放风筝'],
    foods: ['春菜', '香椿', '豆芽', '荠菜'],
    health: '饮食讲究寒热均衡，忌大寒大热；适当户外运动，舒展筋骨。',
    poem: { text: '仲春初四日，春色正中分。', author: '徐铉', title: '春分日' }
  },
  {
    id: 'qingming',
    name: '清明',
    pinyin: 'Qīng Míng',
    order: 5,
    season: 'spring',
    month: 4,
    day: 5,
    emoji: '🌿',
    colors: ['#8fd0a8', '#3d7f5c'],
    tagline: '桐始华，田鼠化为鴽',
    intro:
      '清明既是节气又是节日。此时气清景明、万物皆显，故称清明。气温回升，雨量增多，正是春耕春种的大好时节，民间有"清明前后，种瓜点豆"之说。',
    hou: ['桐始华', '田鼠化为鴽', '虹始见'],
    customs: ['扫墓祭祖', '踏青郊游', '插柳戴柳', '荡秋千', '放风筝'],
    foods: ['青团', '馓子', '螺蛳', '艾草'],
    health: '宜疏肝理气，多吃"柔肝养肺"的食物；对花粉过敏者注意防护。',
    poem: { text: '清明时节雨纷纷，路上行人欲断魂。', author: '杜牧', title: '清明' }
  },
  {
    id: 'guyu',
    name: '谷雨',
    pinyin: 'Gǔ Yǔ',
    order: 6,
    season: 'spring',
    month: 4,
    day: 20,
    emoji: '🌾',
    colors: ['#a8c46a', '#557c2c'],
    tagline: '萍始生，鸣鸠拂其羽',
    intro:
      '谷雨是春季的最后一个节气，取自"雨生百谷"之意。此时降水明显增加，田中的秧苗初插、作物新种，最需要雨水的滋润。',
    hou: ['萍始生', '鸣鸠拂其羽', '戴胜降于桑'],
    customs: ['赏牡丹（谷雨花）', '喝谷雨茶', '祭海', '走谷雨'],
    foods: ['谷雨茶', '香椿', '荠菜', '槐花'],
    health: '湿气渐盛，宜健脾祛湿；"谷雨茶"清热明目，但不宜空腹饮用。',
    poem: { text: '谷雨春光晓，山川黛色青。', author: '元稹', title: '咏廿四气诗·谷雨春光晓' }
  },
  {
    id: 'lixia',
    name: '立夏',
    pinyin: 'Lì Xià',
    order: 7,
    season: 'summer',
    month: 5,
    day: 5,
    emoji: '☀️',
    colors: ['#f5b461', '#c46a1e'],
    tagline: '蝼蝈鸣，蚯蚓出',
    intro:
      '立夏表示即将告别春天，是夏天的开始。此时太阳到达黄经 45°，温度明显升高，雷雨增多，农作物进入旺长阶段。',
    hou: ['蝼蝈鸣', '蚯蚓出', '王瓜生'],
    customs: ['称人（立夏秤人）', '斗蛋', '尝三新', '挂蛋兜'],
    foods: ['蚕豆', '苋菜', '樱桃', '青梅'],
    health: '夏气通于心，宜养心安神，午间小憩；饮食清淡，少食油腻。',
    poem: { text: '绿树阴浓夏日长，楼台倒影入池塘。', author: '高骈', title: '山亭夏日' }
  },
  {
    id: 'xiaoman',
    name: '小满',
    pinyin: 'Xiǎo Mǎn',
    order: 8,
    season: 'summer',
    month: 5,
    day: 21,
    emoji: '🌾',
    colors: ['#e8c95a', '#b0871f'],
    tagline: '苦菜秀，靡草死',
    intro:
      '小满指夏熟作物的籽粒开始灌浆饱满，但还未成熟，只是小满，尚未大满。此时南方雨水丰盈，江河渐满，故民谚有"小满小满，江河渐满"。',
    hou: ['苦菜秀', '靡草死', '麦秋至'],
    customs: ['祭车神', '食苦菜', '抢水', '看麦梢黄'],
    foods: ['苦菜', '冬瓜', '薏米', '绿豆'],
    health: '湿热渐重，宜清热利湿，多吃苦味蔬菜；避免久处空调冷风。',
    poem: { text: '夜莺啼绿柳，皓月醒长空。', author: '欧阳修（传）', title: '小满' }
  },
  {
    id: 'mangzhong',
    name: '芒种',
    pinyin: 'Máng Zhòng',
    order: 9,
    season: 'summer',
    month: 6,
    day: 6,
    emoji: '🌾',
    colors: ['#d9b64a', '#8f6b13'],
    tagline: '螳螂生，鵙始鸣',
    intro:
      '"芒"指有芒的作物（如小麦）收获，"种"指谷黍类作物播种。芒种是农事最繁忙的时节，民间称"忙种"，也有"芒种不种，再种无用"的说法。',
    hou: ['螳螂生', '鵙始鸣', '反舌无声'],
    customs: ['送花神', '安苗', '煮青梅', '打泥巴仗'],
    foods: ['青梅', '绿豆汤', '苦瓜', '鸭肉'],
    health: '气温高、湿度大，宜午休养心；出汗多需及时补充水分与电解质。',
    poem: { text: '时雨及芒种，四野皆插秧。', author: '陆游', title: '时雨' }
  },
  {
    id: 'xiazhi',
    name: '夏至',
    pinyin: 'Xià Zhì',
    order: 10,
    season: 'summer',
    month: 6,
    day: 21,
    emoji: '🌞',
    colors: ['#f4874b', '#b8401a'],
    tagline: '鹿角解，蝉始鸣',
    intro:
      '夏至这天太阳直射北回归线，是北半球一年中白昼最长的一天。"至"是"极"的意思，但夏至并不是一年中最热的时候，真正的暑热在三伏。',
    hou: ['鹿角解', '蝉始鸣', '半夏生'],
    customs: ['吃夏至面', '祭地祀祖', '消夏避伏', '互赠折扇脂粉'],
    foods: ['夏至面', '苦瓜', '莲子', '冬瓜'],
    health: '阳气最盛，宜晚睡早起、午间小睡；忌贪凉饮冷过度伤脾胃。',
    poem: { text: '昼晷已云极，宵漏自此长。', author: '韦应物', title: '夏至避暑北池' }
  },
  {
    id: 'xiaoshu',
    name: '小暑',
    pinyin: 'Xiǎo Shǔ',
    order: 11,
    season: 'summer',
    month: 7,
    day: 7,
    emoji: '🔥',
    colors: ['#f28f3b', '#a83f10'],
    tagline: '温风至，蟋蟀居壁',
    intro:
      '小暑意为天气开始炎热，但还没到最热。"倏忽温风至，因循小暑来"。此时长江中下游地区进入伏旱期，华南、西南进入雨季。',
    hou: ['温风至', '蟋蟀居壁', '鹰始鸷'],
    customs: ['食新（尝新米）', '晒书画衣物', '吃藕', '封斋'],
    foods: ['莲藕', '黄鳝', '绿豆芽', '西瓜'],
    health: '"小暑大暑，上蒸下煮"，宜少动多静、心平气和，注意防暑降温。',
    poem: { text: '倏忽温风至，因循小暑来。', author: '元稹', title: '咏廿四气诗·小暑六月节' }
  },
  {
    id: 'dashu',
    name: '大暑',
    pinyin: 'Dà Shǔ',
    order: 12,
    season: 'summer',
    month: 7,
    day: 23,
    emoji: '🥵',
    colors: ['#e8623a', '#96220f'],
    tagline: '腐草为萤，土润溽暑',
    intro:
      '大暑是一年中最热的时期，正值中伏前后。此时农作物生长最快，同时旱、涝、风灾也最为频繁，是"双抢"最忙的时节。',
    hou: ['腐草为萤', '土润溽暑', '大雨时行'],
    customs: ['饮伏茶', '晒伏姜', '送大暑船', '斗蟋蟀'],
    foods: ['仙草', '伏姜', '绿豆', '冬瓜'],
    health: '防中暑是第一要务，宜多喝温水、少食冰冷；"冬病夏治"三伏贴正当其时。',
    poem: { text: '桂轮开子夜，萤火照空时。', author: '元稹', title: '咏廿四气诗·大暑六月中' }
  },
  {
    id: 'liqiu',
    name: '立秋',
    pinyin: 'Lì Qiū',
    order: 13,
    season: 'autumn',
    month: 8,
    day: 7,
    emoji: '🍂',
    colors: ['#e0b464', '#9a6b1c'],
    tagline: '凉风至，白露降',
    intro:
      '立秋预示着炎热的夏天即将过去，秋天即将来临。但立秋并不代表酷热天气就此结束，往往还有"秋老虎"发威，真正凉爽一般要到白露之后。',
    hou: ['凉风至', '白露生', '寒蝉鸣'],
    customs: ['贴秋膘', '啃秋（吃西瓜）', '晒秋', '秋忙会'],
    foods: ['西瓜', '秋梨', '莲藕', '百合'],
    health: '燥气渐生，宜润肺防燥；"秋不食姜"，少辛增酸。',
    poem: { text: '乳鸦啼散玉屏空，一枕新凉一扇风。', author: '刘翰', title: '立秋' }
  },
  {
    id: 'chushu',
    name: '处暑',
    pinyin: 'Chǔ Shǔ',
    order: 14,
    season: 'autumn',
    month: 8,
    day: 23,
    emoji: '🌤️',
    colors: ['#cbb26a', '#7d6420'],
    tagline: '鹰乃祭鸟，天地始肃',
    intro:
      '"处"是终止的意思，处暑表示炎热的暑天结束了。此时太阳到达黄经 150°，副热带高压南退，中国大部分地区气温逐渐下降。',
    hou: ['鹰乃祭鸟', '天地始肃', '禾乃登'],
    customs: ['放河灯', '开渔节', '煎药茶', '祭祖迎秋'],
    foods: ['鸭子', '莲藕', '银耳', '秋梨'],
    health: '昼夜温差加大，宜"春捂秋冻"适度；饮食润燥，早睡早起。',
    poem: { text: '离离暑云散，袅袅凉风起。', author: '白居易', title: '早秋曲江感怀' }
  },
  {
    id: 'bailu',
    name: '白露',
    pinyin: 'Bái Lù',
    order: 15,
    season: 'autumn',
    month: 9,
    day: 8,
    emoji: '💧',
    colors: ['#9dc3c9', '#43707d'],
    tagline: '鸿雁来，玄鸟归',
    intro:
      '白露是昼夜温差最大的节气。夜间水汽在草木上凝结成白色水滴，故名白露。"白露秋分夜，一夜冷一夜"，此时暑热基本结束。',
    hou: ['鸿雁来', '玄鸟归', '群鸟养羞'],
    customs: ['收清露', '饮白露茶', '吃龙眼', '祭禹王'],
    foods: ['龙眼', '白露茶', '米酒', '红薯'],
    health: '"白露不露身"，注意腹部与脚部保暖，预防感冒与呼吸道疾病。',
    poem: { text: '露从今夜白，月是故乡明。', author: '杜甫', title: '月夜忆舍弟' }
  },
  {
    id: 'qiufen',
    name: '秋分',
    pinyin: 'Qiū Fēn',
    order: 16,
    season: 'autumn',
    month: 9,
    day: 23,
    emoji: '🍁',
    colors: ['#e0a04a', '#9c5a12'],
    tagline: '雷始收声，蛰虫坯户',
    intro:
      '秋分与春分一样，太阳直射赤道，昼夜等长。自 2018 年起，我国将每年秋分设立为"中国农民丰收节"。',
    hou: ['雷始收声', '蛰虫坯户', '水始涸'],
    customs: ['祭月', '竖蛋', '吃秋菜', '送秋牛图', '放风筝'],
    foods: ['秋菜', '螃蟹', '桂花糕', '芋头'],
    health: '阴阳平衡之时，饮食宜平和；秋蟹性寒，食用时配姜醋。',
    poem: { text: '金气秋分，风清露冷秋期半。', author: '谢逸', title: '点绛唇·金气秋分' }
  },
  {
    id: 'hanlu',
    name: '寒露',
    pinyin: 'Hán Lù',
    order: 17,
    season: 'autumn',
    month: 10,
    day: 8,
    emoji: '🌫️',
    colors: ['#b39b6a', '#6b5426'],
    tagline: '鸿雁来宾，菊有黄华',
    intro:
      '寒露表示秋季时节的正式开始，气温比白露时更低，露水更多且寒意更重，快要凝结成霜了。此时北方已见初霜，南方秋意渐浓。',
    hou: ['鸿雁来宾', '雀入大水为蛤', '菊有黄华'],
    customs: ['登高赏菊', '饮菊花酒', '吃芝麻', '斗蟋蟀'],
    foods: ['菊花酒', '芝麻', '螃蟹', '柿子'],
    health: '"寒露脚不露"，睡前热水泡脚；饮食滋阴润燥，多食芝麻、核桃。',
    poem: { text: '袅袅凉风动，凄凄寒露零。', author: '白居易', title: '池上' }
  },
  {
    id: 'shuangjiang',
    name: '霜降',
    pinyin: 'Shuāng Jiàng',
    order: 18,
    season: 'autumn',
    month: 10,
    day: 23,
    emoji: '❄️',
    colors: ['#a8b0bd', '#5a6472'],
    tagline: '豺乃祭兽，草木黄落',
    intro:
      '霜降是秋季的最后一个节气，意味着冬天即将开始。此时黄河流域已出现白霜，"霜叶红于二月花"，也正是赏枫的好时候。',
    hou: ['豺乃祭兽', '草木黄落', '蜇虫咸俯'],
    customs: ['赏红叶', '吃柿子', '进补', '登高远眺'],
    foods: ['柿子', '板栗', '牛肉', '萝卜'],
    health: '慢性呼吸道疾病与关节病易复发，注意保暖；"补冬不如补霜降"。',
    poem: { text: '停车坐爱枫林晚，霜叶红于二月花。', author: '杜牧', title: '山行' }
  },
  {
    id: 'lidong',
    name: '立冬',
    pinyin: 'Lì Dōng',
    order: 19,
    season: 'winter',
    month: 11,
    day: 7,
    emoji: '🧣',
    colors: ['#8fa9c4', '#3f5c7d'],
    tagline: '水始冰，地始冻',
    intro:
      '立冬是冬季的第一个节气，"冬，终也，万物收藏也"。此时农作物收晒完毕、收藏入库，动物也准备冬眠，是一年中休养生息的开始。',
    hou: ['水始冰', '地始冻', '雉入大水为蜃'],
    customs: ['吃饺子', '补冬（进补）', '祭祖饮宴', '贺冬'],
    foods: ['饺子', '羊肉', '萝卜', '栗子'],
    health: '冬季养藏，宜早睡晚起、注意保暖；适度进补，忌盲目大补。',
    poem: { text: '冻笔新诗懒写，寒炉美酒时温。', author: '李白', title: '立冬' }
  },
  {
    id: 'xiaoxue',
    name: '小雪',
    pinyin: 'Xiǎo Xuě',
    order: 20,
    season: 'winter',
    month: 11,
    day: 22,
    emoji: '🌨️',
    colors: ['#b7c9dc', '#5d7794'],
    tagline: '虹藏不见，天气上升',
    intro:
      '小雪表示降雪的起始时间和程度。此时气温下降，开始降雪但雪量不大，故称小雪。黄河中下游地区平均初雪期基本与小雪节令一致。',
    hou: ['虹藏不见', '天气上升地气下降', '闭塞而成冬'],
    customs: ['腌腊肉', '做香肠', '吃糍粑', '晒鱼干'],
    foods: ['糍粑', '腊肉', '白菜', '羊肉汤'],
    health: '宜温补，多晒太阳；室内注意通风，预防流感。',
    poem: { text: '晚来天欲雪，能饮一杯无？', author: '白居易', title: '问刘十九' }
  },
  {
    id: 'daxue',
    name: '大雪',
    pinyin: 'Dà Xuě',
    order: 21,
    season: 'winter',
    month: 12,
    day: 7,
    emoji: '☃️',
    colors: ['#aebfd4', '#4d6484'],
    tagline: '鹖鴠不鸣，虎始交',
    intro:
      '大雪的意思是天气更冷，降雪的可能性比小雪时更大了。此时黄河流域一带渐有积雪，北方则呈现"千里冰封，万里雪飘"的景观。',
    hou: ['鹖鴠不鸣', '虎始交', '荔挺出'],
    customs: ['腌肉', '观赏封河', '进补', '赏雪'],
    foods: ['羊肉', '红薯粥', '雪菜', '柑橘'],
    health: '"冬吃萝卜夏吃姜"，宜温热水泡脚；心脑血管人群注意防寒保暖。',
    poem: { text: '千山鸟飞绝，万径人踪灭。', author: '柳宗元', title: '江雪' }
  },
  {
    id: 'dongzhi',
    name: '冬至',
    pinyin: 'Dōng Zhì',
    order: 22,
    season: 'winter',
    month: 12,
    day: 22,
    emoji: '🥟',
    colors: ['#9db4cf', '#3b5473'],
    tagline: '蚯蚓结，麋角解',
    intro:
      '冬至这天太阳直射南回归线，北半球白昼最短。"冬至大如年"，古人认为冬至是阴极之至、阳气始生，是一个循环的开始，因此十分重视。',
    hou: ['蚯蚓结', '麋角解', '水泉动'],
    customs: ['北方吃饺子', '南方吃汤圆', '数九', '祭祖', '赠鞋袜'],
    foods: ['饺子', '汤圆', '羊肉汤', '赤豆粥'],
    health: '一年中最佳的进补时机，"冬至一阳生"；注意保暖，避免熬夜。',
    poem: { text: '邯郸驿里逢冬至，抱膝灯前影伴身。', author: '白居易', title: '邯郸冬至夜思家' }
  },
  {
    id: 'xiaohan',
    name: '小寒',
    pinyin: 'Xiǎo Hán',
    order: 23,
    season: 'winter',
    month: 1,
    day: 5,
    emoji: '🧊',
    colors: ['#a3b8cc', '#435c78'],
    tagline: '雁北乡，鹊始巢',
    intro:
      '小寒标志着开始进入一年中最寒冷的日子。小寒正处于"三九"前后，民间有"小寒胜大寒"的说法，是一年中气温最低的时段之一。',
    hou: ['雁北乡', '鹊始巢', '雉始雊'],
    customs: ['吃腊八粥', '吃菜饭', '探梅', '冰戏'],
    foods: ['腊八粥', '糯米饭', '菜饭', '羊肉'],
    health: '重在"藏"，宜早睡晚起、避寒就温；适度运动但不宜大汗。',
    poem: { text: '小寒连大吕，欢鹊垒新巢。', author: '元稹', title: '咏廿四气诗·小寒十二月节' }
  },
  {
    id: 'dahan',
    name: '大寒',
    pinyin: 'Dà Hán',
    order: 24,
    season: 'winter',
    month: 1,
    day: 20,
    emoji: '🌬️',
    colors: ['#94a9c0', '#374d68'],
    tagline: '鸡始乳，征鸟厉疾',
    intro:
      '大寒是二十四节气中的最后一个。大寒过后又立春，将迎来新一年的节气轮回。此时寒潮南下频繁，是我国部分地区一年中的最冷时期。',
    hou: ['鸡始乳', '征鸟厉疾', '水泽腹坚'],
    customs: ['尾牙祭', '除尘糊窗', '备年货', '蒸供'],
    foods: ['八宝饭', '年糕', '糯米饭', '鸡汤'],
    health: '防寒保暖同时要"防燥"，多喝水；年关将近，注意饮食节制。',
    poem: { text: '旧雪未及消，新雪又拥户。', author: '邵雍', title: '大寒吟' }
  }
]

/** 按 id 快速查找节气 */
export const TERM_MAP = Object.fromEntries(TERMS.map((t) => [t.id, t]))

/** 按季节分组的节气 */
export const TERMS_BY_SEASON = TERMS.reduce((acc, term) => {
  ;(acc[term.season] ||= []).push(term)
  return acc
}, {})

/**
 * 计算某个节气在指定年份的公历日期。
 * 说明：这里用"常年日期"作为基准，只做展示用途，真实节气时刻由天文台发布。
 */
export function termDate(term, year = new Date().getFullYear()) {
  return new Date(year, term.month - 1, term.day)
}

/**
 * 计算"从 today 开始，下一个节气是谁、还有多少天"。
 * 这是一个纯函数（输入相同 → 输出相同，没有副作用），因此非常适合放进 computed。
 */
export function getNextTerm(today = new Date()) {
  const year = today.getFullYear()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  // 把今年和明年的节气都排出来，再找出第一个"大于等于今天"的
  const candidates = []
  for (const y of [year, year + 1]) {
    for (const term of TERMS) {
      const d = termDate(term, y)
      if (d >= start) candidates.push({ term, date: d })
    }
  }
  candidates.sort((a, b) => a.date - b.date)

  const next = candidates[0]
  const diffDays = Math.round((next.date - start) / 86400000)
  return { ...next, diffDays, year: next.date.getFullYear() }
}

/**
 * 返回当前所处的节气（已经到来的最近一个节气）。
 */
export function getCurrentTerm(today = new Date()) {
  const year = today.getFullYear()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const candidates = []
  for (const y of [year - 1, year]) {
    for (const term of TERMS) {
      const d = termDate(term, y)
      if (d <= start) candidates.push({ term, date: d })
    }
  }
  candidates.sort((a, b) => b.date - a.date)
  return candidates[0]
}

/** 格式化日期为 2026年2月4日 */
export function formatDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}