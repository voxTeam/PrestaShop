'use strict';

/**
 * @ngdoc overview
 * @name modulesApp
 * @description
 * # modulesApp
 *
 * Main module of the application.
 */
angular
  .module('modulesApp', [
    'ngResource',
    'ngRoute',
    'wu.masonry'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'themes/'+current_admin_theme+'/template/controllers/modules/views/tabs/tab-catalog.html',
        controller: 'CatalogCtrl'
      })
      .when('/configure', {
        templateUrl: 'themes/'+current_admin_theme+'/template/controllers/modules/views/tabs/tab-configure.html',
        controller: 'ConfigureCtrl'
      })
      .when('/notifications', {
        templateUrl: 'themes/'+current_admin_theme+'/template/controllers/modules/views/tabs/tab-notifications.html',
        controller: 'ConfigureCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', function($rootScope, $location){
    var path = function() { return $location.path();};
    $rootScope.$watch(path, function(newVal, oldVal){
      $rootScope.activetab = newVal;
     });
  }]);

angular.module('modulesApp')
 //controller for the detailled view of a module
.controller('ModuleDetailsCtrl', function ($scope, focusedModule) {
    $scope.$on('focusedModuleChanged', function(event, module) {
        $scope.module = module;
    });
})
// change appearence of checkbox and allow it to be styled with css
.directive('prettyCheckbox', function() {
    return function(scope, element) {
        angular.element(element).find('input').after('<div class="checkbox-pretty"></div>');
    };
})
.service('focusedModule', function($rootScope) {
    var module;
    return {
        set: function(m) {
            module = m;
            $rootScope.$broadcast('focusedModuleChanged', module);
        },
        get: function() {
            return module;
        }
    };
})
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if ($scope.$last === true) {
                console.log('finished');
                $scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
})
.controller('MainCtrl', function ($scope, $rootScope,focusedModule) {
    //settings for masonry grid
    $scope.masonryOptions = {
        columnWidth: '.grid-sizer',
        itemSelector: '.media-module',
        loadImages: false,
        preserveOrder: true,
        isInitLayout: false,
        hiddenStyle: {
            opacity: 1,
            transform: 'scale(1)'
        }
    };

    $scope.$on('ngRepeatFinished',function(){
        console.log('finished');
    });

    // Shared scope between all views
    $scope.shared = {
        'moduleCategories': {},
        'ourSelections': {},
        'authors': {},
        'search': {}
    };
    
    $scope.checkboxFilters = {};
    $scope.catalog = {
        currentCategory: null
    };
    $scope.configure = {
        currentCategory: null
    };

    //sortBy options + default selected option
    $scope.sortOptions = ['Abc','Category', 'Most Used', 'Last Used'];

    $scope.filters = {
        sortBy: 'Category',
        byAuthor: 'All',
        byPrice: 'All',
        byStatus: 'All'
    };

    var catalog;
    $scope.setCatalog = function(theCatalog) {
        $scope.shared.authors = {};
        catalog = theCatalog;
        var id = 0;
        for (var m in catalog) {
            var module = catalog[m];
            if (!module.hasOwnProperty('id')) {
                module.id = 'auto_generated_id_' + id;
                id++;
            }
            var author = catalog[m].author;
            $scope.shared.authors[author] = ($scope.shared.authors[author] || 0) + 1;
        }
        $scope.shared.authors.All = catalog.length;
    };
    
    var stockLayeredFilters = null;

    $scope.setTab = function(cat){
        
        // click on Categories select all subcats
        if ($scope.catalog.currentCategory === 'Categories' && $rootScope.activetab === '/') {
            $scope.setFilters('All');
        }
        else if ($scope.configure.currentCategory === 'Categories' && $rootScope.activetab === '/configure') {
            $scope.setFilters('All');
        }
        //clean view to prevent clipping
        $scope.catalog.currentCatalogTabTpl = null;
        $scope.configure.currentCatalogTabTpl = null;
        $scope.catalog.currentCategory = null;
        $scope.configure.currentCategory = null;

        if ($rootScope.activetab === '/'){
            $scope.catalog.currentCategory = cat.name;
            $scope.catalog.currentCatalogTabTpl = cat.tpl;
        }
        else if ($rootScope.activetab === '/configure'){
            $scope.configure.currentCategory = cat.name;
            $scope.configure.currentCatalogTabTpl = cat.tpl;
        }

        if(cat.name === 'Categories'){
            $scope.shared.categoriesToDisplay = null;
            $scope.categoriesToExclude = {'Staff Picks': true};
            if (stockLayeredFilters !== null ){
                console.log('Give me back my precious filters', stockLayeredFilters);
                $scope.setFilters('Categories',stockLayeredFilters);
                stockLayeredFilters = null;
            }
        }
        else {
            $scope.shared.categoriesToDisplay = $scope.ourSelections;
            $scope.categoriesToExclude = null;

            if(typeof $scope.shared.layeredFilters === 'undefined'){
                console.log('Every filters have been resetted');
                $scope.setFilters('All');
            }
            else if ($scope.catalog.currentCategory !== 'Categories'){
                stockLayeredFilters = $scope.shared.layeredFilters;
                console.log('Stock filters');
                $scope.setFilters('All');
            }
        }
        $scope.updateModulesToDisplay();
    };

    $scope.setFilters = function(cat,subcat){
        var sc;
        if (cat === 'All'){
            var categories = Object.keys($scope.shared.moduleCategories);
            for( var c = 0; categories.length > c; ++c ){
                for(sc in categories[c]){
                    subcat = $scope.shared.moduleCategories[categories[c]][sc];
                    $scope.checkboxFilters[subcat] = true;
                }
            }
        } else if ( typeof subcat === 'undefined') {
            $scope.checkboxFilters = {};
            var subcats = $scope.shared.moduleCategories[cat];
            for(sc in subcats){
                subcat = subcats[sc];
                $scope.checkboxFilters[subcat] = true;
            }
        } else if ( typeof subcat === 'string') {
            $scope.checkboxFilters = {};
            $scope.checkboxFilters[subcat] = true;
        } else if (typeof subcat === 'object') {
            $scope.checkboxFilters = {};
            for(sc in subcat){
                $scope.checkboxFilters[subcat[sc]] = true;
            }
        }
        $scope.shared.layeredFilters = Object.keys($scope.checkboxFilters);
        $scope.updateModulesToDisplay();
    };

    $scope.filterSubCategories = function() {
        $scope.shared.layeredFilters = [];
        for(var filter in $scope.checkboxFilters){
            if ($scope.checkboxFilters[filter] === true){
                $scope.shared.layeredFilters.push(filter);
            }
        }
        $scope.updateModulesToDisplay();
    };

    $scope.categorySorter = function(cat) {
        return cat.data.style.priority;
    };

    $scope.modulesToDisplay = [];

    //dispatch template for module appearence
    $scope.getTemplate = function(categoryName, position, module) {
        if (categoryName === 'Staff Picks' && position === 0 ){
            return 'themes/'+current_admin_theme+'/template/controllers/modules/views/modules/module-larger.html';
        } else if ( module.supersize === true ){
            return 'themes/'+current_admin_theme+'/template/controllers/modules/views/modules/module-taller.html';
        } else {
            return 'themes/'+current_admin_theme+'/template/controllers/modules/views/modules/module.html';
        }
    };

    $scope.filterPrices = function(price) {
        $scope.filters.byPrice = price;
        $scope.updateModulesToDisplay();
    };

    $scope.filterStatus = function(status) {
        $scope.filters.byStatus = status;
        $scope.updateModulesToDisplay();
    };

    $scope.showModuleDetails = function(module){
        focusedModule.set(module);
        $('#module-details').modal('show');
    };


    /*  
    After calling $scope.updateModulesToDisplay,
    $scope.modulesToDisplay.categories will be an array of objects looking like this:

    [
        {
            name: 'categoryName'
            data: {
                style: {priority: 1, ...},
                modules: [module1, module2, ...],
                subcategories: [
                    {
                        name: 'subcategoryName',
                        data: {
                            modules: [module1, module2, ...]
                        }
                    },
                    ...
                ]
            }
        },
        ...
    ]
    */
    $scope.filterByAuthor = function(author){
        $scope.filters.byAuthor = author;
        $scope.updateModulesToDisplay();
    };

    $scope.updateModulesToDisplay = function() {
        $scope.modulesToDisplay = {
            categories: [],
            modules: []
        };
        var allModules = {};
        var modulesToDisplayByCategory = {};
        for (var m in catalog) {
            var module = catalog[m];
            var categories = module.category;
            if (Object.prototype.toString.call(categories) !== '[object Array]') {
                categories = [categories];
            }
            for (var c = 0; c < categories.length; c++) {
                var category = categories[c];
                if ($scope.categoriesToDisplay) {
                    if (!$scope.categoriesToDisplay[category]) {
                        continue;
                    }
                }
                if ($scope.categoriesToExclude) {
                    if ($scope.categoriesToExclude[category]) {
                        continue;
                    }
                }
                if ($scope.checkboxFilters[module.subcategory]) {
                    var filtered = 'ko';
                    if ($rootScope.activetab === '/') {
                        if (
                            ($scope.filters.byPrice === 'free' && module.price === 'free') ||
                            ($scope.filters.byPrice === 'paid' && module.price !== 'free') ||
                            $scope.filters.byPrice === 'All'
                        ) {
                            filtered = 'ok';
                            $scope.filters.byStatus = 'All';
                        }
                    } else if ($rootScope.activetab === '/configure') {
                        if (
                            ($scope.filters.byStatus === 'active' && module.status === 'active') ||
                            ($scope.filters.byStatus === 'inactive' && module.status !== 'active') ||
                            $scope.filters.byStatus === 'All'
                        ) {
                            filtered = 'ok';
                            $scope.filters.byPrice = 'All';
                        }
                    }
                    if ( filtered === 'ok' && $scope.filters.byAuthor !== 'All') {
                        if (module.author !== $scope.filters.byAuthor ){
                            filtered = 'ko';
                        }
                    }
                    if ( filtered === 'ok' ) {
                        if (!modulesToDisplayByCategory[category]) {
                            modulesToDisplayByCategory[category] = {
                                style: $scope.shared.ourSelections[category],
                                subcategories: {},
                                modules: {}
                            };
                        }
                        if (!modulesToDisplayByCategory[category].subcategories[module.subcategory]) {
                            modulesToDisplayByCategory[category].subcategories[module.subcategory] = {
                                modules: []
                            };
                        }
                        modulesToDisplayByCategory[category].subcategories[module.subcategory].modules.push(module);
                        modulesToDisplayByCategory[category].modules[module.id] = module;

                        allModules[module.id] = module;
                        module.style = $scope.shared.ourSelections[categories[0]];
                    }
                }
            }
        }
        // Make the Data angular friendly: transform Object-lists into Array-lists
        for (var category in modulesToDisplayByCategory) {
            var cat = {
                name: category,
                data: modulesToDisplayByCategory[category]
            };
            var modules = [];
            var i = 0;
            for (var m in modulesToDisplayByCategory[category].modules) {
                modules.push(modulesToDisplayByCategory[category].modules[m]);
            }
            modulesToDisplayByCategory[category].modules = modules;
            var subcategories = [];
            for (var subcategory in cat.data.subcategories) {
                subcategories.push({
                    name: subcategory,
                    data: cat.data.subcategories[subcategory]
                });
            }
            cat.data.subcategories = subcategories;
            $scope.modulesToDisplay.categories.push(cat);
        }
        for (var m in allModules) {
            $scope.modulesToDisplay.modules.push(allModules[m]);
        }
    };

    $scope.moduleActionInstall = function(){
        $(event.target).closest('.media-module-container').addClass('processInstall').find('.module-controls-overlay').addClass('hide');
        $(event.target).closest('.media-module-container').siblings('.module-install').removeClass('hide');
        // call back + success message
    }

});


angular.module('modulesApp')
  // main controller for the Catalog view
  .controller('CatalogCtrl', function ($scope, $http, $q, focusedModule) {
    console.log('okkkkk');
    $scope.catalogCategories = [
      {'name': 'Our Selections', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/selections.html', 'priority': 1, 'icon': 'icon-bookmark'},
      {'name': 'Official Partners', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/partners.html', 'priority': 2, 'icon': 'icon-certificate'},
      {'name': 'Categories', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/categories.html', 'priority': 3, 'icon': 'icon-archive'},
      {'name': 'Top France', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/top.html', 'priority': 4, 'icon': 'icon-trophy'},
      {'name': 'Collections', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/collections.html', 'priority': 5, 'icon': 'icon-magic'},
      {'name': 'Purchased', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/catalog/purchased.html', 'priority': 6, 'icon': 'icon-shopping-cart'}
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
    var catalog_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/catalog.json').then(function(resp) {
      $scope.setCatalog(resp.data);
    });
    var structure_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/structure.json').then(function(resp){
      $scope.shared.ourSelections = resp.data.selection;
      $scope.shared.categoriesToDisplay = $scope.ourSelections;
      $scope.categoriesToExclude = null;
      $scope.shared.moduleCategories  = resp.data.categories;
    });
    $q.all([catalog_p, structure_p]).then(function() {
      init();
    });
  });

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
      {'name': 'Categories', 'tpl': 'themes/'+current_admin_theme+'/template/controllers/modules/views/configure/categories.html', 'priority': 1, 'icon': 'icon-archive'}
    ];

      var config_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/config.json').then(function(resp) {
      $scope.warnings = resp.data.warnings;
      $scope.updates = resp.data.updates;
      $scope.setCatalog(resp.data.modules);
    });

    var structure_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/structure.json').then(function(resp){
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

angular.module('modulesApp')
  // main controller for the Catalog view
  .controller('SearchCtrl', function ($scope, $http, $q, focusedModule) {

    var catalog_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/catalog.json').then(function(resp) {
      // $scope.setCatalog(resp.data);
    });
    var config_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/config.json').then(function(resp) {
      //$scope.setCatalog(resp.data);
    });

    var structure_p = $http.get('themes/'+current_admin_theme+'/template/controllers/modules/data/structure.json').then(function(resp){
      // $scope.shared.ourSelections = resp.data.selection;
      // $scope.shared.categoriesToDisplay = $scope.ourSelections;
      // $scope.categoriesToExclude = null;
      // $scope.shared.moduleCategories  = resp.data.categories;
    });
    $q.all([catalog_p, structure_p, config_p]).then(function() {
      console.log("Init Search Controller");

    });
  });


angular.module('modulesApp').run(['$route', angular.noop]);