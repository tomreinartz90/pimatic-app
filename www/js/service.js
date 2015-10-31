app.service('pimaticApi', function($rootScope, $resource, $http, $httpParamSerializer) {
  var host = '192.168.1.3';
  var port = 8090;
  var u = encodeURIComponent('admin');
  var p = encodeURIComponent('admin');
  var socket = {};
  var _data = {};

  var url = 'http://' +  host + ':' + port + '/login';

  //login to server
  $http({
    url: url,
    method: 'POST',
    data : $httpParamSerializer({username: u, password: p}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });


  this.startSocket = function(){
    socket = io('http://' + host + ':' + port + '/?username=' + u + '&password=' + p, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      timeout: 20000,
      forceNew: true
    });


    socket.on('connect', function(data) {
      console.log('connected');
      //console.log(data);
    });
    //
    socket.on('event', function(data) {
      //console.log(data);
    });

    socket.on('disconnect', function(data) {
      console.log('disconnected');
    });

    socket.on('devices', function(devices){
      _data.devices = devices;
      dataUpdated(_data);
    });
    //
    //  socket.on('rules', function(rules){
    //    console.log(rules);
    //  });
    //
    //  socket.on('variables', function(variables){
    //    console.log(variables);
    //  });

    socket.on('pages', function(pages){
      _data.pages = pages;
      dataUpdated(_data);
    });
    //
    //  socket.on('groups', function(groups){
    //    console.log(groups);
    //  });

    socket.on('deviceAttributeChanged', function(attrEvent) {
      //      console.log(attrEvent);
      updateDeviceAttribute(attrEvent);

    });

    socket.on('callResult', function(msg){
      //      console.log(msg.result);
      if(msg.id === 'update-variable-call1') {
        //console.log(msg.result);
      }
    });

    function updateDeviceAttribute (changedDevice) {
      //loop trough devices
      angular.forEach(_data.devices, function(device, deviceKey){
        //        find updated device by deviceId
        if(device.id == changedDevice.deviceId){

          //          console.log(device);
          //          loop trough attributes
          return angular.forEach(device.attributes, function(attr, attrKey){
            //            find changed attribute
            if(attr.name == changedDevice.attributeName){
              _data.devices[deviceKey].attributes[attrKey].value = changedDevice.value;
              //console.log(_data.devices[deviceKey].attributes[attrKey].value);
              dataUpdated(_data);
            }
          });
        }
      });
    }

    function dataUpdated (data) {
      if(data !== undefined)
        _data = data;
      $rootScope.$emit('data-updated');
    }
  }

  this.updateDevice = function(id, action, parameters){
    var token = u + ':' + p;
    console.log(token);
    //    $http.defaults.headers.common['user'] = 'token';

    var url = 'http://' +  host + ':' + port + '/api/device/:deviceId/:actionName';
    var update = $resource(url,
      {deviceId:'@id', actionName: '@actionName'},
      {update: {
        method:'JSONP',
      }
      }
    );

    update.update({deviceId:id, actionName: action});
  }

  this.data = _data;
});




app.factory ('Base64', function () {
  /* jshint ignore:start */

  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt (i++);
        chr2 = input.charCodeAt (i++);
        chr3 = input.charCodeAt (i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN (chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN (chr3)) {
          enc4 = 64;
        }

        output = output +
          keyStr.charAt (enc1) +
          keyStr.charAt (enc2) +
          keyStr.charAt (enc3) +
          keyStr.charAt (enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec (input)) {
        window.alert ("There were invalid base64 characters in the input text.\n" +
          "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
          "Expect errors in decoding.");
      }
      input = input.replace (/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf (input.charAt (i++));
        enc2 = keyStr.indexOf (input.charAt (i++));
        enc3 = keyStr.indexOf (input.charAt (i++));
        enc4 = keyStr.indexOf (input.charAt (i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode (chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode (chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode (chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };

  /* jshint ignore:end */
});
