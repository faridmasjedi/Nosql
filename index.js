const fs = require('graceful-fs');        

class CreateFolderAndFile {
    createAFolder = (path) => {
        let dir = `${path}`;
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {
            recursive: true
          })
          return dir;
        } else {
          throw new Error(`\n-----------\n"${dir}" is existed already!!!\n---------------\n`);
        }
    }
      
    makeAFile = (path, fileType, data) => {
        fs.appendFileSync(`./${path}.${fileType}`, data, (err) => {
        if (err) throw 'appending error: ' + err;
        })
    }

    getAllFilesFromDir = (path) => {
        try {
            return fs.readdirSync(path);
        }catch(e){
            throw new Error (`\n"${path}" does not exist.\n`)
        }
        
    }

    findTheProperFolder = (path, fileName) => {
        let files = this.getAllFilesFromDir(path);
        let result = files.find(file => {
          return file.includes(fileName)
        })
    
        if (result) {
          return result;
        }else{
          return `\n"${fileName}" is not existed.\n`;
        }
    }

    findTheProperFile = (folderToSearch, fileContentToSearch) => {
        const files = this.getAllFilesFromDir(folderToSearch);
    
        let fileToSearch = folderToSearch+'/';
        fileToSearch += files.find( file => {
        let data = fs.readFileSync(folderToSearch+'/' + file, 'utf-8');
        data = data.toString();
        let condition = data.includes(fileContentToSearch);
        return condition;
        })
        return fileToSearch.includes('undefined') ? `\nNo file contain "${fileContentToSearch}".\n` : fileToSearch;
    }

}


let createFolderAndFile = new CreateFolderAndFile();
createFolderAndFile.createAFolder('./newFolder');

let files;
console.log('\n\n-----\n\n');
setTimeout(() => createFolderAndFile.makeAFile('./newFolder/newFile', 'txt' , '----Just a testing text----'), 400);

setTimeout(() => {
    files = createFolderAndFile.getAllFilesFromDir('./newFolder');
    console.log(files)
    console.log('\n\n-----\n\n');
}, 400);

setTimeout(() => {
    let folder = createFolderAndFile.findTheProperFolder('./newFolder', 'newFile');
    console.log(folder);
    console.log('\n\n-----\n\n');

    folder = createFolderAndFile.findTheProperFolder('./newFolder', 'NotExisted');
    console.log(folder);
    console.log('\n\n-----\n\n');

}, 400);

setTimeout(() => {
    let file = createFolderAndFile.findTheProperFile('./newFolder', 'Just a testing text');
    console.log(file);
    console.log('\n\n-----\n\n');

    file = createFolderAndFile.findTheProperFile('./newFolder', 'Error');
    console.log(file);
    console.log('\n\n-----\n\n');

    file = createFolderAndFile.findTheProperFile('./noFolder', 'Just a testing text');
    console.log(file);
    console.log('\n\n-----\n\n');

}, 400)
