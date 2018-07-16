const soap = require('soap');

const removeNullAndUndefined = (obj) => {
  if (obj || typeof obj === 'object') {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
  }
  return obj;
};

module.exports = (wsdl, options = {}) => {
  const getClient = async () => new Promise((resolve, reject) => {
    soap.createClient(wsdl, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
  let client = null;
  const target = {wsdl, options};
  const handler = {
    get: (target, prop) => {
      if (typeof target[prop] !== 'undefined') {
        return target[prop];
      }
      switch (prop) {
        case 'toJSON':
          return undefined;
        default:
          return async (paramObject = {}, ...args) => {
            if (!client) {
              client = await getClient();
              target.lastRequest = client.lastRequest;
            }
            if (client[prop + 'Async']) {
              const result = await client[prop + 'Async'](removeNullAndUndefined(paramObject), ...args);
              return ((result[0] || {}).return || null);
            }
            if (client[prop]) {
              return client[prop](...args);
            }
            return null;
          };
      }
    }
  };

  return new Proxy(target, handler);
};
