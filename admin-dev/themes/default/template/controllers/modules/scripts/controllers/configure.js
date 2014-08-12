'use strict';

/**
 * @ngdoc function
 * @name modulesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the modulesApp
 */
angular.module('modulesApp')
  .controller('ConfigureCtrl', function ($scope, $http, $q) {

  		var init = function () {
			$scope.setTemplate('grid');
		};

		//bulks
		$scope.bulkSelectedModules = {
			modules: {},
			length: 0,
			selectAll: true,
			unselectAll: false,
			activateAll: false,
			unactivateAll: false,
			updateAll: false,
			activateMobiletAll: false,
			unactivateMobiletAll: false,
			activateTabletAll: false,
			unactivateTabletAll: false,
			activateDesktopAll: false,
			unactivateDesktopAll: false
		};

		$scope.selectModule = function(module){
			//$scope.modulesToDisplay.modules[module].selected = true;
			//console.log($scope.modulesToDisplay.modules[module.id]);
			$scope.bulkSelectedModules.modules[module.id];
		};

		$scope.selectAll = function(){
			for (var m in $scope.modulesToDisplay.modules){
				$scope.bulkSelectedModules.modules[$scope.modulesToDisplay.modules[m].id] = true;
			};
		};

		$scope.unselectAll = function(){
			$scope.bulkSelectedModules.modules = {};	
		};

		$scope.$watchCollection('bulkSelectedModules.modules', function(){
			setControls();
		});

		$scope.$watchCollection('modulesToDisplay.modules', function(){
			$scope.bulkSelectedModules.modules = {};
			setControls();
		});

		function setControls(){
			var length = 0;
			for (var m in $scope.bulkSelectedModules.modules){
				if ($scope.bulkSelectedModules.modules[m]){
					length++;
				}
			};
			$scope.bulkSelectedModules.length = length;
			if (length === 0){
				$scope.bulkSelectedModules.selectAll = true;
				$scope.bulkSelectedModules.unselectAll = false;
				$scope.bulkSelectedModules.activateAll= false;
				$scope.bulkSelectedModules.unactivateAll= false;
				$scope.bulkSelectedModules.updateAll= false;
				$scope.bulkSelectedModules.activateMobileAll= false;
				$scope.bulkSelectedModules.unactivateMobileAll= false;
				$scope.bulkSelectedModules.activateTabletAll= false;
				$scope.bulkSelectedModules.unactivateTabletAll= false;
				$scope.bulkSelectedModules.activateDesktopAll= false;
				$scope.bulkSelectedModules.unactivateDesktopAll= false
			} else {
				$scope.bulkSelectedModules.selectAll = true;
				$scope.bulkSelectedModules.unselectAll = true;
				$scope.bulkSelectedModules.activateAll= true;
				$scope.bulkSelectedModules.unactivateAll= true;
				$scope.bulkSelectedModules.updateAll= true;
				$scope.bulkSelectedModules.activateMobileAll= true;
				$scope.bulkSelectedModules.unactivateMobileAll= true;
				$scope.bulkSelectedModules.activateTabletAll= true;
				$scope.bulkSelectedModules.unactivateTabletAll= true;
				$scope.bulkSelectedModules.activateDesktopAll= true;
				$scope.bulkSelectedModules.unactivateDesktopAll= true
			};
			if (typeof $scope.modulesToDisplay.modules !== 'undefined' && length === $scope.modulesToDisplay.modules.length ){
				$scope.bulkSelectedModules.selectAll = false;
			}
		};

  		$scope.configureCategories = [
			{'name': 'Categories', 'tpl': 'views/configure/categories.html', 'priority': 1, 'icon': 'icon-archive'}
		];

  		var config_p = $http.get('data/config.json').then(function(resp) {
			$scope.warnings = resp.data.warnings;
			$scope.updates = resp.data.updates;
			$scope.setCatalog(resp.data.modules);
		});

		var structure_p = $http.get('data/structure.json').then(function(resp){
			$scope.shared.ourSelections = resp.data.selection;
			$scope.shared.categoriesToDisplay = $scope.ourSelections;
			$scope.categoriesToExclude = null;
			$scope.shared.moduleCategories  = resp.data.categories;
		});

		$q.all([config_p, structure_p]).then(function() {
			$scope.setTab($scope.configureCategories[0]);
			if(typeof $scope.shared.layeredFilters === 'undefined'){
				$scope.setFilters('All');
			}
			console.log('config / structure');
		});

		$scope.setTemplate = function(mode) {
			$scope.currentTemplate = mode;
		};
		init();
  });
