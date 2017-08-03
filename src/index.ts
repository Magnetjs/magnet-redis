import { Module } from 'magnet-core/module'
import * as redis from 'redis'
import * as _promise from 'bluebird'

_promise.promisifyAll(redis.RedisClient.prototype)
_promise.promisifyAll(redis.Multi.prototype)

export default class MagnetRedis extends Module {
  init () {
    this.moduleName = 'redis'
    this.defaultConfig = __dirname
  }

  async setup () {
    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.redisFactory = () => {
      return redis.createClient(this.config)
    }
    this.insert(this.app.redisFactory())
    this.app.redis.on('error', (err) => {
      this.log.error(err)
    })
  }

  async teardown () {
    this.app.redis.quit()
  }
}
