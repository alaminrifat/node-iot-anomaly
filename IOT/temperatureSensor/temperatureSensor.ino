#include <DallasTemperature.h>
#include <OneWire.h>

#define ONE_WIRE_BUS D4                          //D2 pin of nodemcu

OneWire oneWire(ONE_WIRE_BUS);
 
DallasTemperature sensors(&oneWire);            // Pass the oneWire reference to Dallas Temperature.

float Celcius = 0;
float Fahrenheit = 0;

void setup(void)
{
  Serial.begin(9600); 
  sensors.begin();
}

void loop(void)
{  


  sensors.requestTemperatures();
  Celcius = sensors.getTempCByIndex(0);
  Fahrenheit=sensors.toFahrenheit(Celcius);
  Serial.print(" C  ");
  Serial.println(Celcius);
   Serial.print(" F  ");
   Serial.println(Fahrenheit);
  //For Temperature Sensor --END--
  delay(500);
}