import React from 'react';
import Expo from 'expo';
import { ActivityIndicator, Image, Alert, StyleSheet, Text, View, Dimensions, Slider  } from 'react-native';
import { SKY_KEY } from 'react-native-dotenv'
import {  Location, Svg, LinearGradient, Permissions } from 'expo';
import Attribution from './components/Attribution';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const KEY = SKY_KEY
const { Circle } = Svg;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
      color: 'pink',
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied! Here is information for Seattle.')
      let defaultRegion = {
        latitude: 47.6205,
        longitude: -122.3493,
        latitudeDelta: 0.054,
        longitudeDelta: 0.055,
      }
      this.getData(defaultRegion);
    } else {
      console.log("test! 42");
      let location = await Location.getCurrentPositionAsync(GEOLOCATION_OPTIONS);

      console.log(location);
      if (location) {
        this.locationSet(location );
      }
    }
  };

  locationSet = (location) => {
    console.log('test');
    if (location.coords ) {
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.014,
        longitudeDelta: 0.015,
      }
      this.getData(region)
    }
  }

  getData = (region) => {
    let url = 'https://api.darksky.net/forecast/' + KEY + '/' + region.latitude + ',' + region.longitude + '?exclude=minutely,daily,flags,alerts'
    console.log(url);

    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        let tZone = responseJson.timezone;
        let time = ((new Date(responseJson.currently.time * 1000)).toLocaleTimeString('en-US', { timeZone: tZone, hour: '2-digit', hour12: true }));
        let tempHours = responseJson.hourly.data.map((item) => (new Date(item.time * 1000)).toLocaleTimeString('en-US', { timeZone: tZone, hour: '2-digit', hour12: true }))
        let allTemps = responseJson.hourly.data.map((item) => (item.apparentTemperature))

        this.setState({
          isLoading: false,
          dataSource: responseJson,
          tempHourly: allTemps,
          tempTimes: tempHours,
          color: this.pickColor(Math.round(allTemps[0])),
          displayTemp: Math.round(allTemps[0]),
          displayTime: "NOW",
          date: time,
          region: region,
          isReady: true,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  onValueChange(value) {
    let tempIndicator = Math.round(this.state.tempHourly[value])
    let time = this.pickTime(value)
    let chosen = this.pickColor(tempIndicator)

    this.setState({ displayTemp: tempIndicator, displayTime: time, color: chosen });
  }

  pickTime(value) {
    if (this.state.tempTimes[value] == this.state.date) {
      return "NOW"
    } else {
      return this.state.tempTimes[value]
    }
  }

  pickColor(temperature) {
    if (temperature < 45) {
      return '1347a2'
    } else if (temperature > 45 && temperature <= 49 ) {
      return '#135ca4'
    } else if (temperature > 49 && temperature <= 53 ) {
      return '#2076a4'
    } else if (temperature > 53 && temperature <= 57 ) {
      return '#21879f'
    } else if (temperature > 57 && temperature <= 61 ) {
      return '#00a49f'
    } else if (temperature > 61 && temperature <= 64 ) {
      return '#25aa25'
    } else if (temperature > 64 && temperature <= 68 ) {
      return '#96ac12'
    } else if (temperature > 68 && temperature <= 70 ) {
      return '#b1aa17'
    } else if (temperature > 70 && temperature <= 74 ) {
      return '#ea9000'
    } else if (temperature > 74 && temperature <= 78 ) {
      return '#ff6300'
    } else if (temperature > 78 && temperature <= 83 ) {
      return '#ea4113'
    } else if (temperature > 83 && temperature <= 88 ) {
      return '#e11313'
    } else if (temperature > 88 && temperature <= 93 ) {
      return '#cc0000'
    } else if (temperature > 93 ) {
      return '#b90023'
    }
  }

  render(){
    console.log("hello, friend!");

    if (!this.state.isReady) {
      return (
        <View>
        <View style={{position: 'absolute', alignSelf: 'center', marginTop: '80%'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
        <Image style={{width: WIDTH, height: HEIGHT}} source={require('./assets/MS-small-splash.png')}/>
        </View>
      );
    }

    if (this.state.isReady) {
      return (
          <View style={styles.main}>
            <Expo.MapView
              style={{ alignSelf: 'stretch', height: HEIGHT}}
              region={this.state.region}/>

            <LinearGradient
              colors={[this.state.color, 'white']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: '125%',
                opacity: .80,
              }}/>
              <View style={styles.overlay}>

              <Text style ={styles.header}>Weather</Text>
              <Text style ={styles.header2}>Here</Text>
              <Text style ={styles.header3}>Weather</Text>
              <Text style={styles.time}>{this.state.displayTime}</Text>

              <Svg height='100' width='100' style={{alignItems: "center", justifyContent: 'center'}}>
                <Circle
                  cx='50'
                  cy='50'
                  r='45'
                  stroke='pink'
                  strokeWidth='2.5'
                  fill={this.state.color}
                />
                <Text style={styles.temp}>{this.state.displayTemp}</Text>
              </Svg>

              <Slider
                minimumValue={0}
                maximumValue={15}
                minimumTrackTintColor="#1EB1FC"
                maximumTractTintColor="#1EB1FC"
                step={1}
                value={0}
                onValueChange={value => this.onValueChange(value)}
                style={{
                  position: 'relative',
                  marginTop: HEIGHT * 0.15,
                  width: WIDTH * .9,

                }}
                thumbTintColor="#1EB1FC"
              />

              <Attribution source={require('./assets/poweredby-darksky.png')} styles={{width: '100%', height: '65%', marginTop: 15, opacity: .65}} />

              <Text style={styles.credits}>Small Talk Enterprises</Text>

            </View>
          </View>
      );
    }

  }

  // async _cacheResourcesAsync() {
  //     const image = [
  //       require('./assets/MS-splash.png'),
  //     ];
  //
  //     const cacheImage = Asset.fromModule(image).downloadAsync();
  //
  //     return Promise.all(cacheImage)
  //
  //   }
}


const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  overlay: {
    alignItems: 'center',
    position: 'absolute',
  },
  header: {
    fontSize: 60,
    marginBottom: 15,
    color: "white",
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 40,
    marginBottom: 15,
    color: "white",
    fontWeight: 'bold',
  },
  header3: {
    fontSize: 45,
    marginBottom: 20,
    color: "white",
    fontWeight: 'bold',
  },
  time: {
    marginTop: 10,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
  },
  temp: {
    fontSize: 45,
    color: 'white',
  },
  slider: {
    position: 'relative',
    marginTop: HEIGHT * 0.15,
    width: WIDTH * .9,
  },
  credits: {
    color: 'gray',
  }
});
