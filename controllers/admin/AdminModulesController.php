<?php
/*
* 2007-2014 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2014 PrestaShop SA
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

class AdminModulesControllerCore extends AdminController
{
	public function __construct()
	{
		$this->bootstrap = true;
		parent::__construct();
	}

	public function setMedia()
	{
		parent::setMedia();
		$this->addJS(_PS_JS_DIR_.'bower_components/angular/angular.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/json3/lib/json3.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/angular-resource/angular-resource.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/angular-route/angular-route.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/get-style-property/get-style-property.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/get-size/get-size.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/eventie/eventie.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/doc-ready/doc-ready.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/eventEmitter/EventEmitter.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/jquery-bridget/jquery.bridget.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/matches-selector/matches-selector.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/outlayer/item.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/outlayer/outlayer.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/masonry/masonry.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/imagesloaded/imagesloaded.js');
		$this->addJS(_PS_JS_DIR_.'bower_components/angular-masonry/angular-masonry.js');
		$this->addJS(_PS_JS_DIR_.'admin-module.js');
	}

	public function createStructure()
	{
		$data = array(
			'selection' => array(
				$this->l('Staff Picks') => array(
					'priority' => 1,
					'icon' => 'icon-thumb-tack',
					'class' => 'staff-picks',
					'filter' => 'module[\'Staff Picks\' == true]',
					'limit' => 6
				),
				$this->l('Customer Experience') => array(
					'priority' => 2,
					'icon' => 'icon-user',
					'class' => 'customer-experience',
					'limit' => 6
				),
				$this->l('Site Management') => array(
					'priority' => 3,
					'icon' => 'icon-eye',
					'class' => 'staff-management',
					'limit' => 6
				),
				$this->l('Marketing') => array(
					'priority' => 4,
					'icon' => 'icon-tags',
					'class' => 'marketing',
					'limit' => 6
				),
				$this->l('Integrations') => array(
					'priority' => 5,
					'icon' => 'icon-puzzle-piece',
					'class' => 'integrations',
					'limit' => 6
				)
			),
			'categories' => array(
				$this->l('Customer Experience') => array(
					$this->l('Checkout'),
					$this->l('Social Networks'),
					$this->l('Front office features'),
					$this->l('International & Localization'),
					$this->l('Merchandising'),
					$this->l('Mobile'),
					$this->l('Ordering Process'),
					$this->l('Slideshows'),
					$this->l('Site certification')
				),
				$this->l('Site Management') => array(
					$this->l('Administration'),
					$this->l('Taxes & Invoicing'),
					$this->l('Content Management'),
					$this->l('Dashboard'),
					$this->l('Export'),
					$this->l('Quick / Bulk update')
				),
				$this->l('Marketing') => array(
					$this->l('Advertising & Marketing'),
					$this->l('Analytics & Stats'),
					$this->l('Emailling & SMS'),
					$this->l('Marketplace'),
					$this->l('Pricing & Promotion'),
					$this->l('SEO')
				),
				$this->l('Integrations') => array(
					$this->l('Migration tools & CMS'),
					$this->l('Payments & Gateways'),
					$this->l('Shipping & Logistic'),
					$this->l('Comparators & Feed management')
				)
			)
		);

		return Tools::jsonEncode($data);
	}
}
