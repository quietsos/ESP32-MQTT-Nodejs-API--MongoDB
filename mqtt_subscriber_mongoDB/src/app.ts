import mqtt from 'mqtt';
import { mongoConn } from './dbConnection';
import { esp32DataSchema } from './mongodSchema/esp32Schema';

let mqttConnection = mqtt.connect("mqtt://test.mosquitto.org")



let jsonTopic = 'esp32/json'

mqttConnection.on("connect", ()=>{
   
    mqttConnection.subscribe(jsonTopic)

    console.log("Successfully Subscribed")
})



mqttConnection.on('message', async (topic, message) =>{

    console.log(message.toString())
    let deviceData = message.toString();

    let funRes_MongoDB = await saveDataInMongoDB(JSON.parse(deviceData))
    console.log(funRes_MongoDB)
})


mongoConn()


function saveDataInMongoDB(inputJSON){
    try{
        return new Promise(async(resolve,reject) =>{
            await esp32DataSchema.insertMany(inputJSON).then((result: any) => {
                if (result.length>0){
                    resolve({statusCode: 100, message: "Saved in MongoDB"})
                }
                else{
                    reject({statusCode: 201, message: "No data to insert"})
                }
            }).catch((e)=>{
                reject({statusCode: 400, message: e.message})
            })
        })
    }catch(e:any){
        console.log(e.message)
    }
}
