**Bug description**

Renaming a folder which has subfolders throws exception on Windows.

 - Chokidar version [4.0.1]
 - Node version [18, 20, 22]
 - OS version: [Windows 11]

**To Reproduce:**

Create following folder structure:
TEST_FOLDER\folder1
TEST_FOLDER\folder2
TEST_FOLDER\folder2\subfolder

Setup chokidar to watch folder 'TEST_FOLDER'

Rename folder "folder2" to "folder2_renamed"

Exception is thrown:
````
Error: EPERM: operation not permitted, rename 'C:\Users\tomas\chokidar-bug\TEST_FOLDER\folder2' -> 'C:\Users\tomas\chokidar-bug\TEST_FOLDER\folder2_renamed'
    at Object.renameSync (node:fs:1030:11)
    at renameFolders (C:\Users\tomas\chokidar-bug\index.js:50:8)
    at async main (C:\Users\tomas\chokidar-bug\index.js:18:9) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'rename',
  path: 'C:\\Users\\tomas\\chokidar-bug\\TEST_FOLDER\\folder2',
  dest: 'C:\\Users\\tomas\\chokidar-bug\\TEST_FOLDER\\folder2_renamed'
}
````

Test code:

```js
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const rootFolder = path.join(__dirname, 'TEST_FOLDER');

async function main() {
    let watcher;
    try {
        prepareFolderStructure();

        watcher = chokidar.watch(rootFolder, { persistent: true });

        watcher.on('all', (event, path) => {
            console.log(event, path);
        });

        await renameFolders();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;

    } finally {
        if (watcher) {
            await watcher.close();
            console.log('Watcher closed');
        }
    }
}

function prepareFolderStructure() {    
    if (fs.existsSync(rootFolder)) {
        fs.rmSync(rootFolder, { recursive: true });
    }
    // Create the directory structure
    fs.mkdirSync(rootFolder);
    fs.mkdirSync(path.join(rootFolder, 'folder1'));
    fs.mkdirSync(path.join(rootFolder, 'folder2'));
    fs.mkdirSync(path.join(rootFolder, 'folder2', 'subfolder'));
}

async function renameFolders() {
    await new Promise(resolve => setTimeout(resolve, 500));

    fs.renameSync(path.join(rootFolder, 'folder1'), path.join(rootFolder, 'folder1_renamed')); // Rename folder1 - OK

    await new Promise(resolve => setTimeout(resolve, 500));

    fs.renameSync(path.join(rootFolder, 'folder2'), path.join(rootFolder, 'folder2_renamed')); // Rename folder2 with subfolder - IT THROWS AN ERROR!

    await new Promise(resolve => setTimeout(resolve, 500));
}


main();
```

**Expected behavior**
No exception, like it is on linux / macos

**Additional context**
CI:
![image](https://github.com/user-attachments/assets/ba48be0b-a1fe-4b17-a6f5-c078e8c32f8a)

Repo:
https://github.com/eyza-cod2/chokidar-bug
