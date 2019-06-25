const
  MyCustomSSOStrategy = require('./passportStrategy'),
  defaultConfig = {},
  storageMapping = {
    ssousers: {
      properties: {
        kuid: {
          type: 'keyword'
        },
        ssoid: {
          type: 'keyword'
        }
      }
    }
  };

/**
 * @class AuthenticationPlugin
 */
class AuthenticationPlugin {
  /**
   * @constructor
   */
  constructor () {
    this.context = null;
    this.config = null;
    this.strategy = null;
    this.repository = null;
    this.authenticators = {MyCustomSSOStrategy};
  }

  /**
   * @param {object} customConfig
   * @param {KuzzlePluginContext} context
   * @returns {Promise<*>}
   */
  init (customConfig, context) {
    this.config = Object.assign(defaultConfig, customConfig);
    this.context = context;

    this.repository = new this.context.constructors.Repository('ssousers');

    this.strategies = {
      mycustomsso: {
        config: {
          authenticator: 'MyCustomSSOStrategy'
        },
        methods: {
          create: 'create',
          delete: 'delete',
          exists: 'exists',
          update: 'update',
          validate: 'validate',
          verify: 'verify'
        }
      }
    };

    return this.context.accessors.storage.bootstrap(storageMapping)
      .then(() => true);
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} ssoid
   * @returns {Promise<string|{message: string}>}
   */
  async verify (request, ssoid) {
    const ssoUser = await this._get(ssoid);

    // credentials found => return related kuid
    if (ssoUser) {
      return {kuid: ssoUser.kuid};
    }

    // credentials not found => authentication failed
    return false;
  }

  /**
   * @param {KuzzleRequest} request
   * @param {object} credentials
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async create (request, credentials, kuid) {
    if (!credentials.ssoid) {
      throw new this.context.errors.BadRequestError('"ssoid" field needed.');
    }

    const doesUserExist = await this.exists(request, kuid);
    if (doesUserExist) {
      throw new this.context.errors.PreconditionError(`A strategy already exists for user "${kuid}".`);
    }
    const ssoUser = await this.repository.create({
      _id: credentials.ssoid,
      kuid
    }, {refresh: 'wait_for'});
    return {ssoid: ssoUser._id, kuid: ssoUser.kuid};
  }

  /**
   * @param {KuzzleRequest} request
   * @param {object} credentials
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async update (request, credentials, kuid) {
    if (credentials.kuid) {
      throw new this.context.errors.BadRequestError('The request must not contain a kuid attribute.');
    }

    const foundUser = await this._fetchFromKuid(kuid);
    if (foundUser === null) {
      throw new this.context.errors.PreconditionError(`A strategy does not exist for user "${kuid}".`);
    }

    const ssoUser = {ssoid: credentials.ssoid, kuid};

    // same ssoid => no changes to do:
    if (foundUser._id === ssoUser.ssoid) {
      return ssoUser;
    }

    // To change the ssoid, we have to create a new (complete) document and remove the old one
    const newUser = {_id: ssoUser.ssoid, kuid: ssoUser.kuid};
    await this.repository.create(newUser);
    await this.repository.delete(foundUser._id);

    return ssoUser;
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async delete (request, kuid) {
    const ssoUser = await this._fetchFromKuid(kuid);
    if (ssoUser === null) {
      throw new this.context.errors.PreconditionError(`A strategy does not exist for user "${kuid}".`);
    }

    return await this.repository.delete(ssoUser._id, {refresh: 'wait_for'});
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} kuid
   * @returns {Promise<boolean>}
   */
  async exists (request, kuid) {
    const credentials = await this._fetchFromKuid(kuid);
    return (credentials !== null);
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

  /***** PRIVATE METHODS *****/

  /**
   * @param {string} id
   * @returns {Promise<object>}
   */
  async _get(id) {
    try {
      return await this.repository.get(id);
    } catch (err) {
      if (err instanceof this.context.errors.NotFoundError) {
        return null;
      }
      throw err;
    }
  }


  /**
   *
   * @param {string} kuid
   * @returns {Promise<object>}
   */
  async _fetchFromKuid (kuid) {
    const result = await this.repository.search({
      query: {
        match: {
          kuid
        }
      }
    });

    if (result.total === 0) {
      return null;
    }

    return result.hits[0];
  }
}

module.exports = AuthenticationPlugin;
