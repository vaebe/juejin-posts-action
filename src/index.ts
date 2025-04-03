import * as fs from 'node:fs';
import * as core from '@actions/core';
import { getAssetUrl, getJuejinList, getTimeDiffString } from './utils';

async function main(): Promise<void> {
  try {
    // 读取参数: 用户 ID
    const USER_ID = core.getInput('user_id');
    if (!USER_ID) throw new Error('User ID is required');

    core.info('1. 获取页面数据...');
    const commonPosts = await getJuejinList(USER_ID);

    core.info('2. 生成 HTML...');
    const platformSvgUrl = getAssetUrl('juejin.svg');
    const reduceText = commonPosts
      .map(({ title, publish_time, link, star, collect }) => {
        const time = getTimeDiffString(publish_time);
        return `[${title} 👍：${star} ${collect ? `⭐：${collect}` : ''}](${link}) ${time}`;
      })
      .join('\n\n');

    const appendHtml = `## 掘金文章 <img src='${platformSvgUrl}' alt='juejin' width='20' height='20'/>\n\n${reduceText}`;

    core.info('3. 读取 README...');
    const README_PATH = './README.md';
    const readmeContent = fs.readFileSync(README_PATH, 'utf-8');
    const updatedContent = readmeContent.replace(
      /(?<=<!-- juejin-posts start -->)[\s\S]*?(?=<!-- juejin-posts end -->)/,
      `\n${appendHtml}\n`,
    );

    core.info('4. 修改 README...');
    fs.writeFileSync(README_PATH, updatedContent);

    core.info('5. 修改结果:');
    core.info(updatedContent);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

main();
