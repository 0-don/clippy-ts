const fs = require('fs');
const path = require('path');

// (context) => void
exports.default = () => {
  const binariesLocation = './node_modules/@prisma/engines/';

  const binaries = [
    {
      migration: `migration-engine-windows.exe`,
      query: `query_engine-windows.dll.node`,
      os: 'win',
    },
    {
      migration: `migration-engine-darwin`,
      query: `libquery_engine-darwin.dylib.node`,
      os: 'mac',
    },
    {
      migration: `migration-engine-debian-openssl-1.1.x`,
      query: `libquery_engine-debian-openssl-1.1.x.so.node`,
      os: 'linux',
    },
  ];

  binaries.forEach(({ migration, os, query }) => {
    const dest = path.join('./node_modules/.prisma/client/', os);
    const queryDest = path.join(binariesLocation, query);
    const migrationDest = path.join(binariesLocation, migration);

    if (!fs.existsSync(dest)) fs.mkdirSync(dest);

    fs.copyFileSync(query, queryDest);
    fs.copyFileSync(migration, migrationDest);
  });
};
