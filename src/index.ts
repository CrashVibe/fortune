import { Awaitable, Context, Schema, Service } from "koishi";
import { applyModel } from "./model";
import { get_user_fortune_display, get_user_luck_star } from "./data_source";

export const name = "fortune";

declare module "koishi" {
    interface Context {
        fortune: Fortune;
    }
}

/**
 * 运势服务类，提供运势相关的功能
 *
 * API 接口
 */
class Fortune extends Service {
    static inject = ["database"];
    ctx: Context;
    config: Fortune.Config;
    constructor(ctx: Context, config: Fortune.Config) {
        super(ctx, "fortune", true);
        this.ctx = ctx;
        this.config = config;
        applyModel(ctx);
    }

    start(): Awaitable<void> {
        this.ctx
            .command("运势", "获取今日运势 (每天刷新)")
            .alias("今日运势")
            .action(async ({ session }) => {
                if (!session || !session.userId) {
                    this.ctx.logger.warn("运势命令需要用户上下文，无法获取用户ID。");
                    return "出现一点错误，请稍后再试";
                }
                const result = await get_user_fortune_display(this.ctx, this.config, session.userId);
                return result ?? "未能获取到今日运势。";
            });
    }

    public async get_user_luck_star(userId: string) {
        return await get_user_luck_star(this.ctx, userId);
    }
}
namespace Fortune {
    export interface Config {
        timezone: string;
    }

    export const Config: Schema<Config> = Schema.object({
        timezone: Schema.string().default("Asia/Shanghai")
    });
}
export default Fortune;
