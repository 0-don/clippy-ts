const fs = require('fs');
const path = require('path');

// (context) => void
exports.default = () => {
  const binaryLocations = './node_modules/.prisma/client';

  const binaries = [
    { filename: 'query_engine-windows.dll.node', os: 'win' },
    { filename: 'libquery_engine-darwin.dylib.node', os: 'mac' },
    { filename: 'libquery_engine-debian-openssl-1.1.x.so.node', os: 'linux' },
  ];

  binaries.forEach(({ filename, os }) => {
    const binSourceLocation = `${binaryLocations}/${filename}`;
    const binDestLocation = `${binaryLocations}/${os}/${filename}`;

    if (!fs.existsSync(path.dirname(binDestLocation))) {
      fs.mkdirSync(path.dirname(binDestLocation));

      fs.copyFileSync(binSourceLocation, binDestLocation);
    }
  });
};
