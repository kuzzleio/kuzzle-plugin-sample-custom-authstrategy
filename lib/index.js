/**
 * @class AuthenticationPlugin
 */
class AuthenticationPlugin {
  /**
   * @constructor
   */
  constructor () {
    // @TODO: initial class attributes
  }

  /**
   * @param {object} customConfig
   * @param {KuzzlePluginContext} context
   * @returns {Promise<*>}
   */
  init (customConfig, context) {
    /*
    @TODO:
      - init config and context
      - init plugin repository
      - init plugin strategiy
    */
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} ssoid
   * @returns {Promise<string|{message: string}>}
   */
  async verify (request, ssoid) {
    // @TODO: `verify` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#verify )
  }

  /**
   * @param {KuzzleRequest} request
   * @param {object} credentials
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async create (request, credentials, kuid) {
    // @TODO: `create` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#create )
  }

  /**
   * @param {KuzzleRequest} request
   * @param {object} credentials
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async update (request, credentials, kuid) {
    // @TODO: `create` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#update )
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async delete (request, kuid) {
    // @TODO: `delete` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#delete )
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} kuid
   * @returns {Promise<boolean>}
   */
  async exists (request, kuid) {
    // @TODO: `exists` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#exists )
  }

  /**
   * @param {KuzzleRequest} request
   * @param {object} credentials
   * @param {string} kuid
   * @param {string} strategy
   * @param {boolean} isUpdate
   * @returns {Promise<boolean>}
   */
  async validate (request, credentials, kuid, strategy, isUpdate) {
    // @TODO: `validate` method (see https://docs.kuzzle.io/core/1/plugins/guides/strategies/auth-functions/#validate )
  }
}

module.exports = AuthenticationPlugin;
