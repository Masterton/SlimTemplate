define(['jquery', 'utils', 'bootstrap-notify'], function($, utils) {
   'use strict';
   $(function() {
      // merge-common/js/notify.js
/**
 * notify　提示
 */
function _notify(msg, close_callback, callback_params, type, speed) {
    if(!type) {
        type = 'info';
    }
    if(!speed) {
        speed = 1600;
    }
    $.notify({
        message: msg
    }, {
        type: type,
        delay: speed,
        timer: 200,
        z_index: 1051, // z-index of bootstrap-modal is 1050
        placement: {
            align: 'center'
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        onClose: function() {
            if(typeof close_callback == 'function') {
                close_callback(callback_params);
            }
        }
    });
}

/**
 * notify-success
 */
function notifySuccess(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'success');
}

/**
 * notify-info
 */
function notifyInfo(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'info');
}

/**
 * notify-warning
 */
function notifyWarning(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'warning');
}

/**
 * notify-danger
 */
function notifyDanger(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'danger');
}
// merge-common/js/highlight-current.js
function highlightCurrent() {
    var $current_bar = $('#navbar').find('li[data-bar="' + GLOBAL.CURRENT + '"]');
    if($current_bar.length > 0) {
        if(!$current_bar.hasClass('nav-current')) {
            $current_bar.addClass('nav-current');
        }
    }
}

highlightCurrent();
// retrieve_password/main.js

// retrieve_password/__call__.js

   });
});