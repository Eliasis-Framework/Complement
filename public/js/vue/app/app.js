/**
 * PHP library for adding addition of modules for Eliasis Framework.
 *
 * @author     Josantonius - hello@josantonius.com
 * @copyright  Copyright (c) 2017
 * @license    https://opensource.org/licenses/MIT - The MIT License (MIT)
 * @link       https://github.com/Eliasis-Framework/Module
 * @since      1.0.8
 */

var states = {

  'active': {
      'en': 'active',
      'es': 'activo',
  },
  'inactive': {
      'en': 'activate',
      'es': 'activar',
  },
  'installed': {
      'en': 'activate',
      'es': 'activar',
  },
  'outdated': {
      'en': 'update',
      'es': 'actualizar',
  },
  'uninstalled': {
      'en': 'install',
      'es': 'instalar',
  },
  'uninstall': {
      'en': 'uninstall',
      'es': 'desinstalar',
  }
};

var lang = navigator.language || navigator.userLanguage || 'en';

var setting = document.getElementById('modules-filter');

var appID        = setting.getAttribute('data-app');
var moduleSort   = setting.getAttribute('data-sort');
var moduleFilter = setting.getAttribute('data-filter');
var externalUrls = setting.getAttribute('data-external');


function setUrl(params) {

	var url = window.location.href;

	url += (!url.indexOf('?') ? '?' : '&') + 'vue=true';

	Object.keys(params).forEach(function(key) {

		url += '&' + key + '=' + params[key];

	});

	return url;
}


Vue.component('state-buttons', {

	data: function () {

	  return {

	  	id:            false,
	  	state:         false,
	  	message:       false,
	  	removeButton:  false,
		  isActive:      false,
		  isInactive:    false,
		  isOutdated:    false,
		  isInstall:     false,
		  isUninstalled: false,
		  isUninstall:   false,
      theErrors:     [],
      theVersion:    ''
	  }
	},

  watch: {

    'theErrors': function() {

      this.$emit('input', this.theErrors);
    },
  },

  watch: {

    'theVersion': function() {

      this.$emit('input', this.theVersion);
    }
  },

  created: function() {

		this.removeButton = states['uninstall'][lang];

  },

  methods: {

	  resetStates: function(){

		  this.isActive       = false;
		  this.isInactive     = false;
		  this.isOutdated     = false;
		  this.isInstall      = false;
		  this.isUninstalled  = false;
			this.isUninstall    = false;
	  },

	  changeState: function(){

	  	this.id = this.moduleId;

      var request = 'change-state';

	  	if (this.state == 'uninstalled' || this.state == 'outdated') {

        this.resetStates();

	  		this.isInstall = true;

        request = 'install';
	  	}

      var url = setUrl({

        request:  request,
        app:      appID,
        id:       this.id,
        state:    this.state,
        external: externalUrls

      });

      this.$http.get(url).then(function(response) {

        var state = response.body.state;

        this.resetStates();

        this.state = (state === false) ? this.state : state;

        if (typeof response.body.version !== 'undefined') {
          
          this.theVersion = response.body.version;
        }

        this.theErrors = response.body.errors;

      });
	  },

	  uninstall: function() {

      this.id = this.moduleId;

	  	this.isUninstall = true;

      var url = setUrl({

        request: 'uninstall',
        app:      appID,
        id:       this.id,
        external: externalUrls

      });

      this.$http.get(url).then(function(response) {
        
        var that = this;
        
        setTimeout(function() {

          var state = response.body.state;

          that.state = (state === false) ? that.state : state;

          that.theErrors = response.body.errors;

        }, 1000);
      });
	  },
  },

	computed: {

	  changeButtonState: function () {
      
      this.resetStates();
      
      this.state = this.state ? this.state : this.moduleState;

		  this.message = states[this.state][lang];

	    switch (this.state) {

	      case 'active':      this.isActive      = true; break;
	      case 'inactive':    this.isInactive    = true; break;
	      case 'outdated':    this.isOutdated    = true; break;
	      case 'uninstalled': this.isUninstalled = true; break;
	    }

	    return this.message;
	  }
	},

	props: ['moduleId', 'moduleState', 'errors', 'module.version'],
})

var app = new Vue({

  el: '#eliasis-modules',

  data: { 
    modules: [],
    errors:  []
  },

  created: function() {

		var url = setUrl({

      request: 'load-modules',
      app:      appID,
      sort:     moduleSort,
      filter:   moduleFilter,
      external: externalUrls

   	});

		this.$http.get(url).then(function(response) {

			this.modules = response.body.modules;

	    this.errors = response.body.errors;

		});

  }

});
