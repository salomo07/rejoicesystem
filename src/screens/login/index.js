import React, { Component } from "react";
import {ImageBackground, View, StatusBar,Alert,KeyboardAvoidingView,ToastAndroid,SafeAreaView} from "react-native";
import {Container, H3, Content,Form, Item,Label,Button,Text} from 'native-base';
import {TextInput,Checkbox,Snackbar,ActivityIndicator,Colors} from 'react-native-paper';

import styles from "./styles";
import Functions from "./../../Functions.js";
import Splash from "../login/splash";

import messaging from '@react-native-firebase/messaging';

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");
var AppDesc =require("../../../app.json");

class Login extends Component {
  constructor(props) {
    super(props);   
    // this.props.navigation.navigate('AppNavigator');
  }
  componentWillUnmunt(){
    // this.registerAppWithFCM();
  }

  componentDidMount(){
    // new Functions().localStorage.removeItem('userData');
    new Functions().getDataFromStorage('userData',(err,res)=>{
      // console.log("logiiiiiin",this.props.navigation)
      this.setState({userData:res,loadIndicator:false});

      if(res)
      {this.props.navigation.navigate('AppNavigator');}
      else
      {this.props.navigation.navigate('AuthNavigator');}
    });
  }
  
  signingIn()
  {
    this.setState({loadIndicator:true});
    if(this.state.username==''||this.state.password==''||this.state.username==undefined||this.state.password==undefined)
    {
      this.setState({loadIndicator:false});
      ToastAndroid.show("Please insert your username and password", ToastAndroid.SHORT);
    }
    else
    {
      try 
      {
        var data ={username:this.state.username,password:this.state.password};      
        new Functions().getJSONFromURL(AppDesc.ipServer+'/api/getuserdetail/',data,(err,res)=>{
          if(err)
          {ToastAndroid.show("An error occurred!", ToastAndroid.SHORT);}
          else
          {
            if(res.length==0){ToastAndroid.show("Username or password is wrong.", ToastAndroid.SHORT);}
            else
            {    
              new Functions().setDataToStorage('userData',res);
              this.props.refreshNavigation(res);
              this.props.navigation.navigate('AppNavigator');
            }
            this.setState({loadIndicator:false});
          }
          this.setState({loadIndicator:false});
        });
      } 
      catch ({ error }) {
        ToastAndroid.show("An error occurred..",ToastAndroid.SHORT);
        this.setState({loadIndicator:false});
      }
    }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
      <Container >
        {this.state==null ? (<Splash/>) :
          (<ImageBackground source={launchscreenBg} style={styles.imageContainer} >
            <View style={{}}>
              <ImageBackground source={launchscreenLogo} style={styles.logo} />
              <ActivityIndicator size={'large'} animating={this.state.loadIndicator} color={Colors.blue800} />
            </View>
            <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.form}>
              <Form >
                <TextInput style={{borderColor:"#ccff00"}} mode='flat' label="Username" value={this.state.username} onChangeText={(username) => {this.setState({username});}}/>

                <TextInput style={{borderColor:"#ccff00"}} secureTextEntry={!this.state.checked} value={this.state.password} mode='outlined' label="Password" style={{marginTop:10}} onChangeText={(password) => {this.setState({password});}} />
              </Form>
              <View style={{ flexDirection: 'row'}}>
                <View style={{}}>
                </View>
                <View style={{flex:1, flexDirection: 'row',marginTop:5}}>
                  <Checkbox color={"#ccff00"} status={this.state.checked? 'checked' : 'unchecked'} onPress={() =>{this.setState({ checked: !this.state.checked })}}/>
                  <Text style={{marginTop:5}}> Show password</Text>
                </View>
              </View>
              <Form>
                <Button rounded block style={{ margin: 15, marginTop: 10 }} onPress={() => {this.signingIn();}}>
                  <Text>Sign In</Text>
                </Button>
              </Form>
            </View>
            </KeyboardAvoidingView>
          </ImageBackground>
          )
        }
      </Container>
      </SafeAreaView>
    );
  }
}

export default Login;
