const workingDir = `./Grim And Sons`
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${workingDir}/lcp_manifest.json`));
const compileTime = new Date();


function makeDir(folderName){
    new File(folderName).mkdirs();
}

function jsonSort(type){    
    if(type === 'frames'){
        const dir = `${workingDir}/Frames/`;
        let compileDir = `${workingDir}/${config.name}-v${config.version}-${compileTime.getHours()}:${compileTime.getMinutes()}:${compileTime.getSeconds()}_${compileTime.getDate()}_${compileTime.getMonth()}_${compileTime.getFullYear()}`;
        
        let files = [];
        let DATA = [];
        fs.readdirSync(dir).forEach(file => {files.push(file);});
        console.log(`Initalizing Type: ${type}`)

        for (i = 0; i < files.length; i++) {
            console.log(`ITEM: ${dir}${files[i]}`);
            try {
                DATA.push(JSON.parse(fs.readFileSync(`${dir}${files[i]}`)));
                console.log(`Outputting ${dir}${files[i]}`)
                console.log(DATA);
            } catch (err) {console.error(err);}
        };

        fs.appendFileSync(`${compileDir}/frames.json`, JSON.stringify(DATA, null, '\t'), 'utf8', function (err) {
            if (err) {
                console.log(`Error while writing JSON Object to File.`);
                return console.log(err);
            }
            console.log("JSON file has been saved."); 
        });
    };
}

jsonSort('frames');
