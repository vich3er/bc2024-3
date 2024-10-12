const fs = require('fs');
const { program } = require('commander');

 
program
    .version('1.0.0')
    .description('Програма для читання JSON з НБУ та виводу результатів')
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивести результат у консоль')
    .action((options) => {

        if (!options.input) {
            console.error('Please, specify input file');
            process.exit(1);
        }


        fs.readFile(options.input, 'utf8', (err, data) => {
            if (err) {
                console.error('Cannot find input file');
                process.exit(1);
            }


            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data');
                process.exit(1);
            }


            if (options.display) {
                console.log(jsonData);
            }


            if (options.output) {
                fs.writeFile(options.output, JSON.stringify(jsonData, null, 2), (writeError) => {
                    if (writeError) {
                        console.error('Error writing to output file');
                        process.exit(1);
                    }
                    console.log(`Результат записано у ${options.output}`);
                });
            }
        });
    });


if (!process.argv.includes('-i') && !process.argv.includes('--input')) {
    console.error('Please, specify input file');
    process.exit(1);
}


program.parse(process.argv);
