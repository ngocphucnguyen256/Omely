/*
 * Very simple jQuery Color Picker
 * https://github.com/tkrotoff/jquery-simplecolorpicker
 * Copyright (C) 2012-2013 Tanguy Krotoff <tkrotoff@gmail.com>
 * Licensed under the MIT license
 *
 * Modified by QsvProgram (13/01/2015)
 * - Change name to colorpicker
 * - Use "data-color" for Display color
 * - Remove method "selectColor"
 * - Add method "reload" (destroy & init)
 */

(function($) {
  'use strict';

  /**
   * Constructor.
   */
  var ColorPicker = function(select, options) {
    this.init('colorpicker', select, options);
  };

  /**
   * ColorPicker class.
   */
  ColorPicker.prototype = {
    constructor: ColorPicker,

    init: function(type, select, options) {
      var self = this;

      self.type = type;

      self.$select = $(select);
      self.$select.hide();

      self.options = $.extend({}, $.fn.colorpicker.defaults, options);

      self.$colorList = null;

      if (self.options.picker === true) {
        var selectText = self.$select.find('> option:selected').text();
        self.$icon = $('<span class="colorpicker icon"'
                     + ' title="' + selectText + '"'
                     + ' style="background-color: ' + self.$select.data('color') + ';"'
                     + ' role="button" tabindex="0">'
                     + '</span>').insertAfter(self.$select);
        self.$icon.on('click.' + self.type, $.proxy(self.showPicker, self));

        self.$picker = $('<span class="colorpicker picker ' + self.options.theme + '"></span>').appendTo(document.body);
        self.$colorList = self.$picker;

        // Hide picker when clicking outside
        $(document).on('mousedown.' + self.type, $.proxy(self.hidePicker, self));
        self.$picker.on('mousedown.' + self.type, $.proxy(self.mousedown, self));
      } else {
        self.$inline = $('<span class="colorpicker inline ' + self.options.theme + '"></span>').insertAfter(self.$select);
        self.$colorList = self.$inline;
      }

      // Build the list of colors
      // <span class="color selected" title="Green" style="background-color: #7bd148;" role="button"></span>
      self.$select.find('> option').each(function() {
        var $option = $(this);
        var color = $option.data('color');

        var isSelected = $option.is(':selected');
        var isDisabled = $option.is(':disabled');

        var selected = '';
        if (isSelected === true) {
          selected = ' data-selected';
        }

        var disabled = '';
        if (isDisabled === true) {
          disabled = ' data-disabled';
        }

        var title = '';
        if (isDisabled === false) {
          title = ' title="' + $option.text() + '"';
        }

        var role = '';
        if (isDisabled === false) {
          role = ' role="button" tabindex="0"';
        }

        var $colorSpan = $('<span class="color"'
                         + title
                         + ' style="background-color: ' + color + ';"'
                         + ' data-id="' + $option.val() + '"'
                         + ' data-color="' + color + '"'
                         + selected
                         + disabled
                         + role + '>'
                         + '</span>');

        self.$colorList.append($colorSpan);
        $colorSpan.on('click.' + self.type, $.proxy(self.colorSpanClicked, self));

        var $next = $option.next();
        if ($next.is('optgroup') === true) {
          // Vertical break, like hr
          self.$colorList.append('<span class="vr"></span>');
        }
      });
    },

    showPicker: function() {
      var pos = this.$icon.offset();
      this.$picker.css({
        // Remove some pixels to align the picker icon with the icons inside the dropdown
        left: pos.left - 6,
        top: pos.top + this.$icon.outerHeight()
      });

      this.$picker.show(this.options.pickerDelay);
    },

    hidePicker: function() {
      this.$picker.hide(this.options.pickerDelay);
    },

    /**
     * Selects the given span inside $colorList.
     *
     * The given span becomes the selected one.
     * It also changes the HTML select value, this will emit the 'change' event.
     */
    selectColorSpan: function($colorSpan) {
      // Mark this span as the selected one
      $colorSpan.siblings().removeAttr('data-selected');
      $colorSpan.attr('data-selected', '');

      if (this.options.picker === true) {
	    var color = $colorSpan.data('color'),
      		title = $colorSpan.prop('title');

        this.$icon.css('background-color', color);
        this.$icon.prop('title', title);
        this.hidePicker();
      }

      // Change HTML select value
	  var value = $colorSpan.data('id');
      this.$select.val(value);
    },

    /**
     * The user clicked on a color inside $colorList.
     */
    colorSpanClicked: function(e) {
      // When a color is clicked, make it the new selected one (unless disabled)
      if ($(e.target).is('[data-disabled]') === false) {
        this.selectColorSpan($(e.target));
        this.$select.trigger('change');
      }
    },

    /**
     * Prevents the mousedown event from "eating" the click event.
     */
    mousedown: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    destroy: function() {
      if (this.options.picker === true) {
        this.$icon.off('.' + this.type);
        this.$icon.remove();
        $(document).off('.' + this.type);
      }

      this.$colorList.off('.' + this.type);
      this.$colorList.remove();

      this.$select.removeData(this.type);
      this.$select.show();
    }
  };

  /**
   * Plugin definition.
   * How to use: $('#id').colorpicker()
   */
  $.fn.colorpicker = function(option) {
    var args = $.makeArray(arguments);
    args.shift();

    // For HTML element passed to the plugin
    return this.each(function() {
      var $this = $(this),
        data = $this.data('colorpicker'),
        options = typeof option === 'object' && option;
      if (data === undefined) {
        $this.data('colorpicker', (data = new ColorPicker(this, options)));
      }
      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };

  /**
   * Default options.
   */
  $.fn.colorpicker.defaults = {
    // No theme by default
    theme: '',

    // Show the picker or make it inline
    picker: false,

    // Animation delay in milliseconds
    pickerDelay: 0
  };

})(jQuery);
