const compileTime = new Date();

const workingDir = `./Grim And Sons`;
const fs = require('fs');
const debug = false;

const config = JSON.parse(fs.readFileSync(`${workingDir}/lcp_manifest.json`));
const manufacturers = JSON.parse(fs.readFileSync(`${workingDir}/manufacturers.json`));

const compileDir = `${workingDir}/${config.name}-v${config.version}-${compileTime.getHours()}:${compileTime.getMinutes()}:${compileTime.getSeconds()}_${compileTime.getDate()}_${compileTime.getMonth()}_${compileTime.getFullYear()}`;

function dbug(message){
    if(debug){console.log(`[DEBUG] ${message}`)};
}

function makeDir(folderName){
        fs.mkdir(folderName, { recursive: true }, function(err) { 
            if (err){console.error(err)}
            else{}
        });   
}

function makeJSONFile(type, DATA){
    fs.appendFileSync(`${type}.json`, JSON.stringify(DATA, null, '\t'), 'utf8', function (err) {
        if (err) {
            console.error(`Error while writing JSON Object to File.`);
            return console.log(err);
        }
        dbug("JSON file has been saved."); 
    });
}

function jsonSort(type){    
    let files = [];
    let DATA = [];
    if(type === 'frames'){
        const dir = `${workingDir}/Frames/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`)
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            try {
                DATA.push(JSON.parse(fs.readFileSync(`${dir}${files[i]}`)));
                dbug(`Outputting ${dir}${files[i]}`)
                dbug(DATA);
            } catch (err) {console.error(err);}
        };
    } else if(type === 'weapons'){
        const dir = `${workingDir}/Weapons/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`)
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            try {
                DATA.push(JSON.parse(fs.readFileSync(`${dir}${files[i]}`)));
                dbug(`Outputting ${dir}${files[i]}`)
                dbug(DATA);
            } catch (err) {console.error(err);}
        };
    } else {console.error(`Type: ${type} not valid`);}
    makeJSONFile(`${compileDir}/${type}`, DATA);
}

function compile(){
    makeDir(compileDir);
    jsonSort('frames');
    jsonSort('weapons');
    makeJSONFile(`${compileDir}/lcp_manifest`, config);
    makeJSONFile(`${compileDir}/manufacturers`, manufacturers);
}

compile();