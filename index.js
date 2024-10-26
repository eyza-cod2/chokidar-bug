const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

async function main() {
    let watcher;
    try {
        const rootFolder = path.join(__dirname, 'TEST_FOLDER');
        
        if (fs.existsSync(rootFolder)) {
            fs.rmSync(rootFolder, { recursive: true });
        }

        // Create the directory structure
        fs.mkdirSync(rootFolder);
        fs.mkdirSync(path.join(rootFolder, 'folder1'));
        fs.mkdirSync(path.join(rootFolder, 'folder2'));
        fs.mkdirSync(path.join(rootFolder, 'folder2', 'subfolder'));


        watcher = chokidar.watch(rootFolder, { persistent: true });

        watcher.on('all', (event, path) => {
            console.log(event, path);
        });

        // Delay to ensure watcher is ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Rename folder1 - it is ok
        fs.renameSync(path.join(rootFolder, 'folder1'), path.join(rootFolder, 'folder1_renamed'));

        await new Promise(resolve => setTimeout(resolve, 500));

        // Rename folder2 with subfolder - IT THROW ERROR!
        fs.renameSync(path.join(rootFolder, 'folder2'), path.join(rootFolder, 'folder2_renamed'));

        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error(`Error: ${error.message}`);
        
    } finally {
        // Close the watcher in the finally block if it exists
        if (watcher) {
            await watcher.close();
            console.log('Watcher closed');
        }
    }
}

main();
