import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Dimensions, Slider  } from 'react-native';
import { SKY_KEY } from 'react-native-dotenv'
import { Svg, LinearGradient } from 'expo';

const { Circle } = Svg;
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const KEY = SKY_KEY

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount(){
    let url = 'https://api.darksky.net/forecast/' + KEY + '/47.6205,-122.3493?exclude=minutely,daily,flags'
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.currently.time);
        let time = (new Date(responseJson.currently.time * 1000)).toString()
        let tempHours = responseJson.hourly.data.map((item)=>(new Date(item.time * 1000)).toString().slice(15,21))
        let allTemps = responseJson.hourly.data.map((item)=>(item.apparentTemperature))
        console.log(tempHours);

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

  render(){
    console.log("hello");
    console.log(this.state.tempHourly);

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.main}>
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
        <Text style={styles.header}>☁️ Miss Sky ☁️</Text>
        <Text></Text>
        <Text style ={styles.blurbTwo}>Weather Here, Weather</Text>
        <Text style={styles.header}>{this.state.question2}</Text>

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
    );
  }
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    fontSize: 30,
    marginBottom: 10,
    // color: "white",
  },
  blurb: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  blurbTwo: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
  },
  temp: {
    fontSize: 45,
    color: 'white',
  },
  slider: {
    position: 'relative',
    marginTop: HEIGHT * 0.25,
    width: WIDTH * .9,
  },
});
