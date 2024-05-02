import mongoose from 'mongoose';


// const url = "mongodb://127.0.0.1/test";
const url = "mongodb+srv://shohaniu8:PUzWtWh43jm63ael@test-mongodb-1.dfh2ki0.mongodb.net/?retryWrites=true&w=majority&appName=test-mongodb-1";



// export function mongoConn(){
//     mongoose.connect(url)

//     console.log("Connected to MongoDB")
    
// }


export function mongoConn() {

    mongoose.connect(url, {
    }).then(() => {
        console.log("Database Connected");
    }).catch((err) => console.log(err));

}