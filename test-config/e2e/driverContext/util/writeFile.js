const fs = require('node:fs');
const { mkdir } = require('node:fs/promises');
const path = require('node:path');

async function writeFile(filePath, data) {
    const dirpath = path.dirname(filePath);
    await mkdir(dirpath, { recursive: true });

    fs.writeFile(path.resolve(filePath), data, err => {
        if (err) {
            console.error(err);
        } else {
            // done!
        }
    });
}
exports.writeFile = writeFile;
