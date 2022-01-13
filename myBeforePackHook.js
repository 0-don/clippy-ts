const fs = require('fs');
const { log } = require('console');

exports.default = (context) => {
  log('################');
  log('################');
  log('################');
  log('################');
  fs.copyFileSync(
    './node_modules/.prisma/client/query_engine-windows.dll.node',
    './platforms/win32/query_engine-windows.dll.node'
  );
  fs.copyFileSync(
    './node_modules/.prisma/client/libquery_engine-darwin.dylib.node',
    './platforms/darwin/libquery_engine-darwin.dylib.node'
  );
  fs.copyFileSync(
    './node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node',
    './platforms/linux/libquery_engine-debian-openssl-1.1.x.so.node'
  );
  log(context);
  // your custom code
  log('################');
};
