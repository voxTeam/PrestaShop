'use strict';
/**
 * @ngdoc function
 * @name modulesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modulesApp
 */

angular.module('modulesApp')
	// main controller for the Catalog view
	.controller('SearchCtrl', function ($scope, $http, $q, focusedModule) {

		var catalog_p = $http.get('data/catalog.json').then(function(resp) {
			// $scope.setCatalog(resp.data);
		});
		var config_p = $http.get('data/config.json').then(function(resp) {
			//$scope.setCatalog(resp.data);
		});

		var structure_p = $http.get('data/structure.json').then(function(resp){
			// $scope.shared.ourSelections = resp.data.selection;
			// $scope.shared.categoriesToDisplay = $scope.ourSelections;
			// $scope.categoriesToExclude = null;
			// $scope.shared.moduleCategories  = resp.data.categories;
		});
		$q.all([catalog_p, structure_p, config_p]).then(function() {
			console.log("Init Search Controller");

		});
	});