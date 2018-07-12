import React from 'react';
import Expo from 'expo';
import { Platform, StyleSheet, Text, View, Image, Dimensions, Slider  } from 'react-native';
import { SKY_KEY } from 'react-native-dotenv'
// import logo from
import { Location, Svg, LinearGradient, Constants, Permissions } from 'expo';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const KEY = SKY_KEY
const { Circle } = Svg;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      location: { coords: {latitude: 0, longitude: 0}},
      color: 'transparent',
      errorMessage: null,
    }
  }

  componentDidMount(){
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
    this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync(GEOLOCATION_OPTIONS);
    this.locationSet(location );
  };

  locationSet = (location) => {
    if (location) {
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.014,
        longitudeDelta: 0.015,
      }

      let url = 'https://api.darksky.net/forecast/' + KEY + '/' + location.coords.latitude + ',' + location.coords.longitude + '?exclude=minutely,daily,flags'
      console.log(url);

      return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          let time = (new Date(responseJson.currently.time * 1000)).toString()
          let tempHours = responseJson.hourly.data.map((item) => (new Date(item.time * 1000)).toString().slice(15,21))
          let allTemps = responseJson.hourly.data.map((item) => (item.apparentTemperature))

          this.setState({
            isLoading: false,
            dataSource: responseJson,
            tempHourly: allTemps,
            tempTime: tempHours,
            color: this.pickColor(Math.round(allTemps[0])),
            question: Math.round(allTemps[0]),
            question2: "NOW",
            date: time,
            location: location,
            region: region,
          });

        })
        .catch((error) =>{
          console.error(error);
        });
    }
  }

  onValueChange(value) {
    let temp = this.state.tempHourly[value]
    let tempIndicator = Math.round(temp)

    let time = this.pickTime(value)
    let chosen = this.pickColor(tempIndicator)

    this.setState({ question: tempIndicator, question2: time, color: chosen });
  }

  pickTime(value) {
    let time = parseInt(this.state.tempTime[value]);
    let now = this.state.date.slice(16,18)

    if (time == now) {
      time = "NOW"
    } else if (time > 12) {
      time -= 12
      time += " PM"
    } else if (time === 0) {
      time = "12 AM"
    } else if (time === 12) {
      time = " 12 PM"
    } else {
      time += " AM"
    }

    return time
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

    return(
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
            height: '100%',
            opacity: .80,
          }}/>
          <View style={styles.overlay}>

          <Text style ={styles.header}>Weather</Text>
          <Text style ={styles.header2}>Here</Text>
          <Text style ={styles.header3}>Weather</Text>
          <Text style={styles.time}>{this.state.question2}</Text>

          <Svg height='100' width='100' style={{alignItems: "center", justifyContent: 'center'}}>
            <Circle
              cx='50'
              cy='50'
              r='45'
              stroke='pink'
              strokeWidth='2.5'
              fill={this.state.color}
            />
            <Text style={styles.temp}>{this.state.question}</Text>
          </Svg>

          <Slider
            minimumValue={0}
            maximumValue={15}
            minimumTrackTintColor="#1EB1FC"
            maximumTractTintColor="#1EB1FC"
            step={1}
            value={0}
            onValueChange={value => this.onValueChange(value)}
            style={styles.slider}
            thumbTintColor="#1EB1FC"
          />
          <Image source={require('./assets/poweredby-darksky.png')} style={{width: '65%', height: '6%', opacity: .25}}/>

        </View>
      </View>
    );
  }
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
    marginBottom: 20,
    color: "white",
  },
  header2: {
    fontSize: 45,
    marginBottom: 20,
    color: "white",
  },
  header3: {
    fontSize: 40,
    marginBottom: 20,
    color: "white",
  },
  time: {
    marginTop: 20,
    fontSize: 30,
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
});
// [
//   {
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#f5f5f5"
//       }
//     ]
//   },
//   {
//     "elementType": "labels",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.icon",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#616161"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.text.stroke",
//     "stylers": [
//       {
//         "color": "#f5f5f5"
//       }
//     ]
//   },
//   {
//     "featureType": "administrative.land_parcel",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "featureType": "administrative.land_parcel",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#bdbdbd"
//       }
//     ]
//   },
//   {
//     "featureType": "administrative.neighborhood",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#eeeeee"
//       }
//     ]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#757575"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#e5e5e5"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   },
//   {
//     "featureType": "road",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#ffffff"
//       }
//     ]
//   },
//   {
//     "featureType": "road.arterial",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#757575"
//       }
//     ]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#dadada"
//       }
//     ]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#616161"
//       }
//     ]
//   },
//   {
//     "featureType": "road.local",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   },
//   {
//     "featureType": "transit.line",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#e5e5e5"
//       }
//     ]
//   },
//   {
//     "featureType": "transit.station",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#eeeeee"
//       }
//     ]
//   },
//   {
//     "featureType": "water",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#c9c9c9"
//       }
//     ]
//   },
//   {
//     "featureType": "water",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   }
// ]
