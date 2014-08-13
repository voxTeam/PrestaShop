  <div id="modules-list" ng-controller="SearchCtrl">
    <div class="col-lg-6 panel">
      <h3 class="text-center"><i class="icon-cube"></i> "{literal}{{shared.search.term}}{/literal}" on the Catalog</h3>
      <div class="media-module" ng-repeat="module in modulesToDisplay.modules" ng-show="([module] | filter:shared.search.term).length > 0">
        <div class="media-module-container">
          <div class="row module-body">
            <div class="col-xs-2">
              <a href="" class="module-icon">
                <img class="img-responsive" ng-src="{literal}{{module.icon.src}}{/literal}" alt="{literal}{{module.icon.alt}}{/literal}">
              </a>
            </div>
            <div class="col-xs-10 module-content">
              <div class="module-title">
                {literal}{{module.title.text | limitTo: 50}}{/literal}
              </div>
              <div class="row">
                <div class="col-xs-9 module-description">
                  <p class="text-muted">{literal}{{module.description.text | limitTo: 85}}{/literal}...</p>
                </div>
                <div class="col-xs-3">
                  <div ng-show="module.price == 'free'" class="text-center module-price">{literal}{{module.price}}{/literal}</div>
                  <div ng-show="module.price != 'free'" class="text-center module-price">{literal}{{module.price | currency : $}}{/literal}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row module-footer">
            <div class="col-xs-8 module-category" ng-class="category.data.style.class">
              <span class="module-parent-category"><i ng-class="module.style.icon"></i></span>
              <span class="module-category-name">{literal}{{module.subcategory}}{/literal}</span>
              <span ng-show="module.partner" class="label label-partner pull-right"><i class="icon-certificate"></i> Official</span>
            </div>
            <div class="col-xs-4 module-author">
              by {literal}{{module.author}}{/literal}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 panel">
      <h3 class="text-center"><i class="icon-sliders"></i>  "{literal}{{shared.search.term}}{/literal}" on your Shop</h3>
      <div class="media-module" ng-repeat="module in modulesToDisplay.modules" ng-show="([module] | filter:shared.search.term).length > 0">
        <div class="media-module-container">
          <div class="row module-body">
            <div class="col-xs-2">
              <a href="" class="module-icon">
                <img class="img-responsive" ng-src="{literal}{{module.icon.src}}{/literal}" alt="{literal}{{module.icon.alt}}{/literal}">
              </a>
            </div>
            <div class="col-xs-10 module-content">
              <div class="module-title">
                {literal}{{module.title.text | limitTo: 50}}{/literal}
              </div>
              <div class="row">
                <div class="col-xs-9 module-description">
                  <p class="text-muted">{literal}{{module.description.text | limitTo: 85}}{/literal}...</p>
                </div>
                <div class="col-xs-3">
                  <div ng-show="module.price == 'free'" class="text-center module-price">{literal}{{module.price}}{/literal}</div>
                  <div ng-show="module.price != 'free'" class="text-center module-price">{literal}{{module.price | currency : $}}{/literal}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row module-footer">
            <div class="col-xs-8 module-category" ng-class="category.data.style.class">
              <span class="module-parent-category"><i ng-class="module.style.icon"></i></span>
              <span class="module-category-name">{literal}{{module.subcategory}}{/literal}</span>
              <span ng-show="module.partner" class="label label-partner pull-right"><i class="icon-certificate"></i> Official</span>
            </div>
            <div class="col-xs-4 module-author">
              by {literal}{{module.author}}{/literal}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>