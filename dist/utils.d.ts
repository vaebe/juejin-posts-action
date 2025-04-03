import type { CommonPost } from './type';
export declare function getAssetUrl(asset: string): string;
export declare function getTimeDiffString(timestamp: number | string): string;
export declare function getJuejinList(user_id: string): Promise<CommonPost[]>;
