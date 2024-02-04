#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "DHT.h"

#define DPIN 4
#define DTYPE DHT11

const char* ssid = "RAW SQUAD"; // WiFi network SSID
const char* password = "passwordnai"; // WiFi password
const char* serverAddress = "http://192.168.0.107:3000/api/keypad"; // server address


DHT dht(DPIN,DTYPE);

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);


  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
   dht.begin();
}

void loop() {

  delay(1000);
  float temp_c = dht.readTemperature(false);
  float temp_f = dht.readTemperature(true);
  float humidity = dht.readHumidity();
    Serial.print(humidity);
  Serial.println('%');
 Serial.print(temp_c);
 Serial.println('C');
 Serial.print(temp_f);
 Serial.println('F');
  // sendKeyToServer(temp_c,temp_f,humidity);
  WiFiClient client;
  HTTPClient http;
  
  http.begin(client, serverAddress); // Pass the WiFiClient object
  
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
  // Create the data to send to the server
  // String postData = "key=" + String(key);
    String postData = "temp_c=" + String(temp_c) + "&temp_f=" + String(temp_f) + "&humidity=" + String(humidity);

Serial.println(postData);
  int httpResponseCode = http.POST(postData);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.println("Error sending data to server");
  }
  
  http.end();
  delay(10000); // Adjust this delay as needed
}


// void sendKeyToServer(float temp_c, float temp_f, float humidity) {
//   WiFiClient client;
//   HTTPClient http;
  
//   http.begin(client, serverAddress); // Pass the WiFiClient object
  
//   http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
//   // Create the data to send to the server
//   // String postData = "key=" + String(key);
//     String postData = "temp_c=" + String(temp_c) + "&temp_f=" + String(temp_f) + "&humidity=" + String(humidity);

// Serial.println(postData);
//   int httpResponseCode = http.POST(postData);
  
//   if (httpResponseCode > 0) {
//     Serial.print("HTTP Response code: ");
//     Serial.println(httpResponseCode);
//   } else {
//     Serial.println("Error sending data to server");
//   }
  
//   http.end();
//   delay(20000); // Adjust this delay as needed
// }
