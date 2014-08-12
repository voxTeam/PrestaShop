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
	.controller('CatalogCtrl', function ($scope, $http, $q, focusedModule) {
		$scope.catalogCategories = [
			{'name': 'Our Selections', 'tpl': 'views/catalog/selections.html', 'priority': 1, 'icon': 'icon-bookmark'},
			{'name': 'Official Partners', 'tpl': 'views/catalog/partners.html', 'priority': 2, 'icon': 'icon-certificate'},
			{'name': 'Categories', 'tpl': 'views/catalog/categories.html', 'priority': 3, 'icon': 'icon-archive'},
			{'name': 'Top France', 'tpl': 'views/catalog/top.html', 'priority': 4, 'icon': 'icon-trophy'},
			{'name': 'Collections', 'tpl': 'views/catalog/collections.html', 'priority': 5, 'icon': 'icon-magic'},
			{'name': 'Purchased', 'tpl': 'views/catalog/purchased.html', 'priority': 6, 'icon': 'icon-shopping-cart'}
		];
		var init = function () {
			if ($scope.catalog.currentCategory === null && $scope.configure.currentCategory === null){
				console.log('Catalog initialized with tab "Selections"');
				$scope.setTab($scope.catalogCategories[0]);
			}
			if ($scope.configure.currentCategory === 'Categories'){
				console.log('Catalog tab set to Categories');
				$scope.setTab($scope.catalogCategories[2]);
			}
		};
		$scope.ourSelections = {};
		var catalog = [];
		var catalog_p = $http.get('data/catalog.json').then(function(resp) {
			$scope.setCatalog(resp.data);
		});
		var structure_p = $http.get('data/structure.json').then(function(resp){
			$scope.shared.ourSelections = resp.data.selection;
			$scope.shared.categoriesToDisplay = $scope.ourSelections;
			$scope.categoriesToExclude = null;
			$scope.shared.moduleCategories  = resp.data.categories;
		});
		$q.all([catalog_p, structure_p]).then(function() {
			init();
		});
	});