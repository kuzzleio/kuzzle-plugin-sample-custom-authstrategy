const
  PassportStrategy = require('passport-strategy');

class MyCustomSSOStrategy extends PassportStrategy {
  constructor(options, verify) {
    super();
    if (!verify || typeof verify !== 'function') { throw new TypeError('LocalStrategy requires a verify callback'); }

    this.name = 'mycustomsso';
    this._verify = verify;
  }

  authenticate (req, options) {
    // @TODO: Passport Authenticate method
  }
}

module.exports = MyCustomSSOStrategy;
