/*
 *  Equal height all elements that match a certain selector
 *
 *  @author Pieter Beulque
 */

 /*
  * Added CSS rule check on check_css true
  * Allows for percentage units to be set
  *
  */

;(function ($, window, document, undefined) {

    "use strict";

    function EqualHeight(els, check_css) {
        this.$els = els;
        this._name = 'equalHeight';
        this.init(check_css);
    }

    EqualHeight.prototype = {
        init: function (check_css) {
            var height = 0;
            var last_spec = { elements: 0, classes: 0, ids: 0 };
            var style_set = false;
            this.$els.each(function () {
                var temp = $(this).height();
                if(check_css==true) {
                    if(this.style.height!="") {
                        temp = this.style.height;
                    } else {
                        var rules = $.fn.equalHeight.getCssRules(this);
                        for(var i = 0; i < rules.length; i++) {
                            var rule = rules[i];
                            var spec = $.fn.equalHeight.getSpecificity(rule.selectorText);
                            if($.fn.equalHeight.compareSpecificity(spec, last_spec)&&(rule.style.height!="")) {
                                style_set=true;
                                last_spec=spec;
                                temp=rule.style.height;
                            }
                        }
                    }
                    height = ($(this).height()>height) ? temp : height;
                } else {
                    height = (height < temp) ? temp : height;
                }
            }).height(height);
        }
    };

    $.fn.equalHeight = function (check_css) {
        return new EqualHeight(this, check_css);
    };
    $.fn.equalHeight.compareSpecificity = function(sp0, sp1) {
        if(sp0.ids>sp1.ids) {
            return true;
        } else if(sp0.ids<sp1.ids) {
            return false;
        } else if(sp0.classes>sp1.classes) {
            return true;
        } else if(sp0.classes<sp1.classes) {
            return false;
        } else if(sp0.elements>sp1.elements) {
            return true;
        } else if(sp0.elements<sp1.elements) {
            return false;
        }
        return true;
    }
    $.fn.equalHeight.getSpecificity = function(selector) {
        var spec={
            elements: 0,
            classes: 0,
            ids: 0
        };
        var parts = selector.split(' ');
        for(var i = 0; i < parts.length; i++) {
            var part = $.trim(parts[i]);
            if(part!='') {
                switch(part.substring(0,1)) {
                    case '.':
                        spec.classes++;
                        break;
                    case '#':
                        spec.ids++;
                        break;
                    default:
                        spec.elements++;
                        break;
                }
            }
        }
        return spec;
    }
    $.fn.equalHeight.getCssRules =  function(el) {
        var matchedrules = [];
        for(var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            for(var j = 0; j < sheet.cssRules.length; j++) {
                var rule = sheet.cssRules[j];
                var els = $(rule.selectorText);
                for(var k = 0; k < els.length; k++) {
                    if(els[k]==el) {
                        matchedrules.push(rule); } } } }
        return matchedrules;
    };
})(jQuery, window, document);
