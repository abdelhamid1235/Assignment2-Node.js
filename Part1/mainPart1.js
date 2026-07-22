// Part 1
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const {EventEmitter} = require("node:events");
const event = new EventEmitter();
const {createGzip} = require("node:zlib");
const zip = createGzip();

// 1
function logFilePathAndDirectory() {
    console.log({File: __filename, Dir: __dirname});
}
logFilePathAndDirectory();

// 2
function FileName(pathName){
    return path.basename(pathName);
}
console.log(FileName("/user/files/report.pdf"));


//3 
function buildPath(objs){
    return path.format(objs);
}
console.log(buildPath({ dir:"/folder", name:"app", ext:".js"}));

// 4
function fileExtension(pathName){
    return path.extname(pathName);
}
console.log(fileExtension("/docs/readme.md"));

// 5
function returnNameAndExt(pathName){
    const {name , ext} = path.parse(pathName);
    console.log({Name:name , Ext: ext});
}
returnNameAndExt("/home/app/main.js")

//6 
function isAbsolute(pathName) {
    return path.isAbsolute(pathName);
}
console.log(isAbsolute("/home/user/file.txt"));

//7
function joinsMultipleSegments(...arrpath){
    return path.join(...arrpath);
}
console.log(joinsMultipleSegments("src","components", "App.js"));

//8
function resolvesARelativePath(pathName){
    return path.resolve(pathName);
}
console.log(resolvesARelativePath("./index.js"));

//9
function joinsTwoPaths(pathName1 , PathName2){
    return path.join(pathName1 , PathName2);
}
console.log(joinsTwoPaths("/folder1" ,"folder2/file.txt"));

//10
// function  deletesFileAsync(pathName){
//     try {
//         fs.unlinkSync(pathName);
//         console.log(`The ${path.basename(pathName)} is deleted`);
//     } catch (error) {
//         console.log(`error : ${error}`);
//     }
// }
// deletesFileAsync("./path/to/file.txt");

// 11
function createFolderSync(){
    const pathDir = "./folder";
    const exit = fs.existsSync(pathDir);
    if(!exit){
        try {
            fs.mkdirSync(pathDir , {recursive : true});
            console.log("Success");
        } catch (error) {
            console.log({error : error});
        }
        
    }
}
createFolderSync();

//12 
event.on("start" , ()=>{
    console.log("Welcome event triggered!");
})
event.emit("start");

//13 
event.on("login" , (username)=>{
    console.log(`User logged in: ${username}`);
})
event.emit("login" , "Abdelhamid");

// 14 
function readFileAsyn(pathName){
    try {
        const data = fs.readFileSync(pathName , "utf-8");
        return data;
    } catch (error) {
        console.log({error : error});
    }
}
console.log(readFileAsyn("./notes.txt"))

// 15
function WriteInFileAsyn(pathName , content){
    try {
        fs.writeFileSync(pathName , `@@@${content}`  , {flag : "a"});
        console.log("Add in file Done");
        
    } catch (error) {
        console.log({error : error});
    }
}
WriteInFileAsyn("./notes.txt" , "AsyncSave");

// 16
function isExistsDir(pathName){
    return fs.existsSync(pathName);
}
console.log(isExistsDir("./notes.txt"));

// 17 
function returnPlatformAndArch(){
    console.log({Platform: os.platform() , Arch: os.arch()});
}
returnPlatformAndArch();

// 18
    function readSteam(pathName){
        const readStream = fs.createReadStream(pathName , {highWaterMark: 10 , encoding:"utf-8"});
        readStream.on("data" , (chunk)=>{
            console.log({chunk});
        })
    }
    readSteam("./notes.txt");

// 19
    function copyContent(soursePath , destPath){
        const readStream = fs.createReadStream(soursePath);
        const writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
    }
    copyContent("./notes.txt" , "./dest.txt");

// 20 
function compressesFile(dataPath , zipFile){
        const readStream = fs.createReadStream(dataPath);
        const writeZipStream = fs.createWriteStream(zipFile);
        readStream.pipe(zip).pipe(writeZipStream);
}
compressesFile("./notes.txt" , "./notes.txt.gz");




