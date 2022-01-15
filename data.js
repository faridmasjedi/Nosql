const CreateFolderAndFile = require("./index");

class Nosql extends CreateFolderAndFile {
  constructor(folderName, columns) {
    super();
    this.folderName = folderName;
    this.folderPath = this.createAFolder(`db/${this.folderName}`);
    this.columns = [...columns, "Id"];

    this.columns.forEach((c) => this.makeAFile(this.folderPath, c, "txt", ""));
  }

  all = () => {
    let filepath = this.folderPath + "/Id.txt";
    let data = this.readAllInfoToJSON(filepath);
    return data;
  };

  createId = () => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let idPath = this.folderPath + "/" + "Id.txt";
    let newIdFlag = false;
    let idLength = 10;

    while (!newIdFlag) {
      for (let i = 0; i < idLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      newIdFlag = !this.searchInAFile(idPath, text);
    }

    return text;
  };

  create = (info) => {
    if (info.length === 0) {
      return "The info should not be empty";
    }
    let idPath = this.folderPath + "/Id.txt";

    let existedRow = this.searchInJSON(idPath, this.columns, info);
    if (existedRow) {
      return "This row is existed";
    }

    let contentObj = {};
    let id = this.createId();
    contentObj["Id"] = id;

    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i] !== "Id") {
        contentObj[this.columns[i]] = info[i];
      }
    }
    this.appenToAFileDiffKey(this.folderPath, this.columns, contentObj);
  };

  find = (id) => {
    let filepath = this.folderPath + "/Id.txt";
    let data = this.readAllInfoToJSON(filepath);
    return data[id];
  };

  findBy = (columnName, columnValue) => {
    let filepath = this.folderPath + "/" + columnName + ".txt";
    let data = this.readAllInfoToJSON(filepath);
    return data[columnValue];
  };

  findBySomeColumns = (colArray, colValueArray) => {
    let filePath = this.folderPath + "/" + colArray[0] + ".txt";

    let data = this.readAllInfoToJSON(filePath);
    data = data[colValueArray[0]];

    if (colArray.length > 1) {
      for (let key in data) {
        let el = data[key];
        let flag = true;

        for (let i = 1; i < colArray.length; i++) {
          if (el[colArray[i]] !== colValueArray[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return el;
        }
      }
    } else {
      return data;
    }
  };

  update = (newData) => {
    let cols = [...this.columns];
    this.columns.forEach((c) => {
      if (c !== "Id") {
        cols.push(c + "-Id");
      }
    });

    cols.forEach((c) => {
      let filepath = this.folderPath + "/" + c + ".txt";
      let data = this.readAllInfoToJSON(filepath);

      if (c === "Id") {
        data[newData[c]] = newData;
      } else {
        for (let key in data) {
          if (c.includes("-Id")) {
            if (key.includes(newData["Id"])) {
              delete data[key];
              let newKey = newData[c.split("-Id")[0]] + "-" + newData["Id"];
              data[newKey] = newData;
              break;
            }
          } else if (data[key][newData["Id"]]) {
            delete data[key][newData["Id"]];

            if (JSON.stringify(data[key]) === "{}") delete data[key];
            if (data[newData[c]]) {
              data[newData[c]][newData["Id"]] = newData;
            } else {
              data[newData[c]] = {};
              data[newData[c]][newData["Id"]] = newData;
            }
            break;
          }
        }
      }

      this.updateAFile(filepath, data);
    });
  };

  remove = (targetData) => {
    let cols = [...this.columns];
    this.columns.forEach((c) => {
      if (c !== "Id") {
        cols.push(c + "-Id");
      }
    });

    cols.forEach((c) => {
      let filepath = this.folderPath + "/" + c + ".txt";
      let data = this.readAllInfoToJSON(filepath);

      if (c === "Id") {
        delete data[targetData[c]];
      } else {
        for (let key in data) {
          if (c.includes("-Id")) {
            if (key.includes(targetData["Id"])) {
              delete data[key];
              break;
            }
          } else if (data[key][targetData["Id"]]) {
            delete data[key][targetData["Id"]];

            if (JSON.stringify(data[key]) === "{}") delete data[key];
            break;
          }
        }
      }

      this.updateAFile(filepath, data);
    });
  };
}

// let database = new Nosql('user', ['name', 'age']);
// database.create(['Farid', 37])
// database.create(['Sara', 35])
// database.create(['Maede', 33])

// console.log(database.find('bHLW7wV2tb'))
// console.log(database.findBy('Name', 'Sara'));
// console.log(database.findBy('age', 37));
// console.log(database.findBySomeColumns(['name', 'age'], ['Farid', 37]));

// console.log(database.update({"Id":"bHLW7wV2tb","name":"Salar","age":33}))
// console.log(database.update({"Id":"OI9igSjZwp","name":"Farid","age":37}))
// console.log(database.update({"Id":"peQsAYlaqA","name":"Sara","age":34}))

// console.log(database.all())

// console.log(database.remove({"Id":"bHLW7wV2tb","name":"Farid","age":37}))
// console.log(database.all())
