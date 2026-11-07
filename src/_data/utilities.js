/**
 * 时间轴数据工具。
 *
 * 现代浏览器与 Node 都内置 Intl，不再需要 moment.js；
 * 日期统一按 Asia/Shanghai（UTC+8）解析与展示。
 */

const CATEGORY_META = {
  里程碑: { color: 'gold', icon: 'award' },
  直播: { color: 'pink', icon: 'mic' },
  作品: { color: 'blue', icon: 'music' },
  生日与周年: { color: 'rose', icon: 'cake' },
  '3D': { color: 'violet', icon: 'cube' },
  联动: { color: 'mint', icon: 'users' },
  周边: { color: 'amber', icon: 'bag' },
};

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Shanghai',
});

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai',
});

const stripHtml = (html) =>
  String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toDate = (date, time = '00:00') => new Date(`${date}T${time}:00+08:00`);

const formatDate = (date) => dateFormatter.format(toDate(date));

const formatDateTime = (date, time) =>
  `${dateFormatter.format(toDate(date, time))} ${timeFormatter.format(toDate(date, time))}`;

const isWrappedInParagraphTags = (html) =>
  typeof html === 'string' && html.trimStart().startsWith('<p>');

const decorateEntries = (entries) =>
  entries.map((entry, index) => {
    const primaryCategory = entry.categories?.[0] ?? '里程碑';
    const meta = CATEGORY_META[primaryCategory] ?? CATEGORY_META['里程碑'];
    const time = entry.time ?? null;

    return {
      ...entry,
      index,
      side: index % 2 === 0 ? 'left' : 'right',
      year: entry.date.slice(0, 4),
      iso: `${entry.date}T${time ?? '00:00'}:00+08:00`,
      color: entry.color ?? meta.color,
      icon: entry.icon ?? meta.icon,
      dateLabel: formatDate(entry.date),
      timeLabel: time,
      categoryTags: (entry.categories ?? []).map((name) => ({
        name,
        color: (CATEGORY_META[name] ?? CATEGORY_META['里程碑']).color,
      })),
      categoriesString: (entry.categories ?? []).join(','),
      searchText: stripHtml(
        `${(entry.categories ?? []).join(' ')} ${entry.title} ${entry.body}`,
      ).toLowerCase(),
      isUpcoming: entry.status === 'upcoming',
    };
  });

const buildFilters = (entries) =>
  Object.keys(CATEGORY_META)
    .map((name) => ({
      name,
      ...CATEGORY_META[name],
      count: entries.filter((entry) => entry.categories?.includes(name)).length,
    }))
    .filter((filter) => filter.count > 0);

const groupByYear = (entries) => {
  const groups = new Map();

  for (const entry of entries) {
    if (!groups.has(entry.year)) {
      groups.set(entry.year, []);
    }
    groups.get(entry.year).push(entry);
  }

  return [...groups].map(([year, items]) => ({ year, entries: items }));
};

export default {
  formatDate,
  formatDateTime,
  groupByYear,
  buildFilters,
  decorateEntries,
  isWrappedInParagraphTags,
  stripHtml,
};
