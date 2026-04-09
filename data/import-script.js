const mongoose = require('mongoose');
const fs = require('fs');
const Hotel = require('./../model/hotel.js')

//Connect to mongodb

const contString = 'mongodb+srv://admin:9JmFCWyNjjWOprHo@cluster0.7035lmz.mongodb.net/bookmystay?appName=Cluster0'
mongoose.connect(contString)
.then((conn) => console.log('Script: Connection to db successful'))
.catch((err) => console.error('Script: Could not connect to MongoDB', err))

//Read data from data > json file

const hotels = JSON.parse(fs.readFileSync('./data/hotels.json', 'utf-8'));

//Delete existing documents from hotels collection

const deleteDocuments = async () => {
    try{
        await Hotel.deleteMany();
        console.log("Documents deleted successfully");
    }catch(error) {
        console.error("Error deleting documents Error: " + error.message);
    }
    process.exit();
}

//Insert read documents in hotel collection

const importDocuments = async () => {
    try{
        await Hotel.create(hotels);
        console.log("Documents imported successfully");
    }catch(error) {
        console.error("Error importing documents Error: " + error.message);
    }
    process.exit();
}  

//console.log(process.argv); //open project directory in terminal define path: './data/import-script.js -delete'

if(process.argv[2] === '-delete'){
    deleteDocuments();
}
if(process.argv[2] === '-import'){
    importDocuments();
}