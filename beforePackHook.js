const fs = require('fs');
const path = require('path');

function copyBinaries() {
  const binaries = [
    {
      migration: `migration-engine-windows.exe`,
      query: `query_engine-windows.dll.node`,
      os: 'win',
    },
    {
      migration: `migration-engine-debian-openssl-1.1.x`,
      query: `libquery_engine-debian-openssl-1.1.x.so.node`,
      os: 'linux',
    },
    {
      migration: `migration-engine-darwin`,
      query: `libquery_engine-darwin.dylib.node`,
      os: 'mac',
    },
  ];

  const source = './node_modules/@prisma/engines/';

  binaries.forEach(({ migration, os, query }) => {
    const dest = path.join('./node_modules/.prisma/client/', os);

    if (!fs.existsSync(dest)) fs.mkdirSync(dest);

    fs.copyFileSync(path.join(source, query), path.join(dest, query));
    fs.copyFileSync(path.join(source, migration), path.join(dest, migration));
  });
}

copyBinaries();
