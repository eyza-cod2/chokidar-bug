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