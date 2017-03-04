import { Module } from 'magnet-core/module'
import * as redis from 'redis'
import * as _promise from 'bluebird'

import defaultConfig from './config/redis'

_promise.promisifyAll(redis.RedisClient.prototype)
_promise.promisifyAll(redis.Multi.prototype)

export default class Redis extends Module {
  async setup () {
    const config = this.prepareConfig('redis', defaultConfig)

    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.redisFactory = function () {
      return redis.createClient(config)
    }
    this.app.redis = this.app.redisFactory()
    this.app.redis.on('error', (err) => {
      this.log.error(err)
      // assert(err instanceof Error);
      // assert(err instanceof redis.AbortError);
      // assert(err instanceof redis.AggregateError);
      // assert.strictEqual(err.errors.length, 2); // The set and get got aggregated in here
      // assert.strictEqual(err.code, 'NR_CLOSED');
    })
  }

  async teardown () {
    this.app.redis.quit()
  }
}
