import React from 'react';
import { Platform, ActivityIndicator, StyleSheet, Text, View, Dimensions, Slider  } from 'react-native';
import { SKY_KEY } from 'react-native-dotenv'
import { Svg, LinearGradient, MapView, Constants, Location, Permissions } from 'expo';

const { Circle } = Svg;
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const KEY = SKY_KEY

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      latitude: 47.6205,
      longitude: -122.3493,
      color: 'white',
    }
  }

  componentDidMount(){
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, error!',
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

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      location: location,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    console.log(this.state.latitude);
    console.log(this.state.longitude);
    this.getWeatherData(location.coords.latitude.toString(),location.coords.longitude.toString());


  };

  getWeatherData = (lat, long) => {
    let url = 'https://api.darksky.net/forecast/' + KEY + '/'+ lat + ',' + long + '?exclude=minutely,daily,flags'
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.currently.time);
        let time = (new Date(responseJson.currently.time * 1000)).toString()
        let tempHours = responseJson.hourly.data.map((item)=>(new Date(item.time * 1000)).toString().slice(15,21))
        let allTemps = responseJson.hourly.data.map((item)=>(item.apparentTemperature))

        this.setState({
          isLoading: false,
          dataSource: responseJson,
          tempHourly: allTemps,
          tempTime: tempHours,
          color: this.pickColor(Math.round(allTemps[0])),
          question: Math.round(allTemps[0]),
          question2: "NOW",
          date: time,
        }, function(){
        });

      })
      .catch((error) =>{
        console.error(error);
      });
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

  // getMap() {
  //   console.log(this.state.latitude);
  //
  //   if (this.state.latitude) {
  //     let LAT = parseFloat(this.state.latitude);
  //     let LONG = parseFloat(this.state.longitude);
  //     return (
  //       <MapView
  //         style={{ alignSelf: 'stretch', height: HEIGHT}}
  //         initialRegion={{ latitude: LAT, longitude: LONG, latitudeDelta: 0.0222, longitudeDelta: 0.0121, }} />
  //     )
  //   } else {
  //     console.log('MAP ERROR');
  //   }
  // }

  render(){
    console.log("hello");
    console.log(typeof this.state.latitude);
    // console.log(this.state.latitude);
    // console.log(this.state.tempHourly);
    let lat =this.state.latitude
    let long = this.state.longitude

    // console.log(LAT);
    // console.log(LONG);

    if(this.state.isLoading){
      console.log(this.state);
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.main}>
      <MapView
        style={{ alignSelf: 'stretch', height: HEIGHT}}
        initialRegion={{ latitude: lat, longitude: long, latitudeDelta: 0.1222, longitudeDelta: 0.1121, }} />
        <LinearGradient
        colors={[this.state.color, 'white']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
            opacity: .75,
          }}/>
          <View style={styles.overlay}>


          <Text style ={styles.header}>Weather</Text>
          <Text style ={styles.header}>Here</Text>
          <Text style ={styles.header}>Weather</Text>
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
    fontSize: 45,
    marginBottom: 20,
    color: "white",
  },
  blurb: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    marginBottom: 30,
  },
  time: {
    marginTop: 20,
    fontSize: 30,
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
