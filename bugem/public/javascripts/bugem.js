var app = angular.module('bugem', ['ngResource', 'ngRoute']);

/* override the routing so that every request is sent to the static
   angular-created main home page
*/
app.config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            })
            .when('/add-letter', {
                templateUrl: '/partials/letter-form.html',
                controller: 'AddLetterCtrl'
            })
            .when('/letter/:id', {
                templateUrl: '/partials/letter-form.html',
                controller: 'EditLetterCtrl'
            })
            .when('/letter/delete/:id', {
                templateUrl: '/partials/letter-delete.html',
                controller: 'DeleteLetterCtrl'
            })
            .otherwise({
                redirectedTo: '/'
            });
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase:false
            });
        }
    }
]);

/* define the controllers (C of MCV) */
app.controller(
    'HomeCtrl',
    [
        '$scope',
        '$resource',
        function($scope, $resource) {
            var Letters = $resource('/api/letters');
            Letters.query(function(letters){
                $scope.letters = letters;
            });
        }
    ]
);

app.controller(
    'AddLetterCtrl',
    [
        '$scope', '$resource', '$location',
        function($scope, $resource, $location) {
            $scope.save = function() {
                var Letters = $resource('/api/letters');
                Letters.save($scope.letter, function() {
                    $location.path('/');
                });
            };
        }
    ]
);

app.controller(
    'EditLetterCtrl',
    [
        '$scope', '$resource', '$location', '$routeParams',
        function($scope, $resource, $location, $routeParams) {
            var Letters = $resource(
                '/api/letters/:id',
                { id: '@_id' },
                { update: { method: 'PUT' }}
            );

            Letters.get({ id: $routeParams.id }, function(letter) {
                $scope.letter = letter;
            });

            $scope.save = function() {
                Letters.update($scope.letter, function() {
                    $location.path('/');
                });
            };
        }
    ]
);

app.controller(
    'DeleteLetterCtrl',
    [
        '$scope', '$resource', '$location', '$routeParams',
        function($scope, $resource, $location, $routeParams) {
            var Letters = $resource('/api/letters/:id');

            Letters.get({ id: $routeParams.id }, function(letter) {
                $scope.letter = letter;
            });

            $scope.delete = function() {
                Letters.delete({ id: $routeParams.id }, function(letter) {
                    $location.path('/');
                });
            };
        }
    ]
);
