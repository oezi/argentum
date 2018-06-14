const strongSoap = require('strong-soap');

module.exports = async (wsdl, options = {}) => {
  const client = await new Promise((resolve, reject) => {
    strongSoap.soap.createClient(wsdl, options, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });

  const functions = {};
  const r = (d) => {
    Object.keys(d).forEach((k) => {
      if (d[k] && d[k].name && d[k].soapVersion) {
        functions[k] = true;
      } else {
        r(d[k]);
      }
    });
  };
  r(client.describe());

  client.argentumSoapClient = {wsdl};

  const removeNullAndUndefined = (obj) => {
    if (obj || typeof obj === 'object') {
      Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
    }
    return obj;
  };

  const handler = {
    get: (target, prop) => {
      // TODO: richtig prüfen, ob das auch ne SOAP-Function ist, und nicht nur "toString" oder sowas...
      if (typeof client[prop] === 'function' && functions[prop]) {
        return async (args) => (await client[prop](removeNullAndUndefined(args))).result.return;
      }
      return client[prop];
    }
  };
  return () => new Proxy({argentumSoapClient: null}, handler);
};
