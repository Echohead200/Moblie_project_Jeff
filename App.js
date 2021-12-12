import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect, Component, Fragment} from 'react';
import { StyleSheet, Text, View,Image,FlatList } from 'react-native';
import * as Location from 'expo-location';




export default function App() {

  //console.log("worked on load1")
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(()=>{
    async function getWeather(){
      //get location here
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({}); 
      setLocation(location);

      //get weather here
      await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&exclude=minutely,hourly,alerts,current&appid=8a5730258ef4c739584ac0ec3b84d800`)
      .then((response)=> response.json())
      .then((json=> {setData(json); setIsError(false); }))
      .catch((err)=>{setIsError(true); console.error(err);})
      .finally(()=> setIsLoading(false));
    }
    getWeather()
  },[])


  

 
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var z = 0
  function addDays() {
    const d = new Date();
    d.setDate(d.getDate()+z)
    let day = weekday[d.getDay()];
    z= z+1
    return(day)
  }
 

function Tempconvet(input){
  let output = input - 273.15;
  return output.toFixed(0)
}
function errorCheck(input){
  if(data.daily == null){
    return "wait still loading"
  }
  else{
    return input
  }
}

  return (
    <View style={styles.container}>
      
   
      <Text style = {{color: 'white'}}>One Week Forecast</Text>
      {
        data.daily == null || location == null ?<Text style = {{color: 'white'}}>Loading please wait</Text>:
        <>
        <Text style = {{color: 'white'}}>{data.timezone}</Text>
        <Text style = {{color: 'white'}}>Todays Forecast</Text>
        <Text style = {{color: 'white' , fontSize:20, textTransform:'capitalize'}}>{"\n"}
         {data.daily[0].weather[0].description}</Text>
        <Text style = { styles.temploud }>{Tempconvet(data.daily[0].temp.day)} °C</Text>
        <Image style = {styles.biglogo}
        source={
          {uri:`http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`}} />
        </>

      }      
      {
        data.daily == null || location == null ?<Text style = {{color: 'white'}}>DATA NOT THERE</Text>:
        data.daily.map((item,index) => {
          return(
            <View style = {styles.test} key={index}>              
              <Image style = {styles.tinyLogo}
            source={
              {uri:`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}} />
            <Text style={styles.item}>{addDays()}  {"\n"}
                {item.weather[0].description} 
                
                </Text>
                <Text style = {{color :'white'}}> {"\n"}{Tempconvet(item.temp.day)} °C  </Text>                  
                </View>
        )})
      }
      
      
    
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',
    backgroundColor: '#121212',
    justifyContent: 'center',
  },  tinyLogo: {
    width: 50,
    height: 50,

  },  item:{
    width: '60%',
    backgroundColor: '#222',
    color: "white",

    borderColor: "black",

    borderRadius: 10,
    textTransform:'capitalize',

    marginVertical: 5,

  },
  test:{
    backgroundColor: '#222',

    flexDirection: 'row',
    borderRadius: 10,
    marginVertical: 2,
  },temploud:{
    fontSize: 30,
    color: "white"
  },biglogo:{
    width: 100,
    height: 100,
  }
});
