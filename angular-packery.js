/*!
 * angular-packery 0.1.0
 * License: MIT
 */
(function () {
  'use strict';
  angular.module('wu.packery', []).controller('PackeryCtrl', [
    '$scope',
    '$element',
    '$timeout',
    function controller($scope, $element, $timeout) {
      var bricks = {};
      var schedule = [];
      var destroyed = false;
      var self = this;
      var timeout = null;
      this.preserveOrder = false;
      this.loadImages = true;
      this.schedulePackeryOnce = function schedulePackeryOnce() {
        var args = arguments;
        var found = schedule.filter(function filterFn(item) {
            return item[0] === args[0];
          }).length > 0;
        if (!found) {
          this.schedulePackery.apply(null, arguments);
        }
      };
      // Make sure it's only executed once within a reasonable time-frame in
      // case multiple elements are removed or added at once.
      this.schedulePackery = function schedulePackery() {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        schedule.push([].slice.call(arguments));
        timeout = $timeout(function runPackery() {
          if (destroyed) {
            return;
          }
          schedule.forEach(function scheduleForEach(args) {
            $element.packery.apply($element, args);
          });
          schedule = [];
        }, 30);
      };
      function defaultLoaded($element) {
        $element.addClass('loaded');
      }
      this.appendBrick = function appendBrick(element, id) {
        if (destroyed) {
          return;
        }
        function _append() {
          if (Object.keys(bricks).length === 0) {
            $element.packery('bindResize');
          }
          if (bricks[id] === undefined) {
            // Keep track of added elements.
            bricks[id] = true;
            defaultLoaded(element);
            $element.packery('appended', element, true);
          }
        }
        function _layout() {
          // I wanted to make this dynamic but ran into huuuge memory leaks
          // that I couldn't fix. If you know how to dynamically add a
          // callback so one could say <packery loaded="callback($element)">
          // please submit a pull request!
          self.schedulePackeryOnce('layout');
        }
        if (!self.loadImages) {
          _append();
          _layout();
        } else if (self.preserveOrder) {
          _append();
          element.imagesLoaded(_layout);
        } else {
          element.imagesLoaded(function imagesLoaded() {
            _append();
            _layout();
          });
        }
      };
      this.removeBrick = function removeBrick(id, element) {
        if (destroyed) {
          return;
        }
        delete bricks[id];
        $element.packery('remove', element);
        this.schedulePackeryOnce('layout');
      };
      this.destroy = function destroy() {
        destroyed = true;
        if ($element.data('packery')) {
          // Gently uninitialize if still present
          $element.packery('destroy');
        }
        $scope.$emit('packery.destroyed');
        bricks = [];
      };
      this.reload = function reload() {
        $element.packery();
        $scope.$emit('packery.reloaded');
      };
    }
  ]).directive('packery', function packeryDirective() {
    return {
      restrict: 'AE',
      controller: 'PackeryCtrl',
      link: {
        pre: function preLink(scope, element, attrs, ctrl) {
          var attrOptions = scope.$eval(attrs.packery || attrs.packeryOptions);
          var options = angular.extend({
              itemSelector: attrs.itemSelector || '.packery-brick',
              columnWidth: parseInt(attrs.columnWidth, 10) || attrs.columnWidth
            }, attrOptions || {});
          element.packery(options);
          var loadImages = scope.$eval(attrs.loadImages);
          ctrl.loadImages = loadImages !== false;
          var preserveOrder = scope.$eval(attrs.preserveOrder);
          ctrl.preserveOrder = preserveOrder !== false && attrs.preserveOrder !== undefined;
          var reloadOnShow = scope.$eval(attrs.reloadOnShow);
          if (reloadOnShow !== false && attrs.reloadOnShow !== undefined) {
            scope.$watch(function () {
              return element.prop('offsetParent');
            }, function (isVisible, wasVisible) {
              if (isVisible && !wasVisible) {
                ctrl.reload();
              }
            });
          }
          scope.$emit('packery.created', element);
          scope.$on('$destroy', ctrl.destroy);
        }
      }
    };
  }).directive('packeryBrick', function packeryBrickDirective() {
    return {
      restrict: 'AC',
      require: '^packery',
      scope: true,
      link: {
        pre: function preLink(scope, element, attrs, ctrl) {
          var id = scope.$id, index;
          ctrl.appendBrick(element, id);
          element.on('$destroy', function () {
            ctrl.removeBrick(id, element);
          });
          scope.$on('packery.reload', function () {
            ctrl.schedulePackeryOnce('reloadItems');
            ctrl.schedulePackeryOnce('layout');
          });
          scope.$watch('$index', function () {
            if (index !== undefined && index !== scope.$index) {
              ctrl.schedulePackeryOnce('reloadItems');
              ctrl.schedulePackeryOnce('layout');
            }
            index = scope.$index;
          });
        }
      }
    };
  });
}());