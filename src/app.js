/*
window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('bootstrap');
require('daemonite-material');
*/
import 'expose-loader?Popper!popper.js';
import 'script-loader!bootstrap';
import 'script-loader!daemonite-material';


// Config
import 'script-loader!js-cookie';
import '../ext/config.js';

//tracking
import './tracking.js';

// Styles
import './app.scss';

// General
import './general.js';


// Form Control
// import './form.js';

// Floatbar, menu
import './floatbar.js';

// Modal
import './popup.js';

// Product
import './product.js';

// Article
import './article.js';
