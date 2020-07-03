let converter = require('json-2-csv');
let json2csvCallback = function (err, csv) {
    if (err) throw err;
    console.log(csv);
};

converter.json2csv(documents, json2csvCallback);