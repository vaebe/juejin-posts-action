import * as __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__ from "@actions/core";
const ASSETS_PATH = 'https://raw.githubusercontent.com/vaebe/juejin-posts-action/main/assets/';
function getAssetUrl(asset) {
    return ASSETS_PATH + asset;
}
function getTimeDiffString(timestamp) {
    const now = Date.now();
    const time = 'string' == typeof timestamp ? 1000 * Number(timestamp) : 1000 * timestamp;
    const diff = now - time;
    const units = [
        {
            label: '年',
            millis: 31536000000
        },
        {
            label: '个月',
            millis: 2592000000
        },
        {
            label: '天',
            millis: 86400000
        },
        {
            label: '小时',
            millis: 3600000
        },
        {
            label: '分钟',
            millis: 60000
        }
    ];
    for (const { label, millis } of units){
        const value = Math.floor(diff / millis);
        if (value > 0) return `${value}${label}前`;
    }
    return '刚刚';
}
async function getJuejinList(user_id) {
    try {
        const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                sort_type: 2,
                cursor: '0'
            })
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const { data } = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid response format');
        return data.map(({ article_info })=>({
                title: article_info.title,
                publish_time: article_info.ctime,
                link: `https://juejin.cn/post/${article_info.article_id}`,
                star: Number(article_info.digg_count),
                collect: Number(article_info.collect_count)
            }));
    } catch (error) {
        console.error('Error fetching Juejin list:', error);
        return [];
    }
}
async function main() {
    try {
        const USER_ID = __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.getInput('user_id');
        if (!USER_ID) throw new Error('User ID is required');
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info('1. 获取页面数据...');
        const commonPosts = await getJuejinList(USER_ID);
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info('2. 生成 HTML...');
        const platformSvgUrl = getAssetUrl('juejin.svg');
        const reduceText = commonPosts.map(({ title, publish_time, link, star, collect })=>{
            const time = getTimeDiffString(publish_time);
            return `[${time} 👍：${star} ${collect ? `⭐：${collect}` : ''}] [${title}](${link})`;
        }).join('\n\n');
        const appendHtml = `## 掘金文章 <img src='${platformSvgUrl}' alt='juejin' width='20' height='20'/>\n\n${reduceText}`;
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info('3. 读取 README...');
        const README_PATH = './README.md';
        const readmeContent = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.readFileSync(README_PATH, 'utf-8');
        const updatedContent = readmeContent.replace(/(?<=<!-- juejin-posts start -->)[\s\S]*?(?=<!-- juejin-posts end -->)/, `\n${appendHtml}\n`);
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info('4. 修改 README...');
        __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.writeFileSync(README_PATH, updatedContent);
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info('5. 修改结果:');
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.info(updatedContent);
    } catch (error) {
        __WEBPACK_EXTERNAL_MODULE__actions_core_28c3e8e8__.setFailed(error.message);
    }
}
main();
