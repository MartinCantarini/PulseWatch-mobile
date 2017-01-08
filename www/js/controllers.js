var macAddress= "20:15:10:08:39:70";
angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope,$http,$state) {
    $scope.data = {};
    $scope.login = function() {
        if($scope.data.username!=null && $scope.data.password!=null){
          
          var email=$scope.data.username;
          var password=$scope.data.password;
          //alert(email);
          //alert(password);
          var config={
            params:{
              email: email,
              password: password
            }
          }
          $http.get('http://pulsewatch.herokuapp.com/users/login',config)
          .success(function(data){
            user_id=data.user_id;
            window.localStorage['userid'] = user_id;
            $state.go('home');
          })
          .error(function(err){
            alert(err.errors);
            console.log(err.errors);
          });
        }
        else{
          alert("Debe completar ambos campos");
          $state.go('login');
        }    
    }
    $scope.logout = function() {
        window.localStorage.clear();
        alert("Hasta luego!");
        $state.go('login');    
    }
    $scope.redirectLogout = function() {
        $state.go('logup');    
    }
    $scope.logup = function() {
        if($scope.data.username!=null && $scope.data.name!=null && $scope.data.password!=null){
          var email=$scope.data.username;
          var password=$scope.data.password;
          var name=$scope.data.name;
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(re.test(email)){  
          //alert(email);
          //alert(password);
          var config={
            params:{
              email: email,
              password: password,
              name: name
            }
          }
          $http.get('http://pulsewatch.herokuapp.com/users/logup',config)
          .success(function(data){
            alert("Bienvenido"+name+"!");
            user_id=data.user_id;
            window.localStorage['userid'] = user_id;
            $state.go('home');
          })
          .error(function(err){
            alert(err.errors);
            console.log(err.errors);
          });
        }
        else{
          alert("Ingrese un email correcto");
          $scope.data={};
          $state.go('logup');
        }
        }
        else{
          alert("Debe completar todos los campos");
          $scope.data={};
          $state.go('logup');
        }  
    }
})
.controller('HomeCtrl', function($scope,$state){
    //window.localStorage.clear();
    //window.localStorage['userid']=1;
    var userid = window.localStorage['userid'];
    if (userid==null){
      alert("Debe iniciar sesión para utilizar la aplicación");
      $state.go('login');   
    }

})
.controller('EstadisticaCtrl', function($scope,$http,$state) {
    // $scope.getMediciones=function(){
      var userid2 = window.localStorage['userid'];


      var config={
            params:{
              user_id: userid2
            }
          }

      $http.get("http://pulsewatch.herokuapp.com/mesures/statics/",config)
        .success(function(data){
          $scope.mediciones = data;
          $state.go('estadisticas');  
          //window.location.href = '#/estadisticas';
        })
        .error(function(err){
          alert(err.errors);
          console.log(err.errors);
        });  
     //}
})
.controller('PulseApp', function($scope,$ionicPopup,$http,$cordovaMedia) {
  $scope.state="disconnected";
  $scope.pulseBPM="Comenzar";
  $scope.message="";
  $scope.alertaOK="false";
  $scope.alertaEstado=window.localStorage['alertaEstado'];
  $scope.alertaValor=window.localStorage['alertaValor'];

  $scope.connect=function(){
    bluetoothSerial.connect(
                    macAddress,  // device to connect to
                    $scope.openPort,    // start listening if you succeed
                    $scope.showError    // show the error if you fail
                );

  }
  $scope.disconnect=function(){
    if ($scope.state=="connected"){
      $scope.state=null;
      $scope.alertaOK="false";  
      $scope.pulseBPM="Comenzar"; 
      bluetoothSerial.disconnect(
                $scope.closePort,     // stop listening to the port
                $scope.showError
                );      // show the error if you fail)
    }
  }
  $scope.closePort=function(){
    bluetoothSerial.unsubscribe(
                function (data) {
                  bluetoothSerial.clear(function(){}, function(){});
                  $scope.state="disconnected";
                  $scope.pulseBPM="Comenzar";
                  $scope.message="";
                  console.log("desconectado "+ $scope.state);
                  $scope.$apply();
                },
                $scope.showError
          );
  }
  $scope.openPort=function(){
    var src = "/android_asset/www/js/song.mp3";
    var media = $cordovaMedia.newMedia(src);
    var src_alerta = "/android_asset/www/js/alert.mp3";
    var media_alerta = $cordovaMedia.newMedia(src_alerta);
    $scope.alerta=null;
    $scope.alertaOK="false";
    $scope.state="connected";
    $scope.pulseBPM="0 "+"BMP";
    $scope.message="Desconectar";
    $scope.$apply();
    media.play();
    var user_id=window.localStorage['userid'];
    bluetoothSerial.subscribe('\n', function (data) {
            $scope.pulseBPM=data;
            if(($scope.getEstadoAlerta()=="Activado") && (parseInt($scope.pulseBPM) > 100) && ($scope.alertaOK=="false")){
              $scope.alerta="VALOR ALCANZADO";
              $scope.alertaOK="true";
              media_alerta.play();
            }
            else{
              $scope.alerta=null;
            }
            //var medicion=$scope.pulseBPM;
            var config={
            params:{
              data: data,
              id: user_id
            }
            }
            $http.get('http://pulsewatch.herokuapp.com/mesures/create_mesure/',config)
            .success(function(data){
              
            })
            .error(function(err){
          
            });
            //$http.get('http://pulsewatch.herokuapp.com/mesures/create_mesure/',config);
            $scope.$apply();
            //console.log(data);*/
        }, function(e){console.log(e); console.log("errorr");});
  }
  $scope.showError=function(error){
    console.log(error);
  }
  $scope.getEstadoAlerta = function() {
      return window.localStorage['alertaEstado'];
  }
  $scope.setEstadoAlerta = function() {
        alertaEstado = $scope.getEstadoAlerta();
        if(alertaEstado=="Desactivado" || alertaEstado==null){
        	window.localStorage['alertaEstado'] = "Activado";
          $scope.alertaEstado="Activado";
        	alert("Alerta activada");
        }else{
        	window.localStorage['alertaEstado'] = "Desactivado";
        	$scope.alertaEstado="Desactivado";
          alert("Alerta desactivada");
        }
  }
  $scope.getValueAlerta = function(){
    return window.localStorage['alertaValor'];
  }
  $scope.setValueAlerta = function(valor) { //FUNCIONANDO
        if(valor!=null){
          window.localStorage['alertaValor'] = valor;
          alertaValor = $scope.getValueAlerta();
          alert("Valor establecido");
        }
        else{
          alert("Debe ingresar un valor");
        }
  }
  //console.log($scope.state);
  //console.log($scope.pulseBPM);

});
