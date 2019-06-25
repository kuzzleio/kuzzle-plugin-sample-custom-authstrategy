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
    const ssoid = req.query.ssoid || req.body.ssoid; // @TODO: put here your own business logic to fetch the good ssoid

    if (!ssoid) {
      return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    try {
      this._verify(req, ssoid, (err, user, info) => {
        if (err) { return this.error(err); }
        if (!user) { return this.fail(info); }
        this.success(user, info);
      });
    } catch (err) {
      this.error(err);
    }
  }
}

module.exports = MyCustomSSOStrategy;
