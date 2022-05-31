/* polyfill start */
// forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
/* polyfill end */

// modal
function modal() {
  if ($('.modal').length > 0) {
    var modal_CN = '.modal';
    var open_CN = 'modal-open';
    var backdrop = '<div class="modal-backdrop"></div>';
    var backdrop_CN = '.modal-backdrop';
    var content_CN = '.modal-content';
    var body_CN = '.modal-body';
    var show_CN = 'show';
    var modalShow_CN = modal_CN + '.' + show_CN;
    var strict_CN = 'strict';
    var zIndex = $(modal_CN).css('z-index');

    function modalMaxHeight(element) {
      var targetContent = element.find(content_CN);
      var targetBody = element.find(body_CN);
      if (targetContent.outerHeight() <= 0) {
        targetBody.css('max-height', 600);
      } else {
        targetBody.css('max-height',
          $(this).innerHeight() - (
            element.find('.modal-header').outerHeight() +
            (element.find('.modal-footer').outerHeight() || 0)) - 100);
      }
    };

    function openBackdrop() {
      if ($(backdrop_CN).length > 0) return;
      $('body').addClass(open_CN);
      $('body').append(backdrop);
      $(backdrop_CN).addClass(show_CN);
    };

    function openModal(target) {
      openBackdrop();
      if ($(modalShow_CN).length > 0) {
        $(modalShow_CN).css('z-index', zIndex - 1);
      };
      $('#' + target).show();
      modalMaxHeight($('#' + target));
      setTimeout(function () {
        $('#' + target).addClass(show_CN);
      }, 100);
    };

    $(document).on('click', '[data-toggle="modal"]', function (event) {
      var target = $(this).attr('data-target');
      if (this.tagName === 'A') event.preventDefault();
      openModal(target);
    });

    $(document).on('click', '.modal, [data-dismiss="modal"]', function (event) {
      var dismissTarget = $(this).closest('.modal');

      function closeModal() {
        $('body').removeClass(open_CN);
        $(dismissTarget).removeClass(show_CN);
        if ($(modalShow_CN).length > 0) {
          $(modalShow_CN).last().css('z-index', zIndex);
          setTimeout(function () {
            $(dismissTarget).hide();
          }, 300);
          return;
        };
        setTimeout(function () {
          $(backdrop_CN).removeClass(show_CN);
        }, 100);
        setTimeout(function () {
          $(backdrop_CN).remove();
          $(dismissTarget).hide();
        }, 300);
      };
      if ((event.target === event.currentTarget)) {
        if ($(this).hasClass(strict_CN)) return;
        closeModal();
      };
    });

    if ($(modal_CN).hasClass(show_CN)) {
      openBackdrop();
      $(modalShow_CN).show();
      modalMaxHeight($(modalShow_CN));
    };
  };
};
modal();

// popup
function popup(url, name, width, height) {
  var top = (window.innerHeight - height) / 2 + screenY;
  var left = (window.innerWidth - width) / 2 + screenX;
  var option = "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left + ", scrollbars=yes"
  window.open(url, name, option);
};

}(jQuery));
