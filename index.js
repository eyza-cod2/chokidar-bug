const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Define the root folder path
        const rootFolder = path.join(__dirname, 'TEST_FOLDER');
        
        // Remove the directory if it already exists
        if (fs.existsSync(rootFolder)) {
            fs.rmSync(rootFolder, { recursive: true });
        }

        // Recreate the directory structure
        fs.mkdirSync(rootFolder);
        fs.mkdirSync(path.join(rootFolder, 'folder1'));
        fs.mkdirSync(path.join(rootFolder, 'folder2'));
        fs.mkdirSync(path.join(rootFolder, 'folder2', 'subfolder'));

        // Initialize watcher
        const watcher = chokidar.watch(rootFolder, { persistent: true });

        // Set up event logging for all events
        watcher.on('all', (event, path) => {
            console.log(event, path);
        });

        // Delay to ensure watcher is ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Rename folder1 and log events
        fs.renameSync(path.join(rootFolder, 'folder1'), path.join(rootFolder, 'folder1_renamed'));

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Rename folder2 and log events
        fs.renameSync(path.join(rootFolder, 'folder2'), path.join(rootFolder, 'folder2_renamed'));

        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        // Close the watcher
        if (watcher) {
            await watcher.close();
            console.log('Watcher closed');
        }
    }
}

main();
