var macAddress= "20:15:10:12:42:20";
angular.module('starter', ['ionic'])
.run(function($ionicPopup,$ionicPlatform) {
  $ionicPlatform.ready(function() {
  });
})
.controller('PulseApp', function($scope,$ionicPopup,$http) {
  $scope.state="disconnected";
  $scope.pulseBPM="Comenzar";
  $scope.message="";
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
            //$scope.pulseBPM=data+" BMP";
            $scope.pulseBPM=data;
            /*$http.get("http://192.168.1.106:3000/mesures/create_mesure/?data=70").then(function (res){
            $scope.response = res.data;
            });*/
            if($scope.pulseBPM>60){
              $scope.response="/--ALERTA BMP>5--/";
            }
            else{
              $scope.response="/--NORMAL BMP<5--/"; 
            }
            $http({
            url: "http://192.168.1.106:3000/mesures/create_mesure/", 
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
  
  console.log($scope.state);
  console.log($scope.pulseBPM);
   
});


