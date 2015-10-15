app.service('pimaticApi', function($rootScope, $resource) { 
  var host = '192.168.1.3';
  var port = 8090;
  var u = encodeURIComponent('admin');
  var p = encodeURIComponent('admin');
  var socket = io('http://' + host + ':' + port + '/?username=' + u + '&password=' + p, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    timeout: 20000,
    forceNew: true
  });


  var data = {};
  socket.on('connect', function(data) {
    console.log('connected');
    console.log(data);
  });
  //
    socket.on('event', function(data) {
      console.log(data);
    });

  socket.on('disconnect', function(data) {
    console.log('disconnected');
  });

  socket.on('devices', function(devices){
    console.log(devices);
    data.devices = devices;
    dataUpdated(data);
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
    //    console.log(pages); 
  });
  //
  //  socket.on('groups', function(groups){
  //    console.log(groups); 
  //  });

  socket.on('deviceAttributeChanged', function(attrEvent) {
    //    console.log(attrEvent);
  });

  socket.on('callResult', function(msg){
    console.log(msg.result);
    if(msg.id === 'update-variable-call1') {
      console.log(msg.result);
    }
  });

  function dataUpdated (data) { 
    $rootScope.$emit('data-updated', data);
  }

  this.updateDevice = function(id, action, parameters){
    
    console.log('update device ' + id +" action "+ action )
   
//    var update = $resource('http://' + host + ':' + port + '/api/device/:deviceId/:actionName', {deviceId:'@id', actionName: '@actionName'});
//    var updated = update.get({deviceId:id, actionName: action}, function() {
//      console.log(done);
//    });

    socket.emit('device', {
      deviceId: id,
      actionName: action,
    });
  }
});