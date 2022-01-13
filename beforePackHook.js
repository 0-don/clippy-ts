const fs = require('fs');
const path = require('path');

// (context) => void
exports.default = () => {
  const quueryBinaryLocations = './node_modules/.prisma/client';

  const queryBinaries = [
    { filename: 'query_engine-windows.dll.node', os: 'win' },
    { filename: 'libquery_engine-darwin.dylib.node', os: 'mac' },
    { filename: 'libquery_engine-debian-openssl-1.1.x.so.node', os: 'linux' },
  ];

  queryBinaries.forEach(({ filename, os }) => {
    const binSourceLocation = `${quueryBinaryLocations}/${filename}`;
    const binDestLocation = `${quueryBinaryLocations}/${os}/${filename}`;

    if (!fs.existsSync(path.dirname(binDestLocation)))
      fs.mkdirSync(path.dirname(binDestLocation));

    fs.copyFileSync(binSourceLocation, binDestLocation);
  });

  // const migrationBinaries = [
  //   {
  //     gzName: 'migration-engine.exe.gz',
  //     filename: 'migration-engine.exe',
  //     url: 'https://binaries.prisma.sh/2.1.x/latest/windows/migration-engine.exe.gz',
  //     os: 'win',
  //   },
  //   {
  //     gzName: 'migration-engine.exe.gz',
  //     filename: 'migration-engine',
  //     url: 'https://binaries.prisma.sh/2.10.x/2b17eeb22ae07bb9df44af54cb39f2db709b6a84/darwin/migration-engine.gz',
  //     os: 'mac',
  //   },
  //   {
  //     gzName: 'migration-engine.exe.gz',
  //     filename: 'migration-engine.exe',
  //     url: 'https://binaries.prisma.sh/2.1.x/latest/darwin/migration-engine.gz',
  //     os: 'linux',
  //   },
  // ];
};
