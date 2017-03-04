"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("magnet-core/module");
const redis = require("redis");
const _promise = require("bluebird");
const redis_1 = require("./config/redis");
_promise.promisifyAll(redis.RedisClient.prototype);
_promise.promisifyAll(redis.Multi.prototype);
class Redis extends module_1.Module {
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.prepareConfig('redis', redis_1.default);
            // Any cleaner way? Adding this because of
            // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
            this.app.redisFactory = function () {
                return redis.createClient(config);
            };
            this.app.redis = this.app.redisFactory();
            this.app.redis.on('error', (err) => {
                this.log.error(err);
                // assert(err instanceof Error);
                // assert(err instanceof redis.AbortError);
                // assert(err instanceof redis.AggregateError);
                // assert.strictEqual(err.errors.length, 2); // The set and get got aggregated in here
                // assert.strictEqual(err.code, 'NR_CLOSED');
            });
        });
    }
    teardown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.redis.quit();
        });
    }
}
exports.default = Redis;
//# sourceMappingURL=index.js.map