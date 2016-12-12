var macAddress= "20:15:10:12:42:20";
angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope,$http,$state) {
    $scope.data = {};
    $scope.login = function() {
        if($scope.data.username!=null && $scope.data.password!=null){
          //$http.get("http://192.168.1.108:80/users/login?email="+$scope.data.username+"&password="+$scope.data.username)
          $http.get("http://192.168.1.108:80/users/login?email=admin@admin.com&password=123456")
          .success(function(data){
            user_id=data.user_id;
            window.localStorage['userid'] = user_id;
            alert("redirect");
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
        $state.go('home');    
    }
    $scope.redirectLogout = function() {
        $state.go('logup');    
    }
    $scope.logup = function() {
        if($scope.data.username!=null && $scope.data.name!=null && $scope.data.password!=null){
          alert("Enviando...");
          $scope.data={};
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
    window.localStorage['userid']=1;
    var userid = window.localStorage['userid'];
    if (userid==null){
      alert("Debe iniciar sesión para utilizar la aplicación");
      $state.go('login');   
    }
})
.controller('EstadisticaCtrl', function($scope,$http,$state) {
    // $scope.getMediciones=function(){
      
      var userid2 = window.localStorage['userid'];
      
      $http.get("http://192.168.1.108:80/mesures/?user_id="+userid2)
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
.controller('PulseApp', function($scope,$ionicPopup,$http) {
  $scope.state="disconnected";
  $scope.pulseBPM="Comenzar";
  $scope.message="";
  $scope.alertaEstado=window.localStorage['alertaEstado'];
  $scope.alertaValor=window.localStorage['alertaValor'];
  /*$scope.create=function(){
    alert("hola");
    var userid2 = window.localStorage['userid'];
      
      $http.get("http://192.168.1.108:80/mesures/create_mesure?data=5&id="+userid2)
        .success(function(data){
          window.location.href = '#/estadisticas';
        })
        .error(function(err){
          alert(err.errors);
          console.log(err.errors);
        });
  }*/

  $scope.connect=function(){
    bluetoothSerial.connect(
                    macAddress,  // device to connect to
                    $scope.openPort,    // start listening if you succeed
                    $scope.showError    // show the error if you fail
                );

  }
  $scope.disconnect=function(){
    if ($scope.state=="connected"){
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
    console.log("success");
    $scope.state="connected";
    $scope.pulseBPM="0 "+"BMP";
    console.log("por subscribirme");
    $scope.message="Desconectar";
    $scope.$apply();
    bluetoothSerial.subscribe('\n', function (data) {
            $scope.pulseBPM=data;
            if($scope.getEstadoAlerta!=null && $scope.getValueAlerta!==null && scope.pulseBPM > getValueAlerta){
              alert("Valor límite!");
            }
            $http({
            url: "http://192.168.0.102:3000/mesures/create_mesure/",
            method: "GET",
            params: {data: $scope.pulseBPM}
            });
            $scope.$apply();
            //console.log(data);
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
