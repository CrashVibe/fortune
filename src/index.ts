import { Context, Schema } from 'koishi';
import applyModel from './model';
import { get_user_fortune_display } from './data_source';

export const name = 'fortune';

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export async function apply(ctx: Context) {
    await applyModel(ctx);
    ctx.command('运势')
        .alias('今日运势')
        .action(async ({ session }) => {
            if (!session || !session.userId) {
                console.warn('运势命令需要用户上下文，无法获取用户ID。');
                return '出现一点错误，请稍后再试';
            }
            const result = await get_user_fortune_display(ctx, session.userId);
            return result ?? '未能获取到今日运势。';
        });
}
