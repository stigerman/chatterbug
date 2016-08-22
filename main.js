var app = angular.module('chatApp', [])
// app.config(function($stateProvider,$urlRouterProvider) {
// $urlRouterProvider.otherwise('log');   

//         $stateProvider
//             .state('log', {
//                 url: '/login',    
//                 templateUrl: 'templates/log.html',
//                 controller: 'ChatCtrl'
//         })
//          $stateProvider
//             .state('chat', {
//                 url: '/chat',    
//                 templateUrl: 'templates/chat.html',
//                 controller: 'ChatCtrl'
//         })
// })        



app.factory('socket', function(){
    var socket = io.connect('https://chatterbug-stigerman.c9users.io');
    return socket;
})

app.controller('ChatCtrl', function($scope, $http, socket){
    // $scope.newUser = function(user){
    //     $scope.user = user;
    //     $http.post('/newUser',user).then( function(res){
    //         console.log(res);
    //     })
    // }
    
  $scope.users = [];
   $scope.msgs =[];
   $scope.createUser = function(){
        socket.emit('create user', $scope.user.username);
        $scope.user.username='';
        $scope.clicked = true;
    };
    $scope.sendMsg = function(){
        socket.emit('send msg', $scope.msg.text);
        $scope.msg.text='';
    };
    socket.on('get msg', function(data){
        console.log(data);
        $scope.msgs.push(data);
        $scope.$digest();
    });
    socket.on('get users', function(data){
        console.log(data);
        $scope.logged = data;
        $scope.users.push(data);
         $scope.$digest();
    })
})