var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, pimaticApi) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  //$scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

app.controller('DevicesCtrl', function($scope, $rootScope, pimaticApi, $stateParams) {
  $scope.data  = {};
  $scope.page = "";

  $rootScope.$on('data-updated', function(){
    if(pimaticApi.data !== undefined)
      $scope.data.pages = pimaticApi.data.pages;
    setDevices();
  });

  $scope.$on('$locationChangeSuccess', function(event) {
    setDevices();
  })


  //console.log($stateParams);


  setDevices = function() {
    var pageId = $stateParams.pageId;
    pageId = pageId.substring(1);
    //var devicesList = [];
    var devices = [];

    //if there is no page defined show all devices.
    if(pageId == ""){
      $scope.data.devices = pimaticApi.data.devices;
      return;
    }
    //find selected page
    angular.forEach(pimaticApi.data.pages, function(page, pageKey){
      devicesList = [];
      if(page.id == pageId){
        //console.log(page);
        $scope.page = page.name;
        setDevicesInPage(page.devices);
      }
    });

    setDevicesInPage = function (devicesList) {
      //devicesList = page.devices;
      devices = [];
      angular.forEach(pimaticApi.data.devices, function(device){
        angular.forEach(devicesList, function(deviceId){
          if(device.id == deviceId.deviceId){
            devices.push(device);
          }
        });
      });
      //$scope.$apply();
      $scope.$evalAsync(
        function( $scope ) {
          $scope.data.devices = devices;
        }
      );
    };

  };


  $scope.toggleSwitch = function (device) {
    //    console.log(device);
    //device is on
    if(device.attributes[0].value == true){
      pimaticApi.updateDevice(device.id, "turnOff");
      device.attributes[0].value = false;
    } else {
      pimaticApi.updateDevice(device.id, "turnOn");
      device.attributes[0].value = true;
    }
  };

});

app.controller('PlaylistCtrl', function($scope, $stateParams) {
});
