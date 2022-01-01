const fs = require('graceful-fs');        

class CreateFolderAndFile {
    createAFolder = (path) => {
        let dir = `${path}`;
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {
            recursive: true
          })
        } else {
        //   throw new Error(`\n-----------\n"${dir}" is existed already!!!\n---------------\n`);
            console.log(`the ${dir} database is already exist.`)
        }
        return dir;
    }
      
    makeAFile = (path, filename, fileType, data) => {
        fs.appendFileSync(`./${path}/${filename}.${fileType}`, data, (err) => {
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

    searchInAFile = (filePath, fileContentToSearch) => {
        let data = fs.readFileSync(filePath, 'utf-8');
        data = data.toString();
        let condition = data.includes(fileContentToSearch);
        return condition;
    }

    appenToIdFile = (filePath, contentObj) => {
        let data = fs.readFileSync(filePath, 'utf-8');
        if (data) { data = JSON.parse(data); }

        let contentTobeAppended = data ? {...data} : {};
        contentTobeAppended[contentObj['Id']] = contentObj;

        let content = JSON.stringify(contentTobeAppended)
        fs.writeFileSync(filePath, content , function (err) {
            if (err) throw err;
            console.log( 'Saved!' );
        });
    }

    appendToAFile = (filePath, contentTobeAppended, id) => {
        let data = fs.readFileSync(filePath, 'utf-8');
        data = data.toString();
        let content = id + ' : ' + contentTobeAppended;
        fs.appendFile(filePath, !data.length ? content : ',\n' + content, function (err) {
            if (err) throw err;
            console.log('Saved!' );
        });
    }

    appenToAFileDiffKey = (folderPath, columnsArray, contentObj) => {
        
        let columns = [...columnsArray];
        columnsArray.map( c => {
            if (c !== 'Id') {
                this.makeAFile(folderPath, c + '-Id', 'txt', '');
                columns.push(c + '-Id')
                return c + '-Id'
            }
        })

        columns.forEach(c => {
            let filePath = folderPath + '/' + c + '.txt';
            let data = fs.readFileSync(filePath, 'utf-8');
            if (data) { data = JSON.parse(data); }

            let contentTobeAppended = data ? {...data} : {};
            if (c === 'Id') {
                contentTobeAppended[contentObj[c]] = contentObj
            } else if (c.includes('-Id')) {
                contentTobeAppended[contentObj[c.split('-Id')[0]] + '-' +contentObj['Id']] = contentObj;
            } else {
                if (contentTobeAppended[contentObj[c]]) {
                    contentTobeAppended[contentObj[c]][contentObj['Id']] = contentObj
                }else{
                    contentTobeAppended[contentObj[c]] = {}
                    contentTobeAppended[contentObj[c]][contentObj['Id']] = contentObj
                }  
            }
            
            let ctn = JSON.stringify(contentTobeAppended)

            fs.writeFileSync(filePath, ctn , function (err) {
                if (err) throw err;
                console.log( `Saved into ${c} table.` );
            });
            
        })
        
    }

    updateAFile = (filepath, data) => {
        if (typeof data !== 'string') { data = JSON.stringify(data) }
        fs.writeFileSync(filepath, data , function (err) {
            if (err) throw err;
            console.log( `Update ${c} table.` );
        }); 
    }

    searchInJSON = (filepath, contentColumns, contentArray) => {
        let data = fs.readFileSync(filepath, 'utf-8');
        data = data.toString();

        let str = '';

        contentColumns.forEach((c,index) => {
            let value = contentArray[index];

            if (c !== 'Id') {
                str += '"' +c+ '"' + ':' + (typeof value === 'string' ? '"' +value+ '"' : value) + ',';
            }
        })
        str = str.slice(0,-1);
        return data.includes(str);
    }

    readFileToString = (filepath) => {
        let data = fs.readFileSync(filepath, 'utf-8');
        return data.toString();
    }

    readAllInfoToJSON = (filepath) => {
        let data = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    }
}


// let createFolderAndFile = new CreateFolderAndFile();
// createFolderAndFile.createAFolder('./newFolder');

// let files;
// console.log('\n\n-----\n\n');
// setTimeout(() => createFolderAndFile.makeAFile('./newFolder','newFile', 'txt' , '----Just a testing text----'), 400);

// setTimeout(() => {
//     files = createFolderAndFile.getAllFilesFromDir('./newFolder');
//     console.log(files)
//     console.log('\n\n-----\n\n');
// }, 400);

// setTimeout(() => {
//     let folder = createFolderAndFile.findTheProperFolder('./newFolder', 'newFile');
//     console.log(folder);
//     console.log('\n\n-----\n\n');

//     folder = createFolderAndFile.findTheProperFolder('./newFolder', 'NotExisted');
//     console.log(folder);
//     console.log('\n\n-----\n\n');

// }, 400);

// setTimeout(() => {
//     let file = createFolderAndFile.findTheProperFile('./newFolder', 'Just a testing text');
//     console.log(file);
//     console.log('\n\n-----\n\n');

//     file = createFolderAndFile.findTheProperFile('./newFolder', 'Error');
//     console.log(file);
//     console.log('\n\n-----\n\n');

//     file = createFolderAndFile.findTheProperFile('./noFolder', 'Just a testing text');
//     console.log(file);
//     console.log('\n\n-----\n\n');

// }, 400)

module.exports = CreateFolderAndFile;