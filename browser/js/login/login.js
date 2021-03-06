app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, CartFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo)
            .then(function () {
                $state.go('home');
            })
            .then(function () {
                return CartFactory.getItems()
            })
            .then(function (cart) {
                if (cart) $scope.products = cart
            })
            .catch(function () {
                $scope.error = 'Invalid login credentials.';
            });

    };

});
