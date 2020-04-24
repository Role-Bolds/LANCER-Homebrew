/*
    Lancer Corporate Profile Compiler
    Copyright 2020 Github:RowenStipe

    requires npm library: archiver
*/

const fs = require('fs');
const archiver = require('archiver');
const compileTime = new Date();

const workingDir = `./Grim And Sons`; // The top level directory where 
const debug = true; // Set [DBUG] messages on/true or off/false

const config = JSON.parse(fs.readFileSync(`${workingDir}/lcp_manifest.json`));
const manufacturers = JSON.parse(fs.readFileSync(`${workingDir}/manufacturers.json`));

/*
    Directories to compile to.
    compileDir e.g. example-v[string]-DD_MM_YYYY-HHMMSS
*/
let compileDir = `${workingDir}/${config.name}-v${config.version}-${compileTime.getDate()}_${compileTime.getMonth()}_${compileTime.getFullYear()}-${compileTime.getHours()}${compileTime.getMinutes()}${compileTime.getSeconds()}`;
let compileDirOptional = `${compileDir}-optional`

function dbug(message){
    if(debug){console.log(`[DEBUG] ${message}`)}
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
            return console.error(`Error while writing JSON Object to File.`);
        }
        dbug("JSON file has been saved."); 
    });
}

function parseJSONFile(dir, file, wholeFile=false){

    // DATA, dir, files | bake first object prefrence in
    let DATA = [];

    if(!wholeFile){
        try {
            DATA.push(JSON.parse(fs.readFileSync(`${dir}${file}`))[0]); // We only care about the first object
            dbug(`Outputting ${dir}${file}`);
            dbug(DATA);
        } catch (err) {console.error(err);}
        return DATA;
    } else {
        try {
            DATA.push(JSON.parse(fs.readFileSync(`${dir}${file}`))); // Accept whole file
            dbug(`Outputting ${dir}${file}`);
            dbug(DATA);
        } catch (err) {console.error(err);}
        return DATA;
    }
}

function jsonSort(type, optional=false){    
    let files = [];
    let DATA = [];
    if(type === 'frames'){
        const dir = `${workingDir}/Frames/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else if(type === 'weapons'){
        const dir = `${workingDir}/Weapons/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else if(type === 'tags'){
        const dir = `${workingDir}/Tags/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else if(type === 'mods'){
        const dir = `${workingDir}/Mods/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else if(type === 'systems'){
        const dir = `${workingDir}/Systems/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else if(type === 'core_bonuses'){
        const dir = `${workingDir}/Core Bonuses/`;
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        dbug(`Initalizing Type: ${type}`);
        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            DATA.push(parseJSONFile(dir, files[i])[0]); // Drop inherited []
        }
    } else {console.error(`Type: ${type} not valid`); return null}
    if(!optional){makeJSONFile(`${compileDir}/${type}`, DATA);}
    else{makeJSONFile(`${compileDirOptional}/${type}`, DATA);}
}

function makeZip(optional=false){
    let files = [];
    let dir = compileDir;
    let name = `${config.name}-v${config.version}-${compileTime.getHours()}${compileTime.getMinutes()}${compileTime.getSeconds()}-${compileTime.getDate()}_${compileTime.getMonth()}_${compileTime.getFullYear()}`;
    if(optional){
        name = `${name}-optional`;
        dir = compileDirOptional
    }
    fs.readdirSync(dir).forEach(file => {files.push(file);});

    var output = fs.createWriteStream(`${dir}/${name}.lcp`);
    var archive = archiver('zip', {
    zlib: { level: 5 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    
    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
        console.log('Data has been drained');
    });
    
    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
        console.error(err);
        } else {throw err;}
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);   

    dbug(`Initalizing files to zip`)
    for (i = 0; i < files.length; i++) {
        console.log(`ZIPPING ITEM: ${dir}/${files[i]}`);
        archive.append(fs.createReadStream(`${dir}/${files[i]}`), { name: `${files[i]}` });
    };
    archive.finalize();
}

function compile(optional=false){
    
    if(!optional){
        makeDir(compileDir);
        jsonSort('frames');
        jsonSort('weapons');
        jsonSort('tags');
        jsonSort('mods');
        jsonSort('systems');
        jsonSort('core_bonus');
        makeJSONFile(`${compileDir}/lcp_manifest`, config);
        makeJSONFile(`${compileDir}/manufacturers`, manufacturers);
    }else{
        makeDir(compileDirOptional);
        jsonSort('pilot_gear',true);
        config.name = `${config.name} - Pilot Gear`;
        makeJSONFile(`${compileDirOptional}/lcp_manifest`, config);
    }
}
compile();
makeZip();

compile(true);
makeZip(true);