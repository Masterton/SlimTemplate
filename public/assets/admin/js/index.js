define(['jquery', 'utils', 'bootstrap-notify', 'metisMenu'], function($, utils) {
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
// layout/startmin.js
$('#side-menu').metisMenu();

// Loads the correct sidebar on window load,
// collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
// $(window).bind("load resize", function() {
//     var topOffset = 50;
//     var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
//     if (width < 768) {
//         $('div.navbar-collapse').addClass('collapse');
//         topOffset = 100; // 2-row-menu
//     } else {
//         $('div.navbar-collapse').removeClass('collapse');
//     }

//     var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
//     height = height - topOffset;
//     if (height < 1) height = 1;
//     if (height > topOffset) {
//         $("#page-wrapper").css("min-height", (height) + "px");
//     }
// });

var element = $('ul.nav a').filter(function() {
    var current_id = $(this).parent().attr('sidebar-id');
    return current_id && (current_id == GLOBAL.PAGE_ID);
}).addClass('active').parent().parent().addClass('in').parent();
if (element.is('li')) {
    element.addClass('active').addClass('sidebar-highlight');
}

function adjustHeight() {
    var top_height = $('.navbar > .navbar-header').height(),
        max_height = $(window).height();
    $('.sidebar .sidebar-nav').height(max_height - top_height - 8);
    $('#page-wrapper').css('min-height', ($('.sidebar .sidebar-nav').height() + 35) + 'px');
}
// layout/__call__.js
// 判断是否是数字
function isNumber(a) {
    return (
        (typeof a == 'number') ||
        (
            (typeof a == 'string') &&
            a.length > 0 &&
            !isNaN(a)
        )
    );
}

adjustHeight();

$(window).off('resize').on('resize', function() {
    adjustHeight();
});
// index/__call__.js

   });
});