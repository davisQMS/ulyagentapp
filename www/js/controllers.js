angular.module('agentapp.controllers', ['ionic', "angular-hal"])
    .controller('TicketCtrl', function($scope, RESTService,$ionicLoading) {
        $scope.tickets = $scope.tickets || [];
        console.log("here ticket contrl goes");
        RESTService.load().then(function(ticketcoll) {
            ticketcoll.$get("item").then(function(items) {
                console.log("Got results:", items);
                console.log("Refresh List of Tickets:", arguments);
                $scope.tickets = items;
                $scope.total = items.length;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        }, function(error) { console.error("error:", arguments); });
    })
    .controller('TicketDetailCtrl', function($scope, $stateParams, RESTService,$ionicLoading,$ionicActionSheet,$ionicPopup) {
        console.log("TicketDetails Controller :", arguments);
        $scope.ticket = null;
        $scope.loading = true;
        $scope.id = $stateParams.ticketId;
        //call ActionSheet
        $scope.showActionsheet = function() {
          $ionicActionSheet.show({
                  buttons: [
                    { text: 'Resolve' },
                    { text: 'Review' },
                    { text: 'Suspend' },
                    { text: 'Respond' },
                    { text: 'Start Travel' },
                    { text: 'Edit' },
                    { text: '<i class="icon ion-arrow-move"></i> Start Travel' },
                  ],
                  buttonClicked: function(index) {
                    switch (index){
                      case 0 :
                        $scope.showAlert = function() {
                          var alertPopup = $ionicPopup.alert({
                            title: 'Resolve Button',
                            template: 'Resolve Button Popup'
                          })}
                      case 1 :
                        //Handle Move Button
                        return true;
                      case 2 :
                        //Handle Move Button
                        return true;
                      case 3 :
                        //Handle Move Button
                        return true;
                      case 4 :
                        //Handle Move Button
                        return true;
                      case 5 :
                        //Handle Move Button
                        return true;
                      case 6 :
                        //Handle Move Button
                        return true;
                    }
                  }
          });

        }
        console.log("Loading Ticket Data :", arguments);
        RESTService.loadTicket($scope.id).then(function(ticket) {
          console.log("iM ticket here:", arguments);
            $scope.ticket = ticket;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        }, function(error) { console.error("error:", arguments); });
    })
    .controller("LoginCtrl", function($scope, $state, RESTService, UserInfo,$ionicLoading) {

        $scope.user_data = $scope.user_data || {
            "username": "",
            "password": "",
            "server":RESTService.url
        };
        $scope.login = function() {
          console.log("here login goes");
            RESTService.login_rest($scope.user_data.username, $scope.user_data.password).then(function(app) {
                if (app.error) {
                  console.log("Oh snaps, error on webservice");
                  $ionicLoading.hide();
                  $scope.error = app.error;
                }
                else {
                  console.log("Oh snaps, no error on webservice");
                    app.$get("uly:user").then(function(user) {
                        UserInfo.setUserData({
                            "username": $scope.user_data.username,
                            "server":$scope.user_data.server,
                            "email": user.email,
                            "picture": user.picture,
                            "fullname": user.fullname,
                            "roles": user.roles,
                            "id": user.id
                        });
                        $scope.error = "";
                        //navigate to home
                        $state.go("tab.tickets");
                    });
                }

            }, function(error) {
                $ionicLoading.hide();
                $scope.error = "Invalid credentials: ";
            });
        };
    })
  .controller("NewTicketCtrl", function($scope, $state, RESTService, TicketInfo) {
        $scope.ticket_data = $scope.ticket_data || {
            "title": "Test New Ticket",
            "body": "Test Test 123"
        };
        $scope.new_ticket = function() {
            /*if ($scope.user_data.server && RESTService.url != $scope.user_data.server) {
                RESTService.set_url($scope.user_data.server);
            }*/
            RESTService.new_ticket($scope.ticket_data.title, $scope.ticket_data.body).then(function(app) {
                if (app.error) {
                    $scope.error = app.error;
                }
                else {
                    /*app.$get("uly:user").then(function(user) {
                        UserInfo.setUserData({
                            "username": $scope.user_data.username,
                            "server":$scope.user_data.server,
                            "email": user.email,
                            "picture": user.picture,
                            "fullname": user.fullname,
                            "roles": user.roles
                        });
                    });*/
                    alert("yay a new ticket!");
                    $scope.error = "";
                    //navigate to home
                    $state.go("tab.tickets");
                }

            }, function(error) {
                $scope.error = "Error creating ticket: " + error;
            });
        };
    })

  .controller('LoadingCtrl', function($scope, $ionicLoading) {
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };
  });


