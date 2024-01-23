#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Keypad.h>

const char* ssid = "RAW SQUAD"; // WiFi network SSID
const char* password = "passwordnai"; // WiFi password
const char* serverAddress = "http://192.168.0.107:3000/keypad"; // server address

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

byte rowPins[ROWS] = {D0, D1, D2, D3}; // connect to the row pins of the keypad
byte colPins[COLS] = {D4, D5, D6, D7}; // connect to the column pins of the keypad

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
}

void loop() {
  char key = keypad.getKey();
  
  if (key) {
    Serial.println(key);
    sendKeyToServer(key);
  }
}


void sendKeyToServer(char key) {
  WiFiClient client;
  HTTPClient http;
  
  http.begin(client, serverAddress); // Pass the WiFiClient object
  
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
  // Create the data to send to the server
  String postData = "key=" + String(key);
  
  int httpResponseCode = http.POST(postData);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.println("Error sending data to server");
  }
  
  http.end();
  delay(1000); // Adjust this delay as needed
}
