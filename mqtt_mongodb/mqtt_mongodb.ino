#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>


// WiFi
const char *ssid = "VIRUS.COM"; // Enter your Wi-Fi name
const char *password = "mnrs996318";  // Enter Wi-Fi password

// MQTT Broker
const char *mqtt_broker = "test.mosquitto.org";
const char *tempTopic = "esp32/temp";
const char *humTopic = "esp32/hum";
const char *jsonTopic = "esp32/json";

const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);


int senosrMac;
int currentCM;
int batteryLevel;
int signalStrength;


StaticJsonDocument<256> doc;

void setup() {
    // Set software serial baud to 115200;
    Serial.begin(115200);
    // Connecting to a WiFi network
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the Wi-Fi network");
    //connecting to a mqtt broker
    client.setServer(mqtt_broker, mqtt_port);
    // client.setCallback(callback);
    while (!client.connected()) {
        String client_id = "esp32-client-";
        client_id += String(WiFi.macAddress());
        Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
        if (client.connect(client_id.c_str())) {
            Serial.println("Public Mosquitto MQTT broker connected");
        } else {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
}

// void callback(char *topic, byte *payload, unsigned int length) {
//     Serial.print("Message arrived in topic: ");
//     Serial.println(topic);
//     Serial.print("Message:");
//     for (int i = 0; i < length; i++) {
//         Serial.print((char) payload[i]);
//     }
//     Serial.println();
//     Serial.println("-----------------------");
// }

void loop() {
    client.loop();

    
    senosrMac = random(20,50);
    currentCM = random(10,220);
    batteryLevel = random(10, 100);
    signalStrength = random(0,100);

    
    StaticJsonDocument<300> JSONData;
    JSONData["sensorMac"] = senosrMac;
    JSONData["currentCM"] = currentCM;
    JSONData["batteryLevel"] = batteryLevel;
    JSONData["signalStrength"] = signalStrength;
    
    char data[300];
    serializeJson(JSONData, data);
    Serial.println(data);

    client.publish(jsonTopic,data);


    delay(1000);

    
}
