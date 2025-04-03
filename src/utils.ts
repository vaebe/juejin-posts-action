import type { CommonPost, JuejinArticleInfo } from './type';

const ASSETS_PATH =
  'https://raw.githubusercontent.com/vaebe/juejin-posts-action/main/assets/';

export function getAssetUrl(asset: string): string {
  return ASSETS_PATH + asset;
}

export function getTimeDiffString(timestamp: number | string): string {
  const now = Date.now();
  const time =
    typeof timestamp === 'string' ? Number(timestamp) * 1000 : timestamp * 1000;
  const diff = now - time;

  const units = [
    { label: '年', millis: 365 * 24 * 60 * 60 * 1000 },
    { label: '个月', millis: 30 * 24 * 60 * 60 * 1000 },
    { label: '天', millis: 24 * 60 * 60 * 1000 },
    { label: '小时', millis: 60 * 60 * 1000 },
    { label: '分钟', millis: 60 * 1000 },
  ];

  for (const { label, millis } of units) {
    const value = Math.floor(diff / millis);
    if (value > 0) return `${value}${label}前`;
  }

  return '刚刚';
}

export async function getJuejinList(user_id: string): Promise<CommonPost[]> {
  try {
    const res = await fetch(
      'https://api.juejin.cn/content_api/v1/article/query_list',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, sort_type: 2, cursor: '0' }),
      },
    );

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const { data } = (await res.json()) as {
      data: { article_info: JuejinArticleInfo[] };
    };

    if (!Array.isArray(data)) throw new Error('Invalid response format');

    return data.map(
      ({ article_info }: { article_info: JuejinArticleInfo }) => ({
        title: article_info.title,
        publish_time: article_info.ctime,
        link: `https://juejin.cn/post/${article_info.article_id}`,
        star: Number(article_info.digg_count),
        collect: Number(article_info.collect_count),
      }),
    ) as CommonPost[];
  } catch (error) {
    console.error('Error fetching Juejin list:', error);
    return [];
  }
}
