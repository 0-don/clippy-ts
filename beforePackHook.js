const fs = require('fs');
const path = require('path');

// (context) => void
exports.default = () => {
  const migrationBinaryLocations = './node_modules/@prisma/engines/';
  const queryBinaryLocations = './node_modules/.prisma/client/';

  const binaries = [
    {
      migration: `${migrationBinaryLocations}migration-engine-windows.exe`,
      query: `${queryBinaryLocations}query_engine-windows.dll.node`,
      os: 'win',
    },
    {
      migration: `${migrationBinaryLocations}migration-engine-darwin`,
      query: `${queryBinaryLocations}libquery_engine-darwin.dylib.node`,
      os: 'mac',
    },
    {
      migration: `${migrationBinaryLocations}migration-engine-rhel-openssl-1.1.x`,
      query: `${queryBinaryLocations}libquery_engine-debian-openssl-1.1.x.so.node`,
      os: 'linux',
    },
  ];

  binaries.forEach(({ migration, os, query }) => {
    const dest = path.join(queryBinaryLocations, os);
    const queryDest = path.join(dest, path.basename(query));
    const migrationDest = path.join(dest, path.basename(migration));

    if (!fs.existsSync(dest)) fs.mkdirSync(dest);

    fs.copyFileSync(query, queryDest);
    fs.copyFileSync(migration, migrationDest);
  });
};
