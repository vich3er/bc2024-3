const fs = require('fs');
const { program } = require('commander');


program
    .version('1.0.0')
    .description('Програма для читання JSON з НБУ та виводу результатів')
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивести результат у консоль')
    .action((options) => {
        // Перевірка наявності обов'язкового параметра
        if (!options.input) {
            console.error('Please, specify input file');
            process.exit(1);
        }

        let jsonData;

        try {

            const data = fs.readFileSync(options.input, 'utf8');
            jsonData = JSON.parse(data);
        } catch (err) {
            console.error('Cannot find input file');
            process.exit(1);
        }


        // console.log('Прочитані дані:', jsonData);


        const filteredValues = jsonData.filter(item => {
            const kuValue = Number(item.ku);
            const value = Number(item.value);
            // return kuValue === 13 && value < 5;
            return kuValue===13 && value>5;
        }).map(item => item.value);


        if (options.display) {
            if (filteredValues.length === 0) {
                console.log('No matching values found.');
            } else {
                filteredValues.forEach(value => console.log(value));
            }
        }


        if (options.output) {
            try {
                fs.writeFileSync(options.output, JSON.stringify(filteredValues, null, 2));
                console.log(`Результат записано у ${options.output}`);
            } catch (writeError) {
                console.error('Error writing to output file');
                process.exit(1);
            }
        }
    });


if (!process.argv.includes('-i') && !process.argv.includes('--input')) {
    console.error('Please, specify input file');
    process.exit(1);
}


program.parse(process.argv);
