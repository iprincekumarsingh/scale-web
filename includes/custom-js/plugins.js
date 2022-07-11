/*-------------------------------------------------------------------------------------
[TABLE OF CONTENTS]
01. SMARTMENUS
02. STICKY HEADER
03. PICTUREFILL
04. HAMBURGER MENU ICON
05. SVG INJECT
06. ISOTOPE
07. OWL CAROUSEL
08. PLYR
07. LIGHTGALLERY
08. MOUSEWHEEL
09. VALIDATOR
10. PROGRESSBAR
11. WAYPOINTS
12. COUNTER UP
13. VIDEO WRAPPER
14. TYPER
15. RELLAX
16. ITOOLTIP
17. SHOW MORE ITEMS
18. SCROLLCUE
19. EASING
-------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/
/*	01. SMARTMENUS
/*-----------------------------------------------------------------------------------*/
/*! SmartMenus jQuery Plugin - v1.1.1 - July 23, 2020
 * http://www.smartmenus.org/
 * Copyright Vasil Dinkov, Vadikom Web Ltd. http://vadikom.com; Licensed MIT */
(function (t) {
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = t(require("jquery")))
    : t(jQuery);
})(function ($) {
  function initMouseDetection(t) {
    var e = ".smartmenus_mouse";
    if (mouseDetectionEnabled || t)
      mouseDetectionEnabled &&
        t &&
        ($(document).off(e), (mouseDetectionEnabled = !1));
    else {
      var i = !0,
        s = null,
        o = {
          mousemove: function (t) {
            var e = { x: t.pageX, y: t.pageY, timeStamp: new Date().getTime() };
            if (s) {
              var o = Math.abs(s.x - e.x),
                a = Math.abs(s.y - e.y);
              if (
                (o > 0 || a > 0) &&
                4 >= o &&
                4 >= a &&
                300 >= e.timeStamp - s.timeStamp &&
                ((mouse = !0), i)
              ) {
                var n = $(t.target).closest("a");
                n.is("a") &&
                  $.each(menuTrees, function () {
                    return $.contains(this.$root[0], n[0])
                      ? (this.itemEnter({ currentTarget: n[0] }), !1)
                      : void 0;
                  }),
                  (i = !1);
              }
            }
            s = e;
          },
        };
      (o[
        touchEvents
          ? "touchstart"
          : "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"
      ] = function (t) {
        isTouchEvent(t.originalEvent) && (mouse = !1);
      }),
        $(document).on(getEventsNS(o, e)),
        (mouseDetectionEnabled = !0);
    }
  }
  function isTouchEvent(t) {
    return !/^(4|mouse)$/.test(t.pointerType);
  }
  function getEventsNS(t, e) {
    e || (e = "");
    var i = {};
    for (var s in t) i[s.split(" ").join(e + " ") + e] = t[s];
    return i;
  }
  var menuTrees = [],
    mouse = !1,
    touchEvents = "ontouchstart" in window,
    mouseDetectionEnabled = !1,
    requestAnimationFrame =
      window.requestAnimationFrame ||
      function (t) {
        return setTimeout(t, 1e3 / 60);
      },
    cancelAnimationFrame =
      window.cancelAnimationFrame ||
      function (t) {
        clearTimeout(t);
      },
    canAnimate = !!$.fn.animate;
  return (
    ($.SmartMenus = function (t, e) {
      (this.$root = $(t)),
        (this.opts = e),
        (this.rootId = ""),
        (this.accessIdPrefix = ""),
        (this.$subArrow = null),
        (this.activatedItems = []),
        (this.visibleSubMenus = []),
        (this.showTimeout = 0),
        (this.hideTimeout = 0),
        (this.scrollTimeout = 0),
        (this.clickActivated = !1),
        (this.focusActivated = !1),
        (this.zIndexInc = 0),
        (this.idInc = 0),
        (this.$firstLink = null),
        (this.$firstSub = null),
        (this.disabled = !1),
        (this.$disableOverlay = null),
        (this.$touchScrollingSub = null),
        (this.cssTransforms3d =
          "perspective" in t.style || "webkitPerspective" in t.style),
        (this.wasCollapsible = !1),
        this.init();
    }),
    $.extend($.SmartMenus, {
      hideAll: function () {
        $.each(menuTrees, function () {
          this.menuHideAll();
        });
      },
      destroy: function () {
        for (; menuTrees.length; ) menuTrees[0].destroy();
        initMouseDetection(!0);
      },
      prototype: {
        init: function (t) {
          var e = this;
          if (!t) {
            menuTrees.push(this),
              (this.rootId = (
                new Date().getTime() +
                Math.random() +
                ""
              ).replace(/\D/g, "")),
              (this.accessIdPrefix = "sm-" + this.rootId + "-"),
              this.$root.hasClass("sm-rtl") &&
                (this.opts.rightToLeftSubMenus = !0);
            var i = ".smartmenus";
            this.$root
              .data("smartmenus", this)
              .attr("data-smartmenus-id", this.rootId)
              .dataSM("level", 1)
              .on(
                getEventsNS(
                  {
                    "mouseover focusin": $.proxy(this.rootOver, this),
                    "mouseout focusout": $.proxy(this.rootOut, this),
                    keydown: $.proxy(this.rootKeyDown, this),
                  },
                  i
                )
              )
              .on(
                getEventsNS(
                  {
                    mouseenter: $.proxy(this.itemEnter, this),
                    mouseleave: $.proxy(this.itemLeave, this),
                    mousedown: $.proxy(this.itemDown, this),
                    focus: $.proxy(this.itemFocus, this),
                    blur: $.proxy(this.itemBlur, this),
                    click: $.proxy(this.itemClick, this),
                  },
                  i
                ),
                "a"
              ),
              (i += this.rootId),
              this.opts.hideOnClick &&
                $(document).on(
                  getEventsNS(
                    {
                      touchstart: $.proxy(this.docTouchStart, this),
                      touchmove: $.proxy(this.docTouchMove, this),
                      touchend: $.proxy(this.docTouchEnd, this),
                      click: $.proxy(this.docClick, this),
                    },
                    i
                  )
                ),
              $(window).on(
                getEventsNS(
                  { "resize orientationchange": $.proxy(this.winResize, this) },
                  i
                )
              ),
              this.opts.subIndicators &&
                ((this.$subArrow = $("<span/>").addClass("sub-arrow")),
                this.opts.subIndicatorsText &&
                  this.$subArrow.html(this.opts.subIndicatorsText)),
              initMouseDetection();
          }
          if (
            ((this.$firstSub = this.$root
              .find("ul")
              .each(function () {
                e.menuInit($(this));
              })
              .eq(0)),
            (this.$firstLink = this.$root.find("a").eq(0)),
            this.opts.markCurrentItem)
          ) {
            var s = /(index|default)\.[^#\?\/]*/i,
              o = /#.*/,
              a = window.location.href.replace(s, ""),
              n = a.replace(o, "");
            this.$root.find("a:not(.mega-menu a)").each(function () {
              var t = this.href.replace(s, ""),
                i = $(this);
              (t == a || t == n) &&
                (i.addClass("current"),
                e.opts.markCurrentTree &&
                  i
                    .parentsUntil("[data-smartmenus-id]", "ul")
                    .each(function () {
                      $(this).dataSM("parent-a").addClass("current");
                    }));
            });
          }
          this.wasCollapsible = this.isCollapsible();
        },
        destroy: function (t) {
          if (!t) {
            var e = ".smartmenus";
            this.$root
              .removeData("smartmenus")
              .removeAttr("data-smartmenus-id")
              .removeDataSM("level")
              .off(e),
              (e += this.rootId),
              $(document).off(e),
              $(window).off(e),
              this.opts.subIndicators && (this.$subArrow = null);
          }
          this.menuHideAll();
          var i = this;
          this.$root
            .find("ul")
            .each(function () {
              var t = $(this);
              t.dataSM("scroll-arrows") && t.dataSM("scroll-arrows").remove(),
                t.dataSM("shown-before") &&
                  ((i.opts.subMenusMinWidth || i.opts.subMenusMaxWidth) &&
                    t
                      .css({ width: "", minWidth: "", maxWidth: "" })
                      .removeClass("sm-nowrap"),
                  t.dataSM("scroll-arrows") &&
                    t.dataSM("scroll-arrows").remove(),
                  t.css({
                    zIndex: "",
                    top: "",
                    left: "",
                    marginLeft: "",
                    marginTop: "",
                    display: "",
                  })),
                0 == (t.attr("id") || "").indexOf(i.accessIdPrefix) &&
                  t.removeAttr("id");
            })
            .removeDataSM("in-mega")
            .removeDataSM("shown-before")
            .removeDataSM("scroll-arrows")
            .removeDataSM("parent-a")
            .removeDataSM("level")
            .removeDataSM("beforefirstshowfired")
            .removeAttr("role")
            .removeAttr("aria-hidden")
            .removeAttr("aria-labelledby")
            .removeAttr("aria-expanded"),
            this.$root
              .find("a.has-submenu")
              .each(function () {
                var t = $(this);
                0 == t.attr("id").indexOf(i.accessIdPrefix) &&
                  t.removeAttr("id");
              })
              .removeClass("has-submenu")
              .removeDataSM("sub")
              .removeAttr("aria-haspopup")
              .removeAttr("aria-controls")
              .removeAttr("aria-expanded")
              .closest("li")
              .removeDataSM("sub"),
            this.opts.subIndicators &&
              this.$root.find("span.sub-arrow").remove(),
            this.opts.markCurrentItem &&
              this.$root.find("a.current").removeClass("current"),
            t ||
              ((this.$root = null),
              (this.$firstLink = null),
              (this.$firstSub = null),
              this.$disableOverlay &&
                (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
              menuTrees.splice($.inArray(this, menuTrees), 1));
        },
        disable: function (t) {
          if (!this.disabled) {
            if (
              (this.menuHideAll(),
              !t && !this.opts.isPopup && this.$root.is(":visible"))
            ) {
              var e = this.$root.offset();
              this.$disableOverlay = $(
                '<div class="sm-jquery-disable-overlay"/>'
              )
                .css({
                  position: "absolute",
                  top: e.top,
                  left: e.left,
                  width: this.$root.outerWidth(),
                  height: this.$root.outerHeight(),
                  zIndex: this.getStartZIndex(!0),
                  opacity: 0,
                })
                .appendTo(document.body);
            }
            this.disabled = !0;
          }
        },
        docClick: function (t) {
          return this.$touchScrollingSub
            ? ((this.$touchScrollingSub = null), void 0)
            : (((this.visibleSubMenus.length &&
                !$.contains(this.$root[0], t.target)) ||
                $(t.target).closest("a").length) &&
                this.menuHideAll(),
              void 0);
        },
        docTouchEnd: function () {
          if (this.lastTouch) {
            if (
              !(
                !this.visibleSubMenus.length ||
                (void 0 !== this.lastTouch.x2 &&
                  this.lastTouch.x1 != this.lastTouch.x2) ||
                (void 0 !== this.lastTouch.y2 &&
                  this.lastTouch.y1 != this.lastTouch.y2) ||
                (this.lastTouch.target &&
                  $.contains(this.$root[0], this.lastTouch.target))
              )
            ) {
              this.hideTimeout &&
                (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
              var t = this;
              this.hideTimeout = setTimeout(function () {
                t.menuHideAll();
              }, 350);
            }
            this.lastTouch = null;
          }
        },
        docTouchMove: function (t) {
          if (this.lastTouch) {
            var e = t.originalEvent.touches[0];
            (this.lastTouch.x2 = e.pageX), (this.lastTouch.y2 = e.pageY);
          }
        },
        docTouchStart: function (t) {
          var e = t.originalEvent.touches[0];
          this.lastTouch = { x1: e.pageX, y1: e.pageY, target: e.target };
        },
        enable: function () {
          this.disabled &&
            (this.$disableOverlay &&
              (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
            (this.disabled = !1));
        },
        getClosestMenu: function (t) {
          for (var e = $(t).closest("ul"); e.dataSM("in-mega"); )
            e = e.parent().closest("ul");
          return e[0] || null;
        },
        getHeight: function (t) {
          return this.getOffset(t, !0);
        },
        getOffset: function (t, e) {
          var i;
          "none" == t.css("display") &&
            ((i = {
              position: t[0].style.position,
              visibility: t[0].style.visibility,
            }),
            t.css({ position: "absolute", visibility: "hidden" }).show());
          var s = t[0].getBoundingClientRect && t[0].getBoundingClientRect(),
            o =
              s &&
              (e ? s.height || s.bottom - s.top : s.width || s.right - s.left);
          return (
            o || 0 === o || (o = e ? t[0].offsetHeight : t[0].offsetWidth),
            i && t.hide().css(i),
            o
          );
        },
        getStartZIndex: function (t) {
          var e = parseInt(this[t ? "$root" : "$firstSub"].css("z-index"));
          return (
            !t && isNaN(e) && (e = parseInt(this.$root.css("z-index"))),
            isNaN(e) ? 1 : e
          );
        },
        getTouchPoint: function (t) {
          return (
            (t.touches && t.touches[0]) ||
            (t.changedTouches && t.changedTouches[0]) ||
            t
          );
        },
        getViewport: function (t) {
          var e = t ? "Height" : "Width",
            i = document.documentElement["client" + e],
            s = window["inner" + e];
          return s && (i = Math.min(i, s)), i;
        },
        getViewportHeight: function () {
          return this.getViewport(!0);
        },
        getViewportWidth: function () {
          return this.getViewport();
        },
        getWidth: function (t) {
          return this.getOffset(t);
        },
        handleEvents: function () {
          return !this.disabled && this.isCSSOn();
        },
        handleItemEvents: function (t) {
          return this.handleEvents() && !this.isLinkInMegaMenu(t);
        },
        isCollapsible: function () {
          return "static" == this.$firstSub.css("position");
        },
        isCSSOn: function () {
          return "inline" != this.$firstLink.css("display");
        },
        isFixed: function () {
          var t = "fixed" == this.$root.css("position");
          return (
            t ||
              this.$root.parentsUntil("body").each(function () {
                return "fixed" == $(this).css("position")
                  ? ((t = !0), !1)
                  : void 0;
              }),
            t
          );
        },
        isLinkInMegaMenu: function (t) {
          return $(this.getClosestMenu(t[0])).hasClass("mega-menu");
        },
        isTouchMode: function () {
          return !mouse || this.opts.noMouseOver || this.isCollapsible();
        },
        itemActivate: function (t, e) {
          var i = t.closest("ul"),
            s = i.dataSM("level");
          if (
            s > 1 &&
            (!this.activatedItems[s - 2] ||
              this.activatedItems[s - 2][0] != i.dataSM("parent-a")[0])
          ) {
            var o = this;
            $(i.parentsUntil("[data-smartmenus-id]", "ul").get().reverse())
              .add(i)
              .each(function () {
                o.itemActivate($(this).dataSM("parent-a"));
              });
          }
          if (
            ((!this.isCollapsible() || e) &&
              this.menuHideSubMenus(
                this.activatedItems[s - 1] &&
                  this.activatedItems[s - 1][0] == t[0]
                  ? s
                  : s - 1
              ),
            (this.activatedItems[s - 1] = t),
            this.$root.triggerHandler("activate.smapi", t[0]) !== !1)
          ) {
            var a = t.dataSM("sub");
            a &&
              (this.isTouchMode() ||
                !this.opts.showOnClick ||
                this.clickActivated) &&
              this.menuShow(a);
          }
        },
        itemBlur: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            this.$root.triggerHandler("blur.smapi", e[0]);
        },
        itemClick: function (t) {
          var e = $(t.currentTarget);
          if (this.handleItemEvents(e)) {
            if (
              this.$touchScrollingSub &&
              this.$touchScrollingSub[0] == e.closest("ul")[0]
            )
              return (this.$touchScrollingSub = null), t.stopPropagation(), !1;
            if (this.$root.triggerHandler("click.smapi", e[0]) === !1)
              return !1;
            var i = e.dataSM("sub"),
              s = i ? 2 == i.dataSM("level") : !1;
            if (i) {
              var o = $(t.target).is(".sub-arrow"),
                a = this.isCollapsible(),
                n = /toggle$/.test(this.opts.collapsibleBehavior),
                r = /link$/.test(this.opts.collapsibleBehavior),
                h = /^accordion/.test(this.opts.collapsibleBehavior);
              if (i.is(":visible")) {
                if (!a && this.opts.showOnClick && s)
                  return (
                    this.menuHide(i),
                    (this.clickActivated = !1),
                    (this.focusActivated = !1),
                    !1
                  );
                if (a && (n || o))
                  return this.itemActivate(e, h), this.menuHide(i), !1;
              } else if (
                (!r || !a || o) &&
                (!a && this.opts.showOnClick && s && (this.clickActivated = !0),
                this.itemActivate(e, h),
                i.is(":visible"))
              )
                return (this.focusActivated = !0), !1;
            }
            return (!a && this.opts.showOnClick && s) ||
              e.hasClass("disabled") ||
              this.$root.triggerHandler("select.smapi", e[0]) === !1
              ? !1
              : void 0;
          }
        },
        itemDown: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) && e.dataSM("mousedown", !0);
        },
        itemEnter: function (t) {
          var e = $(t.currentTarget);
          if (this.handleItemEvents(e)) {
            if (!this.isTouchMode()) {
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0));
              var i = this;
              this.showTimeout = setTimeout(
                function () {
                  i.itemActivate(e);
                },
                this.opts.showOnClick && 1 == e.closest("ul").dataSM("level")
                  ? 1
                  : this.opts.showTimeout
              );
            }
            this.$root.triggerHandler("mouseenter.smapi", e[0]);
          }
        },
        itemFocus: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            (!this.focusActivated ||
              (this.isTouchMode() && e.dataSM("mousedown")) ||
              (this.activatedItems.length &&
                this.activatedItems[this.activatedItems.length - 1][0] ==
                  e[0]) ||
              this.itemActivate(e, !0),
            this.$root.triggerHandler("focus.smapi", e[0]));
        },
        itemLeave: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            (this.isTouchMode() ||
              (e[0].blur(),
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0))),
            e.removeDataSM("mousedown"),
            this.$root.triggerHandler("mouseleave.smapi", e[0]));
        },
        menuHide: function (t) {
          if (
            this.$root.triggerHandler("beforehide.smapi", t[0]) !== !1 &&
            (canAnimate && t.stop(!0, !0), "none" != t.css("display"))
          ) {
            var e = function () {
              t.css("z-index", "");
            };
            this.isCollapsible()
              ? canAnimate && this.opts.collapsibleHideFunction
                ? this.opts.collapsibleHideFunction.call(this, t, e)
                : t.hide(this.opts.collapsibleHideDuration, e)
              : canAnimate && this.opts.hideFunction
              ? this.opts.hideFunction.call(this, t, e)
              : t.hide(this.opts.hideDuration, e),
              t.dataSM("scroll") &&
                (this.menuScrollStop(t),
                t
                  .css({
                    "touch-action": "",
                    "-ms-touch-action": "",
                    "-webkit-transform": "",
                    transform: "",
                  })
                  .off(".smartmenus_scroll")
                  .removeDataSM("scroll")
                  .dataSM("scroll-arrows")
                  .hide()),
              t
                .dataSM("parent-a")
                .removeClass("highlighted")
                .attr("aria-expanded", "false"),
              t.attr({ "aria-expanded": "false", "aria-hidden": "true" });
            var i = t.dataSM("level");
            this.activatedItems.splice(i - 1, 1),
              this.visibleSubMenus.splice(
                $.inArray(t, this.visibleSubMenus),
                1
              ),
              this.$root.triggerHandler("hide.smapi", t[0]);
          }
        },
        menuHideAll: function () {
          this.showTimeout &&
            (clearTimeout(this.showTimeout), (this.showTimeout = 0));
          for (
            var t = this.opts.isPopup ? 1 : 0,
              e = this.visibleSubMenus.length - 1;
            e >= t;
            e--
          )
            this.menuHide(this.visibleSubMenus[e]);
          this.opts.isPopup &&
            (canAnimate && this.$root.stop(!0, !0),
            this.$root.is(":visible") &&
              (canAnimate && this.opts.hideFunction
                ? this.opts.hideFunction.call(this, this.$root)
                : this.$root.hide(this.opts.hideDuration))),
            (this.activatedItems = []),
            (this.visibleSubMenus = []),
            (this.clickActivated = !1),
            (this.focusActivated = !1),
            (this.zIndexInc = 0),
            this.$root.triggerHandler("hideAll.smapi");
        },
        menuHideSubMenus: function (t) {
          for (var e = this.activatedItems.length - 1; e >= t; e--) {
            var i = this.activatedItems[e].dataSM("sub");
            i && this.menuHide(i);
          }
        },
        menuInit: function (t) {
          if (!t.dataSM("in-mega")) {
            t.hasClass("mega-menu") && t.find("ul").dataSM("in-mega", !0);
            for (
              var e = 2, i = t[0];
              (i = i.parentNode.parentNode) != this.$root[0];

            )
              e++;
            var s = t.prevAll("a").eq(-1);
            s.length || (s = t.prevAll().find("a").eq(-1)),
              s.addClass("has-submenu").dataSM("sub", t),
              t
                .dataSM("parent-a", s)
                .dataSM("level", e)
                .parent()
                .dataSM("sub", t);
            var o = s.attr("id") || this.accessIdPrefix + ++this.idInc,
              a = t.attr("id") || this.accessIdPrefix + ++this.idInc;
            s.attr({
              id: o,
              "aria-haspopup": "true",
              "aria-controls": a,
              "aria-expanded": "false",
            }),
              t.attr({
                id: a,
                role: "group",
                "aria-hidden": "true",
                "aria-labelledby": o,
                "aria-expanded": "false",
              }),
              this.opts.subIndicators &&
                s[this.opts.subIndicatorsPos](this.$subArrow.clone());
          }
        },
        menuPosition: function (t) {
          var e,
            i,
            s = t.dataSM("parent-a"),
            o = s.closest("li"),
            a = o.parent(),
            n = t.dataSM("level"),
            r = this.getWidth(t),
            h = this.getHeight(t),
            u = s.offset(),
            l = u.left,
            c = u.top,
            d = this.getWidth(s),
            m = this.getHeight(s),
            p = $(window),
            f = p.scrollLeft(),
            v = p.scrollTop(),
            b = this.getViewportWidth(),
            S = this.getViewportHeight(),
            g =
              a.parent().is("[data-sm-horizontal-sub]") ||
              (2 == n && !a.hasClass("sm-vertical")),
            w =
              (this.opts.rightToLeftSubMenus && !o.is("[data-sm-reverse]")) ||
              (!this.opts.rightToLeftSubMenus && o.is("[data-sm-reverse]")),
            M =
              2 == n
                ? this.opts.mainMenuSubOffsetX
                : this.opts.subMenusSubOffsetX,
            T =
              2 == n
                ? this.opts.mainMenuSubOffsetY
                : this.opts.subMenusSubOffsetY;
          if (
            (g
              ? ((e = w ? d - r - M : M),
                (i = this.opts.bottomToTopSubMenus ? -h - T : m + T))
              : ((e = w ? M - r : d - M),
                (i = this.opts.bottomToTopSubMenus ? m - T - h : T)),
            this.opts.keepInViewport)
          ) {
            var y = l + e,
              I = c + i;
            if (
              (w && f > y
                ? (e = g ? f - y + e : d - M)
                : !w && y + r > f + b && (e = g ? f + b - r - y + e : M - r),
              g ||
                (S > h && I + h > v + S
                  ? (i += v + S - h - I)
                  : (h >= S || v > I) && (i += v - I)),
              (g && (I + h > v + S + 0.49 || v > I)) || (!g && h > S + 0.49))
            ) {
              var x = this;
              t.dataSM("scroll-arrows") ||
                t.dataSM(
                  "scroll-arrows",
                  $([
                    $(
                      '<span class="scroll-up"><span class="scroll-up-arrow"></span></span>'
                    )[0],
                    $(
                      '<span class="scroll-down"><span class="scroll-down-arrow"></span></span>'
                    )[0],
                  ])
                    .on({
                      mouseenter: function () {
                        (t.dataSM("scroll").up = $(this).hasClass("scroll-up")),
                          x.menuScroll(t);
                      },
                      mouseleave: function (e) {
                        x.menuScrollStop(t), x.menuScrollOut(t, e);
                      },
                      "mousewheel DOMMouseScroll": function (t) {
                        t.preventDefault();
                      },
                    })
                    .insertAfter(t)
                );
              var A = ".smartmenus_scroll";
              if (
                (t
                  .dataSM("scroll", {
                    y: this.cssTransforms3d ? 0 : i - m,
                    step: 1,
                    itemH: m,
                    subH: h,
                    arrowDownH: this.getHeight(t.dataSM("scroll-arrows").eq(1)),
                  })
                  .on(
                    getEventsNS(
                      {
                        mouseover: function (e) {
                          x.menuScrollOver(t, e);
                        },
                        mouseout: function (e) {
                          x.menuScrollOut(t, e);
                        },
                        "mousewheel DOMMouseScroll": function (e) {
                          x.menuScrollMousewheel(t, e);
                        },
                      },
                      A
                    )
                  )
                  .dataSM("scroll-arrows")
                  .css({
                    top: "auto",
                    left: "0",
                    marginLeft: e + (parseInt(t.css("border-left-width")) || 0),
                    width:
                      r -
                      (parseInt(t.css("border-left-width")) || 0) -
                      (parseInt(t.css("border-right-width")) || 0),
                    zIndex: t.css("z-index"),
                  })
                  .eq(g && this.opts.bottomToTopSubMenus ? 0 : 1)
                  .show(),
                this.isFixed())
              ) {
                var C = {};
                (C[
                  touchEvents
                    ? "touchstart touchmove touchend"
                    : "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"
                ] = function (e) {
                  x.menuScrollTouch(t, e);
                }),
                  t
                    .css({ "touch-action": "none", "-ms-touch-action": "none" })
                    .on(getEventsNS(C, A));
              }
            }
          }
          t.css({ top: "auto", left: "0", marginLeft: e, marginTop: i - m });
        },
        menuScroll: function (t, e, i) {
          var s,
            o = t.dataSM("scroll"),
            a = t.dataSM("scroll-arrows"),
            n = o.up ? o.upEnd : o.downEnd;
          if (!e && o.momentum) {
            if (((o.momentum *= 0.92), (s = o.momentum), 0.5 > s))
              return this.menuScrollStop(t), void 0;
          } else
            s =
              i ||
              (e || !this.opts.scrollAccelerate
                ? this.opts.scrollStep
                : Math.floor(o.step));
          var r = t.dataSM("level");
          if (
            (this.activatedItems[r - 1] &&
              this.activatedItems[r - 1].dataSM("sub") &&
              this.activatedItems[r - 1].dataSM("sub").is(":visible") &&
              this.menuHideSubMenus(r - 1),
            (o.y =
              (o.up && o.y >= n) || (!o.up && n >= o.y)
                ? o.y
                : Math.abs(n - o.y) > s
                ? o.y + (o.up ? s : -s)
                : n),
            t.css(
              this.cssTransforms3d
                ? {
                    "-webkit-transform": "translate3d(0, " + o.y + "px, 0)",
                    transform: "translate3d(0, " + o.y + "px, 0)",
                  }
                : { marginTop: o.y }
            ),
            mouse &&
              ((o.up && o.y > o.downEnd) || (!o.up && o.y < o.upEnd)) &&
              a.eq(o.up ? 1 : 0).show(),
            o.y == n)
          )
            mouse && a.eq(o.up ? 0 : 1).hide(), this.menuScrollStop(t);
          else if (!e) {
            this.opts.scrollAccelerate &&
              o.step < this.opts.scrollStep &&
              (o.step += 0.2);
            var h = this;
            this.scrollTimeout = requestAnimationFrame(function () {
              h.menuScroll(t);
            });
          }
        },
        menuScrollMousewheel: function (t, e) {
          if (this.getClosestMenu(e.target) == t[0]) {
            e = e.originalEvent;
            var i = (e.wheelDelta || -e.detail) > 0;
            t
              .dataSM("scroll-arrows")
              .eq(i ? 0 : 1)
              .is(":visible") &&
              ((t.dataSM("scroll").up = i), this.menuScroll(t, !0));
          }
          e.preventDefault();
        },
        menuScrollOut: function (t, e) {
          mouse &&
            (/^scroll-(up|down)/.test((e.relatedTarget || "").className) ||
              ((t[0] == e.relatedTarget || $.contains(t[0], e.relatedTarget)) &&
                this.getClosestMenu(e.relatedTarget) == t[0]) ||
              t.dataSM("scroll-arrows").css("visibility", "hidden"));
        },
        menuScrollOver: function (t, e) {
          if (
            mouse &&
            !/^scroll-(up|down)/.test(e.target.className) &&
            this.getClosestMenu(e.target) == t[0]
          ) {
            this.menuScrollRefreshData(t);
            var i = t.dataSM("scroll"),
              s =
                $(window).scrollTop() -
                t.dataSM("parent-a").offset().top -
                i.itemH;
            t.dataSM("scroll-arrows")
              .eq(0)
              .css("margin-top", s)
              .end()
              .eq(1)
              .css("margin-top", s + this.getViewportHeight() - i.arrowDownH)
              .end()
              .css("visibility", "visible");
          }
        },
        menuScrollRefreshData: function (t) {
          var e = t.dataSM("scroll"),
            i =
              $(window).scrollTop() -
              t.dataSM("parent-a").offset().top -
              e.itemH;
          this.cssTransforms3d && (i = -(parseFloat(t.css("margin-top")) - i)),
            $.extend(e, {
              upEnd: i,
              downEnd: i + this.getViewportHeight() - e.subH,
            });
        },
        menuScrollStop: function (t) {
          return this.scrollTimeout
            ? (cancelAnimationFrame(this.scrollTimeout),
              (this.scrollTimeout = 0),
              (t.dataSM("scroll").step = 1),
              !0)
            : void 0;
        },
        menuScrollTouch: function (t, e) {
          if (((e = e.originalEvent), isTouchEvent(e))) {
            var i = this.getTouchPoint(e);
            if (this.getClosestMenu(i.target) == t[0]) {
              var s = t.dataSM("scroll");
              if (/(start|down)$/i.test(e.type))
                this.menuScrollStop(t)
                  ? (e.preventDefault(), (this.$touchScrollingSub = t))
                  : (this.$touchScrollingSub = null),
                  this.menuScrollRefreshData(t),
                  $.extend(s, {
                    touchStartY: i.pageY,
                    touchStartTime: e.timeStamp,
                  });
              else if (/move$/i.test(e.type)) {
                var o = void 0 !== s.touchY ? s.touchY : s.touchStartY;
                if (void 0 !== o && o != i.pageY) {
                  this.$touchScrollingSub = t;
                  var a = i.pageY > o;
                  void 0 !== s.up &&
                    s.up != a &&
                    $.extend(s, {
                      touchStartY: i.pageY,
                      touchStartTime: e.timeStamp,
                    }),
                    $.extend(s, { up: a, touchY: i.pageY }),
                    this.menuScroll(t, !0, Math.abs(i.pageY - o));
                }
                e.preventDefault();
              } else
                void 0 !== s.touchY &&
                  ((s.momentum =
                    15 *
                    Math.pow(
                      Math.abs(i.pageY - s.touchStartY) /
                        (e.timeStamp - s.touchStartTime),
                      2
                    )) &&
                    (this.menuScrollStop(t),
                    this.menuScroll(t),
                    e.preventDefault()),
                  delete s.touchY);
            }
          }
        },
        menuShow: function (t) {
          if (
            (t.dataSM("beforefirstshowfired") ||
              (t.dataSM("beforefirstshowfired", !0),
              this.$root.triggerHandler("beforefirstshow.smapi", t[0]) !==
                !1)) &&
            this.$root.triggerHandler("beforeshow.smapi", t[0]) !== !1 &&
            (t.dataSM("shown-before", !0),
            canAnimate && t.stop(!0, !0),
            !t.is(":visible"))
          ) {
            var e = t.dataSM("parent-a"),
              i = this.isCollapsible();
            if (
              ((this.opts.keepHighlighted || i) && e.addClass("highlighted"), i)
            )
              t.removeClass("sm-nowrap").css({
                zIndex: "",
                width: "auto",
                minWidth: "",
                maxWidth: "",
                top: "",
                left: "",
                marginLeft: "",
                marginTop: "",
              });
            else {
              if (
                (t.css(
                  "z-index",
                  (this.zIndexInc =
                    (this.zIndexInc || this.getStartZIndex()) + 1)
                ),
                (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) &&
                  (t
                    .css({ width: "auto", minWidth: "", maxWidth: "" })
                    .addClass("sm-nowrap"),
                  this.opts.subMenusMinWidth &&
                    t.css("min-width", this.opts.subMenusMinWidth),
                  this.opts.subMenusMaxWidth))
              ) {
                var s = this.getWidth(t);
                t.css("max-width", this.opts.subMenusMaxWidth),
                  s > this.getWidth(t) &&
                    t
                      .removeClass("sm-nowrap")
                      .css("width", this.opts.subMenusMaxWidth);
              }
              this.menuPosition(t);
            }
            var o = function () {
              t.css("overflow", "");
            };
            i
              ? canAnimate && this.opts.collapsibleShowFunction
                ? this.opts.collapsibleShowFunction.call(this, t, o)
                : t.show(this.opts.collapsibleShowDuration, o)
              : canAnimate && this.opts.showFunction
              ? this.opts.showFunction.call(this, t, o)
              : t.show(this.opts.showDuration, o),
              e.attr("aria-expanded", "true"),
              t.attr({ "aria-expanded": "true", "aria-hidden": "false" }),
              this.visibleSubMenus.push(t),
              this.$root.triggerHandler("show.smapi", t[0]);
          }
        },
        popupHide: function (t) {
          this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
          var e = this;
          this.hideTimeout = setTimeout(
            function () {
              e.menuHideAll();
            },
            t ? 1 : this.opts.hideTimeout
          );
        },
        popupShow: function (t, e) {
          if (!this.opts.isPopup)
            return (
              alert(
                'SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'
              ),
              void 0
            );
          if (
            (this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
            this.$root.dataSM("shown-before", !0),
            canAnimate && this.$root.stop(!0, !0),
            !this.$root.is(":visible"))
          ) {
            this.$root.css({ left: t, top: e });
            var i = this,
              s = function () {
                i.$root.css("overflow", "");
              };
            canAnimate && this.opts.showFunction
              ? this.opts.showFunction.call(this, this.$root, s)
              : this.$root.show(this.opts.showDuration, s),
              (this.visibleSubMenus[0] = this.$root);
          }
        },
        refresh: function () {
          this.destroy(!0), this.init(!0);
        },
        rootKeyDown: function (t) {
          if (this.handleEvents())
            switch (t.keyCode) {
              case 27:
                var e = this.activatedItems[0];
                if (e) {
                  this.menuHideAll(), e[0].focus();
                  var i = e.dataSM("sub");
                  i && this.menuHide(i);
                }
                break;
              case 32:
                var s = $(t.target);
                if (s.is("a") && this.handleItemEvents(s)) {
                  var i = s.dataSM("sub");
                  i &&
                    !i.is(":visible") &&
                    (this.itemClick({ currentTarget: t.target }),
                    t.preventDefault());
                }
            }
        },
        rootOut: function (t) {
          if (
            this.handleEvents() &&
            !this.isTouchMode() &&
            t.target != this.$root[0] &&
            (this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
            !this.opts.showOnClick || !this.opts.hideOnClick)
          ) {
            var e = this;
            this.hideTimeout = setTimeout(function () {
              e.menuHideAll();
            }, this.opts.hideTimeout);
          }
        },
        rootOver: function (t) {
          this.handleEvents() &&
            !this.isTouchMode() &&
            t.target != this.$root[0] &&
            this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
        },
        winResize: function (t) {
          if (this.handleEvents()) {
            if (
              !("onorientationchange" in window) ||
              "orientationchange" == t.type
            ) {
              var e = this.isCollapsible();
              (this.wasCollapsible && e) ||
                (this.activatedItems.length &&
                  this.activatedItems[this.activatedItems.length - 1][0].blur(),
                this.menuHideAll()),
                (this.wasCollapsible = e);
            }
          } else if (this.$disableOverlay) {
            var i = this.$root.offset();
            this.$disableOverlay.css({
              top: i.top,
              left: i.left,
              width: this.$root.outerWidth(),
              height: this.$root.outerHeight(),
            });
          }
        },
      },
    }),
    ($.fn.dataSM = function (t, e) {
      return e ? this.data(t + "_smartmenus", e) : this.data(t + "_smartmenus");
    }),
    ($.fn.removeDataSM = function (t) {
      return this.removeData(t + "_smartmenus");
    }),
    ($.fn.smartmenus = function (options) {
      if ("string" == typeof options) {
        var args = arguments,
          method = options;
        return (
          Array.prototype.shift.call(args),
          this.each(function () {
            var t = $(this).data("smartmenus");
            t && t[method] && t[method].apply(t, args);
          })
        );
      }
      return this.each(function () {
        var dataOpts = $(this).data("sm-options") || null;
        if (dataOpts && "object" != typeof dataOpts)
          try {
            dataOpts = eval("(" + dataOpts + ")");
          } catch (e) {
            (dataOpts = null),
              alert(
                'ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.'
              );
          }
        new $.SmartMenus(
          this,
          $.extend({}, $.fn.smartmenus.defaults, options, dataOpts)
        );
      });
    }),
    ($.fn.smartmenus.defaults = {
      isPopup: !1,
      mainMenuSubOffsetX: 0,
      mainMenuSubOffsetY: 0,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: 0,
      subMenusMinWidth: "10rem",
      subMenusMaxWidth: "25rem",
      subIndicators: !0,
      subIndicatorsPos: "append",
      subIndicatorsText: "",
      scrollStep: 30,
      scrollAccelerate: !0,
      showTimeout: 200,
      hideTimeout: 200,
      showDuration: 0,
      showFunction: null,
      hideDuration: 0,
      hideFunction: function (t, e) {
        t.fadeOut(200, e);
      },
      collapsibleShowDuration: 0,
      collapsibleShowFunction: function (t, e) {
        t.slideDown(200, e);
      },
      collapsibleHideDuration: 0,
      collapsibleHideFunction: function (t, e) {
        t.slideUp(200, e);
      },
      showOnClick: !1,
      hideOnClick: !0,
      noMouseOver: !1,
      keepInViewport: !0,
      keepHighlighted: !0,
      markCurrentItem: !1,
      markCurrentTree: !0,
      rightToLeftSubMenus: !1,
      bottomToTopSubMenus: !1,
      collapsibleBehavior: "link",
    }),
    $
  );
});
/*
 * SmartMenus jQuery Bootstrap 4 Addon - v0.1.0+
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com/
 *
 * Released under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "smartmenus"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.extend(($.SmartMenus.Bootstrap = {}), {
    keydownFix: !1,
    init: function () {
      var $navbars = $("ul.navbar-nav:not([data-sm-skip])");
      $navbars.each(function () {
        var $this = $(this),
          obj = $this.data("smartmenus");
        if (!obj) {
          var skipBehavior = $this.is("[data-sm-skip-collapsible-behavior]"),
            rightAligned =
              $this.hasClass("ml-auto") || $this.prevAll(".mr-auto").length > 0;
          $this
            .smartmenus({
              subMenusSubOffsetX: -8,
              subMenusSubOffsetY: 0,
              subIndicators: !skipBehavior,
              collapsibleShowFunction: null,
              collapsibleHideFunction: null,
              rightToLeftSubMenus: rightAligned,
              bottomToTopSubMenus: $this.closest(".fixed-bottom").length > 0,
              bootstrapHighlightClasses: "",
            })
            .on({
              "show.smapi": function (e, menu) {
                var $menu = $(menu),
                  $scrollArrows = $menu.dataSM("scroll-arrows");
                if ($scrollArrows) {
                  $scrollArrows.css(
                    "background-color",
                    $menu.css("background-color")
                  );
                }
                $menu.parent().addClass("show");
                if (obj.opts.keepHighlighted && $menu.dataSM("level") > 2) {
                  $menu
                    .prevAll("a")
                    .addClass(obj.opts.bootstrapHighlightClasses);
                }
              },
              "hide.smapi": function (e, menu) {
                var $menu = $(menu);
                $menu.parent().removeClass("show");
                if (obj.opts.keepHighlighted && $menu.dataSM("level") > 2) {
                  $menu
                    .prevAll("a")
                    .removeClass(obj.opts.bootstrapHighlightClasses);
                }
              },
            });
          obj = $this.data("smartmenus");
          function onInit() {
            $this.find("a.current").each(function () {
              var $this = $(this);
              ($this.hasClass("dropdown-item")
                ? $this
                : $this.parent()
              ).addClass("active");
            });
            $this.find("a.has-submenu").each(function () {
              var $this = $(this);
              if ($this.is('[data-toggle="dropdown"]')) {
                $this
                  .dataSM("bs-data-toggle-dropdown", !0)
                  .removeAttr("data-toggle");
              }
              if (!skipBehavior && $this.hasClass("dropdown-toggle")) {
                $this
                  .dataSM("bs-dropdown-toggle", !0)
                  .removeClass("dropdown-toggle");
              }
            });
          }
          onInit();
          function onBeforeDestroy() {
            $this.find("a.current").each(function () {
              var $this = $(this);
              ($this.hasClass("active") ? $this : $this.parent()).removeClass(
                "active"
              );
            });
            $this.find("a.has-submenu").each(function () {
              var $this = $(this);
              if ($this.dataSM("bs-dropdown-toggle")) {
                $this
                  .addClass("dropdown-toggle")
                  .removeDataSM("bs-dropdown-toggle");
              }
              if ($this.dataSM("bs-data-toggle-dropdown")) {
                $this
                  .attr("data-toggle", "dropdown")
                  .removeDataSM("bs-data-toggle-dropdown");
              }
            });
          }
          obj.refresh = function () {
            $.SmartMenus.prototype.refresh.call(this);
            onInit();
            detectCollapsible(!0);
          };
          obj.destroy = function (refresh) {
            onBeforeDestroy();
            $.SmartMenus.prototype.destroy.call(this, refresh);
          };
          if (skipBehavior) {
            obj.opts.collapsibleBehavior = "toggle";
          }
          var winW;
          function detectCollapsible(force) {
            var newW = obj.getViewportWidth();
            if (newW != winW || force) {
              if (obj.isCollapsible()) {
                $this.addClass("sm-collapsible");
              } else {
                $this.removeClass("sm-collapsible");
              }
              winW = newW;
            }
          }
          detectCollapsible();
          $(window).on("resize.smartmenus" + obj.rootId, detectCollapsible);
        }
      });
      if ($navbars.length && !$.SmartMenus.Bootstrap.keydownFix) {
        $(document).off("keydown.bs.dropdown.data-api", ".dropdown-menu");
        if (
          $.fn.dropdown &&
          $.fn.dropdown.Constructor &&
          typeof $.fn.dropdown.Constructor._dataApiKeydownHandler == "function"
        ) {
          $(document).on(
            "keydown.bs.dropdown.data-api",
            ".dropdown-menu.show",
            $.fn.dropdown.Constructor._dataApiKeydownHandler
          );
        }
        $.SmartMenus.Bootstrap.keydownFix = !0;
      }
    },
  });
  $($.SmartMenus.Bootstrap.init);
  return $;
});
/*-----------------------------------------------------------------------------------*/
/*	02. STICKY HEADER
/*-----------------------------------------------------------------------------------*/
/*!
 * Headhesive.js v1.2.3 - An on-demand sticky header
 * Author: Copyright (c) Mark Goodyear <@markgdyr> <http://markgoodyear.com>
 * Url: http://markgoodyear.com/labs/headhesive
 * License: MIT
 */
!(function (t, e) {
  "function" == typeof define && define.amd
    ? define([], function () {
        return e();
      })
    : "object" == typeof exports
    ? (module.exports = e())
    : (t.Headhesive = e());
})(this, function () {
  "use strict";
  var t = function (e, s) {
      for (var o in s)
        s.hasOwnProperty(o) &&
          (e[o] = "object" == typeof s[o] ? t(e[o], s[o]) : s[o]);
      return e;
    },
    e = function (t, e) {
      var s,
        o,
        i,
        n =
          Date.now ||
          function () {
            return new Date().getTime();
          },
        l = null,
        c = 0,
        r = function () {
          (c = n()), (l = null), (i = t.apply(s, o)), (s = o = null);
        };
      return function () {
        var f = n(),
          h = e - (f - c);
        return (
          (s = this),
          (o = arguments),
          0 >= h
            ? (clearTimeout(l),
              (l = null),
              (c = f),
              (i = t.apply(s, o)),
              (s = o = null))
            : l || (l = setTimeout(r, h)),
          i
        );
      };
    },
    s = function () {
      return void 0 !== window.pageYOffset
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    },
    o = function (t, e) {
      for (var s = 0, o = t.offsetHeight; t; )
        (s += t.offsetTop), (t = t.offsetParent);
      return "bottom" === e && (s += o), s;
    },
    i = function (e, s) {
      "querySelector" in document &&
        "addEventListener" in window &&
        ((this.visible = !1),
        (this.options = {
          offset: 300,
          offsetSide: "top",
          classes: {
            clone: "headhesive",
            stick: "headhesive--stick",
            unstick: "headhesive--unstick",
          },
          throttle: 250,
          onInit: function () {},
          onStick: function () {},
          onUnstick: function () {},
          onDestroy: function () {},
        }),
        (this.elem = "string" == typeof e ? document.querySelector(e) : e),
        (this.options = t(this.options, s)),
        this.init());
    };
  return (
    (i.prototype = {
      constructor: i,
      init: function () {
        if (
          ((this.clonedElem = this.elem.cloneNode(!0)),
          (this.clonedElem.className += " " + this.options.classes.clone),
          document.body.insertBefore(this.clonedElem, document.body.firstChild),
          "number" == typeof this.options.offset)
        )
          this.scrollOffset = this.options.offset;
        else {
          if ("string" != typeof this.options.offset)
            throw new Error("Invalid offset: " + this.options.offset);
          this._setScrollOffset();
        }
        (this._throttleUpdate = e(
          this.update.bind(this),
          this.options.throttle
        )),
          (this._throttleScrollOffset = e(
            this._setScrollOffset.bind(this),
            this.options.throttle
          )),
          window.addEventListener("scroll", this._throttleUpdate, !1),
          window.addEventListener("resize", this._throttleScrollOffset, !1),
          this.options.onInit.call(this);
      },
      _setScrollOffset: function () {
        "string" == typeof this.options.offset &&
          (this.scrollOffset = o(
            document.querySelector(this.options.offset),
            this.options.offsetSide
          ));
      },
      destroy: function () {
        document.body.removeChild(this.clonedElem),
          window.removeEventListener("scroll", this._throttleUpdate),
          window.removeEventListener("resize", this._throttleScrollOffset),
          this.options.onDestroy.call(this);
      },
      stick: function () {
        this.visible ||
          ((this.clonedElem.className = this.clonedElem.className.replace(
            new RegExp(
              "(^|\\s)*" + this.options.classes.unstick + "(\\s|$)*",
              "g"
            ),
            ""
          )),
          (this.clonedElem.className += " " + this.options.classes.stick),
          (this.visible = !0),
          this.options.onStick.call(this));
      },
      unstick: function () {
        this.visible &&
          ((this.clonedElem.className = this.clonedElem.className.replace(
            new RegExp(
              "(^|\\s)*" + this.options.classes.stick + "(\\s|$)*",
              "g"
            ),
            ""
          )),
          (this.clonedElem.className += " " + this.options.classes.unstick),
          (this.visible = !1),
          this.options.onUnstick.call(this));
      },
      update: function () {
        s() > this.scrollOffset ? this.stick() : this.unstick();
      },
    }),
    i
  );
});
/*-----------------------------------------------------------------------------------*/
/*	03. PICTUREFILL
/*-----------------------------------------------------------------------------------*/
/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!(function (a) {
  var b = navigator.userAgent;
  a.HTMLPictureElement &&
    /ecko/.test(b) &&
    b.match(/rv\:(\d+)/) &&
    RegExp.$1 < 45 &&
    addEventListener(
      "resize",
      (function () {
        var b,
          c = document.createElement("source"),
          d = function (a) {
            var b,
              d,
              e = a.parentNode;
            "PICTURE" === e.nodeName.toUpperCase()
              ? ((b = c.cloneNode()),
                e.insertBefore(b, e.firstElementChild),
                setTimeout(function () {
                  e.removeChild(b);
                }))
              : (!a._pfLastSize || a.offsetWidth > a._pfLastSize) &&
                ((a._pfLastSize = a.offsetWidth),
                (d = a.sizes),
                (a.sizes += ",100vw"),
                setTimeout(function () {
                  a.sizes = d;
                }));
          },
          e = function () {
            var a,
              b = document.querySelectorAll(
                "picture > img, img[srcset][sizes]"
              );
            for (a = 0; a < b.length; a++) d(b[a]);
          },
          f = function () {
            clearTimeout(b), (b = setTimeout(e, 99));
          },
          g = a.matchMedia && matchMedia("(orientation: landscape)"),
          h = function () {
            f(), g && g.addListener && g.addListener(f);
          };
        return (
          (c.srcset =
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),
          /^[c|i]|d$/.test(document.readyState || "")
            ? h()
            : document.addEventListener("DOMContentLoaded", h),
          f
        );
      })()
    );
})(window),
  (function (a, b, c) {
    "use strict";
    function d(a) {
      return " " === a || "	" === a || "\n" === a || "\f" === a || "\r" === a;
    }
    function e(b, c) {
      var d = new a.Image();
      return (
        (d.onerror = function () {
          (A[b] = !1), ba();
        }),
        (d.onload = function () {
          (A[b] = 1 === d.width), ba();
        }),
        (d.src = c),
        "pending"
      );
    }
    function f() {
      (M = !1),
        (P = a.devicePixelRatio),
        (N = {}),
        (O = {}),
        (s.DPR = P || 1),
        (Q.width = Math.max(a.innerWidth || 0, z.clientWidth)),
        (Q.height = Math.max(a.innerHeight || 0, z.clientHeight)),
        (Q.vw = Q.width / 100),
        (Q.vh = Q.height / 100),
        (r = [Q.height, Q.width, P].join("-")),
        (Q.em = s.getEmValue()),
        (Q.rem = Q.em);
    }
    function g(a, b, c, d) {
      var e, f, g, h;
      return (
        "saveData" === B.algorithm
          ? a > 2.7
            ? (h = c + 1)
            : ((f = b - c),
              (e = Math.pow(a - 0.6, 1.5)),
              (g = f * e),
              d && (g += 0.1 * e),
              (h = a + g))
          : (h = c > 1 ? Math.sqrt(a * b) : a),
        h > c
      );
    }
    function h(a) {
      var b,
        c = s.getSet(a),
        d = !1;
      "pending" !== c &&
        ((d = r), c && ((b = s.setRes(c)), s.applySetCandidate(b, a))),
        (a[s.ns].evaled = d);
    }
    function i(a, b) {
      return a.res - b.res;
    }
    function j(a, b, c) {
      var d;
      return (
        !c && b && ((c = a[s.ns].sets), (c = c && c[c.length - 1])),
        (d = k(b, c)),
        d &&
          ((b = s.makeUrl(b)),
          (a[s.ns].curSrc = b),
          (a[s.ns].curCan = d),
          d.res || aa(d, d.set.sizes)),
        d
      );
    }
    function k(a, b) {
      var c, d, e;
      if (a && b)
        for (e = s.parseSet(b), a = s.makeUrl(a), c = 0; c < e.length; c++)
          if (a === s.makeUrl(e[c].url)) {
            d = e[c];
            break;
          }
      return d;
    }
    function l(a, b) {
      var c,
        d,
        e,
        f,
        g = a.getElementsByTagName("source");
      for (c = 0, d = g.length; d > c; c++)
        (e = g[c]),
          (e[s.ns] = !0),
          (f = e.getAttribute("srcset")),
          f &&
            b.push({
              srcset: f,
              media: e.getAttribute("media"),
              type: e.getAttribute("type"),
              sizes: e.getAttribute("sizes"),
            });
    }
    function m(a, b) {
      function c(b) {
        var c,
          d = b.exec(a.substring(m));
        return d ? ((c = d[0]), (m += c.length), c) : void 0;
      }
      function e() {
        var a,
          c,
          d,
          e,
          f,
          i,
          j,
          k,
          l,
          m = !1,
          o = {};
        for (e = 0; e < h.length; e++)
          (f = h[e]),
            (i = f[f.length - 1]),
            (j = f.substring(0, f.length - 1)),
            (k = parseInt(j, 10)),
            (l = parseFloat(j)),
            X.test(j) && "w" === i
              ? ((a || c) && (m = !0), 0 === k ? (m = !0) : (a = k))
              : Y.test(j) && "x" === i
              ? ((a || c || d) && (m = !0), 0 > l ? (m = !0) : (c = l))
              : X.test(j) && "h" === i
              ? ((d || c) && (m = !0), 0 === k ? (m = !0) : (d = k))
              : (m = !0);
        m ||
          ((o.url = g),
          a && (o.w = a),
          c && (o.d = c),
          d && (o.h = d),
          d || c || a || (o.d = 1),
          1 === o.d && (b.has1x = !0),
          (o.set = b),
          n.push(o));
      }
      function f() {
        for (c(T), i = "", j = "in descriptor"; ; ) {
          if (((k = a.charAt(m)), "in descriptor" === j))
            if (d(k)) i && (h.push(i), (i = ""), (j = "after descriptor"));
            else {
              if ("," === k) return (m += 1), i && h.push(i), void e();
              if ("(" === k) (i += k), (j = "in parens");
              else {
                if ("" === k) return i && h.push(i), void e();
                i += k;
              }
            }
          else if ("in parens" === j)
            if (")" === k) (i += k), (j = "in descriptor");
            else {
              if ("" === k) return h.push(i), void e();
              i += k;
            }
          else if ("after descriptor" === j)
            if (d(k));
            else {
              if ("" === k) return void e();
              (j = "in descriptor"), (m -= 1);
            }
          m += 1;
        }
      }
      for (var g, h, i, j, k, l = a.length, m = 0, n = []; ; ) {
        if ((c(U), m >= l)) return n;
        (g = c(V)),
          (h = []),
          "," === g.slice(-1) ? ((g = g.replace(W, "")), e()) : f();
      }
    }
    function n(a) {
      function b(a) {
        function b() {
          f && (g.push(f), (f = ""));
        }
        function c() {
          g[0] && (h.push(g), (g = []));
        }
        for (var e, f = "", g = [], h = [], i = 0, j = 0, k = !1; ; ) {
          if (((e = a.charAt(j)), "" === e)) return b(), c(), h;
          if (k) {
            if ("*" === e && "/" === a[j + 1]) {
              (k = !1), (j += 2), b();
              continue;
            }
            j += 1;
          } else {
            if (d(e)) {
              if ((a.charAt(j - 1) && d(a.charAt(j - 1))) || !f) {
                j += 1;
                continue;
              }
              if (0 === i) {
                b(), (j += 1);
                continue;
              }
              e = " ";
            } else if ("(" === e) i += 1;
            else if (")" === e) i -= 1;
            else {
              if ("," === e) {
                b(), c(), (j += 1);
                continue;
              }
              if ("/" === e && "*" === a.charAt(j + 1)) {
                (k = !0), (j += 2);
                continue;
              }
            }
            (f += e), (j += 1);
          }
        }
      }
      function c(a) {
        return k.test(a) && parseFloat(a) >= 0
          ? !0
          : l.test(a)
          ? !0
          : "0" === a || "-0" === a || "+0" === a
          ? !0
          : !1;
      }
      var e,
        f,
        g,
        h,
        i,
        j,
        k =
          /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
        l = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
      for (f = b(a), g = f.length, e = 0; g > e; e++)
        if (((h = f[e]), (i = h[h.length - 1]), c(i))) {
          if (((j = i), h.pop(), 0 === h.length)) return j;
          if (((h = h.join(" ")), s.matchesMedia(h))) return j;
        }
      return "100vw";
    }
    b.createElement("picture");
    var o,
      p,
      q,
      r,
      s = {},
      t = !1,
      u = function () {},
      v = b.createElement("img"),
      w = v.getAttribute,
      x = v.setAttribute,
      y = v.removeAttribute,
      z = b.documentElement,
      A = {},
      B = { algorithm: "" },
      C = "data-pfsrc",
      D = C + "set",
      E = navigator.userAgent,
      F =
        /rident/.test(E) ||
        (/ecko/.test(E) && E.match(/rv\:(\d+)/) && RegExp.$1 > 35),
      G = "currentSrc",
      H = /\s+\+?\d+(e\d+)?w/,
      I = /(\([^)]+\))?\s*(.+)/,
      J = a.picturefillCFG,
      K =
        "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",
      L = "font-size:100%!important;",
      M = !0,
      N = {},
      O = {},
      P = a.devicePixelRatio,
      Q = { px: 1, in: 96 },
      R = b.createElement("a"),
      S = !1,
      T = /^[ \t\n\r\u000c]+/,
      U = /^[, \t\n\r\u000c]+/,
      V = /^[^ \t\n\r\u000c]+/,
      W = /[,]+$/,
      X = /^\d+$/,
      Y = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
      Z = function (a, b, c, d) {
        a.addEventListener
          ? a.addEventListener(b, c, d || !1)
          : a.attachEvent && a.attachEvent("on" + b, c);
      },
      $ = function (a) {
        var b = {};
        return function (c) {
          return c in b || (b[c] = a(c)), b[c];
        };
      },
      _ = (function () {
        var a = /^([\d\.]+)(em|vw|px)$/,
          b = function () {
            for (var a = arguments, b = 0, c = a[0]; ++b in a; )
              c = c.replace(a[b], a[++b]);
            return c;
          },
          c = $(function (a) {
            return (
              "return " +
              b(
                (a || "").toLowerCase(),
                /\band\b/g,
                "&&",
                /,/g,
                "||",
                /min-([a-z-\s]+):/g,
                "e.$1>=",
                /max-([a-z-\s]+):/g,
                "e.$1<=",
                /calc([^)]+)/g,
                "($1)",
                /(\d+[\.]*[\d]*)([a-z]+)/g,
                "($1 * e.$2)",
                /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,
                ""
              ) +
              ";"
            );
          });
        return function (b, d) {
          var e;
          if (!(b in N))
            if (((N[b] = !1), d && (e = b.match(a)))) N[b] = e[1] * Q[e[2]];
            else
              try {
                N[b] = new Function("e", c(b))(Q);
              } catch (f) {}
          return N[b];
        };
      })(),
      aa = function (a, b) {
        return (
          a.w
            ? ((a.cWidth = s.calcListLength(b || "100vw")),
              (a.res = a.w / a.cWidth))
            : (a.res = a.d),
          a
        );
      },
      ba = function (a) {
        if (t) {
          var c,
            d,
            e,
            f = a || {};
          if (
            (f.elements &&
              1 === f.elements.nodeType &&
              ("IMG" === f.elements.nodeName.toUpperCase()
                ? (f.elements = [f.elements])
                : ((f.context = f.elements), (f.elements = null))),
            (c =
              f.elements ||
              s.qsa(
                f.context || b,
                f.reevaluate || f.reselect ? s.sel : s.selShort
              )),
            (e = c.length))
          ) {
            for (s.setupRun(f), S = !0, d = 0; e > d; d++) s.fillImg(c[d], f);
            s.teardownRun(f);
          }
        }
      };
    (o =
      a.console && console.warn
        ? function (a) {
            console.warn(a);
          }
        : u),
      G in v || (G = "src"),
      (A["image/jpeg"] = !0),
      (A["image/gif"] = !0),
      (A["image/png"] = !0),
      (A["image/svg+xml"] = b.implementation.hasFeature(
        "http://www.w3.org/TR/SVG11/feature#Image",
        "1.1"
      )),
      (s.ns = ("pf" + new Date().getTime()).substr(0, 9)),
      (s.supSrcset = "srcset" in v),
      (s.supSizes = "sizes" in v),
      (s.supPicture = !!a.HTMLPictureElement),
      s.supSrcset &&
        s.supPicture &&
        !s.supSizes &&
        !(function (a) {
          (v.srcset = "data:,a"),
            (a.src = "data:,a"),
            (s.supSrcset = v.complete === a.complete),
            (s.supPicture = s.supSrcset && s.supPicture);
        })(b.createElement("img")),
      s.supSrcset && !s.supSizes
        ? !(function () {
            var a =
                "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",
              c =
                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
              d = b.createElement("img"),
              e = function () {
                var a = d.width;
                2 === a && (s.supSizes = !0),
                  (q = s.supSrcset && !s.supSizes),
                  (t = !0),
                  setTimeout(ba);
              };
            (d.onload = e),
              (d.onerror = e),
              d.setAttribute("sizes", "9px"),
              (d.srcset = c + " 1w," + a + " 9w"),
              (d.src = c);
          })()
        : (t = !0),
      (s.selShort = "picture>img,img[srcset]"),
      (s.sel = s.selShort),
      (s.cfg = B),
      (s.DPR = P || 1),
      (s.u = Q),
      (s.types = A),
      (s.setSize = u),
      (s.makeUrl = $(function (a) {
        return (R.href = a), R.href;
      })),
      (s.qsa = function (a, b) {
        return "querySelector" in a ? a.querySelectorAll(b) : [];
      }),
      (s.matchesMedia = function () {
        return (
          a.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches
            ? (s.matchesMedia = function (a) {
                return !a || matchMedia(a).matches;
              })
            : (s.matchesMedia = s.mMQ),
          s.matchesMedia.apply(this, arguments)
        );
      }),
      (s.mMQ = function (a) {
        return a ? _(a) : !0;
      }),
      (s.calcLength = function (a) {
        var b = _(a, !0) || !1;
        return 0 > b && (b = !1), b;
      }),
      (s.supportsType = function (a) {
        return a ? A[a] : !0;
      }),
      (s.parseSize = $(function (a) {
        var b = (a || "").match(I);
        return { media: b && b[1], length: b && b[2] };
      })),
      (s.parseSet = function (a) {
        return a.cands || (a.cands = m(a.srcset, a)), a.cands;
      }),
      (s.getEmValue = function () {
        var a;
        if (!p && (a = b.body)) {
          var c = b.createElement("div"),
            d = z.style.cssText,
            e = a.style.cssText;
          (c.style.cssText = K),
            (z.style.cssText = L),
            (a.style.cssText = L),
            a.appendChild(c),
            (p = c.offsetWidth),
            a.removeChild(c),
            (p = parseFloat(p, 10)),
            (z.style.cssText = d),
            (a.style.cssText = e);
        }
        return p || 16;
      }),
      (s.calcListLength = function (a) {
        if (!(a in O) || B.uT) {
          var b = s.calcLength(n(a));
          O[a] = b ? b : Q.width;
        }
        return O[a];
      }),
      (s.setRes = function (a) {
        var b;
        if (a) {
          b = s.parseSet(a);
          for (var c = 0, d = b.length; d > c; c++) aa(b[c], a.sizes);
        }
        return b;
      }),
      (s.setRes.res = aa),
      (s.applySetCandidate = function (a, b) {
        if (a.length) {
          var c,
            d,
            e,
            f,
            h,
            k,
            l,
            m,
            n,
            o = b[s.ns],
            p = s.DPR;
          if (
            ((k = o.curSrc || b[G]),
            (l = o.curCan || j(b, k, a[0].set)),
            l &&
              l.set === a[0].set &&
              ((n = F && !b.complete && l.res - 0.1 > p),
              n || ((l.cached = !0), l.res >= p && (h = l))),
            !h)
          )
            for (a.sort(i), f = a.length, h = a[f - 1], d = 0; f > d; d++)
              if (((c = a[d]), c.res >= p)) {
                (e = d - 1),
                  (h =
                    a[e] &&
                    (n || k !== s.makeUrl(c.url)) &&
                    g(a[e].res, c.res, p, a[e].cached)
                      ? a[e]
                      : c);
                break;
              }
          h &&
            ((m = s.makeUrl(h.url)),
            (o.curSrc = m),
            (o.curCan = h),
            m !== k && s.setSrc(b, h),
            s.setSize(b));
        }
      }),
      (s.setSrc = function (a, b) {
        var c;
        (a.src = b.url),
          "image/svg+xml" === b.set.type &&
            ((c = a.style.width),
            (a.style.width = a.offsetWidth + 1 + "px"),
            a.offsetWidth + 1 && (a.style.width = c));
      }),
      (s.getSet = function (a) {
        var b,
          c,
          d,
          e = !1,
          f = a[s.ns].sets;
        for (b = 0; b < f.length && !e; b++)
          if (
            ((c = f[b]),
            c.srcset && s.matchesMedia(c.media) && (d = s.supportsType(c.type)))
          ) {
            "pending" === d && (c = d), (e = c);
            break;
          }
        return e;
      }),
      (s.parseSets = function (a, b, d) {
        var e,
          f,
          g,
          h,
          i = b && "PICTURE" === b.nodeName.toUpperCase(),
          j = a[s.ns];
        (j.src === c || d.src) &&
          ((j.src = w.call(a, "src")),
          j.src ? x.call(a, C, j.src) : y.call(a, C)),
          (j.srcset === c || d.srcset || !s.supSrcset || a.srcset) &&
            ((e = w.call(a, "srcset")), (j.srcset = e), (h = !0)),
          (j.sets = []),
          i && ((j.pic = !0), l(b, j.sets)),
          j.srcset
            ? ((f = { srcset: j.srcset, sizes: w.call(a, "sizes") }),
              j.sets.push(f),
              (g = (q || j.src) && H.test(j.srcset || "")),
              g ||
                !j.src ||
                k(j.src, f) ||
                f.has1x ||
                ((f.srcset += ", " + j.src),
                f.cands.push({ url: j.src, d: 1, set: f })))
            : j.src && j.sets.push({ srcset: j.src, sizes: null }),
          (j.curCan = null),
          (j.curSrc = c),
          (j.supported = !(i || (f && !s.supSrcset) || (g && !s.supSizes))),
          h &&
            s.supSrcset &&
            !j.supported &&
            (e ? (x.call(a, D, e), (a.srcset = "")) : y.call(a, D)),
          j.supported &&
            !j.srcset &&
            ((!j.src && a.src) || a.src !== s.makeUrl(j.src)) &&
            (null === j.src ? a.removeAttribute("src") : (a.src = j.src)),
          (j.parsed = !0);
      }),
      (s.fillImg = function (a, b) {
        var c,
          d = b.reselect || b.reevaluate;
        a[s.ns] || (a[s.ns] = {}),
          (c = a[s.ns]),
          (d || c.evaled !== r) &&
            ((!c.parsed || b.reevaluate) && s.parseSets(a, a.parentNode, b),
            c.supported ? (c.evaled = r) : h(a));
      }),
      (s.setupRun = function () {
        (!S || M || P !== a.devicePixelRatio) && f();
      }),
      s.supPicture
        ? ((ba = u), (s.fillImg = u))
        : !(function () {
            var c,
              d = a.attachEvent ? /d$|^c/ : /d$|^c|^i/,
              e = function () {
                var a = b.readyState || "";
                (f = setTimeout(e, "loading" === a ? 200 : 999)),
                  b.body &&
                    (s.fillImgs(), (c = c || d.test(a)), c && clearTimeout(f));
              },
              f = setTimeout(e, b.body ? 9 : 99),
              g = function (a, b) {
                var c,
                  d,
                  e = function () {
                    var f = new Date() - d;
                    b > f ? (c = setTimeout(e, b - f)) : ((c = null), a());
                  };
                return function () {
                  (d = new Date()), c || (c = setTimeout(e, b));
                };
              },
              h = z.clientHeight,
              i = function () {
                (M =
                  Math.max(a.innerWidth || 0, z.clientWidth) !== Q.width ||
                  z.clientHeight !== h),
                  (h = z.clientHeight),
                  M && s.fillImgs();
              };
            Z(a, "resize", g(i, 99)), Z(b, "readystatechange", e);
          })(),
      (s.picturefill = ba),
      (s.fillImgs = ba),
      (s.teardownRun = u),
      (ba._ = s),
      (a.picturefillCFG = {
        pf: s,
        push: function (a) {
          var b = a.shift();
          "function" == typeof s[b]
            ? s[b].apply(s, a)
            : ((B[b] = a[0]), S && s.fillImgs({ reselect: !0 }));
        },
      });
    for (; J && J.length; ) a.picturefillCFG.push(J.shift());
    (a.picturefill = ba),
      "object" == typeof module && "object" == typeof module.exports
        ? (module.exports = ba)
        : "function" == typeof define &&
          define.amd &&
          define("picturefill", function () {
            return ba;
          }),
      s.supPicture ||
        (A["image/webp"] = e(
          "image/webp",
          "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="
        ));
  })(window, document);
/*-----------------------------------------------------------------------------------*/
/*	04. HAMBURGER MENU ICON
/*-----------------------------------------------------------------------------------*/
/*!
 * jquery-hmbrgr.js v0.0.2
 * https://github.com/MorenoDiDomenico/jquery-hmbrgr
 *
 * Copyright 2015, Moreno Di Domenico
 * Released under the MIT license
 * http://mdd.mit-license.org
 *
 */
!(function (a) {
  a.fn.hmbrgr = function (b) {
    function g(b) {
      a(b)
        .css({ width: c.width, height: c.height })
        .html("<span /><span /><span />")
        .find("span")
        .css({
          position: "absolute",
          width: "100%",
          height: c.barHeight,
          "border-radius": c.barRadius,
          "background-color": c.barColor,
          "transition-duration": c.speed + "ms",
        }),
        h(b),
        a.isFunction(c.onInit) && c.onInit.call(this);
    }
    function h(b) {
      a(b).data("clickable", !0).find("span").eq(0).css({ top: d }),
        a(b).find("span").eq(1).css({ top: e }),
        a(b).find("span").eq(2).css({ top: f });
    }
    function i(b) {
      a(b).on("click", function (c) {
        c.preventDefault(),
          a(this).data("clickable") &&
            (a(this).data("clickable", !1),
            a(b).toggleClass("cross"),
            a(b).hasClass("cross") ? j(b) : k(b));
      });
    }
    function j(b) {
      a(b).find("span").css({ top: e }),
        setTimeout(function () {
          a(b).addClass(c.animation).data("clickable", !0),
            a.isFunction(c.onOpen) && c.onOpen.call(this);
        }, c.speed);
    }
    function k(b) {
      a(b).removeClass(c.animation),
        setTimeout(function () {
          h(b), a.isFunction(c.onClose) && c.onClose.call(this);
        }, c.speed);
    }
    var c = a.extend(
        {
          width: 60,
          height: 50,
          speed: 200,
          barHeight: 8,
          barRadius: 0,
          barColor: "#ffffff",
          animation: "expand",
          onInit: null,
          onOpen: null,
          onClose: null,
        },
        b
      ),
      d = 0,
      e = c.height / 2 - c.barHeight / 2,
      f = c.height - c.barHeight;
    return this.each(function () {
      g(this), i(this);
    });
  };
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	05. SVG INJECT
/*-----------------------------------------------------------------------------------*/
!(function (o, l) {
  var r,
    a,
    s = "createElement",
    g = "getElementsByTagName",
    b = "length",
    E = "style",
    d = "title",
    y = "undefined",
    k = "setAttribute",
    w = "getAttribute",
    x = null,
    A = "__svgInject",
    C = "--inject-",
    S = new RegExp(C + "\\d+", "g"),
    I = "LOAD_FAIL",
    t = "SVG_NOT_SUPPORTED",
    L = "SVG_INVALID",
    v = ["src", "alt", "onload", "onerror"],
    j = l[s]("a"),
    G = typeof SVGRect != y,
    f = { useCache: !0, copyAttributes: !0, makeIdsUnique: !0 },
    N = {
      clipPath: ["clip-path"],
      "color-profile": x,
      cursor: x,
      filter: x,
      linearGradient: ["fill", "stroke"],
      marker: ["marker", "marker-end", "marker-mid", "marker-start"],
      mask: x,
      pattern: ["fill", "stroke"],
      radialGradient: ["fill", "stroke"],
    },
    u = 1,
    c = 2,
    O = 1;
  function T(e) {
    return (r = r || new XMLSerializer()).serializeToString(e);
  }
  function P(e, r) {
    var t,
      n,
      i,
      o,
      a = C + O++,
      f = /url\("?#([a-zA-Z][\w:.-]*)"?\)/g,
      u = e.querySelectorAll("[id]"),
      c = r ? [] : x,
      l = {},
      s = [],
      d = !1;
    if (u[b]) {
      for (i = 0; i < u[b]; i++) (n = u[i].localName) in N && (l[n] = 1);
      for (n in l)
        (N[n] || [n]).forEach(function (e) {
          s.indexOf(e) < 0 && s.push(e);
        });
      s[b] && s.push(E);
      var v,
        p,
        m,
        h = e[g]("*"),
        y = e;
      for (i = -1; y != x; ) {
        if (y.localName == E)
          (m =
            (p = y.textContent) &&
            p.replace(f, function (e, r) {
              return c && (c[r] = 1), "url(#" + r + a + ")";
            })) !== p && (y.textContent = m);
        else if (y.hasAttributes()) {
          for (o = 0; o < s[b]; o++)
            (v = s[o]),
              (m =
                (p = y[w](v)) &&
                p.replace(f, function (e, r) {
                  return c && (c[r] = 1), "url(#" + r + a + ")";
                })) !== p && y[k](v, m);
          ["xlink:href", "href"].forEach(function (e) {
            var r = y[w](e);
            /^\s*#/.test(r) &&
              ((r = r.trim()), y[k](e, r + a), c && (c[r.substring(1)] = 1));
          });
        }
        y = h[++i];
      }
      for (i = 0; i < u[b]; i++)
        (t = u[i]), (c && !c[t.id]) || ((t.id += a), (d = !0));
    }
    return d;
  }
  function V(e, r, t, n) {
    if (r) {
      r[k]("data-inject-url", t);
      var i = e.parentNode;
      if (i) {
        n.copyAttributes &&
          (function c(e, r) {
            for (var t, n, i, o = e.attributes, a = 0; a < o[b]; a++)
              if (((n = (t = o[a]).name), -1 == v.indexOf(n)))
                if (((i = t.value), n == d)) {
                  var f,
                    u = r.firstElementChild;
                  u && u.localName.toLowerCase() == d
                    ? (f = u)
                    : ((f = l[s + "NS"]("http://www.w3.org/2000/svg", d)),
                      r.insertBefore(f, u)),
                    (f.textContent = i);
                } else r[k](n, i);
          })(e, r);
        var o = n.beforeInject,
          a = (o && o(e, r)) || r;
        i.replaceChild(a, e), (e[A] = u), m(e);
        var f = n.afterInject;
        f && f(e, a);
      }
    } else D(e, n);
  }
  function p() {
    for (var e = {}, r = arguments, t = 0; t < r[b]; t++) {
      var n = r[t];
      for (var i in n) n.hasOwnProperty(i) && (e[i] = n[i]);
    }
    return e;
  }
  function _(e, r) {
    if (r) {
      var t;
      try {
        t = (function i(e) {
          return (a = a || new DOMParser()).parseFromString(e, "text/xml");
        })(e);
      } catch (o) {
        return x;
      }
      return t[g]("parsererror")[b] ? x : t.documentElement;
    }
    var n = l.createElement("div");
    return (n.innerHTML = e), n.firstElementChild;
  }
  function m(e) {
    e.removeAttribute("onload");
  }
  function n(e) {
    console.error("SVGInject: " + e);
  }
  function i(e, r, t) {
    (e[A] = c), t.onFail ? t.onFail(e, r) : n(r);
  }
  function D(e, r) {
    m(e), i(e, L, r);
  }
  function F(e, r) {
    m(e), i(e, t, r);
  }
  function M(e, r) {
    i(e, I, r);
  }
  function q(e) {
    (e.onload = x), (e.onerror = x);
  }
  function R(e) {
    n("no img element");
  }
  var e = (function z(e, r) {
    var t = p(f, r),
      h = {};
    function n(a, f) {
      f = p(t, f);
      var e = function (r) {
        var e = function () {
          var e = f.onAllFinish;
          e && e(), r && r();
        };
        if (a && typeof a[b] != y) {
          var t = 0,
            n = a[b];
          if (0 == n) e();
          else
            for (
              var i = function () {
                  ++t == n && e();
                },
                o = 0;
              o < n;
              o++
            )
              u(a[o], f, i);
        } else u(a, f, e);
      };
      return typeof Promise == y ? e() : new Promise(e);
    }
    function u(u, c, e) {
      if (u) {
        var r = u[A];
        if (r) Array.isArray(r) ? r.push(e) : e();
        else {
          if ((q(u), !G)) return F(u, c), void e();
          var t = c.beforeLoad,
            n = (t && t(u)) || u[w]("src");
          if (!n) return "" === n && M(u, c), void e();
          var i = [];
          u[A] = i;
          var l = function () {
              e(),
                i.forEach(function (e) {
                  e();
                });
            },
            s = (function f(e) {
              return (j.href = e), j.href;
            })(n),
            d = c.useCache,
            v = c.makeIdsUnique,
            p = function (r) {
              d &&
                (h[s].forEach(function (e) {
                  e(r);
                }),
                (h[s] = r));
            };
          if (d) {
            var o,
              a = function (e) {
                if (e === I) M(u, c);
                else if (e === L) D(u, c);
                else {
                  var r,
                    t = e[0],
                    n = e[1],
                    i = e[2];
                  v &&
                    (t === x
                      ? ((t = P((r = _(n, !1)), !1)),
                        (e[0] = t),
                        (e[2] = t && T(r)))
                      : t &&
                        (n = (function o(e) {
                          return e.replace(S, C + O++);
                        })(i))),
                    (r = r || _(n, !1)),
                    V(u, r, s, c);
                }
                l();
              };
            if (typeof (o = h[s]) != y)
              return void (o.isCallbackQueue ? o.push(a) : a(o));
            ((o = []).isCallbackQueue = !0), (h[s] = o);
          }
          !(function m(e, r, t) {
            if (e) {
              var n = new XMLHttpRequest();
              (n.onreadystatechange = function () {
                if (4 == n.readyState) {
                  var e = n.status;
                  200 == e
                    ? r(n.responseXML, n.responseText.trim())
                    : 400 <= e
                    ? t()
                    : 0 == e && t();
                }
              }),
                n.open("GET", e, !0),
                n.send();
            }
          })(
            s,
            function (e, r) {
              var t = e instanceof Document ? e.documentElement : _(r, !0),
                n = c.afterLoad;
              if (n) {
                var i = n(t, r) || t;
                if (i) {
                  var o = "string" == typeof i;
                  (r = o ? i : T(t)), (t = o ? _(i, !0) : i);
                }
              }
              if (t instanceof SVGElement) {
                var a = x;
                if ((v && (a = P(t, !1)), d)) {
                  var f = a && T(t);
                  p([a, r, f]);
                }
                V(u, t, s, c);
              } else D(u, c), p(L);
              l();
            },
            function () {
              M(u, c), p(I), l();
            }
          );
        }
      } else R();
    }
    return (
      G &&
        (function i(e) {
          var r = l[g]("head")[0];
          if (r) {
            var t = l[s](E);
            (t.type = "text/css"),
              t.appendChild(l.createTextNode(e)),
              r.appendChild(t);
          }
        })('img[onload^="' + e + '("]{visibility:hidden;}'),
      (n.setOptions = function (e) {
        t = p(t, e);
      }),
      (n.create = z),
      (n.err = function (e, r) {
        e
          ? e[A] != c &&
            (q(e), G ? (m(e), M(e, t)) : F(e, t), r && (m(e), (e.src = r)))
          : R();
      }),
      (o[e] = n)
    );
  })("SVGInject");
  "object" == typeof module &&
    "object" == typeof module.exports &&
    (module.exports = e);
})(window, document);
/*-----------------------------------------------------------------------------------*/
/*	06. ISOTOPE
/*-----------------------------------------------------------------------------------*/
/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
        return e(t, i);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = e(t, require("jquery")))
    : (t.jQueryBridget = e(t, t.jQuery));
})(window, function (t, e) {
  "use strict";
  function i(i, s, a) {
    function u(t, e, o) {
      var n,
        s = "$()." + i + '("' + e + '")';
      return (
        t.each(function (t, u) {
          var h = a.data(u, i);
          if (!h)
            return void r(
              i + " not initialized. Cannot call methods, i.e. " + s
            );
          var d = h[e];
          if (!d || "_" == e.charAt(0))
            return void r(s + " is not a valid method");
          var l = d.apply(h, o);
          n = void 0 === n ? l : n;
        }),
        void 0 !== n ? n : t
      );
    }
    function h(t, e) {
      t.each(function (t, o) {
        var n = a.data(o, i);
        n ? (n.option(e), n._init()) : ((n = new s(o, e)), a.data(o, i, n));
      });
    }
    (a = a || e || t.jQuery),
      a &&
        (s.prototype.option ||
          (s.prototype.option = function (t) {
            a.isPlainObject(t) &&
              (this.options = a.extend(!0, this.options, t));
          }),
        (a.fn[i] = function (t) {
          if ("string" == typeof t) {
            var e = n.call(arguments, 1);
            return u(this, t, e);
          }
          return h(this, t), this;
        }),
        o(a));
  }
  function o(t) {
    !t || (t && t.bridget) || (t.bridget = i);
  }
  var n = Array.prototype.slice,
    s = t.console,
    r =
      "undefined" == typeof s
        ? function () {}
        : function (t) {
            s.error(t);
          };
  return o(e || t.jQuery), i;
}),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            o = (i[t] = i[t] || []);
          return o.indexOf(e) == -1 && o.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {}),
            o = (i[t] = i[t] || {});
          return (o[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var o = i.indexOf(e);
          return o != -1 && i.splice(o, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var o = this._onceEvents && this._onceEvents[t], n = 0;
            n < i.length;
            n++
          ) {
            var s = i[n],
              r = o && o[s];
            r && (this.off(t, s), delete o[s]), s.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("get-size/get-size", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    "use strict";
    function t(t) {
      var e = parseFloat(t),
        i = t.indexOf("%") == -1 && !isNaN(e);
      return i && e;
    }
    function e() {}
    function i() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          e = 0;
        e < h;
        e++
      ) {
        var i = u[e];
        t[i] = 0;
      }
      return t;
    }
    function o(t) {
      var e = getComputedStyle(t);
      return (
        e ||
          a(
            "Style returned " +
              e +
              ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
          ),
        e
      );
    }
    function n() {
      if (!d) {
        d = !0;
        var e = document.createElement("div");
        (e.style.width = "200px"),
          (e.style.padding = "1px 2px 3px 4px"),
          (e.style.borderStyle = "solid"),
          (e.style.borderWidth = "1px 2px 3px 4px"),
          (e.style.boxSizing = "border-box");
        var i = document.body || document.documentElement;
        i.appendChild(e);
        var n = o(e);
        (r = 200 == Math.round(t(n.width))),
          (s.isBoxSizeOuter = r),
          i.removeChild(e);
      }
    }
    function s(e) {
      if (
        (n(),
        "string" == typeof e && (e = document.querySelector(e)),
        e && "object" == typeof e && e.nodeType)
      ) {
        var s = o(e);
        if ("none" == s.display) return i();
        var a = {};
        (a.width = e.offsetWidth), (a.height = e.offsetHeight);
        for (
          var d = (a.isBorderBox = "border-box" == s.boxSizing), l = 0;
          l < h;
          l++
        ) {
          var f = u[l],
            c = s[f],
            m = parseFloat(c);
          a[f] = isNaN(m) ? 0 : m;
        }
        var p = a.paddingLeft + a.paddingRight,
          y = a.paddingTop + a.paddingBottom,
          g = a.marginLeft + a.marginRight,
          v = a.marginTop + a.marginBottom,
          _ = a.borderLeftWidth + a.borderRightWidth,
          z = a.borderTopWidth + a.borderBottomWidth,
          I = d && r,
          x = t(s.width);
        x !== !1 && (a.width = x + (I ? 0 : p + _));
        var S = t(s.height);
        return (
          S !== !1 && (a.height = S + (I ? 0 : y + z)),
          (a.innerWidth = a.width - (p + _)),
          (a.innerHeight = a.height - (y + z)),
          (a.outerWidth = a.width + g),
          (a.outerHeight = a.height + v),
          a
        );
      }
    }
    var r,
      a =
        "undefined" == typeof console
          ? e
          : function (t) {
              console.error(t);
            },
      u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      h = u.length,
      d = !1;
    return s;
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("desandro-matches-selector/matches-selector", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    "use strict";
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return "matches";
      if (t.matchesSelector) return "matchesSelector";
      for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
        var o = e[i],
          n = o + "MatchesSelector";
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "fizzy-ui-utils/utils",
          ["desandro-matches-selector/matches-selector"],
          function (i) {
            return e(t, i);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("desandro-matches-selector")))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {};
    (i.extend = function (t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }),
      (i.modulo = function (t, e) {
        return ((t % e) + e) % e;
      });
    var o = Array.prototype.slice;
    (i.makeArray = function (t) {
      if (Array.isArray(t)) return t;
      if (null === t || void 0 === t) return [];
      var e = "object" == typeof t && "number" == typeof t.length;
      return e ? o.call(t) : [t];
    }),
      (i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1);
      }),
      (i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), e(t, i))) return t;
      }),
      (i.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t;
      }),
      (i.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (i.filterFindElements = function (t, o) {
        t = i.makeArray(t);
        var n = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement) {
              if (!o) return void n.push(t);
              e(t, o) && n.push(t);
              for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++)
                n.push(i[s]);
            }
          }),
          n
        );
      }),
      (i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var o = t.prototype[e],
          n = e + "Timeout";
        t.prototype[e] = function () {
          var t = this[n];
          clearTimeout(t);
          var e = arguments,
            s = this;
          this[n] = setTimeout(function () {
            o.apply(s, e), delete s[n];
          }, i);
        };
      }),
      (i.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e
          ? setTimeout(t)
          : document.addEventListener("DOMContentLoaded", t);
      }),
      (i.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i;
          })
          .toLowerCase();
      });
    var n = t.console;
    return (
      (i.htmlInit = function (e, o) {
        i.docReady(function () {
          var s = i.toDashed(o),
            r = "data-" + s,
            a = document.querySelectorAll("[" + r + "]"),
            u = document.querySelectorAll(".js-" + s),
            h = i.makeArray(a).concat(i.makeArray(u)),
            d = r + "-options",
            l = t.jQuery;
          h.forEach(function (t) {
            var i,
              s = t.getAttribute(r) || t.getAttribute(d);
            try {
              i = s && JSON.parse(s);
            } catch (a) {
              return void (
                n &&
                n.error("Error parsing " + r + " on " + t.className + ": " + a)
              );
            }
            var u = new e(t, i);
            l && l.data(t, o, u);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          ["ev-emitter/ev-emitter", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("ev-emitter"), require("get-size")))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    "use strict";
    function i(t) {
      for (var e in t) return !1;
      return (e = null), !0;
    }
    function o(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = { x: 0, y: 0 }),
        this._create());
    }
    function n(t) {
      return t.replace(/([A-Z])/g, function (t) {
        return "-" + t.toLowerCase();
      });
    }
    var s = document.documentElement.style,
      r = "string" == typeof s.transition ? "transition" : "WebkitTransition",
      a = "string" == typeof s.transform ? "transform" : "WebkitTransform",
      u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend",
      }[r],
      h = {
        transform: a,
        transition: r,
        transitionDuration: r + "Duration",
        transitionProperty: r + "Property",
        transitionDelay: r + "Delay",
      },
      d = (o.prototype = Object.create(t.prototype));
    (d.constructor = o),
      (d._create = function () {
        (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
          this.css({ position: "absolute" });
      }),
      (d.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (d.getSize = function () {
        this.size = e(this.element);
      }),
      (d.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
          var o = h[i] || i;
          e[o] = t[i];
        }
      }),
      (d.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = this.layout._getOption("originLeft"),
          i = this.layout._getOption("originTop"),
          o = t[e ? "left" : "right"],
          n = t[i ? "top" : "bottom"],
          s = parseFloat(o),
          r = parseFloat(n),
          a = this.layout.size;
        o.indexOf("%") != -1 && (s = (s / 100) * a.width),
          n.indexOf("%") != -1 && (r = (r / 100) * a.height),
          (s = isNaN(s) ? 0 : s),
          (r = isNaN(r) ? 0 : r),
          (s -= e ? a.paddingLeft : a.paddingRight),
          (r -= i ? a.paddingTop : a.paddingBottom),
          (this.position.x = s),
          (this.position.y = r);
      }),
      (d.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop"),
          n = i ? "paddingLeft" : "paddingRight",
          s = i ? "left" : "right",
          r = i ? "right" : "left",
          a = this.position.x + t[n];
        (e[s] = this.getXValue(a)), (e[r] = "");
        var u = o ? "paddingTop" : "paddingBottom",
          h = o ? "top" : "bottom",
          d = o ? "bottom" : "top",
          l = this.position.y + t[u];
        (e[h] = this.getYValue(l)),
          (e[d] = ""),
          this.css(e),
          this.emitEvent("layout", [this]);
      }),
      (d.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + "%"
          : t + "px";
      }),
      (d.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + "%"
          : t + "px";
      }),
      (d._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          o = this.position.y,
          n = t == this.position.x && e == this.position.y;
        if ((this.setPosition(t, e), n && !this.isTransitioning))
          return void this.layoutPosition();
        var s = t - i,
          r = e - o,
          a = {};
        (a.transform = this.getTranslate(s, r)),
          this.transition({
            to: a,
            onTransitionEnd: { transform: this.layoutPosition },
            isCleaning: !0,
          });
      }),
      (d.getTranslate = function (t, e) {
        var i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop");
        return (
          (t = i ? t : -t),
          (e = o ? e : -e),
          "translate3d(" + t + "px, " + e + "px, 0)"
        );
      }),
      (d.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (d.moveTo = d._transitionTo),
      (d.setPosition = function (t, e) {
        (this.position.x = parseFloat(t)), (this.position.y = parseFloat(e));
      }),
      (d._nonTransition = function (t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
      }),
      (d.transition = function (t) {
        if (!parseFloat(this.layout.options.transitionDuration))
          return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to)
          (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
          this.css(t.from);
          var o = this.element.offsetHeight;
          o = null;
        }
        this.enableTransition(t.to),
          this.css(t.to),
          (this.isTransitioning = !0);
      });
    var l = "opacity," + n(a);
    (d.enableTransition = function () {
      if (!this.isTransitioning) {
        var t = this.layout.options.transitionDuration;
        (t = "number" == typeof t ? t + "ms" : t),
          this.css({
            transitionProperty: l,
            transitionDuration: t,
            transitionDelay: this.staggerDelay || 0,
          }),
          this.element.addEventListener(u, this, !1);
      }
    }),
      (d.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (d.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var f = { "-webkit-transform": "transform" };
    (d.ontransitionend = function (t) {
      if (t.target === this.element) {
        var e = this._transn,
          o = f[t.propertyName] || t.propertyName;
        if (
          (delete e.ingProperties[o],
          i(e.ingProperties) && this.disableTransition(),
          o in e.clean &&
            ((this.element.style[t.propertyName] = ""), delete e.clean[o]),
          o in e.onEnd)
        ) {
          var n = e.onEnd[o];
          n.call(this), delete e.onEnd[o];
        }
        this.emitEvent("transitionEnd", [this]);
      }
    }),
      (d.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(u, this, !1),
          (this.isTransitioning = !1);
      }),
      (d._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e);
      });
    var c = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: "",
    };
    return (
      (d.removeTransitionStyles = function () {
        this.css(c);
      }),
      (d.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
      }),
      (d.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({ display: "" }),
          this.emitEvent("remove", [this]);
      }),
      (d.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration)
          ? (this.once("transitionEnd", function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (d.reveal = function () {
        delete this.isHidden, this.css({ display: "" });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("visibleStyle");
        (e[i] = this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal");
      }),
      (d.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i;
      }),
      (d.hide = function () {
        (this.isHidden = !0), this.css({ display: "" });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        (e[i] = this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({ display: "none" }), this.emitEvent("hide"));
      }),
      (d.destroy = function () {
        this.css({
          position: "",
          left: "",
          right: "",
          top: "",
          bottom: "",
          transition: "",
          transform: "",
        });
      }),
      o
    );
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./item",
          ],
          function (i, o, n, s) {
            return e(t, i, o, n, s);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("ev-emitter"),
          require("get-size"),
          require("fizzy-ui-utils"),
          require("./item")
        ))
      : (t.Outlayer = e(
          t,
          t.EvEmitter,
          t.getSize,
          t.fizzyUIUtils,
          t.Outlayer.Item
        ));
  })(window, function (t, e, i, o, n) {
    "use strict";
    function s(t, e) {
      var i = o.getQueryElement(t);
      if (!i)
        return void (
          u &&
          u.error(
            "Bad element for " + this.constructor.namespace + ": " + (i || t)
          )
        );
      (this.element = i),
        h && (this.$element = h(this.element)),
        (this.options = o.extend({}, this.constructor.defaults)),
        this.option(e);
      var n = ++l;
      (this.element.outlayerGUID = n), (f[n] = this), this._create();
      var s = this._getOption("initLayout");
      s && this.layout();
    }
    function r(t) {
      function e() {
        t.apply(this, arguments);
      }
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        e
      );
    }
    function a(t) {
      if ("number" == typeof t) return t;
      var e = t.match(/(^\d*\.?\d*)(\w*)/),
        i = e && e[1],
        o = e && e[2];
      if (!i.length) return 0;
      i = parseFloat(i);
      var n = m[o] || 1;
      return i * n;
    }
    var u = t.console,
      h = t.jQuery,
      d = function () {},
      l = 0,
      f = {};
    (s.namespace = "outlayer"),
      (s.Item = n),
      (s.defaults = {
        containerStyle: { position: "relative" },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
        visibleStyle: { opacity: 1, transform: "scale(1)" },
      });
    var c = s.prototype;
    o.extend(c, e.prototype),
      (c.option = function (t) {
        o.extend(this.options, t);
      }),
      (c._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer",
      }),
      (c._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize();
      }),
      (c.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (c._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            o = [],
            n = 0;
          n < e.length;
          n++
        ) {
          var s = e[n],
            r = new i(s, this);
          o.push(r);
        }
        return o;
      }),
      (c._filterFindItemElements = function (t) {
        return o.filterFindElements(t, this.options.itemSelector);
      }),
      (c.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (c.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
      }),
      (c._init = c.layout),
      (c._resetLayout = function () {
        this.getSize();
      }),
      (c.getSize = function () {
        this.size = i(this.element);
      }),
      (c._getMeasurement = function (t, e) {
        var o,
          n = this.options[t];
        n
          ? ("string" == typeof n
              ? (o = this.element.querySelector(n))
              : n instanceof HTMLElement && (o = n),
            (this[t] = o ? i(o)[e] : n))
          : (this[t] = 0);
      }),
      (c.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (c._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (c._layoutItems = function (t, e) {
        if ((this._emitCompleteOnItems("layout", t), t && t.length)) {
          var i = [];
          t.forEach(function (t) {
            var o = this._getItemLayoutPosition(t);
            (o.item = t), (o.isInstant = e || t.isLayoutInstant), i.push(o);
          }, this),
            this._processLayoutQueue(i);
        }
      }),
      (c._getItemLayoutPosition = function () {
        return { x: 0, y: 0 };
      }),
      (c._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (c.updateStagger = function () {
        var t = this.options.stagger;
        return null === t || void 0 === t
          ? void (this.stagger = 0)
          : ((this.stagger = a(t)), this.stagger);
      }),
      (c._positionItem = function (t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i));
      }),
      (c._postLayout = function () {
        this.resizeContainer();
      }),
      (c.resizeContainer = function () {
        var t = this._getOption("resizeContainer");
        if (t) {
          var e = this._getContainerSize();
          e &&
            (this._setContainerMeasure(e.width, !0),
            this._setContainerMeasure(e.height, !1));
        }
      }),
      (c._getContainerSize = d),
      (c._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
          var i = this.size;
          i.isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
            (t = Math.max(t, 0)),
            (this.element.style[e ? "width" : "height"] = t + "px");
        }
      }),
      (c._emitCompleteOnItems = function (t, e) {
        function i() {
          n.dispatchEvent(t + "Complete", null, [e]);
        }
        function o() {
          r++, r == s && i();
        }
        var n = this,
          s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function (e) {
          e.once(t, o);
        });
      }),
      (c.dispatchEvent = function (t, e, i) {
        var o = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, o), h))
          if (((this.$element = this.$element || h(this.element)), e)) {
            var n = h.Event(e);
            (n.type = t), this.$element.trigger(n, i);
          } else this.$element.trigger(t, i);
      }),
      (c.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
      }),
      (c.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
      }),
      (c.stamp = function (t) {
        (t = this._find(t)),
          t &&
            ((this.stamps = this.stamps.concat(t)),
            t.forEach(this.ignore, this));
      }),
      (c.unstamp = function (t) {
        (t = this._find(t)),
          t &&
            t.forEach(function (t) {
              o.removeFrom(this.stamps, t), this.unignore(t);
            }, this);
      }),
      (c._find = function (t) {
        if (t)
          return (
            "string" == typeof t && (t = this.element.querySelectorAll(t)),
            (t = o.makeArray(t))
          );
      }),
      (c._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (c._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (c._manageStamp = d),
      (c._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          o = this._boundingRect,
          n = i(t),
          s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom,
          };
        return s;
      }),
      (c.handleEvent = o.handleEvent),
      (c.bindResize = function () {
        t.addEventListener("resize", this), (this.isResizeBound = !0);
      }),
      (c.unbindResize = function () {
        t.removeEventListener("resize", this), (this.isResizeBound = !1);
      }),
      (c.onresize = function () {
        this.resize();
      }),
      o.debounceMethod(s, "onresize", 100),
      (c.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (c.needsResizeLayout = function () {
        var t = i(this.element),
          e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth;
      }),
      (c.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
      }),
      (c.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
      }),
      (c.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          var i = this.items.slice(0);
          (this.items = e.concat(i)),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i);
        }
      }),
      (c.reveal = function (t) {
        if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.reveal();
          });
        }
      }),
      (c.hide = function (t) {
        if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.hide();
          });
        }
      }),
      (c.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e);
      }),
      (c.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e);
      }),
      (c.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (c.getItems = function (t) {
        t = o.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (c.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e),
          e &&
            e.length &&
            e.forEach(function (t) {
              t.remove(), o.removeFrom(this.items, t);
            }, this);
      }),
      (c.destroy = function () {
        var t = this.element.style;
        (t.height = ""),
          (t.position = ""),
          (t.width = ""),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e],
          delete this.element.outlayerGUID,
          h && h.removeData(this.element, this.constructor.namespace);
      }),
      (s.data = function (t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e];
      }),
      (s.create = function (t, e) {
        var i = r(s);
        return (
          (i.defaults = o.extend({}, s.defaults)),
          o.extend(i.defaults, e),
          (i.compatOptions = o.extend({}, s.compatOptions)),
          (i.namespace = t),
          (i.data = s.data),
          (i.Item = r(n)),
          o.htmlInit(i, t),
          h && h.bridget && h.bridget(t, i),
          i
        );
      });
    var m = { ms: 1, s: 1e3 };
    return (s.Item = n), s;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/item", ["outlayer/outlayer"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer")))
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window, function (t) {
    "use strict";
    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      o = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), o.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData["original-order"] = this.id),
            (this.sortData.random = Math.random());
          var t = this.layout.options.getSortData,
            e = this.layout._sorters;
          for (var i in t) {
            var o = e[i];
            this.sortData[i] = o(this.element, this);
          }
        }
      });
    var n = i.destroy;
    return (
      (i.destroy = function () {
        n.apply(this, arguments), this.css({ display: "" });
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("get-size"), require("outlayer")))
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (t, e) {
    "use strict";
    function i(t) {
      (this.isotope = t),
        t &&
          ((this.options = t.options[this.namespace]),
          (this.element = t.element),
          (this.items = t.filteredItems),
          (this.size = t.size));
    }
    var o = i.prototype,
      n = [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption",
      ];
    return (
      n.forEach(function (t) {
        o[t] = function () {
          return e.prototype[t].apply(this.isotope, arguments);
        };
      }),
      (o.needsVerticalResizeLayout = function () {
        var e = t(this.isotope.element),
          i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight;
      }),
      (o._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments);
      }),
      (o.getColumnWidth = function () {
        this.getSegmentSize("column", "Width");
      }),
      (o.getRowHeight = function () {
        this.getSegmentSize("row", "Height");
      }),
      (o.getSegmentSize = function (t, e) {
        var i = t + e,
          o = "outer" + e;
        if ((this._getMeasurement(i, o), !this[i])) {
          var n = this.getFirstItemSize();
          this[i] = (n && n[o]) || this.isotope.size["inner" + e];
        }
      }),
      (o.getFirstItemSize = function () {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
      }),
      (o.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments);
      }),
      (o.getSize = function () {
        this.isotope.getSize(), (this.size = this.isotope.size);
      }),
      (i.modes = {}),
      (i.create = function (t, e) {
        function n() {
          i.apply(this, arguments);
        }
        return (
          (n.prototype = Object.create(o)),
          (n.prototype.constructor = n),
          e && (n.options = e),
          (n.prototype.namespace = t),
          (i.modes[t] = n),
          n
        );
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "masonry-layout/masonry",
          ["outlayer/outlayer", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer"), require("get-size")))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return (
      (o._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (o.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var t = this.items[0],
            i = t && t.element;
          this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        var o = (this.columnWidth += this.gutter),
          n = this.containerWidth + this.gutter,
          s = n / o,
          r = o - (n % o),
          a = r && r < 1 ? "round" : "floor";
        (s = Math[a](s)), (this.cols = Math.max(s, 1));
      }),
      (o.getContainerWidth = function () {
        var t = this._getOption("fitWidth"),
          i = t ? this.element.parentNode : this.element,
          o = e(i);
        this.containerWidth = o && o.innerWidth;
      }),
      (o._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
          i = e && e < 1 ? "round" : "ceil",
          o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (
          var n = this.options.horizontalOrder
              ? "_getHorizontalColPosition"
              : "_getTopColPosition",
            s = this[n](o, t),
            r = { x: this.columnWidth * s.col, y: s.y },
            a = s.y + t.size.outerHeight,
            u = o + s.col,
            h = s.col;
          h < u;
          h++
        )
          this.colYs[h] = a;
        return r;
      }),
      (o._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          i = Math.min.apply(Math, e);
        return { col: e.indexOf(i), y: i };
      }),
      (o._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++)
          e[o] = this._getColGroupY(o, t);
        return e;
      }),
      (o._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
      }),
      (o._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols,
          o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = n ? i + t : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, t) }
        );
      }),
      (o._manageStamp = function (t) {
        var i = e(t),
          o = this._getElementOffset(t),
          n = this._getOption("originLeft"),
          s = n ? o.left : o.right,
          r = s + i.outerWidth,
          a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        (u -= r % this.columnWidth ? 0 : 1), (u = Math.min(this.cols - 1, u));
        for (
          var h = this._getOption("originTop"),
            d = (h ? o.top : o.bottom) + i.outerHeight,
            l = a;
          l <= u;
          l++
        )
          this.colYs[l] = Math.max(d, this.colYs[l]);
      }),
      (o._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = { height: this.maxY };
        return (
          this._getOption("fitWidth") &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (o._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (o.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-modes/masonry",
          ["../layout-mode", "masonry-layout/masonry"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          require("../layout-mode"),
          require("masonry-layout")
        ))
      : e(t.Isotope.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    "use strict";
    var i = t.create("masonry"),
      o = i.prototype,
      n = { _getElementOffset: !0, layout: !0, _getMeasurement: !0 };
    for (var s in e.prototype) n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function () {
      (this.items = this.isotope.filteredItems), r.call(this);
    };
    var a = o._getOption;
    return (
      (o._getOption = function (t) {
        return "fitWidth" == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : a.apply(this.isotope, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : "object" == typeof exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("fitRows"),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement("gutter", "outerWidth");
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        var o = { x: this.x, y: this.y };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          o
        );
      }),
      (i._getContainerSize = function () {
        return { height: this.maxY };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("vertical", { horizontalAlignment: 0 }),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        this.y = 0;
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotope.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (this.y += t.size.outerHeight), { x: e, y: i };
      }),
      (i._getContainerSize = function () {
        return { height: this.y };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope-layout/js/item",
            "isotope-layout/js/layout-mode",
            "isotope-layout/js/layout-modes/masonry",
            "isotope-layout/js/layout-modes/fit-rows",
            "isotope-layout/js/layout-modes/vertical",
          ],
          function (i, o, n, s, r, a) {
            return e(t, i, o, n, s, r, a);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("outlayer"),
          require("get-size"),
          require("desandro-matches-selector"),
          require("fizzy-ui-utils"),
          require("isotope-layout/js/item"),
          require("isotope-layout/js/layout-mode"),
          require("isotope-layout/js/layout-modes/masonry"),
          require("isotope-layout/js/layout-modes/fit-rows"),
          require("isotope-layout/js/layout-modes/vertical")
        ))
      : (t.Isotope = e(
          t,
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.fizzyUIUtils,
          t.Isotope.Item,
          t.Isotope.LayoutMode
        ));
  })(window, function (t, e, i, o, n, s, r) {
    function a(t, e) {
      return function (i, o) {
        for (var n = 0; n < t.length; n++) {
          var s = t[n],
            r = i.sortData[s],
            a = o.sortData[s];
          if (r > a || r < a) {
            var u = void 0 !== e[s] ? e[s] : e,
              h = u ? 1 : -1;
            return (r > a ? 1 : -1) * h;
          }
        }
        return 0;
      };
    }
    var u = t.jQuery,
      h = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
    (d.Item = s), (d.LayoutMode = r);
    var l = d.prototype;
    (l._create = function () {
      (this.itemGUID = 0),
        (this._sorters = {}),
        this._getSorters(),
        e.prototype._create.call(this),
        (this.modes = {}),
        (this.filteredItems = this.items),
        (this.sortHistory = ["original-order"]);
      for (var t in r.modes) this._initLayoutMode(t);
    }),
      (l.reloadItems = function () {
        (this.itemGUID = 0), e.prototype.reloadItems.call(this);
      }),
      (l._itemize = function () {
        for (
          var t = e.prototype._itemize.apply(this, arguments), i = 0;
          i < t.length;
          i++
        ) {
          var o = t[i];
          o.id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
      }),
      (l._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? n.extend(e.options, i) : i),
          (this.modes[t] = new e(this));
      }),
      (l.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout")
          ? void this.arrange()
          : void this._layout();
      }),
      (l._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(this.filteredItems, t),
          (this._isLayoutInited = !0);
      }),
      (l.arrange = function (t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        (this.filteredItems = e.matches),
          this._bindArrangeComplete(),
          this._isInstant
            ? this._noTransition(this._hideReveal, [e])
            : this._hideReveal(e),
          this._sort(),
          this._layout();
      }),
      (l._init = l.arrange),
      (l._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
      }),
      (l._getIsInstant = function () {
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        return (this._isInstant = e), e;
      }),
      (l._bindArrangeComplete = function () {
        function t() {
          e &&
            i &&
            o &&
            n.dispatchEvent("arrangeComplete", null, [n.filteredItems]);
        }
        var e,
          i,
          o,
          n = this;
        this.once("layoutComplete", function () {
          (e = !0), t();
        }),
          this.once("hideComplete", function () {
            (i = !0), t();
          }),
          this.once("revealComplete", function () {
            (o = !0), t();
          });
      }),
      (l._filter = function (t) {
        var e = this.options.filter;
        e = e || "*";
        for (
          var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0;
          r < t.length;
          r++
        ) {
          var a = t[r];
          if (!a.isIgnored) {
            var u = s(a);
            u && i.push(a),
              u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a);
          }
        }
        return { matches: i, needReveal: o, needHide: n };
      }),
      (l._getFilterTest = function (t) {
        return u && this.options.isJQueryFiltering
          ? function (e) {
              return u(e.element).is(t);
            }
          : "function" == typeof t
          ? function (e) {
              return t(e.element);
            }
          : function (e) {
              return o(e.element, t);
            };
      }),
      (l.updateSortData = function (t) {
        var e;
        t ? ((t = n.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
          this._getSorters(),
          this._updateItemsSortData(e);
      }),
      (l._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
          var i = t[e];
          this._sorters[e] = f(i);
        }
      }),
      (l._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
          var o = t[i];
          o.updateSortData();
        }
      });
    var f = (function () {
      function t(t) {
        if ("string" != typeof t) return t;
        var i = h(t).split(" "),
          o = i[0],
          n = o.match(/^\[(.+)\]$/),
          s = n && n[1],
          r = e(s, o),
          a = d.sortDataParsers[i[1]];
        return (t = a
          ? function (t) {
              return t && a(r(t));
            }
          : function (t) {
              return t && r(t);
            });
      }
      function e(t, e) {
        return t
          ? function (e) {
              return e.getAttribute(t);
            }
          : function (t) {
              var i = t.querySelector(e);
              return i && i.textContent;
            };
      }
      return t;
    })();
    (d.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (l._sort = function () {
        if (this.options.sortBy) {
          var t = n.makeArray(this.options.sortBy);
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory));
          var e = a(this.sortHistory, this.options.sortAscending);
          this.filteredItems.sort(e);
        }
      }),
      (l._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++)
          if (t[e] != this.sortHistory[e]) return !1;
        return !0;
      }),
      (l._mode = function () {
        var t = this.options.layoutMode,
          e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return (e.options = this.options[t]), e;
      }),
      (l._resetLayout = function () {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout();
      }),
      (l._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t);
      }),
      (l._manageStamp = function (t) {
        this._mode()._manageStamp(t);
      }),
      (l._getContainerSize = function () {
        return this._mode()._getContainerSize();
      }),
      (l.needsResizeLayout = function () {
        return this._mode().needsResizeLayout();
      }),
      (l.appended = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i = this._filterRevealAdded(e);
          this.filteredItems = this.filteredItems.concat(i);
        }
      }),
      (l.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          this._resetLayout(), this._manageStamps();
          var i = this._filterRevealAdded(e);
          this.layoutItems(this.filteredItems),
            (this.filteredItems = i.concat(this.filteredItems)),
            (this.items = e.concat(this.items));
        }
      }),
      (l._filterRevealAdded = function (t) {
        var e = this._filter(t);
        return (
          this.hide(e.needHide),
          this.reveal(e.matches),
          this.layoutItems(e.matches, !0),
          e.matches
        );
      }),
      (l.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i,
            o,
            n = e.length;
          for (i = 0; i < n; i++)
            (o = e[i]), this.element.appendChild(o.element);
          var s = this._filter(e).matches;
          for (i = 0; i < n; i++) e[i].isLayoutInstant = !0;
          for (this.arrange(), i = 0; i < n; i++) delete e[i].isLayoutInstant;
          this.reveal(s);
        }
      });
    var c = l.remove;
    return (
      (l.remove = function (t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
          var s = e[o];
          n.removeFrom(this.filteredItems, s);
        }
      }),
      (l.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
          var e = this.items[t];
          e.sortData.random = Math.random();
        }
        (this.options.sortBy = "random"), this._sort(), this._layout();
      }),
      (l._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return (this.options.transitionDuration = i), o;
      }),
      (l.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
          return t.element;
        });
      }),
      d
    );
  });
/*!
 * imagesLoaded PACKAGED v4.1.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("ev-emitter/ev-emitter", e)
    : "object" == typeof module && module.exports
    ? (module.exports = e())
    : (t.EvEmitter = e());
})(this, function () {
  function t() {}
  var e = t.prototype;
  return (
    (e.on = function (t, e) {
      if (t && e) {
        var i = (this._events = this._events || {}),
          n = (i[t] = i[t] || []);
        return -1 == n.indexOf(e) && n.push(e), this;
      }
    }),
    (e.once = function (t, e) {
      if (t && e) {
        this.on(t, e);
        var i = (this._onceEvents = this._onceEvents || {}),
          n = (i[t] = i[t] || []);
        return (n[e] = !0), this;
      }
    }),
    (e.off = function (t, e) {
      var i = this._events && this._events[t];
      if (i && i.length) {
        var n = i.indexOf(e);
        return -1 != n && i.splice(n, 1), this;
      }
    }),
    (e.emitEvent = function (t, e) {
      var i = this._events && this._events[t];
      if (i && i.length) {
        var n = 0,
          o = i[n];
        e = e || [];
        for (var r = this._onceEvents && this._onceEvents[t]; o; ) {
          var s = r && r[o];
          s && (this.off(t, o), delete r[o]),
            o.apply(this, e),
            (n += s ? 0 : 1),
            (o = i[n]);
        }
        return this;
      }
    }),
    t
  );
}),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["ev-emitter/ev-emitter"], function (i) {
          return e(t, i);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("ev-emitter")))
      : (t.imagesLoaded = e(t, t.EvEmitter));
  })(window, function (t, e) {
    function i(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function n(t) {
      var e = [];
      if (Array.isArray(t)) e = t;
      else if ("number" == typeof t.length)
        for (var i = 0; i < t.length; i++) e.push(t[i]);
      else e.push(t);
      return e;
    }
    function o(t, e, r) {
      return this instanceof o
        ? ("string" == typeof t && (t = document.querySelectorAll(t)),
          (this.elements = n(t)),
          (this.options = i({}, this.options)),
          "function" == typeof e ? (r = e) : i(this.options, e),
          r && this.on("always", r),
          this.getImages(),
          h && (this.jqDeferred = new h.Deferred()),
          void setTimeout(
            function () {
              this.check();
            }.bind(this)
          ))
        : new o(t, e, r);
    }
    function r(t) {
      this.img = t;
    }
    function s(t, e) {
      (this.url = t), (this.element = e), (this.img = new Image());
    }
    var h = t.jQuery,
      a = t.console;
    (o.prototype = Object.create(e.prototype)),
      (o.prototype.options = {}),
      (o.prototype.getImages = function () {
        (this.images = []), this.elements.forEach(this.addElementImages, this);
      }),
      (o.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t),
          this.options.background === !0 && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && d[e]) {
          for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
            var o = i[n];
            this.addImage(o);
          }
          if ("string" == typeof this.options.background) {
            var r = t.querySelectorAll(this.options.background);
            for (n = 0; n < r.length; n++) {
              var s = r[n];
              this.addElementBackgroundImages(s);
            }
          }
        }
      });
    var d = { 1: !0, 9: !0, 11: !0 };
    return (
      (o.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e)
          for (
            var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage);
            null !== n;

          ) {
            var o = n && n[2];
            o && this.addBackground(o, t), (n = i.exec(e.backgroundImage));
          }
      }),
      (o.prototype.addImage = function (t) {
        var e = new r(t);
        this.images.push(e);
      }),
      (o.prototype.addBackground = function (t, e) {
        var i = new s(t, e);
        this.images.push(i);
      }),
      (o.prototype.check = function () {
        function t(t, i, n) {
          setTimeout(function () {
            e.progress(t, i, n);
          });
        }
        var e = this;
        return (
          (this.progressedCount = 0),
          (this.hasAnyBroken = !1),
          this.images.length
            ? void this.images.forEach(function (e) {
                e.once("progress", t), e.check();
              })
            : void this.complete()
        );
      }),
      (o.prototype.progress = function (t, e, i) {
        this.progressedCount++,
          (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
          this.emitEvent("progress", [this, t, e]),
          this.jqDeferred &&
            this.jqDeferred.notify &&
            this.jqDeferred.notify(this, t),
          this.progressedCount == this.images.length && this.complete(),
          this.options.debug && a && a.log("progress: " + i, t, e);
      }),
      (o.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (
          ((this.isComplete = !0),
          this.emitEvent(t, [this]),
          this.emitEvent("always", [this]),
          this.jqDeferred)
        ) {
          var e = this.hasAnyBroken ? "reject" : "resolve";
          this.jqDeferred[e](this);
        }
      }),
      (r.prototype = Object.create(e.prototype)),
      (r.prototype.check = function () {
        var t = this.getIsImageComplete();
        return t
          ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
          : ((this.proxyImage = new Image()),
            this.proxyImage.addEventListener("load", this),
            this.proxyImage.addEventListener("error", this),
            this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            void (this.proxyImage.src = this.img.src));
      }),
      (r.prototype.getIsImageComplete = function () {
        return this.img.complete && void 0 !== this.img.naturalWidth;
      }),
      (r.prototype.confirm = function (t, e) {
        (this.isLoaded = t), this.emitEvent("progress", [this, this.img, e]);
      }),
      (r.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (r.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents();
      }),
      (r.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents();
      }),
      (r.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this),
          this.proxyImage.removeEventListener("error", this),
          this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      (s.prototype = Object.create(r.prototype)),
      (s.prototype.check = function () {
        this.img.addEventListener("load", this),
          this.img.addEventListener("error", this),
          (this.img.src = this.url);
        var t = this.getIsImageComplete();
        t &&
          (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
          this.unbindEvents());
      }),
      (s.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      (s.prototype.confirm = function (t, e) {
        (this.isLoaded = t),
          this.emitEvent("progress", [this, this.element, e]);
      }),
      (o.makeJQueryPlugin = function (e) {
        (e = e || t.jQuery),
          e &&
            ((h = e),
            (h.fn.imagesLoaded = function (t, e) {
              var i = new o(this, t, e);
              return i.jqDeferred.promise(h(this));
            }));
      }),
      o.makeJQueryPlugin(),
      o
    );
  });
/*-----------------------------------------------------------------------------------*/
/*	07. OWL CAROUSEL
/*-----------------------------------------------------------------------------------*/
/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!(function (a, b, c, d) {
  function e(b, c) {
    (this.settings = null),
      (this.options = a.extend({}, e.Defaults, c)),
      (this.$element = a(b)),
      (this._handlers = {}),
      (this._plugins = {}),
      (this._supress = {}),
      (this._current = null),
      (this._speed = null),
      (this._coordinates = []),
      (this._breakpoint = null),
      (this._width = null),
      (this._items = []),
      (this._clones = []),
      (this._mergers = []),
      (this._widths = []),
      (this._invalidated = {}),
      (this._pipe = []),
      (this._drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null,
      }),
      (this._states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"],
        },
      }),
      a.each(
        ["onResize", "onThrottledResize"],
        a.proxy(function (b, c) {
          this._handlers[c] = a.proxy(this[c], this);
        }, this)
      ),
      a.each(
        e.Plugins,
        a.proxy(function (a, b) {
          this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this)
      ),
      a.each(
        e.Workers,
        a.proxy(function (b, c) {
          this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this)
      ),
      this.setup(),
      this.initialize();
  }
  (e.Defaults = {
    items: 3,
    loop: !1,
    center: !1,
    rewind: !1,
    checkVisibility: !0,
    mouseDrag: !0,
    touchDrag: !0,
    pullDrag: !0,
    freeDrag: !1,
    margin: 0,
    stagePadding: 0,
    merge: !1,
    mergeFit: !0,
    autoWidth: !1,
    startPosition: 0,
    rtl: !1,
    smartSpeed: 250,
    fluidSpeed: !1,
    dragEndSpeed: !1,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: b,
    fallbackEasing: "swing",
    slideTransition: "",
    info: !1,
    nestedItemSelector: !1,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab",
  }),
    (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
    (e.Type = { Event: "event", State: "state" }),
    (e.Plugins = {}),
    (e.Workers = [
      {
        filter: ["width", "settings"],
        run: function () {
          this._width = this.$element.width();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          a.current = this._items && this._items[this.relative(this._current)];
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          this.$stage.children(".cloned").remove();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this.settings.margin || "",
            c = !this.settings.autoWidth,
            d = this.settings.rtl,
            e = {
              width: "auto",
              "margin-left": d ? b : "",
              "margin-right": d ? "" : b,
            };
          !c && this.$stage.children().css(e), (a.css = e);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b =
              (this.width() / this.settings.items).toFixed(3) -
              this.settings.margin,
            c = null,
            d = this._items.length,
            e = !this.settings.autoWidth,
            f = [];
          for (a.items = { merge: !1, width: b }; d--; )
            (c = this._mergers[d]),
              (c =
                (this.settings.mergeFit && Math.min(c, this.settings.items)) ||
                c),
              (a.items.merge = c > 1 || a.items.merge),
              (f[d] = e ? b * c : this._items[d].width());
          this._widths = f;
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          var b = [],
            c = this._items,
            d = this.settings,
            e = Math.max(2 * d.items, 4),
            f = 2 * Math.ceil(c.length / 2),
            g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
            h = "",
            i = "";
          for (g /= 2; g > 0; )
            b.push(this.normalize(b.length / 2, !0)),
              (h += c[b[b.length - 1]][0].outerHTML),
              b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)),
              (i = c[b[b.length - 1]][0].outerHTML + i),
              (g -= 1);
          (this._clones = b),
            a(h).addClass("cloned").appendTo(this.$stage),
            a(i).addClass("cloned").prependTo(this.$stage);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          for (
            var a = this.settings.rtl ? 1 : -1,
              b = this._clones.length + this._items.length,
              c = -1,
              d = 0,
              e = 0,
              f = [];
            ++c < b;

          )
            (d = f[c - 1] || 0),
              (e = this._widths[this.relative(c)] + this.settings.margin),
              f.push(d + e * a);
          this._coordinates = f;
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          var a = this.settings.stagePadding,
            b = this._coordinates,
            c = {
              width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
              "padding-left": a || "",
              "padding-right": a || "",
            };
          this.$stage.css(c);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this._coordinates.length,
            c = !this.settings.autoWidth,
            d = this.$stage.children();
          if (c && a.items.merge)
            for (; b--; )
              (a.css.width = this._widths[this.relative(b)]),
                d.eq(b).css(a.css);
          else c && ((a.css.width = a.items.width), d.css(a.css));
        },
      },
      {
        filter: ["items"],
        run: function () {
          this._coordinates.length < 1 && this.$stage.removeAttr("style");
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          (a.current = a.current ? this.$stage.children().index(a.current) : 0),
            (a.current = Math.max(
              this.minimum(),
              Math.min(this.maximum(), a.current)
            )),
            this.reset(a.current);
        },
      },
      {
        filter: ["position"],
        run: function () {
          this.animate(this.coordinates(this._current));
        },
      },
      {
        filter: ["width", "position", "items", "settings"],
        run: function () {
          var a,
            b,
            c,
            d,
            e = this.settings.rtl ? 1 : -1,
            f = 2 * this.settings.stagePadding,
            g = this.coordinates(this.current()) + f,
            h = g + this.width() * e,
            i = [];
          for (c = 0, d = this._coordinates.length; c < d; c++)
            (a = this._coordinates[c - 1] || 0),
              (b = Math.abs(this._coordinates[c]) + f * e),
              ((this.op(a, "<=", g) && this.op(a, ">", h)) ||
                (this.op(b, "<", g) && this.op(b, ">", h))) &&
                i.push(c);
          this.$stage.children(".active").removeClass("active"),
            this.$stage
              .children(":eq(" + i.join("), :eq(") + ")")
              .addClass("active"),
            this.$stage.children(".center").removeClass("center"),
            this.settings.center &&
              this.$stage.children().eq(this.current()).addClass("center");
        },
      },
    ]),
    (e.prototype.initializeStage = function () {
      (this.$stage = this.$element.find("." + this.settings.stageClass)),
        this.$stage.length ||
          (this.$element.addClass(this.options.loadingClass),
          (this.$stage = a("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass,
          }).wrap(a("<div/>", { class: this.settings.stageOuterClass }))),
          this.$element.append(this.$stage.parent()));
    }),
    (e.prototype.initializeItems = function () {
      var b = this.$element.find(".owl-item");
      if (b.length)
        return (
          (this._items = b.get().map(function (b) {
            return a(b);
          })),
          (this._mergers = this._items.map(function () {
            return 1;
          })),
          void this.refresh()
        );
      this.replace(this.$element.children().not(this.$stage.parent())),
        this.isVisible() ? this.refresh() : this.invalidate("width"),
        this.$element
          .removeClass(this.options.loadingClass)
          .addClass(this.options.loadedClass);
    }),
    (e.prototype.initialize = function () {
      if (
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading"))
      ) {
        var a, b, c;
        (a = this.$element.find("img")),
          (b = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : d),
          (c = this.$element.children(b).width()),
          a.length && c <= 0 && this.preloadAutoWidthImages(a);
      }
      this.initializeStage(),
        this.initializeItems(),
        this.registerEventHandlers(),
        this.leave("initializing"),
        this.trigger("initialized");
    }),
    (e.prototype.isVisible = function () {
      return !this.settings.checkVisibility || this.$element.is(":visible");
    }),
    (e.prototype.setup = function () {
      var b = this.viewport(),
        c = this.options.responsive,
        d = -1,
        e = null;
      c
        ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a));
          }),
          (e = a.extend({}, this.options, c[d])),
          "function" == typeof e.stagePadding &&
            (e.stagePadding = e.stagePadding()),
          delete e.responsive,
          e.responsiveClass &&
            this.$element.attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(
                    "(" + this.options.responsiveClass + "-)\\S+\\s",
                    "g"
                  ),
                  "$1" + d
                )
            ))
        : (e = a.extend({}, this.options)),
        this.trigger("change", { property: { name: "settings", value: e } }),
        (this._breakpoint = d),
        (this.settings = e),
        this.invalidate("settings"),
        this.trigger("changed", {
          property: { name: "settings", value: this.settings },
        });
    }),
    (e.prototype.optionsLogic = function () {
      this.settings.autoWidth &&
        ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    }),
    (e.prototype.prepare = function (b) {
      var c = this.trigger("prepare", { content: b });
      return (
        c.data ||
          (c.data = a("<" + this.settings.itemElement + "/>")
            .addClass(this.options.itemClass)
            .append(b)),
        this.trigger("prepared", { content: c.data }),
        c.data
      );
    }),
    (e.prototype.update = function () {
      for (
        var b = 0,
          c = this._pipe.length,
          d = a.proxy(function (a) {
            return this[a];
          }, this._invalidated),
          e = {};
        b < c;

      )
        (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) &&
          this._pipe[b].run(e),
          b++;
      (this._invalidated = {}), !this.is("valid") && this.enter("valid");
    }),
    (e.prototype.width = function (a) {
      switch ((a = a || e.Width.Default)) {
        case e.Width.Inner:
        case e.Width.Outer:
          return this._width;
        default:
          return (
            this._width - 2 * this.settings.stagePadding + this.settings.margin
          );
      }
    }),
    (e.prototype.refresh = function () {
      this.enter("refreshing"),
        this.trigger("refresh"),
        this.setup(),
        this.optionsLogic(),
        this.$element.addClass(this.options.refreshClass),
        this.update(),
        this.$element.removeClass(this.options.refreshClass),
        this.leave("refreshing"),
        this.trigger("refreshed");
    }),
    (e.prototype.onThrottledResize = function () {
      b.clearTimeout(this.resizeTimer),
        (this.resizeTimer = b.setTimeout(
          this._handlers.onResize,
          this.settings.responsiveRefreshRate
        ));
    }),
    (e.prototype.onResize = function () {
      return (
        !!this._items.length &&
        this._width !== this.$element.width() &&
        !!this.isVisible() &&
        (this.enter("resizing"),
        this.trigger("resize").isDefaultPrevented()
          ? (this.leave("resizing"), !1)
          : (this.invalidate("width"),
            this.refresh(),
            this.leave("resizing"),
            void this.trigger("resized")))
      );
    }),
    (e.prototype.registerEventHandlers = function () {
      a.support.transition &&
        this.$stage.on(
          a.support.transition.end + ".owl.core",
          a.proxy(this.onTransitionEnd, this)
        ),
        !1 !== this.settings.responsive &&
          this.on(b, "resize", this._handlers.onThrottledResize),
        this.settings.mouseDrag &&
          (this.$element.addClass(this.options.dragClass),
          this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
          this.$stage.on(
            "dragstart.owl.core selectstart.owl.core",
            function () {
              return !1;
            }
          )),
        this.settings.touchDrag &&
          (this.$stage.on(
            "touchstart.owl.core",
            a.proxy(this.onDragStart, this)
          ),
          this.$stage.on(
            "touchcancel.owl.core",
            a.proxy(this.onDragEnd, this)
          ));
    }),
    (e.prototype.onDragStart = function (b) {
      var d = null;
      3 !== b.which &&
        (a.support.transform
          ? ((d = this.$stage
              .css("transform")
              .replace(/.*\(|\)| /g, "")
              .split(",")),
            (d = {
              x: d[16 === d.length ? 12 : 4],
              y: d[16 === d.length ? 13 : 5],
            }))
          : ((d = this.$stage.position()),
            (d = {
              x: this.settings.rtl
                ? d.left +
                  this.$stage.width() -
                  this.width() +
                  this.settings.margin
                : d.left,
              y: d.top,
            })),
        this.is("animating") &&
          (a.support.transform ? this.animate(d.x) : this.$stage.stop(),
          this.invalidate("position")),
        this.$element.toggleClass(
          this.options.grabClass,
          "mousedown" === b.type
        ),
        this.speed(0),
        (this._drag.time = new Date().getTime()),
        (this._drag.target = a(b.target)),
        (this._drag.stage.start = d),
        (this._drag.stage.current = d),
        (this._drag.pointer = this.pointer(b)),
        a(c).on(
          "mouseup.owl.core touchend.owl.core",
          a.proxy(this.onDragEnd, this)
        ),
        a(c).one(
          "mousemove.owl.core touchmove.owl.core",
          a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on(
              "mousemove.owl.core touchmove.owl.core",
              a.proxy(this.onDragMove, this)
            ),
              (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) ||
                (b.preventDefault(),
                this.enter("dragging"),
                this.trigger("drag"));
          }, this)
        ));
    }),
    (e.prototype.onDragMove = function (a) {
      var b = null,
        c = null,
        d = null,
        e = this.difference(this._drag.pointer, this.pointer(a)),
        f = this.difference(this._drag.stage.start, e);
      this.is("dragging") &&
        (a.preventDefault(),
        this.settings.loop
          ? ((b = this.coordinates(this.minimum())),
            (c = this.coordinates(this.maximum() + 1) - b),
            (f.x = ((((f.x - b) % c) + c) % c) + b))
          : ((b = this.settings.rtl
              ? this.coordinates(this.maximum())
              : this.coordinates(this.minimum())),
            (c = this.settings.rtl
              ? this.coordinates(this.minimum())
              : this.coordinates(this.maximum())),
            (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
            (f.x = Math.max(Math.min(f.x, b + d), c + d))),
        (this._drag.stage.current = f),
        this.animate(f.x));
    }),
    (e.prototype.onDragEnd = function (b) {
      var d = this.difference(this._drag.pointer, this.pointer(b)),
        e = this._drag.stage.current,
        f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
      a(c).off(".owl.core"),
        this.$element.removeClass(this.options.grabClass),
        ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
          this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
          this.invalidate("position"),
          this.update(),
          (this._drag.direction = f),
          (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
            this._drag.target.one("click.owl.core", function () {
              return !1;
            })),
        this.is("dragging") &&
          (this.leave("dragging"), this.trigger("dragged"));
    }),
    (e.prototype.closest = function (b, c) {
      var e = -1,
        f = 30,
        g = this.width(),
        h = this.coordinates();
      return (
        this.settings.freeDrag ||
          a.each(
            h,
            a.proxy(function (a, i) {
              return (
                "left" === c && b > i - f && b < i + f
                  ? (e = a)
                  : "right" === c && b > i - g - f && b < i - g + f
                  ? (e = a + 1)
                  : this.op(b, "<", i) &&
                    this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) &&
                    (e = "left" === c ? a + 1 : a),
                -1 === e
              );
            }, this)
          ),
        this.settings.loop ||
          (this.op(b, ">", h[this.minimum()])
            ? (e = b = this.minimum())
            : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())),
        e
      );
    }),
    (e.prototype.animate = function (b) {
      var c = this.speed() > 0;
      this.is("animating") && this.onTransitionEnd(),
        c && (this.enter("animating"), this.trigger("translate")),
        a.support.transform3d && a.support.transition
          ? this.$stage.css({
              transform: "translate3d(" + b + "px,0px,0px)",
              transition:
                this.speed() / 1e3 +
                "s" +
                (this.settings.slideTransition
                  ? " " + this.settings.slideTransition
                  : ""),
            })
          : c
          ? this.$stage.animate(
              { left: b + "px" },
              this.speed(),
              this.settings.fallbackEasing,
              a.proxy(this.onTransitionEnd, this)
            )
          : this.$stage.css({ left: b + "px" });
    }),
    (e.prototype.is = function (a) {
      return this._states.current[a] && this._states.current[a] > 0;
    }),
    (e.prototype.current = function (a) {
      if (a === d) return this._current;
      if (0 === this._items.length) return d;
      if (((a = this.normalize(a)), this._current !== a)) {
        var b = this.trigger("change", {
          property: { name: "position", value: a },
        });
        b.data !== d && (a = this.normalize(b.data)),
          (this._current = a),
          this.invalidate("position"),
          this.trigger("changed", {
            property: { name: "position", value: this._current },
          });
      }
      return this._current;
    }),
    (e.prototype.invalidate = function (b) {
      return (
        "string" === a.type(b) &&
          ((this._invalidated[b] = !0),
          this.is("valid") && this.leave("valid")),
        a.map(this._invalidated, function (a, b) {
          return b;
        })
      );
    }),
    (e.prototype.reset = function (a) {
      (a = this.normalize(a)) !== d &&
        ((this._speed = 0),
        (this._current = a),
        this.suppress(["translate", "translated"]),
        this.animate(this.coordinates(a)),
        this.release(["translate", "translated"]));
    }),
    (e.prototype.normalize = function (a, b) {
      var c = this._items.length,
        e = b ? 0 : this._clones.length;
      return (
        !this.isNumeric(a) || c < 1
          ? (a = d)
          : (a < 0 || a >= c + e) &&
            (a = ((((a - e / 2) % c) + c) % c) + e / 2),
        a
      );
    }),
    (e.prototype.relative = function (a) {
      return (a -= this._clones.length / 2), this.normalize(a, !0);
    }),
    (e.prototype.maximum = function (a) {
      var b,
        c,
        d,
        e = this.settings,
        f = this._coordinates.length;
      if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
      else if (e.autoWidth || e.merge) {
        if ((b = this._items.length))
          for (
            c = this._items[--b].width(), d = this.$element.width();
            b-- && !((c += this._items[b].width() + this.settings.margin) > d);

          );
        f = b + 1;
      } else
        f = e.center ? this._items.length - 1 : this._items.length - e.items;
      return a && (f -= this._clones.length / 2), Math.max(f, 0);
    }),
    (e.prototype.minimum = function (a) {
      return a ? 0 : this._clones.length / 2;
    }),
    (e.prototype.items = function (a) {
      return a === d
        ? this._items.slice()
        : ((a = this.normalize(a, !0)), this._items[a]);
    }),
    (e.prototype.mergers = function (a) {
      return a === d
        ? this._mergers.slice()
        : ((a = this.normalize(a, !0)), this._mergers[a]);
    }),
    (e.prototype.clones = function (b) {
      var c = this._clones.length / 2,
        e = c + this._items.length,
        f = function (a) {
          return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2;
        };
      return b === d
        ? a.map(this._clones, function (a, b) {
            return f(b);
          })
        : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null;
          });
    }),
    (e.prototype.speed = function (a) {
      return a !== d && (this._speed = a), this._speed;
    }),
    (e.prototype.coordinates = function (b) {
      var c,
        e = 1,
        f = b - 1;
      return b === d
        ? a.map(
            this._coordinates,
            a.proxy(function (a, b) {
              return this.coordinates(b);
            }, this)
          )
        : (this.settings.center
            ? (this.settings.rtl && ((e = -1), (f = b + 1)),
              (c = this._coordinates[b]),
              (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e))
            : (c = this._coordinates[f] || 0),
          (c = Math.ceil(c)));
    }),
    (e.prototype.duration = function (a, b, c) {
      return 0 === c
        ? 0
        : Math.min(Math.max(Math.abs(b - a), 1), 6) *
            Math.abs(c || this.settings.smartSpeed);
    }),
    (e.prototype.to = function (a, b) {
      var c = this.current(),
        d = null,
        e = a - this.relative(c),
        f = (e > 0) - (e < 0),
        g = this._items.length,
        h = this.minimum(),
        i = this.maximum();
      this.settings.loop
        ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g),
          (a = c + e),
          (d = ((((a - h) % g) + g) % g) + h) !== a &&
            d - e <= i &&
            d - e > 0 &&
            ((c = d - e), (a = d), this.reset(c)))
        : this.settings.rewind
        ? ((i += 1), (a = ((a % i) + i) % i))
        : (a = Math.max(h, Math.min(i, a))),
        this.speed(this.duration(c, a, b)),
        this.current(a),
        this.isVisible() && this.update();
    }),
    (e.prototype.next = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) + 1, a);
    }),
    (e.prototype.prev = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) - 1, a);
    }),
    (e.prototype.onTransitionEnd = function (a) {
      if (
        a !== d &&
        (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))
      )
        return !1;
      this.leave("animating"), this.trigger("translated");
    }),
    (e.prototype.viewport = function () {
      var d;
      return (
        this.options.responsiveBaseElement !== b
          ? (d = a(this.options.responsiveBaseElement).width())
          : b.innerWidth
          ? (d = b.innerWidth)
          : c.documentElement && c.documentElement.clientWidth
          ? (d = c.documentElement.clientWidth)
          : console.warn("Can not detect viewport width."),
        d
      );
    }),
    (e.prototype.replace = function (b) {
      this.$stage.empty(),
        (this._items = []),
        b && (b = b instanceof jQuery ? b : a(b)),
        this.settings.nestedItemSelector &&
          (b = b.find("." + this.settings.nestedItemSelector)),
        b
          .filter(function () {
            return 1 === this.nodeType;
          })
          .each(
            a.proxy(function (a, b) {
              (b = this.prepare(b)),
                this.$stage.append(b),
                this._items.push(b),
                this._mergers.push(
                  1 *
                    b
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                );
            }, this)
          ),
        this.reset(
          this.isNumeric(this.settings.startPosition)
            ? this.settings.startPosition
            : 0
        ),
        this.invalidate("items");
    }),
    (e.prototype.add = function (b, c) {
      var e = this.relative(this._current);
      (c = c === d ? this._items.length : this.normalize(c, !0)),
        (b = b instanceof jQuery ? b : a(b)),
        this.trigger("add", { content: b, position: c }),
        (b = this.prepare(b)),
        0 === this._items.length || c === this._items.length
          ? (0 === this._items.length && this.$stage.append(b),
            0 !== this._items.length && this._items[c - 1].after(b),
            this._items.push(b),
            this._mergers.push(
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            ))
          : (this._items[c].before(b),
            this._items.splice(c, 0, b),
            this._mergers.splice(
              c,
              0,
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            )),
        this._items[e] && this.reset(this._items[e].index()),
        this.invalidate("items"),
        this.trigger("added", { content: b, position: c });
    }),
    (e.prototype.remove = function (a) {
      (a = this.normalize(a, !0)) !== d &&
        (this.trigger("remove", { content: this._items[a], position: a }),
        this._items[a].remove(),
        this._items.splice(a, 1),
        this._mergers.splice(a, 1),
        this.invalidate("items"),
        this.trigger("removed", { content: null, position: a }));
    }),
    (e.prototype.preloadAutoWidthImages = function (b) {
      b.each(
        a.proxy(function (b, c) {
          this.enter("pre-loading"),
            (c = a(c)),
            a(new Image())
              .one(
                "load",
                a.proxy(function (a) {
                  c.attr("src", a.target.src),
                    c.css("opacity", 1),
                    this.leave("pre-loading"),
                    !this.is("pre-loading") &&
                      !this.is("initializing") &&
                      this.refresh();
                }, this)
              )
              .attr(
                "src",
                c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")
              );
        }, this)
      );
    }),
    (e.prototype.destroy = function () {
      this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        a(c).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (b.clearTimeout(this.resizeTimer),
          this.off(b, "resize", this._handlers.onThrottledResize));
      for (var d in this._plugins) this._plugins[d].destroy();
      this.$stage.children(".cloned").remove(),
        this.$stage.unwrap(),
        this.$stage.children().contents().unwrap(),
        this.$stage.children().unwrap(),
        this.$stage.remove(),
        this.$element
          .removeClass(this.options.refreshClass)
          .removeClass(this.options.loadingClass)
          .removeClass(this.options.loadedClass)
          .removeClass(this.options.rtlClass)
          .removeClass(this.options.dragClass)
          .removeClass(this.options.grabClass)
          .attr(
            "class",
            this.$element
              .attr("class")
              .replace(
                new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                ""
              )
          )
          .removeData("owl.carousel");
    }),
    (e.prototype.op = function (a, b, c) {
      var d = this.settings.rtl;
      switch (b) {
        case "<":
          return d ? a > c : a < c;
        case ">":
          return d ? a < c : a > c;
        case ">=":
          return d ? a <= c : a >= c;
        case "<=":
          return d ? a >= c : a <= c;
      }
    }),
    (e.prototype.on = function (a, b, c, d) {
      a.addEventListener
        ? a.addEventListener(b, c, d)
        : a.attachEvent && a.attachEvent("on" + b, c);
    }),
    (e.prototype.off = function (a, b, c, d) {
      a.removeEventListener
        ? a.removeEventListener(b, c, d)
        : a.detachEvent && a.detachEvent("on" + b, c);
    }),
    (e.prototype.trigger = function (b, c, d, f, g) {
      var h = { item: { count: this._items.length, index: this.current() } },
        i = a.camelCase(
          a
            .grep(["on", b, d], function (a) {
              return a;
            })
            .join("-")
            .toLowerCase()
        ),
        j = a.Event(
          [b, "owl", d || "carousel"].join(".").toLowerCase(),
          a.extend({ relatedTarget: this }, h, c)
        );
      return (
        this._supress[b] ||
          (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j);
          }),
          this.register({ type: e.Type.Event, name: b }),
          this.$element.trigger(j),
          this.settings &&
            "function" == typeof this.settings[i] &&
            this.settings[i].call(this, j)),
        j
      );
    }),
    (e.prototype.enter = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b] === d && (this._states.current[b] = 0),
            this._states.current[b]++;
        }, this)
      );
    }),
    (e.prototype.leave = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b]--;
        }, this)
      );
    }),
    (e.prototype.register = function (b) {
      if (b.type === e.Type.Event) {
        if (
          (a.event.special[b.name] || (a.event.special[b.name] = {}),
          !a.event.special[b.name].owl)
        ) {
          var c = a.event.special[b.name]._default;
          (a.event.special[b.name]._default = function (a) {
            return !c ||
              !c.apply ||
              (a.namespace && -1 !== a.namespace.indexOf("owl"))
              ? a.namespace && a.namespace.indexOf("owl") > -1
              : c.apply(this, arguments);
          }),
            (a.event.special[b.name].owl = !0);
        }
      } else
        b.type === e.Type.State &&
          (this._states.tags[b.name]
            ? (this._states.tags[b.name] = this._states.tags[b.name].concat(
                b.tags
              ))
            : (this._states.tags[b.name] = b.tags),
          (this._states.tags[b.name] = a.grep(
            this._states.tags[b.name],
            a.proxy(function (c, d) {
              return a.inArray(c, this._states.tags[b.name]) === d;
            }, this)
          )));
    }),
    (e.prototype.suppress = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          this._supress[b] = !0;
        }, this)
      );
    }),
    (e.prototype.release = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          delete this._supress[b];
        }, this)
      );
    }),
    (e.prototype.pointer = function (a) {
      var c = { x: null, y: null };
      return (
        (a = a.originalEvent || a || b.event),
        (a =
          a.touches && a.touches.length
            ? a.touches[0]
            : a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : a),
        a.pageX
          ? ((c.x = a.pageX), (c.y = a.pageY))
          : ((c.x = a.clientX), (c.y = a.clientY)),
        c
      );
    }),
    (e.prototype.isNumeric = function (a) {
      return !isNaN(parseFloat(a));
    }),
    (e.prototype.difference = function (a, b) {
      return { x: a.x - b.x, y: a.y - b.y };
    }),
    (a.fn.owlCarousel = function (b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var d = a(this),
          f = d.data("owl.carousel");
        f ||
          ((f = new e(this, "object" == typeof b && b)),
          d.data("owl.carousel", f),
          a.each(
            [
              "next",
              "prev",
              "to",
              "destroy",
              "refresh",
              "replace",
              "add",
              "remove",
            ],
            function (b, c) {
              f.register({ type: e.Type.Event, name: c }),
                f.$element.on(
                  c + ".owl.carousel.core",
                  a.proxy(function (a) {
                    a.namespace &&
                      a.relatedTarget !== this &&
                      (this.suppress([c]),
                      f[c].apply(this, [].slice.call(arguments, 1)),
                      this.release([c]));
                  }, f)
                );
            }
          )),
          "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
      });
    }),
    (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (e.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = b.setInterval(
            a.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (e.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            a.proxy(function (b) {
              if (
                b.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((b.property && "position" == b.property.name) ||
                  "initialized" == b.type)
              ) {
                var c = this._core.settings,
                  e = (c.center && Math.ceil(c.items / 2)) || c.items,
                  f = (c.center && -1 * e) || 0,
                  g =
                    (b.property && b.property.value !== d
                      ? b.property.value
                      : this._core.current()) + f,
                  h = this._core.clones().length,
                  i = a.proxy(function (a, b) {
                    this.load(b);
                  }, this);
                for (
                  c.lazyLoadEager > 0 &&
                  ((e += c.lazyLoadEager),
                  c.loop && ((g -= c.lazyLoadEager), e++));
                  f++ < e;

                )
                  this.load(h / 2 + this._core.relative(g)),
                    h && a.each(this._core.clones(this._core.relative(g)), i),
                    g++;
              }
            }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
          e = d && d.find(".owl-lazy");
        !e ||
          a.inArray(d.get(0), this._loaded) > -1 ||
          (e.each(
            a.proxy(function (c, d) {
              var e,
                f = a(d),
                g =
                  (b.devicePixelRatio > 1 && f.attr("data-src-retina")) ||
                  f.attr("data-src") ||
                  f.attr("data-srcset");
              this._core.trigger("load", { element: f, url: g }, "lazy"),
                f.is("img")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          f.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: f, url: g },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", g)
                  : f.is("source")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: f, url: g },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", g)
                  : ((e = new Image()),
                    (e.onload = a.proxy(function () {
                      f.css({
                        "background-image": 'url("' + g + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: f, url: g },
                          "lazy"
                        );
                    }, this)),
                    (e.src = g));
            }, this)
          ),
          this._loaded.push(d.get(0)));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (c) {
      (this._core = c),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (
            a
          ) {
            a.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              "position" === a.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              a.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var d = this;
      a(b).on("load", function () {
        d._core.settings.autoHeight && d.update();
      }),
        a(b).resize(function () {
          d._core.settings.autoHeight &&
            (null != d._intervalId && clearTimeout(d._intervalId),
            (d._intervalId = setTimeout(function () {
              d.update();
            }, 250)));
        });
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        var b = this._core._current,
          c = b + this._core.settings.items,
          d = this._core.settings.lazyLoad,
          e = this._core.$stage.children().toArray().slice(b, c),
          f = [],
          g = 0;
        a.each(e, function (b, c) {
          f.push(a(c).height());
        }),
          (g = Math.max.apply(null, f)),
          g <= 1 && d && this._previousHeight && (g = this._previousHeight),
          (this._previousHeight = g),
          this._core.$stage
            .parent()
            .height(g)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              a.preventDefault();
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" === a.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content).find(".owl-video");
              c.length &&
                (c.css("display", "none"), this.fetch(c, a(b.content)));
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          a.proxy(function (a) {
            this.play(a);
          }, this)
        );
    };
    (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (e.prototype.fetch = function (a, b) {
        var c = (function () {
            return a.attr("data-vimeo-id")
              ? "vimeo"
              : a.attr("data-vzaar-id")
              ? "vzaar"
              : "youtube";
          })(),
          d =
            a.attr("data-vimeo-id") ||
            a.attr("data-youtube-id") ||
            a.attr("data-vzaar-id"),
          e = a.attr("data-width") || this._core.settings.videoWidth,
          f = a.attr("data-height") || this._core.settings.videoHeight,
          g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (
          ((d = g.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          d[3].indexOf("youtu") > -1)
        )
          c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
          if (!(d[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          c = "vzaar";
        }
        (d = d[6]),
          (this._videos[g] = { type: c, id: d, width: e, height: f }),
          b.attr("data-video", g),
          this.thumbnail(a, this._videos[g]);
      }),
      (e.prototype.thumbnail = function (b, c) {
        var d,
          e,
          f,
          g =
            c.width && c.height
              ? "width:" + c.width + "px;height:" + c.height + "px;"
              : "",
          h = b.find("img"),
          i = "src",
          j = "",
          k = this._core.settings,
          l = function (c) {
            (e = '<div class="owl-video-play-icon"></div>'),
              (d = k.lazyLoad
                ? a("<div/>", { class: "owl-video-tn " + j, srcType: c })
                : a("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + c + ")",
                  })),
              b.after(d),
              b.after(e);
          };
        if (
          (b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })),
          this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")),
          h.length)
        )
          return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type
          ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
          : "vimeo" === c.type
          ? a.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a[0].thumbnail_large), l(f);
              },
            })
          : "vzaar" === c.type &&
            a.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a.framegrab_url), l(f);
              },
            });
      }),
      (e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (e.prototype.play = function (b) {
        var c,
          d = a(b.target),
          e = d.closest("." + this._core.settings.itemClass),
          f = this._videos[e.attr("data-video")],
          g = f.width || "100%",
          h = f.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          (c = a(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )),
          c.attr("height", h),
          c.attr("width", g),
          "youtube" === f.type
            ? c.attr(
                "src",
                "//www.youtube.com/embed/" +
                  f.id +
                  "?autoplay=1&rel=0&v=" +
                  f.id
              )
            : "vimeo" === f.type
            ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1")
            : "vzaar" === f.type &&
              c.attr(
                "src",
                "//view.vzaar.com/" + f.id + "/player?autoplay=true"
              ),
          a(c)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(e.find(".owl-video")),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (e.prototype.isInFullScreen = function () {
        var b =
          c.fullscreenElement ||
          c.mozFullScreenElement ||
          c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame");
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Video = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this.core = b),
        (this.core.options = a.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = d),
        (this.next = d),
        (this.handlers = {
          "change.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" == a.property.name &&
              ((this.previous = this.core.current()),
              (this.next = a.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            a.proxy(function (a) {
              a.namespace && (this.swapping = "translated" == a.type);
            }, this),
          "translate.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          a.support.animation &&
          a.support.transition
        ) {
          this.core.speed(0);
          var b,
            c = a.proxy(this.clear, this),
            d = this.core.$stage.children().eq(this.previous),
            e = this.core.$stage.children().eq(this.next),
            f = this.core.settings.animateIn,
            g = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (g &&
              ((b =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              d
                .one(a.support.animation.end, c)
                .css({ left: b + "px" })
                .addClass("animated owl-animated-out")
                .addClass(g)),
            f &&
              e
                .one(a.support.animation.end, c)
                .addClass("animated owl-animated-in")
                .addClass(f));
        }
      }),
      (e.prototype.clear = function (b) {
        a(b.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "settings" === a.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : a.namespace &&
                "position" === a.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": a.proxy(function (a, b, c) {
            a.namespace && this.play(b, c);
          }, this),
          "stop.owl.autoplay": a.proxy(function (a) {
            a.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = a.extend({}, e.Defaults, this._core.options));
    };
    (e.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (e.prototype._next = function (d) {
        (this._call = b.setTimeout(
          a.proxy(this._next, this, d),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            c.hidden ||
            this._core.next(d || this._core.settings.autoplaySpeed);
      }),
      (e.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (e.prototype.play = function (c, d) {
        var e;
        this._core.is("rotating") || this._core.enter("rotating"),
          (c = c || this._core.settings.autoplayTimeout),
          (e = Math.min(this._time % (this._timeout || c), c)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : b.clearTimeout(this._call),
          (this._time += (this.read() % c) - e),
          (this._timeout = c),
          (this._call = b.setTimeout(a.proxy(this._next, this, d), c - e));
      }),
      (e.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          b.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (e.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          b.clearTimeout(this._call));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (b) {
      (this._core = b),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": a.proxy(function (b) {
            b.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  a(b.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 1);
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "position" == a.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="Previous">&#x2039;</span>',
        '<span aria-label="Next">&#x203a;</span>',
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (e.prototype.initialize = function () {
        var b,
          c = this._core.settings;
        (this._controls.$relative = (
          c.navContainer
            ? a(c.navContainer)
            : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
          (this._controls.$previous = a("<" + c.navElement + ">")
            .addClass(c.navClass[0])
            .html(c.navText[0])
            .prependTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.prev(c.navSpeed);
              }, this)
            )),
          (this._controls.$next = a("<" + c.navElement + ">")
            .addClass(c.navClass[1])
            .html(c.navText[1])
            .appendTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.next(c.navSpeed);
              }, this)
            )),
          c.dotsData ||
            (this._templates = [
              a('<button role="button">')
                .addClass(c.dotClass)
                .append(a("<span>"))
                .prop("outerHTML"),
            ]),
          (this._controls.$absolute = (
            c.dotsContainer
              ? a(c.dotsContainer)
              : a("<div>").addClass(c.dotsClass).appendTo(this.$element)
          ).addClass("disabled")),
          this._controls.$absolute.on(
            "click",
            "button",
            a.proxy(function (b) {
              var d = a(b.target).parent().is(this._controls.$absolute)
                ? a(b.target).index()
                : a(b.target).parent().index();
              b.preventDefault(), this.to(d, c.dotsSpeed);
            }, this)
          );
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
      }),
      (e.prototype.destroy = function () {
        var a, b, c, d, e;
        e = this._core.settings;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls)
          "$relative" === b && e.navContainer
            ? this._controls[b].html("")
            : this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (e.prototype.update = function () {
        var a,
          b,
          c,
          d = this._core.clones().length / 2,
          e = d + this._core.items().length,
          f = this._core.maximum(!0),
          g = this._core.settings,
          h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if (
          ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)),
          g.dots || "page" == g.slideBy)
        )
          for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
            if (b >= h || 0 === b) {
              if (
                (this._pages.push({
                  start: Math.min(f, a - d),
                  end: a - d + h - 1,
                }),
                Math.min(f, a - d) === f)
              )
                break;
              (b = 0), ++c;
            }
            b += this._core.mergers(this._core.relative(a));
          }
      }),
      (e.prototype.draw = function () {
        var b,
          c = this._core.settings,
          d = this._core.items().length <= c.items,
          e = this._core.relative(this._core.current()),
          f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d),
          c.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !f && e <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !f && e >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !c.dots || d),
          c.dots &&
            ((b =
              this._pages.length - this._controls.$absolute.children().length),
            c.dotsData && 0 !== b
              ? this._controls.$absolute.html(this._templates.join(""))
              : b > 0
              ? this._controls.$absolute.append(
                  new Array(b + 1).join(this._templates[0])
                )
              : b < 0 && this._controls.$absolute.children().slice(b).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(a.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
          index: a.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            c &&
            (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items),
        };
      }),
      (e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a
          .grep(
            this._pages,
            a.proxy(function (a, c) {
              return a.start <= b && a.end >= b;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (b) {
        var c,
          d,
          e = this._core.settings;
        return (
          "page" == e.slideBy
            ? ((c = a.inArray(this.current(), this._pages)),
              (d = this._pages.length),
              b ? ++c : --c,
              (c = this._pages[((c % d) + d) % d].start))
            : ((c = this._core.relative(this._core.current())),
              (d = this._core.items().length),
              b ? (c += e.slideBy) : (c -= e.slideBy)),
          c
        );
      }),
      (e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
      }),
      (e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
      }),
      (e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length
          ? ((e = this._pages.length),
            a.proxy(this._overrides.to, this._core)(
              this._pages[((b % e) + e) % e].start,
              c
            ))
          : a.proxy(this._overrides.to, this._core)(b, c);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (c) {
      (this._core = c),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (c) {
            c.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              a(b).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!c) return;
              this._hashes[c] = b.content;
            }
          }, this),
          "changed.owl.carousel": a.proxy(function (c) {
            if (c.namespace && "position" === c.property.name) {
              var d = this._core.items(
                  this._core.relative(this._core.current())
                ),
                e = a
                  .map(this._hashes, function (a, b) {
                    return a === d ? b : null;
                  })
                  .join();
              if (!e || b.location.hash.slice(1) === e) return;
              b.location.hash = e;
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        a(b).on(
          "hashchange.owl.navigation",
          a.proxy(function (a) {
            var c = b.location.hash.substring(1),
              e = this._core.$stage.children(),
              f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d &&
              f !== this._core.current() &&
              this._core.to(this._core.relative(f), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))
          "function" != typeof this[d] && (this[d] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    function e(b, c) {
      var e = !1,
        f = b.charAt(0).toUpperCase() + b.slice(1);
      return (
        a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
          if (g[b] !== d) return (e = !c || b), !1;
        }),
        e
      );
    }
    function f(a) {
      return e(a, !0);
    }
    var g = a("<support>").get(0).style,
      h = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      j = {
        csstransforms: function () {
          return !!e("transform");
        },
        csstransforms3d: function () {
          return !!e("perspective");
        },
        csstransitions: function () {
          return !!e("transition");
        },
        cssanimations: function () {
          return !!e("animation");
        },
      };
    j.csstransitions() &&
      ((a.support.transition = new String(f("transition"))),
      (a.support.transition.end = i.transition.end[a.support.transition])),
      j.cssanimations() &&
        ((a.support.animation = new String(f("animation"))),
        (a.support.animation.end = i.animation.end[a.support.animation])),
      j.csstransforms() &&
        ((a.support.transform = new String(f("transform"))),
        (a.support.transform3d = j.csstransforms3d()));
  })(window.Zepto || window.jQuery, window, document);
/*-----------------------------------------------------------------------------------*/
/*	08. PLYR 3.6.4
/*-----------------------------------------------------------------------------------*/
"object" == typeof navigator &&
  (function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define("Plyr", t)
      : ((e = "undefined" != typeof globalThis ? globalThis : e || self).Plyr =
          t());
  })(this, function () {
    "use strict";
    function e(t) {
      return (e =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            })(t);
    }
    function t(e, t) {
      if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function");
    }
    function n(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(e, i.key, i);
      }
    }
    function i(e, t, i) {
      return t && n(e.prototype, t), i && n(e, i), e;
    }
    function a(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    function r(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, i);
      }
      return n;
    }
    function o(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? r(Object(n), !0).forEach(function (t) {
              a(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : r(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t)
              );
            });
      }
      return e;
    }
    function s(e, t) {
      if (null == e) return {};
      var n,
        i,
        a = (function (e, t) {
          if (null == e) return {};
          var n,
            i,
            a = {},
            r = Object.keys(e);
          for (i = 0; i < r.length; i++)
            (n = r[i]), t.indexOf(n) >= 0 || (a[n] = e[n]);
          return a;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        for (i = 0; i < r.length; i++)
          (n = r[i]),
            t.indexOf(n) >= 0 ||
              (Object.prototype.propertyIsEnumerable.call(e, n) &&
                (a[n] = e[n]));
      }
      return a;
    }
    function l(e, t) {
      return (
        (function (e) {
          if (Array.isArray(e)) return e;
        })(e) ||
        (function (e, t) {
          if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
            return;
          var n = [],
            i = !0,
            a = !1,
            r = void 0;
          try {
            for (
              var o, s = e[Symbol.iterator]();
              !(i = (o = s.next()).done) &&
              (n.push(o.value), !t || n.length !== t);
              i = !0
            );
          } catch (e) {
            (a = !0), (r = e);
          } finally {
            try {
              i || null == s.return || s.return();
            } finally {
              if (a) throw r;
            }
          }
          return n;
        })(e, t) ||
        u(e, t) ||
        (function () {
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        })()
      );
    }
    function c(e) {
      return (
        (function (e) {
          if (Array.isArray(e)) return d(e);
        })(e) ||
        (function (e) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
            return Array.from(e);
        })(e) ||
        u(e) ||
        (function () {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        })()
      );
    }
    function u(e, t) {
      if (e) {
        if ("string" == typeof e) return d(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        return (
          "Object" === n && e.constructor && (n = e.constructor.name),
          "Map" === n || "Set" === n
            ? Array.from(e)
            : "Arguments" === n ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            ? d(e, t)
            : void 0
        );
      }
    }
    function d(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
      return i;
    }
    function h(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(e, i.key, i);
      }
    }
    function m(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    function p(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, i);
      }
      return n;
    }
    function f(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? p(Object(n), !0).forEach(function (t) {
              m(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : p(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t)
              );
            });
      }
      return e;
    }
    var g = { addCSS: !0, thumbWidth: 15, watch: !0 };
    function y(e, t) {
      return function () {
        return Array.from(document.querySelectorAll(t)).includes(this);
      }.call(e, t);
    }
    var b = function (e) {
        return null != e ? e.constructor : null;
      },
      v = function (e, t) {
        return !!(e && t && e instanceof t);
      },
      w = function (e) {
        return null == e;
      },
      k = function (e) {
        return b(e) === Object;
      },
      T = function (e) {
        return b(e) === String;
      },
      C = function (e) {
        return Array.isArray(e);
      },
      A = function (e) {
        return v(e, NodeList);
      },
      S = T,
      P = C,
      E = A,
      N = function (e) {
        return v(e, Element);
      },
      M = function (e) {
        return v(e, Event);
      },
      x = function (e) {
        return (
          w(e) ||
          ((T(e) || C(e) || A(e)) && !e.length) ||
          (k(e) && !Object.keys(e).length)
        );
      };
    function I(e, t) {
      if (1 > t) {
        var n = (function (e) {
          var t = "".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
          return t
            ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0))
            : 0;
        })(t);
        return parseFloat(e.toFixed(n));
      }
      return Math.round(e / t) * t;
    }
    var L,
      O,
      _,
      j = (function () {
        function e(t, n) {
          (function (e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            N(t)
              ? (this.element = t)
              : S(t) && (this.element = document.querySelector(t)),
            N(this.element) &&
              x(this.element.rangeTouch) &&
              ((this.config = f({}, g, {}, n)), this.init());
        }
        return (
          (function (e, t, n) {
            t && h(e.prototype, t), n && h(e, n);
          })(
            e,
            [
              {
                key: "init",
                value: function () {
                  e.enabled &&
                    (this.config.addCSS &&
                      ((this.element.style.userSelect = "none"),
                      (this.element.style.webKitUserSelect = "none"),
                      (this.element.style.touchAction = "manipulation")),
                    this.listeners(!0),
                    (this.element.rangeTouch = this));
                },
              },
              {
                key: "destroy",
                value: function () {
                  e.enabled &&
                    (this.config.addCSS &&
                      ((this.element.style.userSelect = ""),
                      (this.element.style.webKitUserSelect = ""),
                      (this.element.style.touchAction = "")),
                    this.listeners(!1),
                    (this.element.rangeTouch = null));
                },
              },
              {
                key: "listeners",
                value: function (e) {
                  var t = this,
                    n = e ? "addEventListener" : "removeEventListener";
                  ["touchstart", "touchmove", "touchend"].forEach(function (e) {
                    t.element[n](
                      e,
                      function (e) {
                        return t.set(e);
                      },
                      !1
                    );
                  });
                },
              },
              {
                key: "get",
                value: function (t) {
                  if (!e.enabled || !M(t)) return null;
                  var n,
                    i = t.target,
                    a = t.changedTouches[0],
                    r = parseFloat(i.getAttribute("min")) || 0,
                    o = parseFloat(i.getAttribute("max")) || 100,
                    s = parseFloat(i.getAttribute("step")) || 1,
                    l = i.getBoundingClientRect(),
                    c = ((100 / l.width) * (this.config.thumbWidth / 2)) / 100;
                  return (
                    0 > (n = (100 / l.width) * (a.clientX - l.left))
                      ? (n = 0)
                      : 100 < n && (n = 100),
                    50 > n
                      ? (n -= (100 - 2 * n) * c)
                      : 50 < n && (n += 2 * (n - 50) * c),
                    r + I((n / 100) * (o - r), s)
                  );
                },
              },
              {
                key: "set",
                value: function (t) {
                  e.enabled &&
                    M(t) &&
                    !t.target.disabled &&
                    (t.preventDefault(),
                    (t.target.value = this.get(t)),
                    (function (e, t) {
                      if (e && t) {
                        var n = new Event(t, { bubbles: !0 });
                        e.dispatchEvent(n);
                      }
                    })(t.target, "touchend" === t.type ? "change" : "input"));
                },
              },
            ],
            [
              {
                key: "setup",
                value: function (t) {
                  var n =
                      1 < arguments.length && void 0 !== arguments[1]
                        ? arguments[1]
                        : {},
                    i = null;
                  if (
                    (x(t) || S(t)
                      ? (i = Array.from(
                          document.querySelectorAll(
                            S(t) ? t : 'input[type="range"]'
                          )
                        ))
                      : N(t)
                      ? (i = [t])
                      : E(t)
                      ? (i = Array.from(t))
                      : P(t) && (i = t.filter(N)),
                    x(i))
                  )
                    return null;
                  var a = f({}, g, {}, n);
                  if (S(t) && a.watch) {
                    var r = new MutationObserver(function (n) {
                      Array.from(n).forEach(function (n) {
                        Array.from(n.addedNodes).forEach(function (n) {
                          N(n) && y(n, t) && new e(n, a);
                        });
                      });
                    });
                    r.observe(document.body, { childList: !0, subtree: !0 });
                  }
                  return i.map(function (t) {
                    return new e(t, n);
                  });
                },
              },
              {
                key: "enabled",
                get: function () {
                  return "ontouchstart" in document.documentElement;
                },
              },
            ]
          ),
          e
        );
      })(),
      D = function (e) {
        return null != e ? e.constructor : null;
      },
      q = function (e, t) {
        return Boolean(e && t && e instanceof t);
      },
      H = function (e) {
        return null == e;
      },
      F = function (e) {
        return D(e) === Object;
      },
      R = function (e) {
        return D(e) === String;
      },
      V = function (e) {
        return D(e) === Function;
      },
      B = function (e) {
        return Array.isArray(e);
      },
      U = function (e) {
        return q(e, NodeList);
      },
      W = function (e) {
        return (
          H(e) ||
          ((R(e) || B(e) || U(e)) && !e.length) ||
          (F(e) && !Object.keys(e).length)
        );
      },
      z = H,
      K = F,
      Y = function (e) {
        return D(e) === Number && !Number.isNaN(e);
      },
      Q = R,
      X = function (e) {
        return D(e) === Boolean;
      },
      $ = V,
      J = B,
      G = U,
      Z = function (t) {
        return (
          null !== t &&
          "object" === e(t) &&
          1 === t.nodeType &&
          "object" === e(t.style) &&
          "object" === e(t.ownerDocument)
        );
      },
      ee = function (e) {
        return q(e, Event);
      },
      te = function (e) {
        return q(e, KeyboardEvent);
      },
      ne = function (e) {
        return q(e, TextTrack) || (!H(e) && R(e.kind));
      },
      ie = function (e) {
        return q(e, Promise) && V(e.then);
      },
      ae = function (e) {
        if (q(e, window.URL)) return !0;
        if (!R(e)) return !1;
        var t = e;
        (e.startsWith("http://") && e.startsWith("https://")) ||
          (t = "http://".concat(e));
        try {
          return !W(new URL(t).hostname);
        } catch (e) {
          return !1;
        }
      },
      re = W,
      oe =
        ((L = document.createElement("span")),
        (O = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend",
        }),
        (_ = Object.keys(O).find(function (e) {
          return void 0 !== L.style[e];
        })),
        !!Q(_) && O[_]);
    function se(e, t) {
      setTimeout(function () {
        try {
          (e.hidden = !0), e.offsetHeight, (e.hidden = !1);
        } catch (e) {}
      }, t);
    }
    var le = {
      isIE:
        /* @cc_on!@ */
        !!document.documentMode,
      isEdge: window.navigator.userAgent.includes("Edge"),
      isWebkit:
        "WebkitAppearance" in document.documentElement.style &&
        !/Edge/.test(navigator.userAgent),
      isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
      isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
    };
    function ce(e, t) {
      return t.split(".").reduce(function (e, t) {
        return e && e[t];
      }, e);
    }
    function ue() {
      for (
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = arguments.length,
          n = new Array(t > 1 ? t - 1 : 0),
          i = 1;
        i < t;
        i++
      )
        n[i - 1] = arguments[i];
      if (!n.length) return e;
      var r = n.shift();
      return K(r)
        ? (Object.keys(r).forEach(function (t) {
            K(r[t])
              ? (Object.keys(e).includes(t) || Object.assign(e, a({}, t, {})),
                ue(e[t], r[t]))
              : Object.assign(e, a({}, t, r[t]));
          }),
          ue.apply(void 0, [e].concat(n)))
        : e;
    }
    function de(e, t) {
      var n = e.length ? e : [e];
      Array.from(n)
        .reverse()
        .forEach(function (e, n) {
          var i = n > 0 ? t.cloneNode(!0) : t,
            a = e.parentNode,
            r = e.nextSibling;
          i.appendChild(e), r ? a.insertBefore(i, r) : a.appendChild(i);
        });
    }
    function he(e, t) {
      Z(e) &&
        !re(t) &&
        Object.entries(t)
          .filter(function (e) {
            var t = l(e, 2)[1];
            return !z(t);
          })
          .forEach(function (t) {
            var n = l(t, 2),
              i = n[0],
              a = n[1];
            return e.setAttribute(i, a);
          });
    }
    function me(e, t, n) {
      var i = document.createElement(e);
      return K(t) && he(i, t), Q(n) && (i.innerText = n), i;
    }
    function pe(e, t, n, i) {
      Z(t) && t.appendChild(me(e, n, i));
    }
    function fe(e) {
      G(e) || J(e)
        ? Array.from(e).forEach(fe)
        : Z(e) && Z(e.parentNode) && e.parentNode.removeChild(e);
    }
    function ge(e) {
      if (Z(e))
        for (var t = e.childNodes.length; t > 0; )
          e.removeChild(e.lastChild), (t -= 1);
    }
    function ye(e, t) {
      return Z(t) && Z(t.parentNode) && Z(e)
        ? (t.parentNode.replaceChild(e, t), e)
        : null;
    }
    function be(e, t) {
      if (!Q(e) || re(e)) return {};
      var n = {},
        i = ue({}, t);
      return (
        e.split(",").forEach(function (e) {
          var t = e.trim(),
            a = t.replace(".", ""),
            r = t.replace(/[[\]]/g, "").split("="),
            o = l(r, 1)[0],
            s = r.length > 1 ? r[1].replace(/["']/g, "") : "";
          switch (t.charAt(0)) {
            case ".":
              Q(i.class)
                ? (n.class = "".concat(i.class, " ").concat(a))
                : (n.class = a);
              break;
            case "#":
              n.id = t.replace("#", "");
              break;
            case "[":
              n[o] = s;
          }
        }),
        ue(i, n)
      );
    }
    function ve(e, t) {
      if (Z(e)) {
        var n = t;
        X(n) || (n = !e.hidden), (e.hidden = n);
      }
    }
    function we(e, t, n) {
      if (G(e))
        return Array.from(e).map(function (e) {
          return we(e, t, n);
        });
      if (Z(e)) {
        var i = "toggle";
        return (
          void 0 !== n && (i = n ? "add" : "remove"),
          e.classList[i](t),
          e.classList.contains(t)
        );
      }
      return !1;
    }
    function ke(e, t) {
      return Z(e) && e.classList.contains(t);
    }
    function Te(e, t) {
      var n = Element.prototype;
      return (
        n.matches ||
        n.webkitMatchesSelector ||
        n.mozMatchesSelector ||
        n.msMatchesSelector ||
        function () {
          return Array.from(document.querySelectorAll(t)).includes(this);
        }
      ).call(e, t);
    }
    function Ce(e) {
      return this.elements.container.querySelectorAll(e);
    }
    function Ae(e) {
      return this.elements.container.querySelector(e);
    }
    function Se() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      Z(e) &&
        (e.focus({ preventScroll: !0 }),
        t && we(e, this.config.classNames.tabFocus));
    }
    var Pe,
      Ee = {
        "audio/ogg": "vorbis",
        "audio/wav": "1",
        "video/webm": "vp8, vorbis",
        "video/mp4": "avc1.42E01E, mp4a.40.2",
        "video/ogg": "theora",
      },
      Ne = {
        audio: "canPlayType" in document.createElement("audio"),
        video: "canPlayType" in document.createElement("video"),
        check: function (e, t, n) {
          var i = le.isIPhone && n && Ne.playsinline,
            a = Ne[e] || "html5" !== t;
          return {
            api: a,
            ui: a && Ne.rangeInput && ("video" !== e || !le.isIPhone || i),
          };
        },
        pip: !(
          le.isIPhone ||
          (!$(me("video").webkitSetPresentationMode) &&
            (!document.pictureInPictureEnabled ||
              me("video").disablePictureInPicture))
        ),
        airplay: $(window.WebKitPlaybackTargetAvailabilityEvent),
        playsinline: "playsInline" in document.createElement("video"),
        mime: function (e) {
          if (re(e)) return !1;
          var t = l(e.split("/"), 1)[0],
            n = e;
          if (!this.isHTML5 || t !== this.type) return !1;
          Object.keys(Ee).includes(n) && (n += '; codecs="'.concat(Ee[e], '"'));
          try {
            return Boolean(n && this.media.canPlayType(n).replace(/no/, ""));
          } catch (e) {
            return !1;
          }
        },
        textTracks: "textTracks" in document.createElement("video"),
        rangeInput:
          ((Pe = document.createElement("input")),
          (Pe.type = "range"),
          "range" === Pe.type),
        touch: "ontouchstart" in document.documentElement,
        transitions: !1 !== oe,
        reducedMotion:
          "matchMedia" in window &&
          window.matchMedia("(prefers-reduced-motion)").matches,
      },
      Me = (function () {
        var e = !1;
        try {
          var t = Object.defineProperty({}, "passive", {
            get: function () {
              return (e = !0), null;
            },
          });
          window.addEventListener("test", null, t),
            window.removeEventListener("test", null, t);
        } catch (e) {}
        return e;
      })();
    function xe(e, t, n) {
      var i = this,
        a = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
        r = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4],
        o = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
      if (e && "addEventListener" in e && !re(t) && $(n)) {
        var s = t.split(" "),
          l = o;
        Me && (l = { passive: r, capture: o }),
          s.forEach(function (t) {
            i &&
              i.eventListeners &&
              a &&
              i.eventListeners.push({
                element: e,
                type: t,
                callback: n,
                options: l,
              }),
              e[a ? "addEventListener" : "removeEventListener"](t, n, l);
          });
      }
    }
    function Ie(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 ? arguments[2] : void 0,
        i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      xe.call(this, e, t, n, !0, i, a);
    }
    function Le(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 ? arguments[2] : void 0,
        i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      xe.call(this, e, t, n, !1, i, a);
    }
    function Oe(e) {
      var t = this,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments.length > 2 ? arguments[2] : void 0,
        a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
        o = function o() {
          Le(e, n, o, a, r);
          for (var s = arguments.length, l = new Array(s), c = 0; c < s; c++)
            l[c] = arguments[c];
          i.apply(t, l);
        };
      xe.call(this, e, n, o, !0, a, r);
    }
    function _e(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
      if (Z(e) && !re(t)) {
        var a = new CustomEvent(t, {
          bubbles: n,
          detail: o(o({}, i), {}, { plyr: this }),
        });
        e.dispatchEvent(a);
      }
    }
    function je() {
      this &&
        this.eventListeners &&
        (this.eventListeners.forEach(function (e) {
          var t = e.element,
            n = e.type,
            i = e.callback,
            a = e.options;
          t.removeEventListener(n, i, a);
        }),
        (this.eventListeners = []));
    }
    function De() {
      var e = this;
      return new Promise(function (t) {
        return e.ready
          ? setTimeout(t, 0)
          : Ie.call(e, e.elements.container, "ready", t);
      }).then(function () {});
    }
    function qe(e) {
      ie(e) && e.then(null, function () {});
    }
    function He(e) {
      return (
        !!(J(e) || (Q(e) && e.includes(":"))) &&
        (J(e) ? e : e.split(":")).map(Number).every(Y)
      );
    }
    function Fe(e) {
      if (!J(e) || !e.every(Y)) return null;
      var t = l(e, 2),
        n = t[0],
        i = t[1],
        a = (function e(t, n) {
          return 0 === n ? t : e(n, t % n);
        })(n, i);
      return [n / a, i / a];
    }
    function Re(e) {
      var t = function (e) {
          return He(e) ? e.split(":").map(Number) : null;
        },
        n = t(e);
      if (
        (null === n && (n = t(this.config.ratio)),
        null === n &&
          !re(this.embed) &&
          J(this.embed.ratio) &&
          (n = this.embed.ratio),
        null === n && this.isHTML5)
      ) {
        var i = this.media;
        n = Fe([i.videoWidth, i.videoHeight]);
      }
      return n;
    }
    function Ve(e) {
      if (!this.isVideo) return {};
      var t = this.elements.wrapper,
        n = Re.call(this, e),
        i = l(J(n) ? n : [0, 0], 2),
        a = (100 / i[0]) * i[1];
      if (
        ((t.style.paddingBottom = "".concat(a, "%")),
        this.isVimeo && !this.config.vimeo.premium && this.supported.ui)
      ) {
        var r =
            (100 / this.media.offsetWidth) *
            parseInt(window.getComputedStyle(this.media).paddingBottom, 10),
          o = (r - a) / (r / 50);
        this.fullscreen.active
          ? (t.style.paddingBottom = null)
          : (this.media.style.transform = "translateY(-".concat(o, "%)"));
      } else this.isHTML5 && t.classList.toggle(this.config.classNames.videoFixedRatio, null !== n);
      return { padding: a, ratio: n };
    }
    var Be = {
      getSources: function () {
        var e = this;
        return this.isHTML5
          ? Array.from(this.media.querySelectorAll("source")).filter(function (
              t
            ) {
              var n = t.getAttribute("type");
              return !!re(n) || Ne.mime.call(e, n);
            })
          : [];
      },
      getQualityOptions: function () {
        return this.config.quality.forced
          ? this.config.quality.options
          : Be.getSources
              .call(this)
              .map(function (e) {
                return Number(e.getAttribute("size"));
              })
              .filter(Boolean);
      },
      setup: function () {
        if (this.isHTML5) {
          var e = this;
          (e.options.speed = e.config.speed.options),
            re(this.config.ratio) || Ve.call(e),
            Object.defineProperty(e.media, "quality", {
              get: function () {
                var t = Be.getSources.call(e).find(function (t) {
                  return t.getAttribute("src") === e.source;
                });
                return t && Number(t.getAttribute("size"));
              },
              set: function (t) {
                if (e.quality !== t) {
                  if (e.config.quality.forced && $(e.config.quality.onChange))
                    e.config.quality.onChange(t);
                  else {
                    var n = Be.getSources.call(e).find(function (e) {
                      return Number(e.getAttribute("size")) === t;
                    });
                    if (!n) return;
                    var i = e.media,
                      a = i.currentTime,
                      r = i.paused,
                      o = i.preload,
                      s = i.readyState,
                      l = i.playbackRate;
                    (e.media.src = n.getAttribute("src")),
                      ("none" !== o || s) &&
                        (e.once("loadedmetadata", function () {
                          (e.speed = l), (e.currentTime = a), r || qe(e.play());
                        }),
                        e.media.load());
                  }
                  _e.call(e, e.media, "qualitychange", !1, { quality: t });
                }
              },
            });
        }
      },
      cancelRequests: function () {
        this.isHTML5 &&
          (fe(Be.getSources.call(this)),
          this.media.setAttribute("src", this.config.blankVideo),
          this.media.load(),
          this.debug.log("Cancelled network requests"));
      },
    };
    function Ue(e) {
      return J(e)
        ? e.filter(function (t, n) {
            return e.indexOf(t) === n;
          })
        : e;
    }
    function We(e) {
      for (
        var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
        i < t;
        i++
      )
        n[i - 1] = arguments[i];
      return re(e)
        ? e
        : e.toString().replace(/{(\d+)}/g, function (e, t) {
            return n[t].toString();
          });
    }
    var ze = function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
        return e.replace(
          new RegExp(
            t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"),
            "g"
          ),
          n.toString()
        );
      },
      Ke = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        return e.toString().replace(/\w\S*/g, function (e) {
          return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
        });
      };
    function Ye() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = e.toString();
      return (
        (t = ze(t, "-", " ")),
        (t = ze(t, "_", " ")),
        (t = Ke(t)),
        ze(t, " ", "")
      );
    }
    function Qe(e) {
      var t = document.createElement("div");
      return t.appendChild(e), t.innerHTML;
    }
    var Xe = {
        pip: "PIP",
        airplay: "AirPlay",
        html5: "HTML5",
        vimeo: "Vimeo",
        youtube: "YouTube",
      },
      $e = function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (re(e) || re(t)) return "";
        var n = ce(t.i18n, e);
        if (re(n)) return Object.keys(Xe).includes(e) ? Xe[e] : "";
        var i = { "{seektime}": t.seekTime, "{title}": t.title };
        return (
          Object.entries(i).forEach(function (e) {
            var t = l(e, 2),
              i = t[0],
              a = t[1];
            n = ze(n, i, a);
          }),
          n
        );
      },
      Je = (function () {
        function e(n) {
          var i = this;
          t(this, e),
            a(this, "get", function (t) {
              if (!e.supported || !i.enabled) return null;
              var n = window.localStorage.getItem(i.key);
              if (re(n)) return null;
              var a = JSON.parse(n);
              return Q(t) && t.length ? a[t] : a;
            }),
            a(this, "set", function (t) {
              if (e.supported && i.enabled && K(t)) {
                var n = i.get();
                re(n) && (n = {}),
                  ue(n, t),
                  window.localStorage.setItem(i.key, JSON.stringify(n));
              }
            }),
            (this.enabled = n.config.storage.enabled),
            (this.key = n.config.storage.key);
        }
        return (
          i(e, null, [
            {
              key: "supported",
              get: function () {
                try {
                  if (!("localStorage" in window)) return !1;
                  var e = "___test";
                  return (
                    window.localStorage.setItem(e, e),
                    window.localStorage.removeItem(e),
                    !0
                  );
                } catch (e) {
                  return !1;
                }
              },
            },
          ]),
          e
        );
      })();
    function Ge(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "text";
      return new Promise(function (n, i) {
        try {
          var a = new XMLHttpRequest();
          if (!("withCredentials" in a)) return;
          a.addEventListener("load", function () {
            if ("text" === t)
              try {
                n(JSON.parse(a.responseText));
              } catch (e) {
                n(a.responseText);
              }
            else n(a.response);
          }),
            a.addEventListener("error", function () {
              throw new Error(a.status);
            }),
            a.open("GET", e, !0),
            (a.responseType = t),
            a.send();
        } catch (e) {
          i(e);
        }
      });
    }
    function Ze(e, t) {
      if (Q(e)) {
        var n = "cache",
          i = Q(t),
          a = function () {
            return null !== document.getElementById(t);
          },
          r = function (e, t) {
            (e.innerHTML = t),
              (i && a()) ||
                document.body.insertAdjacentElement("afterbegin", e);
          };
        if (!i || !a()) {
          var o = Je.supported,
            s = document.createElement("div");
          if ((s.setAttribute("hidden", ""), i && s.setAttribute("id", t), o)) {
            var l = window.localStorage.getItem("".concat(n, "-").concat(t));
            if (null !== l) {
              var c = JSON.parse(l);
              r(s, c.content);
            }
          }
          Ge(e)
            .then(function (e) {
              re(e) ||
                (o &&
                  window.localStorage.setItem(
                    "".concat(n, "-").concat(t),
                    JSON.stringify({ content: e })
                  ),
                r(s, e));
            })
            .catch(function () {});
        }
      }
    }
    var et = function (e) {
        return Math.trunc((e / 60 / 60) % 60, 10);
      },
      tt = function (e) {
        return Math.trunc((e / 60) % 60, 10);
      },
      nt = function (e) {
        return Math.trunc(e % 60, 10);
      };
    function it() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (!Y(e)) return it(void 0, t, n);
      var i = function (e) {
          return "0".concat(e).slice(-2);
        },
        a = et(e),
        r = tt(e),
        o = nt(e);
      return (
        (a = t || a > 0 ? "".concat(a, ":") : ""),
        ""
          .concat(n && e > 0 ? "-" : "")
          .concat(a)
          .concat(i(r), ":")
          .concat(i(o))
      );
    }
    var at = {
      getIconUrl: function () {
        var e =
          new URL(this.config.iconUrl, window.location).host !==
            window.location.host ||
          (le.isIE && !window.svg4everybody);
        return { url: this.config.iconUrl, cors: e };
      },
      findElements: function () {
        try {
          return (
            (this.elements.controls = Ae.call(
              this,
              this.config.selectors.controls.wrapper
            )),
            (this.elements.buttons = {
              play: Ce.call(this, this.config.selectors.buttons.play),
              pause: Ae.call(this, this.config.selectors.buttons.pause),
              restart: Ae.call(this, this.config.selectors.buttons.restart),
              rewind: Ae.call(this, this.config.selectors.buttons.rewind),
              fastForward: Ae.call(
                this,
                this.config.selectors.buttons.fastForward
              ),
              mute: Ae.call(this, this.config.selectors.buttons.mute),
              pip: Ae.call(this, this.config.selectors.buttons.pip),
              airplay: Ae.call(this, this.config.selectors.buttons.airplay),
              settings: Ae.call(this, this.config.selectors.buttons.settings),
              captions: Ae.call(this, this.config.selectors.buttons.captions),
              fullscreen: Ae.call(
                this,
                this.config.selectors.buttons.fullscreen
              ),
            }),
            (this.elements.progress = Ae.call(
              this,
              this.config.selectors.progress
            )),
            (this.elements.inputs = {
              seek: Ae.call(this, this.config.selectors.inputs.seek),
              volume: Ae.call(this, this.config.selectors.inputs.volume),
            }),
            (this.elements.display = {
              buffer: Ae.call(this, this.config.selectors.display.buffer),
              currentTime: Ae.call(
                this,
                this.config.selectors.display.currentTime
              ),
              duration: Ae.call(this, this.config.selectors.display.duration),
            }),
            Z(this.elements.progress) &&
              (this.elements.display.seekTooltip =
                this.elements.progress.querySelector(
                  ".".concat(this.config.classNames.tooltip)
                )),
            !0
          );
        } catch (e) {
          return (
            this.debug.warn(
              "It looks like there is a problem with your custom controls HTML",
              e
            ),
            this.toggleNativeControls(!0),
            !1
          );
        }
      },
      createIcon: function (e, t) {
        var n = "http://www.w3.org/2000/svg",
          i = at.getIconUrl.call(this),
          a = ""
            .concat(i.cors ? "" : i.url, "#")
            .concat(this.config.iconPrefix),
          r = document.createElementNS(n, "svg");
        he(r, ue(t, { "aria-hidden": "true", focusable: "false" }));
        var o = document.createElementNS(n, "use"),
          s = "".concat(a, "-").concat(e);
        return (
          "href" in o &&
            o.setAttributeNS("http://www.w3.org/1999/xlink", "href", s),
          o.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", s),
          r.appendChild(o),
          r
        );
      },
      createLabel: function (e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = $e(e, this.config),
          i = o(
            o({}, t),
            {},
            {
              class: [t.class, this.config.classNames.hidden]
                .filter(Boolean)
                .join(" "),
            }
          );
        return me("span", i, n);
      },
      createBadge: function (e) {
        if (re(e)) return null;
        var t = me("span", { class: this.config.classNames.menu.value });
        return (
          t.appendChild(
            me("span", { class: this.config.classNames.menu.badge }, e)
          ),
          t
        );
      },
      createButton: function (e, t) {
        var n = this,
          i = ue({}, t),
          a = (function () {
            var e = (
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : ""
            ).toString();
            return (e = Ye(e)).charAt(0).toLowerCase() + e.slice(1);
          })(e),
          r = {
            element: "button",
            toggle: !1,
            label: null,
            icon: null,
            labelPressed: null,
            iconPressed: null,
          };
        switch (
          (["element", "icon", "label"].forEach(function (e) {
            Object.keys(i).includes(e) && ((r[e] = i[e]), delete i[e]);
          }),
          "button" !== r.element ||
            Object.keys(i).includes("type") ||
            (i.type = "button"),
          Object.keys(i).includes("class")
            ? i.class.split(" ").some(function (e) {
                return e === n.config.classNames.control;
              }) ||
              ue(i, {
                class: ""
                  .concat(i.class, " ")
                  .concat(this.config.classNames.control),
              })
            : (i.class = this.config.classNames.control),
          e)
        ) {
          case "play":
            (r.toggle = !0),
              (r.label = "play"),
              (r.labelPressed = "pause"),
              (r.icon = "play"),
              (r.iconPressed = "pause");
            break;
          case "mute":
            (r.toggle = !0),
              (r.label = "mute"),
              (r.labelPressed = "unmute"),
              (r.icon = "volume"),
              (r.iconPressed = "muted");
            break;
          case "captions":
            (r.toggle = !0),
              (r.label = "enableCaptions"),
              (r.labelPressed = "disableCaptions"),
              (r.icon = "captions-off"),
              (r.iconPressed = "captions-on");
            break;
          case "fullscreen":
            (r.toggle = !0),
              (r.label = "enterFullscreen"),
              (r.labelPressed = "exitFullscreen"),
              (r.icon = "enter-fullscreen"),
              (r.iconPressed = "exit-fullscreen");
            break;
          case "play-large":
            (i.class += " ".concat(
              this.config.classNames.control,
              "--overlaid"
            )),
              (a = "play"),
              (r.label = "play"),
              (r.icon = "play");
            break;
          default:
            re(r.label) && (r.label = a), re(r.icon) && (r.icon = e);
        }
        var o = me(r.element);
        return (
          r.toggle
            ? (o.appendChild(
                at.createIcon.call(this, r.iconPressed, {
                  class: "icon--pressed",
                })
              ),
              o.appendChild(
                at.createIcon.call(this, r.icon, { class: "icon--not-pressed" })
              ),
              o.appendChild(
                at.createLabel.call(this, r.labelPressed, {
                  class: "label--pressed",
                })
              ),
              o.appendChild(
                at.createLabel.call(this, r.label, {
                  class: "label--not-pressed",
                })
              ))
            : (o.appendChild(at.createIcon.call(this, r.icon)),
              o.appendChild(at.createLabel.call(this, r.label))),
          ue(i, be(this.config.selectors.buttons[a], i)),
          he(o, i),
          "play" === a
            ? (J(this.elements.buttons[a]) || (this.elements.buttons[a] = []),
              this.elements.buttons[a].push(o))
            : (this.elements.buttons[a] = o),
          o
        );
      },
      createRange: function (e, t) {
        var n = me(
          "input",
          ue(
            be(this.config.selectors.inputs[e]),
            {
              type: "range",
              min: 0,
              max: 100,
              step: 0.01,
              value: 0,
              autocomplete: "off",
              role: "slider",
              "aria-label": $e(e, this.config),
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": 0,
            },
            t
          )
        );
        return (
          (this.elements.inputs[e] = n),
          at.updateRangeFill.call(this, n),
          j.setup(n),
          n
        );
      },
      createProgress: function (e, t) {
        var n = me(
          "progress",
          ue(
            be(this.config.selectors.display[e]),
            {
              min: 0,
              max: 100,
              value: 0,
              role: "progressbar",
              "aria-hidden": !0,
            },
            t
          )
        );
        if ("volume" !== e) {
          n.appendChild(me("span", null, "0"));
          var i = { played: "played", buffer: "buffered" }[e],
            a = i ? $e(i, this.config) : "";
          n.innerText = "% ".concat(a.toLowerCase());
        }
        return (this.elements.display[e] = n), n;
      },
      createTime: function (e, t) {
        var n = be(this.config.selectors.display[e], t),
          i = me(
            "div",
            ue(n, {
              class: ""
                .concat(n.class ? n.class : "", " ")
                .concat(this.config.classNames.display.time, " ")
                .trim(),
              "aria-label": $e(e, this.config),
            }),
            "00:00"
          );
        return (this.elements.display[e] = i), i;
      },
      bindMenuItemShortcuts: function (e, t) {
        var n = this;
        Ie.call(
          this,
          e,
          "keydown keyup",
          function (i) {
            if (
              [32, 38, 39, 40].includes(i.which) &&
              (i.preventDefault(), i.stopPropagation(), "keydown" !== i.type)
            ) {
              var a,
                r = Te(e, '[role="menuitemradio"]');
              if (!r && [32, 39].includes(i.which))
                at.showMenuPanel.call(n, t, !0);
              else
                32 !== i.which &&
                  (40 === i.which || (r && 39 === i.which)
                    ? ((a = e.nextElementSibling),
                      Z(a) || (a = e.parentNode.firstElementChild))
                    : ((a = e.previousElementSibling),
                      Z(a) || (a = e.parentNode.lastElementChild)),
                  Se.call(n, a, !0));
            }
          },
          !1
        ),
          Ie.call(this, e, "keyup", function (e) {
            13 === e.which && at.focusFirstMenuItem.call(n, null, !0);
          });
      },
      createMenuItem: function (e) {
        var t = this,
          n = e.value,
          i = e.list,
          a = e.type,
          r = e.title,
          o = e.badge,
          s = void 0 === o ? null : o,
          l = e.checked,
          c = void 0 !== l && l,
          u = be(this.config.selectors.inputs[a]),
          d = me(
            "button",
            ue(u, {
              type: "button",
              role: "menuitemradio",
              class: ""
                .concat(this.config.classNames.control, " ")
                .concat(u.class ? u.class : "")
                .trim(),
              "aria-checked": c,
              value: n,
            })
          ),
          h = me("span");
        (h.innerHTML = r),
          Z(s) && h.appendChild(s),
          d.appendChild(h),
          Object.defineProperty(d, "checked", {
            enumerable: !0,
            get: function () {
              return "true" === d.getAttribute("aria-checked");
            },
            set: function (e) {
              e &&
                Array.from(d.parentNode.children)
                  .filter(function (e) {
                    return Te(e, '[role="menuitemradio"]');
                  })
                  .forEach(function (e) {
                    return e.setAttribute("aria-checked", "false");
                  }),
                d.setAttribute("aria-checked", e ? "true" : "false");
            },
          }),
          this.listeners.bind(
            d,
            "click keyup",
            function (e) {
              if (!te(e) || 32 === e.which) {
                switch (
                  (e.preventDefault(), e.stopPropagation(), (d.checked = !0), a)
                ) {
                  case "language":
                    t.currentTrack = Number(n);
                    break;
                  case "quality":
                    t.quality = n;
                    break;
                  case "speed":
                    t.speed = parseFloat(n);
                }
                at.showMenuPanel.call(t, "home", te(e));
              }
            },
            a,
            !1
          ),
          at.bindMenuItemShortcuts.call(this, d, a),
          i.appendChild(d);
      },
      formatTime: function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (!Y(e)) return e;
        var n = et(this.duration) > 0;
        return it(e, n, t);
      },
      updateTimeDisplay: function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : null,
          t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        Z(e) && Y(t) && (e.innerText = at.formatTime(t, n));
      },
      updateVolume: function () {
        this.supported.ui &&
          (Z(this.elements.inputs.volume) &&
            at.setRange.call(
              this,
              this.elements.inputs.volume,
              this.muted ? 0 : this.volume
            ),
          Z(this.elements.buttons.mute) &&
            (this.elements.buttons.mute.pressed =
              this.muted || 0 === this.volume));
      },
      setRange: function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        Z(e) && ((e.value = t), at.updateRangeFill.call(this, e));
      },
      updateProgress: function (e) {
        var t = this;
        if (this.supported.ui && ee(e)) {
          var n,
            i,
            a = 0;
          if (e)
            switch (e.type) {
              case "timeupdate":
              case "seeking":
              case "seeked":
                (n = this.currentTime),
                  (i = this.duration),
                  (a =
                    0 === n || 0 === i || Number.isNaN(n) || Number.isNaN(i)
                      ? 0
                      : ((n / i) * 100).toFixed(2)),
                  "timeupdate" === e.type &&
                    at.setRange.call(this, this.elements.inputs.seek, a);
                break;
              case "playing":
              case "progress":
                !(function (e, n) {
                  var i = Y(n) ? n : 0,
                    a = Z(e) ? e : t.elements.display.buffer;
                  if (Z(a)) {
                    a.value = i;
                    var r = a.getElementsByTagName("span")[0];
                    Z(r) && (r.childNodes[0].nodeValue = i);
                  }
                })(this.elements.display.buffer, 100 * this.buffered);
            }
        }
      },
      updateRangeFill: function (e) {
        var t = ee(e) ? e.target : e;
        if (Z(t) && "range" === t.getAttribute("type")) {
          if (Te(t, this.config.selectors.inputs.seek)) {
            t.setAttribute("aria-valuenow", this.currentTime);
            var n = at.formatTime(this.currentTime),
              i = at.formatTime(this.duration),
              a = $e("seekLabel", this.config);
            t.setAttribute(
              "aria-valuetext",
              a.replace("{currentTime}", n).replace("{duration}", i)
            );
          } else if (Te(t, this.config.selectors.inputs.volume)) {
            var r = 100 * t.value;
            t.setAttribute("aria-valuenow", r),
              t.setAttribute("aria-valuetext", "".concat(r.toFixed(1), "%"));
          } else t.setAttribute("aria-valuenow", t.value);
          le.isWebkit &&
            t.style.setProperty(
              "--value",
              "".concat((t.value / t.max) * 100, "%")
            );
        }
      },
      updateSeekTooltip: function (e) {
        var t = this;
        if (
          this.config.tooltips.seek &&
          Z(this.elements.inputs.seek) &&
          Z(this.elements.display.seekTooltip) &&
          0 !== this.duration
        ) {
          var n = "".concat(this.config.classNames.tooltip, "--visible"),
            i = function (e) {
              return we(t.elements.display.seekTooltip, n, e);
            };
          if (this.touch) i(!1);
          else {
            var a = 0,
              r = this.elements.progress.getBoundingClientRect();
            if (ee(e)) a = (100 / r.width) * (e.pageX - r.left);
            else {
              if (!ke(this.elements.display.seekTooltip, n)) return;
              a = parseFloat(this.elements.display.seekTooltip.style.left, 10);
            }
            a < 0 ? (a = 0) : a > 100 && (a = 100),
              at.updateTimeDisplay.call(
                this,
                this.elements.display.seekTooltip,
                (this.duration / 100) * a
              ),
              (this.elements.display.seekTooltip.style.left = "".concat(
                a,
                "%"
              )),
              ee(e) &&
                ["mouseenter", "mouseleave"].includes(e.type) &&
                i("mouseenter" === e.type);
          }
        }
      },
      timeUpdate: function (e) {
        var t = !Z(this.elements.display.duration) && this.config.invertTime;
        at.updateTimeDisplay.call(
          this,
          this.elements.display.currentTime,
          t ? this.duration - this.currentTime : this.currentTime,
          t
        ),
          (e && "timeupdate" === e.type && this.media.seeking) ||
            at.updateProgress.call(this, e);
      },
      durationUpdate: function () {
        if (
          this.supported.ui &&
          (this.config.invertTime || !this.currentTime)
        ) {
          if (this.duration >= Math.pow(2, 32))
            return (
              ve(this.elements.display.currentTime, !0),
              void ve(this.elements.progress, !0)
            );
          Z(this.elements.inputs.seek) &&
            this.elements.inputs.seek.setAttribute(
              "aria-valuemax",
              this.duration
            );
          var e = Z(this.elements.display.duration);
          !e &&
            this.config.displayDuration &&
            this.paused &&
            at.updateTimeDisplay.call(
              this,
              this.elements.display.currentTime,
              this.duration
            ),
            e &&
              at.updateTimeDisplay.call(
                this,
                this.elements.display.duration,
                this.duration
              ),
            at.updateSeekTooltip.call(this);
        }
      },
      toggleMenuButton: function (e, t) {
        ve(this.elements.settings.buttons[e], !t);
      },
      updateSetting: function (e, t, n) {
        var i = this.elements.settings.panels[e],
          a = null,
          r = t;
        if ("captions" === e) a = this.currentTrack;
        else {
          if (
            ((a = re(n) ? this[e] : n),
            re(a) && (a = this.config[e].default),
            !re(this.options[e]) && !this.options[e].includes(a))
          )
            return void this.debug.warn(
              "Unsupported value of '".concat(a, "' for ").concat(e)
            );
          if (!this.config[e].options.includes(a))
            return void this.debug.warn(
              "Disabled value of '".concat(a, "' for ").concat(e)
            );
        }
        if ((Z(r) || (r = i && i.querySelector('[role="menu"]')), Z(r))) {
          this.elements.settings.buttons[e].querySelector(
            ".".concat(this.config.classNames.menu.value)
          ).innerHTML = at.getLabel.call(this, e, a);
          var o = r && r.querySelector('[value="'.concat(a, '"]'));
          Z(o) && (o.checked = !0);
        }
      },
      getLabel: function (e, t) {
        switch (e) {
          case "speed":
            return 1 === t
              ? $e("normal", this.config)
              : "".concat(t, "&times;");
          case "quality":
            if (Y(t)) {
              var n = $e("qualityLabel.".concat(t), this.config);
              return n.length ? n : "".concat(t, "p");
            }
            return Ke(t);
          case "captions":
            return st.getLabel.call(this);
          default:
            return null;
        }
      },
      setQualityMenu: function (e) {
        var t = this;
        if (Z(this.elements.settings.panels.quality)) {
          var n = "quality",
            i =
              this.elements.settings.panels.quality.querySelector(
                '[role="menu"]'
              );
          J(e) &&
            (this.options.quality = Ue(e).filter(function (e) {
              return t.config.quality.options.includes(e);
            }));
          var a = !re(this.options.quality) && this.options.quality.length > 1;
          if (
            (at.toggleMenuButton.call(this, n, a),
            ge(i),
            at.checkMenu.call(this),
            a)
          ) {
            var r = function (e) {
              var n = $e("qualityBadge.".concat(e), t.config);
              return n.length ? at.createBadge.call(t, n) : null;
            };
            this.options.quality
              .sort(function (e, n) {
                var i = t.config.quality.options;
                return i.indexOf(e) > i.indexOf(n) ? 1 : -1;
              })
              .forEach(function (e) {
                at.createMenuItem.call(t, {
                  value: e,
                  list: i,
                  type: n,
                  title: at.getLabel.call(t, "quality", e),
                  badge: r(e),
                });
              }),
              at.updateSetting.call(this, n, i);
          }
        }
      },
      setCaptionsMenu: function () {
        var e = this;
        if (Z(this.elements.settings.panels.captions)) {
          var t = "captions",
            n =
              this.elements.settings.panels.captions.querySelector(
                '[role="menu"]'
              ),
            i = st.getTracks.call(this),
            a = Boolean(i.length);
          if (
            (at.toggleMenuButton.call(this, t, a),
            ge(n),
            at.checkMenu.call(this),
            a)
          ) {
            var r = i.map(function (t, i) {
              return {
                value: i,
                checked: e.captions.toggled && e.currentTrack === i,
                title: st.getLabel.call(e, t),
                badge:
                  t.language &&
                  at.createBadge.call(e, t.language.toUpperCase()),
                list: n,
                type: "language",
              };
            });
            r.unshift({
              value: -1,
              checked: !this.captions.toggled,
              title: $e("disabled", this.config),
              list: n,
              type: "language",
            }),
              r.forEach(at.createMenuItem.bind(this)),
              at.updateSetting.call(this, t, n);
          }
        }
      },
      setSpeedMenu: function () {
        var e = this;
        if (Z(this.elements.settings.panels.speed)) {
          var t = "speed",
            n =
              this.elements.settings.panels.speed.querySelector(
                '[role="menu"]'
              );
          this.options.speed = this.options.speed.filter(function (t) {
            return t >= e.minimumSpeed && t <= e.maximumSpeed;
          });
          var i = !re(this.options.speed) && this.options.speed.length > 1;
          at.toggleMenuButton.call(this, t, i),
            ge(n),
            at.checkMenu.call(this),
            i &&
              (this.options.speed.forEach(function (i) {
                at.createMenuItem.call(e, {
                  value: i,
                  list: n,
                  type: t,
                  title: at.getLabel.call(e, "speed", i),
                });
              }),
              at.updateSetting.call(this, t, n));
        }
      },
      checkMenu: function () {
        var e = this.elements.settings.buttons,
          t =
            !re(e) &&
            Object.values(e).some(function (e) {
              return !e.hidden;
            });
        ve(this.elements.settings.menu, !t);
      },
      focusFirstMenuItem: function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (!this.elements.settings.popup.hidden) {
          var n = e;
          Z(n) ||
            (n = Object.values(this.elements.settings.panels).find(function (
              e
            ) {
              return !e.hidden;
            }));
          var i = n.querySelector('[role^="menuitem"]');
          Se.call(this, i, t);
        }
      },
      toggleMenu: function (e) {
        var t = this.elements.settings.popup,
          n = this.elements.buttons.settings;
        if (Z(t) && Z(n)) {
          var i = t.hidden,
            a = i;
          if (X(e)) a = e;
          else if (te(e) && 27 === e.which) a = !1;
          else if (ee(e)) {
            var r = $(e.composedPath) ? e.composedPath()[0] : e.target,
              o = t.contains(r);
            if (o || (!o && e.target !== n && a)) return;
          }
          n.setAttribute("aria-expanded", a),
            ve(t, !a),
            we(this.elements.container, this.config.classNames.menu.open, a),
            a && te(e)
              ? at.focusFirstMenuItem.call(this, null, !0)
              : a || i || Se.call(this, n, te(e));
        }
      },
      getMenuSize: function (e) {
        var t = e.cloneNode(!0);
        (t.style.position = "absolute"),
          (t.style.opacity = 0),
          t.removeAttribute("hidden"),
          e.parentNode.appendChild(t);
        var n = t.scrollWidth,
          i = t.scrollHeight;
        return fe(t), { width: n, height: i };
      },
      showMenuPanel: function () {
        var e = this,
          t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          i = this.elements.container.querySelector(
            "#plyr-settings-".concat(this.id, "-").concat(t)
          );
        if (Z(i)) {
          var a = i.parentNode,
            r = Array.from(a.children).find(function (e) {
              return !e.hidden;
            });
          if (Ne.transitions && !Ne.reducedMotion) {
            (a.style.width = "".concat(r.scrollWidth, "px")),
              (a.style.height = "".concat(r.scrollHeight, "px"));
            var o = at.getMenuSize.call(this, i),
              s = function t(n) {
                n.target === a &&
                  ["width", "height"].includes(n.propertyName) &&
                  ((a.style.width = ""),
                  (a.style.height = ""),
                  Le.call(e, a, oe, t));
              };
            Ie.call(this, a, oe, s),
              (a.style.width = "".concat(o.width, "px")),
              (a.style.height = "".concat(o.height, "px"));
          }
          ve(r, !0), ve(i, !1), at.focusFirstMenuItem.call(this, i, n);
        }
      },
      setDownloadUrl: function () {
        var e = this.elements.buttons.download;
        Z(e) && e.setAttribute("href", this.download);
      },
      create: function (e) {
        var t = this,
          n = at.bindMenuItemShortcuts,
          i = at.createButton,
          a = at.createProgress,
          r = at.createRange,
          o = at.createTime,
          s = at.setQualityMenu,
          l = at.setSpeedMenu,
          c = at.showMenuPanel;
        (this.elements.controls = null),
          J(this.config.controls) &&
            this.config.controls.includes("play-large") &&
            this.elements.container.appendChild(i.call(this, "play-large"));
        var u = me("div", be(this.config.selectors.controls.wrapper));
        this.elements.controls = u;
        var d = { class: "plyr__controls__item" };
        return (
          Ue(J(this.config.controls) ? this.config.controls : []).forEach(
            function (s) {
              if (
                ("restart" === s && u.appendChild(i.call(t, "restart", d)),
                "rewind" === s && u.appendChild(i.call(t, "rewind", d)),
                "play" === s && u.appendChild(i.call(t, "play", d)),
                "fast-forward" === s &&
                  u.appendChild(i.call(t, "fast-forward", d)),
                "progress" === s)
              ) {
                var l = me("div", {
                    class: "".concat(d.class, " plyr__progress__container"),
                  }),
                  h = me("div", be(t.config.selectors.progress));
                if (
                  (h.appendChild(
                    r.call(t, "seek", { id: "plyr-seek-".concat(e.id) })
                  ),
                  h.appendChild(a.call(t, "buffer")),
                  t.config.tooltips.seek)
                ) {
                  var m = me(
                    "span",
                    { class: t.config.classNames.tooltip },
                    "00:00"
                  );
                  h.appendChild(m), (t.elements.display.seekTooltip = m);
                }
                (t.elements.progress = h),
                  l.appendChild(t.elements.progress),
                  u.appendChild(l);
              }
              if (
                ("current-time" === s &&
                  u.appendChild(o.call(t, "currentTime", d)),
                "duration" === s && u.appendChild(o.call(t, "duration", d)),
                "mute" === s || "volume" === s)
              ) {
                var p = t.elements.volume;
                if (
                  ((Z(p) && u.contains(p)) ||
                    ((p = me(
                      "div",
                      ue({}, d, {
                        class: "".concat(d.class, " plyr__volume").trim(),
                      })
                    )),
                    (t.elements.volume = p),
                    u.appendChild(p)),
                  "mute" === s && p.appendChild(i.call(t, "mute")),
                  "volume" === s && !le.isIos)
                ) {
                  var f = { max: 1, step: 0.05, value: t.config.volume };
                  p.appendChild(
                    r.call(
                      t,
                      "volume",
                      ue(f, { id: "plyr-volume-".concat(e.id) })
                    )
                  );
                }
              }
              if (
                ("captions" === s && u.appendChild(i.call(t, "captions", d)),
                "settings" === s && !re(t.config.settings))
              ) {
                var g = me(
                  "div",
                  ue({}, d, {
                    class: "".concat(d.class, " plyr__menu").trim(),
                    hidden: "",
                  })
                );
                g.appendChild(
                  i.call(t, "settings", {
                    "aria-haspopup": !0,
                    "aria-controls": "plyr-settings-".concat(e.id),
                    "aria-expanded": !1,
                  })
                );
                var y = me("div", {
                    class: "plyr__menu__container",
                    id: "plyr-settings-".concat(e.id),
                    hidden: "",
                  }),
                  b = me("div"),
                  v = me("div", { id: "plyr-settings-".concat(e.id, "-home") }),
                  w = me("div", { role: "menu" });
                v.appendChild(w),
                  b.appendChild(v),
                  (t.elements.settings.panels.home = v),
                  t.config.settings.forEach(function (i) {
                    var a = me(
                      "button",
                      ue(be(t.config.selectors.buttons.settings), {
                        type: "button",
                        class: ""
                          .concat(t.config.classNames.control, " ")
                          .concat(t.config.classNames.control, "--forward"),
                        role: "menuitem",
                        "aria-haspopup": !0,
                        hidden: "",
                      })
                    );
                    n.call(t, a, i),
                      Ie.call(t, a, "click", function () {
                        c.call(t, i, !1);
                      });
                    var r = me("span", null, $e(i, t.config)),
                      o = me("span", { class: t.config.classNames.menu.value });
                    (o.innerHTML = e[i]),
                      r.appendChild(o),
                      a.appendChild(r),
                      w.appendChild(a);
                    var s = me("div", {
                        id: "plyr-settings-".concat(e.id, "-").concat(i),
                        hidden: "",
                      }),
                      l = me("button", {
                        type: "button",
                        class: ""
                          .concat(t.config.classNames.control, " ")
                          .concat(t.config.classNames.control, "--back"),
                      });
                    l.appendChild(
                      me("span", { "aria-hidden": !0 }, $e(i, t.config))
                    ),
                      l.appendChild(
                        me(
                          "span",
                          { class: t.config.classNames.hidden },
                          $e("menuBack", t.config)
                        )
                      ),
                      Ie.call(
                        t,
                        s,
                        "keydown",
                        function (e) {
                          37 === e.which &&
                            (e.preventDefault(),
                            e.stopPropagation(),
                            c.call(t, "home", !0));
                        },
                        !1
                      ),
                      Ie.call(t, l, "click", function () {
                        c.call(t, "home", !1);
                      }),
                      s.appendChild(l),
                      s.appendChild(me("div", { role: "menu" })),
                      b.appendChild(s),
                      (t.elements.settings.buttons[i] = a),
                      (t.elements.settings.panels[i] = s);
                  }),
                  y.appendChild(b),
                  g.appendChild(y),
                  u.appendChild(g),
                  (t.elements.settings.popup = y),
                  (t.elements.settings.menu = g);
              }
              if (
                ("pip" === s && Ne.pip && u.appendChild(i.call(t, "pip", d)),
                "airplay" === s &&
                  Ne.airplay &&
                  u.appendChild(i.call(t, "airplay", d)),
                "download" === s)
              ) {
                var k = ue({}, d, {
                  element: "a",
                  href: t.download,
                  target: "_blank",
                });
                t.isHTML5 && (k.download = "");
                var T = t.config.urls.download;
                !ae(T) &&
                  t.isEmbed &&
                  ue(k, {
                    icon: "logo-".concat(t.provider),
                    label: t.provider,
                  }),
                  u.appendChild(i.call(t, "download", k));
              }
              "fullscreen" === s && u.appendChild(i.call(t, "fullscreen", d));
            }
          ),
          this.isHTML5 && s.call(this, Be.getQualityOptions.call(this)),
          l.call(this),
          u
        );
      },
      inject: function () {
        var e = this;
        if (this.config.loadSprite) {
          var t = at.getIconUrl.call(this);
          t.cors && Ze(t.url, "sprite-plyr");
        }
        this.id = Math.floor(1e4 * Math.random());
        var n = null;
        this.elements.controls = null;
        var i = {
            id: this.id,
            seektime: this.config.seekTime,
            title: this.config.title,
          },
          a = !0;
        $(this.config.controls) &&
          (this.config.controls = this.config.controls.call(this, i)),
          this.config.controls || (this.config.controls = []),
          Z(this.config.controls) || Q(this.config.controls)
            ? (n = this.config.controls)
            : ((n = at.create.call(this, {
                id: this.id,
                seektime: this.config.seekTime,
                speed: this.speed,
                quality: this.quality,
                captions: st.getLabel.call(this),
              })),
              (a = !1));
        var r, o;
        if (
          (a &&
            Q(this.config.controls) &&
            ((r = n),
            Object.entries(i).forEach(function (e) {
              var t = l(e, 2),
                n = t[0],
                i = t[1];
              r = ze(r, "{".concat(n, "}"), i);
            }),
            (n = r)),
          Q(this.config.selectors.controls.container) &&
            (o = document.querySelector(
              this.config.selectors.controls.container
            )),
          Z(o) || (o = this.elements.container),
          o[Z(n) ? "insertAdjacentElement" : "insertAdjacentHTML"](
            "afterbegin",
            n
          ),
          Z(this.elements.controls) || at.findElements.call(this),
          !re(this.elements.buttons))
        ) {
          var s = function (t) {
            var n = e.config.classNames.controlPressed;
            Object.defineProperty(t, "pressed", {
              enumerable: !0,
              get: function () {
                return ke(t, n);
              },
              set: function () {
                var e =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0];
                we(t, n, e);
              },
            });
          };
          Object.values(this.elements.buttons)
            .filter(Boolean)
            .forEach(function (e) {
              J(e) || G(e) ? Array.from(e).filter(Boolean).forEach(s) : s(e);
            });
        }
        if ((le.isEdge && se(o), this.config.tooltips.controls)) {
          var c = this.config,
            u = c.classNames,
            d = c.selectors,
            h = ""
              .concat(d.controls.wrapper, " ")
              .concat(d.labels, " .")
              .concat(u.hidden),
            m = Ce.call(this, h);
          Array.from(m).forEach(function (t) {
            we(t, e.config.classNames.hidden, !1),
              we(t, e.config.classNames.tooltip, !0);
          });
        }
      },
    };
    function rt(e) {
      var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
        n = e;
      if (t) {
        var i = document.createElement("a");
        (i.href = n), (n = i.href);
      }
      try {
        return new URL(n);
      } catch (e) {
        return null;
      }
    }
    function ot(e) {
      var t = new URLSearchParams();
      return (
        K(e) &&
          Object.entries(e).forEach(function (e) {
            var n = l(e, 2),
              i = n[0],
              a = n[1];
            t.set(i, a);
          }),
        t
      );
    }
    var st = {
        setup: function () {
          if (this.supported.ui)
            if (
              !this.isVideo ||
              this.isYouTube ||
              (this.isHTML5 && !Ne.textTracks)
            )
              J(this.config.controls) &&
                this.config.controls.includes("settings") &&
                this.config.settings.includes("captions") &&
                at.setCaptionsMenu.call(this);
            else {
              if (
                (Z(this.elements.captions) ||
                  ((this.elements.captions = me(
                    "div",
                    be(this.config.selectors.captions)
                  )),
                  (function (e, t) {
                    Z(e) && Z(t) && t.parentNode.insertBefore(e, t.nextSibling);
                  })(this.elements.captions, this.elements.wrapper)),
                le.isIE && window.URL)
              ) {
                var e = this.media.querySelectorAll("track");
                Array.from(e).forEach(function (e) {
                  var t = e.getAttribute("src"),
                    n = rt(t);
                  null !== n &&
                    n.hostname !== window.location.href.hostname &&
                    ["http:", "https:"].includes(n.protocol) &&
                    Ge(t, "blob")
                      .then(function (t) {
                        e.setAttribute("src", window.URL.createObjectURL(t));
                      })
                      .catch(function () {
                        fe(e);
                      });
                });
              }
              var t = Ue(
                  (
                    navigator.languages || [
                      navigator.language || navigator.userLanguage || "en",
                    ]
                  ).map(function (e) {
                    return e.split("-")[0];
                  })
                ),
                n = (
                  this.storage.get("language") ||
                  this.config.captions.language ||
                  "auto"
                ).toLowerCase();
              if ("auto" === n) n = l(t, 1)[0];
              var i = this.storage.get("captions");
              if (
                (X(i) || (i = this.config.captions.active),
                Object.assign(this.captions, {
                  toggled: !1,
                  active: i,
                  language: n,
                  languages: t,
                }),
                this.isHTML5)
              ) {
                var a = this.config.captions.update
                  ? "addtrack removetrack"
                  : "removetrack";
                Ie.call(this, this.media.textTracks, a, st.update.bind(this));
              }
              setTimeout(st.update.bind(this), 0);
            }
        },
        update: function () {
          var e = this,
            t = st.getTracks.call(this, !0),
            n = this.captions,
            i = n.active,
            a = n.language,
            r = n.meta,
            o = n.currentTrackNode,
            s = Boolean(
              t.find(function (e) {
                return e.language === a;
              })
            );
          this.isHTML5 &&
            this.isVideo &&
            t
              .filter(function (e) {
                return !r.get(e);
              })
              .forEach(function (t) {
                e.debug.log("Track added", t),
                  r.set(t, { default: "showing" === t.mode }),
                  "showing" === t.mode && (t.mode = "hidden"),
                  Ie.call(e, t, "cuechange", function () {
                    return st.updateCues.call(e);
                  });
              }),
            ((s && this.language !== a) || !t.includes(o)) &&
              (st.setLanguage.call(this, a), st.toggle.call(this, i && s)),
            we(
              this.elements.container,
              this.config.classNames.captions.enabled,
              !re(t)
            ),
            J(this.config.controls) &&
              this.config.controls.includes("settings") &&
              this.config.settings.includes("captions") &&
              at.setCaptionsMenu.call(this);
        },
        toggle: function (e) {
          var t = this,
            n =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1];
          if (this.supported.ui) {
            var i = this.captions.toggled,
              a = this.config.classNames.captions.active,
              r = z(e) ? !i : e;
            if (r !== i) {
              if (
                (n ||
                  ((this.captions.active = r),
                  this.storage.set({ captions: r })),
                !this.language && r && !n)
              ) {
                var o = st.getTracks.call(this),
                  s = st.findTrack.call(
                    this,
                    [this.captions.language].concat(c(this.captions.languages)),
                    !0
                  );
                return (
                  (this.captions.language = s.language),
                  void st.set.call(this, o.indexOf(s))
                );
              }
              this.elements.buttons.captions &&
                (this.elements.buttons.captions.pressed = r),
                we(this.elements.container, a, r),
                (this.captions.toggled = r),
                at.updateSetting.call(this, "captions"),
                _e.call(
                  this,
                  this.media,
                  r ? "captionsenabled" : "captionsdisabled"
                );
            }
            setTimeout(function () {
              r &&
                t.captions.toggled &&
                (t.captions.currentTrackNode.mode = "hidden");
            });
          }
        },
        set: function (e) {
          var t =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            n = st.getTracks.call(this);
          if (-1 !== e)
            if (Y(e))
              if (e in n) {
                if (this.captions.currentTrack !== e) {
                  this.captions.currentTrack = e;
                  var i = n[e],
                    a = i || {},
                    r = a.language;
                  (this.captions.currentTrackNode = i),
                    at.updateSetting.call(this, "captions"),
                    t ||
                      ((this.captions.language = r),
                      this.storage.set({ language: r })),
                    this.isVimeo && this.embed.enableTextTrack(r),
                    _e.call(this, this.media, "languagechange");
                }
                st.toggle.call(this, !0, t),
                  this.isHTML5 && this.isVideo && st.updateCues.call(this);
              } else this.debug.warn("Track not found", e);
            else this.debug.warn("Invalid caption argument", e);
          else st.toggle.call(this, !1, t);
        },
        setLanguage: function (e) {
          var t =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          if (Q(e)) {
            var n = e.toLowerCase();
            this.captions.language = n;
            var i = st.getTracks.call(this),
              a = st.findTrack.call(this, [n]);
            st.set.call(this, i.indexOf(a), t);
          } else this.debug.warn("Invalid language argument", e);
        },
        getTracks: function () {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            n = Array.from((this.media || {}).textTracks || []);
          return n
            .filter(function (n) {
              return !e.isHTML5 || t || e.captions.meta.has(n);
            })
            .filter(function (e) {
              return ["captions", "subtitles"].includes(e.kind);
            });
        },
        findTrack: function (e) {
          var t,
            n = this,
            i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            a = st.getTracks.call(this),
            r = function (e) {
              return Number((n.captions.meta.get(e) || {}).default);
            },
            o = Array.from(a).sort(function (e, t) {
              return r(t) - r(e);
            });
          return (
            e.every(function (e) {
              return !(t = o.find(function (t) {
                return t.language === e;
              }));
            }),
            t || (i ? o[0] : void 0)
          );
        },
        getCurrentTrack: function () {
          return st.getTracks.call(this)[this.currentTrack];
        },
        getLabel: function (e) {
          var t = e;
          return (
            !ne(t) &&
              Ne.textTracks &&
              this.captions.toggled &&
              (t = st.getCurrentTrack.call(this)),
            ne(t)
              ? re(t.label)
                ? re(t.language)
                  ? $e("enabled", this.config)
                  : e.language.toUpperCase()
                : t.label
              : $e("disabled", this.config)
          );
        },
        updateCues: function (e) {
          if (this.supported.ui)
            if (Z(this.elements.captions))
              if (z(e) || Array.isArray(e)) {
                var t = e;
                if (!t) {
                  var n = st.getCurrentTrack.call(this);
                  t = Array.from((n || {}).activeCues || [])
                    .map(function (e) {
                      return e.getCueAsHTML();
                    })
                    .map(Qe);
                }
                var i = t
                  .map(function (e) {
                    return e.trim();
                  })
                  .join("\n");
                if (i !== this.elements.captions.innerHTML) {
                  ge(this.elements.captions);
                  var a = me("span", be(this.config.selectors.caption));
                  (a.innerHTML = i),
                    this.elements.captions.appendChild(a),
                    _e.call(this, this.media, "cuechange");
                }
              } else this.debug.warn("updateCues: Invalid input", e);
            else this.debug.warn("No captions element to render to");
        },
      },
      lt = {
        enabled: !0,
        title: "",
        debug: !1,
        autoplay: !1,
        autopause: !0,
        playsinline: !0,
        seekTime: 10,
        volume: 1,
        muted: !1,
        duration: null,
        displayDuration: !0,
        invertTime: !0,
        toggleInvert: !0,
        ratio: null,
        clickToPlay: !0,
        hideControls: !0,
        resetOnEnd: !1,
        disableContextMenu: !0,
        loadSprite: !0,
        iconPrefix: "plyr",
        iconUrl: "https://cdn.plyr.io/3.6.4/plyr.svg",
        blankVideo: "https://cdn.plyr.io/static/blank.mp4",
        quality: {
          default: 576,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
          forced: !1,
          onChange: null,
        },
        loop: { active: !1 },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] },
        keyboard: { focused: !0, global: !1 },
        tooltips: { controls: !1, seek: !0 },
        captions: { active: !1, language: "auto", update: !1 },
        fullscreen: { enabled: !0, fallback: !0, iosNative: !1 },
        storage: { enabled: !0, key: "plyr" },
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed"],
        i18n: {
          restart: "Restart",
          rewind: "Rewind {seektime}s",
          play: "Play",
          pause: "Pause",
          fastForward: "Forward {seektime}s",
          seek: "Seek",
          seekLabel: "{currentTime} of {duration}",
          played: "Played",
          buffered: "Buffered",
          currentTime: "Current time",
          duration: "Duration",
          volume: "Volume",
          mute: "Mute",
          unmute: "Unmute",
          enableCaptions: "Enable captions",
          disableCaptions: "Disable captions",
          download: "Download",
          enterFullscreen: "Enter fullscreen",
          exitFullscreen: "Exit fullscreen",
          frameTitle: "Player for {title}",
          captions: "Captions",
          settings: "Settings",
          pip: "PIP",
          menuBack: "Go back to previous menu",
          speed: "Speed",
          normal: "Normal",
          quality: "Quality",
          loop: "Loop",
          start: "Start",
          end: "End",
          all: "All",
          reset: "Reset",
          disabled: "Disabled",
          enabled: "Enabled",
          advertisement: "Ad",
          qualityBadge: {
            2160: "4K",
            1440: "HD",
            1080: "HD",
            720: "HD",
            576: "SD",
            480: "SD",
          },
        },
        urls: {
          download: null,
          vimeo: {
            sdk: "https://player.vimeo.com/api/player.js",
            iframe: "https://player.vimeo.com/video/{0}?{1}",
            api: "https://vimeo.com/api/oembed.json?url={0}",
          },
          youtube: {
            sdk: "https://www.youtube.com/iframe_api",
            api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}",
          },
          googleIMA: {
            sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
          },
        },
        listeners: {
          seek: null,
          play: null,
          pause: null,
          restart: null,
          rewind: null,
          fastForward: null,
          mute: null,
          volume: null,
          captions: null,
          download: null,
          fullscreen: null,
          pip: null,
          airplay: null,
          speed: null,
          quality: null,
          loop: null,
          language: null,
        },
        events: [
          "ended",
          "progress",
          "stalled",
          "playing",
          "waiting",
          "canplay",
          "canplaythrough",
          "loadstart",
          "loadeddata",
          "loadedmetadata",
          "timeupdate",
          "volumechange",
          "play",
          "pause",
          "error",
          "seeking",
          "seeked",
          "emptied",
          "ratechange",
          "cuechange",
          "download",
          "enterfullscreen",
          "exitfullscreen",
          "captionsenabled",
          "captionsdisabled",
          "languagechange",
          "controlshidden",
          "controlsshown",
          "ready",
          "statechange",
          "qualitychange",
          "adsloaded",
          "adscontentpause",
          "adscontentresume",
          "adstarted",
          "adsmidpoint",
          "adscomplete",
          "adsallcomplete",
          "adsimpression",
          "adsclick",
        ],
        selectors: {
          editable: "input, textarea, select, [contenteditable]",
          container: ".plyr",
          controls: { container: null, wrapper: ".plyr__controls" },
          labels: "[data-plyr]",
          buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            fastForward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            download: '[data-plyr="download"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]',
          },
          inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]',
          },
          display: {
            currentTime: ".plyr__time--current",
            duration: ".plyr__time--duration",
            buffer: ".plyr__progress__buffer",
            loop: ".plyr__progress__loop",
            volume: ".plyr__volume--display",
          },
          progress: ".plyr__progress",
          captions: ".plyr__captions",
          caption: ".plyr__caption",
        },
        classNames: {
          type: "plyr--{0}",
          provider: "plyr--{0}",
          video: "plyr__video-wrapper",
          embed: "plyr__video-embed",
          videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
          embedContainer: "plyr__video-embed__container",
          poster: "plyr__poster",
          posterEnabled: "plyr__poster-enabled",
          ads: "plyr__ads",
          control: "plyr__control",
          controlPressed: "plyr__control--pressed",
          playing: "plyr--playing",
          paused: "plyr--paused",
          stopped: "plyr--stopped",
          loading: "plyr--loading",
          hover: "plyr--hover",
          tooltip: "plyr__tooltip",
          cues: "plyr__cues",
          hidden: "plyr__sr-only",
          hideControls: "plyr--hide-controls",
          isIos: "plyr--is-ios",
          isTouch: "plyr--is-touch",
          uiSupported: "plyr--full-ui",
          noTransition: "plyr--no-transition",
          display: { time: "plyr__time" },
          menu: {
            value: "plyr__menu__value",
            badge: "plyr__badge",
            open: "plyr--menu-open",
          },
          captions: {
            enabled: "plyr--captions-enabled",
            active: "plyr--captions-active",
          },
          fullscreen: {
            enabled: "plyr--fullscreen-enabled",
            fallback: "plyr--fullscreen-fallback",
          },
          pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" },
          airplay: {
            supported: "plyr--airplay-supported",
            active: "plyr--airplay-active",
          },
          tabFocus: "plyr__tab-focus",
          previewThumbnails: {
            thumbContainer: "plyr__preview-thumb",
            thumbContainerShown: "plyr__preview-thumb--is-shown",
            imageContainer: "plyr__preview-thumb__image-container",
            timeContainer: "plyr__preview-thumb__time-container",
            scrubbingContainer: "plyr__preview-scrubbing",
            scrubbingContainerShown: "plyr__preview-scrubbing--is-shown",
          },
        },
        attributes: {
          embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id" },
        },
        ads: { enabled: !1, publisherId: "", tagUrl: "" },
        previewThumbnails: { enabled: !1, src: "" },
        vimeo: {
          byline: !1,
          portrait: !1,
          title: !1,
          speed: !0,
          transparent: !1,
          customControls: !0,
          referrerPolicy: null,
          premium: !1,
        },
        youtube: {
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          customControls: !0,
          noCookie: !1,
        },
      },
      ct = "picture-in-picture",
      ut = "inline",
      dt = { html5: "html5", youtube: "youtube", vimeo: "vimeo" },
      ht = "audio",
      mt = "video";
    var pt = function () {},
      ft = (function () {
        function e() {
          var n =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          t(this, e),
            (this.enabled = window.console && n),
            this.enabled && this.log("Debugging enabled");
        }
        return (
          i(e, [
            {
              key: "log",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.log, console)
                  : pt;
              },
            },
            {
              key: "warn",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.warn, console)
                  : pt;
              },
            },
            {
              key: "error",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.error, console)
                  : pt;
              },
            },
          ]),
          e
        );
      })(),
      gt = (function () {
        function e(n) {
          var i = this;
          t(this, e),
            a(this, "onChange", function () {
              if (i.enabled) {
                var e = i.player.elements.buttons.fullscreen;
                Z(e) && (e.pressed = i.active);
                var t =
                  i.target === i.player.media
                    ? i.target
                    : i.player.elements.container;
                _e.call(
                  i.player,
                  t,
                  i.active ? "enterfullscreen" : "exitfullscreen",
                  !0
                );
              }
            }),
            a(this, "toggleFallback", function () {
              var e =
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              if (
                (e
                  ? (i.scrollPosition = {
                      x: window.scrollX || 0,
                      y: window.scrollY || 0,
                    })
                  : window.scrollTo(i.scrollPosition.x, i.scrollPosition.y),
                (document.body.style.overflow = e ? "hidden" : ""),
                we(i.target, i.player.config.classNames.fullscreen.fallback, e),
                le.isIos)
              ) {
                var t = document.head.querySelector('meta[name="viewport"]'),
                  n = "viewport-fit=cover";
                t ||
                  (t = document.createElement("meta")).setAttribute(
                    "name",
                    "viewport"
                  );
                var a = Q(t.content) && t.content.includes(n);
                e
                  ? ((i.cleanupViewport = !a),
                    a || (t.content += ",".concat(n)))
                  : i.cleanupViewport &&
                    (t.content = t.content
                      .split(",")
                      .filter(function (e) {
                        return e.trim() !== n;
                      })
                      .join(","));
              }
              i.onChange();
            }),
            a(this, "trapFocus", function (e) {
              if (!le.isIos && i.active && "Tab" === e.key && 9 === e.keyCode) {
                var t = document.activeElement,
                  n = Ce.call(
                    i.player,
                    "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"
                  ),
                  a = l(n, 1)[0],
                  r = n[n.length - 1];
                t !== r || e.shiftKey
                  ? t === a && e.shiftKey && (r.focus(), e.preventDefault())
                  : (a.focus(), e.preventDefault());
              }
            }),
            a(this, "update", function () {
              var t;
              i.enabled
                ? ((t = i.forceFallback
                    ? "Fallback (forced)"
                    : e.native
                    ? "Native"
                    : "Fallback"),
                  i.player.debug.log("".concat(t, " fullscreen enabled")))
                : i.player.debug.log(
                    "Fullscreen not supported and fallback disabled"
                  );
              we(
                i.player.elements.container,
                i.player.config.classNames.fullscreen.enabled,
                i.enabled
              );
            }),
            a(this, "enter", function () {
              i.enabled &&
                (le.isIos && i.player.config.fullscreen.iosNative
                  ? i.player.isVimeo
                    ? i.player.embed.requestFullscreen()
                    : i.target.webkitEnterFullscreen()
                  : !e.native || i.forceFallback
                  ? i.toggleFallback(!0)
                  : i.prefix
                  ? re(i.prefix) ||
                    i.target[
                      "".concat(i.prefix, "Request").concat(i.property)
                    ]()
                  : i.target.requestFullscreen({ navigationUI: "hide" }));
            }),
            a(this, "exit", function () {
              if (i.enabled)
                if (le.isIos && i.player.config.fullscreen.iosNative)
                  i.target.webkitExitFullscreen(), qe(i.player.play());
                else if (!e.native || i.forceFallback) i.toggleFallback(!1);
                else if (i.prefix) {
                  if (!re(i.prefix)) {
                    var t = "moz" === i.prefix ? "Cancel" : "Exit";
                    document[
                      "".concat(i.prefix).concat(t).concat(i.property)
                    ]();
                  }
                } else
                  (document.cancelFullScreen || document.exitFullscreen).call(
                    document
                  );
            }),
            a(this, "toggle", function () {
              i.active ? i.exit() : i.enter();
            }),
            (this.player = n),
            (this.prefix = e.prefix),
            (this.property = e.property),
            (this.scrollPosition = { x: 0, y: 0 }),
            (this.forceFallback = "force" === n.config.fullscreen.fallback),
            (this.player.elements.fullscreen =
              n.config.fullscreen.container &&
              (function (e, t) {
                return (
                  Element.prototype.closest ||
                  function () {
                    var e = this;
                    do {
                      if (Te.matches(e, t)) return e;
                      e = e.parentElement || e.parentNode;
                    } while (null !== e && 1 === e.nodeType);
                    return null;
                  }
                ).call(e, t);
              })(
                this.player.elements.container,
                n.config.fullscreen.container
              )),
            Ie.call(
              this.player,
              document,
              "ms" === this.prefix
                ? "MSFullscreenChange"
                : "".concat(this.prefix, "fullscreenchange"),
              function () {
                i.onChange();
              }
            ),
            Ie.call(
              this.player,
              this.player.elements.container,
              "dblclick",
              function (e) {
                (Z(i.player.elements.controls) &&
                  i.player.elements.controls.contains(e.target)) ||
                  i.player.listeners.proxy(e, i.toggle, "fullscreen");
              }
            ),
            Ie.call(
              this,
              this.player.elements.container,
              "keydown",
              function (e) {
                return i.trapFocus(e);
              }
            ),
            this.update();
        }
        return (
          i(
            e,
            [
              {
                key: "usingNative",
                get: function () {
                  return e.native && !this.forceFallback;
                },
              },
              {
                key: "enabled",
                get: function () {
                  return (
                    (e.native || this.player.config.fullscreen.fallback) &&
                    this.player.config.fullscreen.enabled &&
                    this.player.supported.ui &&
                    this.player.isVideo
                  );
                },
              },
              {
                key: "active",
                get: function () {
                  if (!this.enabled) return !1;
                  if (!e.native || this.forceFallback)
                    return ke(
                      this.target,
                      this.player.config.classNames.fullscreen.fallback
                    );
                  var t = this.prefix
                    ? document[
                        "".concat(this.prefix).concat(this.property, "Element")
                      ]
                    : document.fullscreenElement;
                  return t && t.shadowRoot
                    ? t === this.target.getRootNode().host
                    : t === this.target;
                },
              },
              {
                key: "target",
                get: function () {
                  return le.isIos && this.player.config.fullscreen.iosNative
                    ? this.player.media
                    : this.player.elements.fullscreen ||
                        this.player.elements.container;
                },
              },
            ],
            [
              {
                key: "native",
                get: function () {
                  return !!(
                    document.fullscreenEnabled ||
                    document.webkitFullscreenEnabled ||
                    document.mozFullScreenEnabled ||
                    document.msFullscreenEnabled
                  );
                },
              },
              {
                key: "prefix",
                get: function () {
                  if ($(document.exitFullscreen)) return "";
                  var e = "";
                  return (
                    ["webkit", "moz", "ms"].some(function (t) {
                      return (
                        !(
                          !$(document["".concat(t, "ExitFullscreen")]) &&
                          !$(document["".concat(t, "CancelFullScreen")])
                        ) && ((e = t), !0)
                      );
                    }),
                    e
                  );
                },
              },
              {
                key: "property",
                get: function () {
                  return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
                },
              },
            ]
          ),
          e
        );
      })();
    function yt(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
      return new Promise(function (n, i) {
        var a = new Image(),
          r = function () {
            delete a.onload, delete a.onerror, (a.naturalWidth >= t ? n : i)(a);
          };
        Object.assign(a, { onload: r, onerror: r, src: e });
      });
    }
    var bt = {
        addStyleHook: function () {
          we(
            this.elements.container,
            this.config.selectors.container.replace(".", ""),
            !0
          ),
            we(
              this.elements.container,
              this.config.classNames.uiSupported,
              this.supported.ui
            );
        },
        toggleNativeControls: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          e && this.isHTML5
            ? this.media.setAttribute("controls", "")
            : this.media.removeAttribute("controls");
        },
        build: function () {
          var e = this;
          if ((this.listeners.media(), !this.supported.ui))
            return (
              this.debug.warn(
                "Basic support only for "
                  .concat(this.provider, " ")
                  .concat(this.type)
              ),
              void bt.toggleNativeControls.call(this, !0)
            );
          Z(this.elements.controls) ||
            (at.inject.call(this), this.listeners.controls()),
            bt.toggleNativeControls.call(this),
            this.isHTML5 && st.setup.call(this),
            (this.volume = null),
            (this.muted = null),
            (this.loop = null),
            (this.quality = null),
            (this.speed = null),
            at.updateVolume.call(this),
            at.timeUpdate.call(this),
            bt.checkPlaying.call(this),
            we(
              this.elements.container,
              this.config.classNames.pip.supported,
              Ne.pip && this.isHTML5 && this.isVideo
            ),
            we(
              this.elements.container,
              this.config.classNames.airplay.supported,
              Ne.airplay && this.isHTML5
            ),
            we(this.elements.container, this.config.classNames.isIos, le.isIos),
            we(
              this.elements.container,
              this.config.classNames.isTouch,
              this.touch
            ),
            (this.ready = !0),
            setTimeout(function () {
              _e.call(e, e.media, "ready");
            }, 0),
            bt.setTitle.call(this),
            this.poster &&
              bt.setPoster.call(this, this.poster, !1).catch(function () {}),
            this.config.duration && at.durationUpdate.call(this);
        },
        setTitle: function () {
          var e = $e("play", this.config);
          if (
            (Q(this.config.title) &&
              !re(this.config.title) &&
              (e += ", ".concat(this.config.title)),
            Array.from(this.elements.buttons.play || []).forEach(function (t) {
              t.setAttribute("aria-label", e);
            }),
            this.isEmbed)
          ) {
            var t = Ae.call(this, "iframe");
            if (!Z(t)) return;
            var n = re(this.config.title) ? "video" : this.config.title,
              i = $e("frameTitle", this.config);
            t.setAttribute("title", i.replace("{title}", n));
          }
        },
        togglePoster: function (e) {
          we(this.elements.container, this.config.classNames.posterEnabled, e);
        },
        setPoster: function (e) {
          var t = this,
            n =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1];
          return n && this.poster
            ? Promise.reject(new Error("Poster already set"))
            : (this.media.setAttribute("data-poster", e),
              this.elements.poster.removeAttribute("hidden"),
              De.call(this)
                .then(function () {
                  return yt(e);
                })
                .catch(function (n) {
                  throw (e === t.poster && bt.togglePoster.call(t, !1), n);
                })
                .then(function () {
                  if (e !== t.poster)
                    throw new Error(
                      "setPoster cancelled by later call to setPoster"
                    );
                })
                .then(function () {
                  return (
                    Object.assign(t.elements.poster.style, {
                      backgroundImage: "url('".concat(e, "')"),
                      backgroundSize: "",
                    }),
                    bt.togglePoster.call(t, !0),
                    e
                  );
                }));
        },
        checkPlaying: function (e) {
          var t = this;
          we(
            this.elements.container,
            this.config.classNames.playing,
            this.playing
          ),
            we(
              this.elements.container,
              this.config.classNames.paused,
              this.paused
            ),
            we(
              this.elements.container,
              this.config.classNames.stopped,
              this.stopped
            ),
            Array.from(this.elements.buttons.play || []).forEach(function (e) {
              Object.assign(e, { pressed: t.playing }),
                e.setAttribute(
                  "aria-label",
                  $e(t.playing ? "pause" : "play", t.config)
                );
            }),
            (ee(e) && "timeupdate" === e.type) || bt.toggleControls.call(this);
        },
        checkLoading: function (e) {
          var t = this;
          (this.loading = ["stalled", "waiting"].includes(e.type)),
            clearTimeout(this.timers.loading),
            (this.timers.loading = setTimeout(
              function () {
                we(
                  t.elements.container,
                  t.config.classNames.loading,
                  t.loading
                ),
                  bt.toggleControls.call(t);
              },
              this.loading ? 250 : 0
            ));
        },
        toggleControls: function (e) {
          var t = this.elements.controls;
          if (t && this.config.hideControls) {
            var n = this.touch && this.lastSeekTime + 2e3 > Date.now();
            this.toggleControls(
              Boolean(
                e || this.loading || this.paused || t.pressed || t.hover || n
              )
            );
          }
        },
        migrateStyles: function () {
          var e = this;
          Object.values(o({}, this.media.style))
            .filter(function (e) {
              return !re(e) && Q(e) && e.startsWith("--plyr");
            })
            .forEach(function (t) {
              e.elements.container.style.setProperty(
                t,
                e.media.style.getPropertyValue(t)
              ),
                e.media.style.removeProperty(t);
            }),
            re(this.media.style) && this.media.removeAttribute("style");
        },
      },
      vt = (function () {
        function e(n) {
          var i = this;
          t(this, e),
            a(this, "firstTouch", function () {
              var e = i.player,
                t = e.elements;
              (e.touch = !0), we(t.container, e.config.classNames.isTouch, !0);
            }),
            a(this, "setTabFocus", function (e) {
              var t = i.player,
                n = t.elements;
              if (
                (clearTimeout(i.focusTimer),
                "keydown" !== e.type || 9 === e.which)
              ) {
                "keydown" === e.type && (i.lastKeyDown = e.timeStamp);
                var a,
                  r = e.timeStamp - i.lastKeyDown <= 20;
                if ("focus" !== e.type || r)
                  (a = t.config.classNames.tabFocus),
                    we(Ce.call(t, ".".concat(a)), a, !1),
                    "focusout" !== e.type &&
                      (i.focusTimer = setTimeout(function () {
                        var e = document.activeElement;
                        n.container.contains(e) &&
                          we(
                            document.activeElement,
                            t.config.classNames.tabFocus,
                            !0
                          );
                      }, 10));
              }
            }),
            a(this, "global", function () {
              var e =
                  !(arguments.length > 0 && void 0 !== arguments[0]) ||
                  arguments[0],
                t = i.player;
              t.config.keyboard.global &&
                xe.call(t, window, "keydown keyup", i.handleKey, e, !1),
                xe.call(t, document.body, "click", i.toggleMenu, e),
                Oe.call(t, document.body, "touchstart", i.firstTouch),
                xe.call(
                  t,
                  document.body,
                  "keydown focus blur focusout",
                  i.setTabFocus,
                  e,
                  !1,
                  !0
                );
            }),
            a(this, "container", function () {
              var e = i.player,
                t = e.config,
                n = e.elements,
                a = e.timers;
              !t.keyboard.global &&
                t.keyboard.focused &&
                Ie.call(e, n.container, "keydown keyup", i.handleKey, !1),
                Ie.call(
                  e,
                  n.container,
                  "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen",
                  function (t) {
                    var i = n.controls;
                    i &&
                      "enterfullscreen" === t.type &&
                      ((i.pressed = !1), (i.hover = !1));
                    var r = 0;
                    ["touchstart", "touchmove", "mousemove"].includes(t.type) &&
                      (bt.toggleControls.call(e, !0),
                      (r = e.touch ? 3e3 : 2e3)),
                      clearTimeout(a.controls),
                      (a.controls = setTimeout(function () {
                        return bt.toggleControls.call(e, !1);
                      }, r));
                  }
                );
              var r = function (t) {
                  if (!t) return Ve.call(e);
                  var i = n.container.getBoundingClientRect(),
                    a = i.width,
                    r = i.height;
                  return Ve.call(e, "".concat(a, ":").concat(r));
                },
                o = function () {
                  clearTimeout(a.resized), (a.resized = setTimeout(r, 50));
                };
              Ie.call(
                e,
                n.container,
                "enterfullscreen exitfullscreen",
                function (t) {
                  var i = e.fullscreen,
                    a = i.target,
                    s = i.usingNative;
                  if (a === n.container && (e.isEmbed || !re(e.config.ratio))) {
                    var c = "enterfullscreen" === t.type,
                      u = r(c);
                    u.padding;
                    !(function (t, n, i) {
                      if (e.isVimeo && !e.config.vimeo.premium) {
                        var a = e.elements.wrapper.firstChild,
                          r = l(t, 2)[1],
                          o = l(Re.call(e), 2),
                          s = o[0],
                          c = o[1];
                        (a.style.maxWidth = i
                          ? "".concat((r / c) * s, "px")
                          : null),
                          (a.style.margin = i ? "0 auto" : null);
                      }
                    })(u.ratio, 0, c),
                      c &&
                        setTimeout(function () {
                          return se(n.container);
                        }, 100),
                      s ||
                        (c
                          ? Ie.call(e, window, "resize", o)
                          : Le.call(e, window, "resize", o));
                  }
                }
              );
            }),
            a(this, "media", function () {
              var e = i.player,
                t = e.elements;
              if (
                (Ie.call(e, e.media, "timeupdate seeking seeked", function (t) {
                  return at.timeUpdate.call(e, t);
                }),
                Ie.call(
                  e,
                  e.media,
                  "durationchange loadeddata loadedmetadata",
                  function (t) {
                    return at.durationUpdate.call(e, t);
                  }
                ),
                Ie.call(e, e.media, "ended", function () {
                  e.isHTML5 &&
                    e.isVideo &&
                    e.config.resetOnEnd &&
                    (e.restart(), e.pause());
                }),
                Ie.call(
                  e,
                  e.media,
                  "progress playing seeking seeked",
                  function (t) {
                    return at.updateProgress.call(e, t);
                  }
                ),
                Ie.call(e, e.media, "volumechange", function (t) {
                  return at.updateVolume.call(e, t);
                }),
                Ie.call(
                  e,
                  e.media,
                  "playing play pause ended emptied timeupdate",
                  function (t) {
                    return bt.checkPlaying.call(e, t);
                  }
                ),
                Ie.call(
                  e,
                  e.media,
                  "waiting canplay seeked playing",
                  function (t) {
                    return bt.checkLoading.call(e, t);
                  }
                ),
                e.supported.ui && e.config.clickToPlay && !e.isAudio)
              ) {
                var n = Ae.call(e, ".".concat(e.config.classNames.video));
                if (!Z(n)) return;
                Ie.call(e, t.container, "click", function (a) {
                  ([t.container, n].includes(a.target) ||
                    n.contains(a.target)) &&
                    ((e.touch && e.config.hideControls) ||
                      (e.ended
                        ? (i.proxy(a, e.restart, "restart"),
                          i.proxy(
                            a,
                            function () {
                              qe(e.play());
                            },
                            "play"
                          ))
                        : i.proxy(
                            a,
                            function () {
                              qe(e.togglePlay());
                            },
                            "play"
                          )));
                });
              }
              e.supported.ui &&
                e.config.disableContextMenu &&
                Ie.call(
                  e,
                  t.wrapper,
                  "contextmenu",
                  function (e) {
                    e.preventDefault();
                  },
                  !1
                ),
                Ie.call(e, e.media, "volumechange", function () {
                  e.storage.set({ volume: e.volume, muted: e.muted });
                }),
                Ie.call(e, e.media, "ratechange", function () {
                  at.updateSetting.call(e, "speed"),
                    e.storage.set({ speed: e.speed });
                }),
                Ie.call(e, e.media, "qualitychange", function (t) {
                  at.updateSetting.call(e, "quality", null, t.detail.quality);
                }),
                Ie.call(e, e.media, "ready qualitychange", function () {
                  at.setDownloadUrl.call(e);
                });
              var a = e.config.events.concat(["keyup", "keydown"]).join(" ");
              Ie.call(e, e.media, a, function (n) {
                var i = n.detail,
                  a = void 0 === i ? {} : i;
                "error" === n.type && (a = e.media.error),
                  _e.call(e, t.container, n.type, !0, a);
              });
            }),
            a(this, "proxy", function (e, t, n) {
              var a = i.player,
                r = a.config.listeners[n],
                o = !0;
              $(r) && (o = r.call(a, e)), !1 !== o && $(t) && t.call(a, e);
            }),
            a(this, "bind", function (e, t, n, a) {
              var r =
                  !(arguments.length > 4 && void 0 !== arguments[4]) ||
                  arguments[4],
                o = i.player,
                s = o.config.listeners[a],
                l = $(s);
              Ie.call(
                o,
                e,
                t,
                function (e) {
                  return i.proxy(e, n, a);
                },
                r && !l
              );
            }),
            a(this, "controls", function () {
              var e = i.player,
                t = e.elements,
                n = le.isIE ? "change" : "input";
              if (
                (t.buttons.play &&
                  Array.from(t.buttons.play).forEach(function (t) {
                    i.bind(
                      t,
                      "click",
                      function () {
                        qe(e.togglePlay());
                      },
                      "play"
                    );
                  }),
                i.bind(t.buttons.restart, "click", e.restart, "restart"),
                i.bind(
                  t.buttons.rewind,
                  "click",
                  function () {
                    (e.lastSeekTime = Date.now()), e.rewind();
                  },
                  "rewind"
                ),
                i.bind(
                  t.buttons.fastForward,
                  "click",
                  function () {
                    (e.lastSeekTime = Date.now()), e.forward();
                  },
                  "fastForward"
                ),
                i.bind(
                  t.buttons.mute,
                  "click",
                  function () {
                    e.muted = !e.muted;
                  },
                  "mute"
                ),
                i.bind(t.buttons.captions, "click", function () {
                  return e.toggleCaptions();
                }),
                i.bind(
                  t.buttons.download,
                  "click",
                  function () {
                    _e.call(e, e.media, "download");
                  },
                  "download"
                ),
                i.bind(
                  t.buttons.fullscreen,
                  "click",
                  function () {
                    e.fullscreen.toggle();
                  },
                  "fullscreen"
                ),
                i.bind(
                  t.buttons.pip,
                  "click",
                  function () {
                    e.pip = "toggle";
                  },
                  "pip"
                ),
                i.bind(t.buttons.airplay, "click", e.airplay, "airplay"),
                i.bind(
                  t.buttons.settings,
                  "click",
                  function (t) {
                    t.stopPropagation(),
                      t.preventDefault(),
                      at.toggleMenu.call(e, t);
                  },
                  null,
                  !1
                ),
                i.bind(
                  t.buttons.settings,
                  "keyup",
                  function (t) {
                    var n = t.which;
                    [13, 32].includes(n) &&
                      (13 !== n
                        ? (t.preventDefault(),
                          t.stopPropagation(),
                          at.toggleMenu.call(e, t))
                        : at.focusFirstMenuItem.call(e, null, !0));
                  },
                  null,
                  !1
                ),
                i.bind(t.settings.menu, "keydown", function (t) {
                  27 === t.which && at.toggleMenu.call(e, t);
                }),
                i.bind(t.inputs.seek, "mousedown mousemove", function (e) {
                  var n = t.progress.getBoundingClientRect(),
                    i = (100 / n.width) * (e.pageX - n.left);
                  e.currentTarget.setAttribute("seek-value", i);
                }),
                i.bind(
                  t.inputs.seek,
                  "mousedown mouseup keydown keyup touchstart touchend",
                  function (t) {
                    var n = t.currentTarget,
                      i = t.keyCode ? t.keyCode : t.which,
                      a = "play-on-seeked";
                    if (!te(t) || 39 === i || 37 === i) {
                      e.lastSeekTime = Date.now();
                      var r = n.hasAttribute(a),
                        o = ["mouseup", "touchend", "keyup"].includes(t.type);
                      r && o
                        ? (n.removeAttribute(a), qe(e.play()))
                        : !o && e.playing && (n.setAttribute(a, ""), e.pause());
                    }
                  }
                ),
                le.isIos)
              ) {
                var a = Ce.call(e, 'input[type="range"]');
                Array.from(a).forEach(function (e) {
                  return i.bind(e, n, function (e) {
                    return se(e.target);
                  });
                });
              }
              i.bind(
                t.inputs.seek,
                n,
                function (t) {
                  var n = t.currentTarget,
                    i = n.getAttribute("seek-value");
                  re(i) && (i = n.value),
                    n.removeAttribute("seek-value"),
                    (e.currentTime = (i / n.max) * e.duration);
                },
                "seek"
              ),
                i.bind(
                  t.progress,
                  "mouseenter mouseleave mousemove",
                  function (t) {
                    return at.updateSeekTooltip.call(e, t);
                  }
                ),
                i.bind(t.progress, "mousemove touchmove", function (t) {
                  var n = e.previewThumbnails;
                  n && n.loaded && n.startMove(t);
                }),
                i.bind(t.progress, "mouseleave touchend click", function () {
                  var t = e.previewThumbnails;
                  t && t.loaded && t.endMove(!1, !0);
                }),
                i.bind(t.progress, "mousedown touchstart", function (t) {
                  var n = e.previewThumbnails;
                  n && n.loaded && n.startScrubbing(t);
                }),
                i.bind(t.progress, "mouseup touchend", function (t) {
                  var n = e.previewThumbnails;
                  n && n.loaded && n.endScrubbing(t);
                }),
                le.isWebkit &&
                  Array.from(Ce.call(e, 'input[type="range"]')).forEach(
                    function (t) {
                      i.bind(t, "input", function (t) {
                        return at.updateRangeFill.call(e, t.target);
                      });
                    }
                  ),
                e.config.toggleInvert &&
                  !Z(t.display.duration) &&
                  i.bind(t.display.currentTime, "click", function () {
                    0 !== e.currentTime &&
                      ((e.config.invertTime = !e.config.invertTime),
                      at.timeUpdate.call(e));
                  }),
                i.bind(
                  t.inputs.volume,
                  n,
                  function (t) {
                    e.volume = t.target.value;
                  },
                  "volume"
                ),
                i.bind(t.controls, "mouseenter mouseleave", function (n) {
                  t.controls.hover = !e.touch && "mouseenter" === n.type;
                }),
                t.fullscreen &&
                  Array.from(t.fullscreen.children)
                    .filter(function (e) {
                      return !e.contains(t.container);
                    })
                    .forEach(function (n) {
                      i.bind(n, "mouseenter mouseleave", function (n) {
                        t.controls.hover = !e.touch && "mouseenter" === n.type;
                      });
                    }),
                i.bind(
                  t.controls,
                  "mousedown mouseup touchstart touchend touchcancel",
                  function (e) {
                    t.controls.pressed = ["mousedown", "touchstart"].includes(
                      e.type
                    );
                  }
                ),
                i.bind(t.controls, "focusin", function () {
                  var n = e.config,
                    a = e.timers;
                  we(t.controls, n.classNames.noTransition, !0),
                    bt.toggleControls.call(e, !0),
                    setTimeout(function () {
                      we(t.controls, n.classNames.noTransition, !1);
                    }, 0);
                  var r = i.touch ? 3e3 : 4e3;
                  clearTimeout(a.controls),
                    (a.controls = setTimeout(function () {
                      return bt.toggleControls.call(e, !1);
                    }, r));
                }),
                i.bind(
                  t.inputs.volume,
                  "wheel",
                  function (t) {
                    var n = t.webkitDirectionInvertedFromDevice,
                      i = l(
                        [t.deltaX, -t.deltaY].map(function (e) {
                          return n ? -e : e;
                        }),
                        2
                      ),
                      a = i[0],
                      r = i[1],
                      o = Math.sign(Math.abs(a) > Math.abs(r) ? a : r);
                    e.increaseVolume(o / 50);
                    var s = e.media.volume;
                    ((1 === o && s < 1) || (-1 === o && s > 0)) &&
                      t.preventDefault();
                  },
                  "volume",
                  !1
                );
            }),
            (this.player = n),
            (this.lastKey = null),
            (this.focusTimer = null),
            (this.lastKeyDown = null),
            (this.handleKey = this.handleKey.bind(this)),
            (this.toggleMenu = this.toggleMenu.bind(this)),
            (this.setTabFocus = this.setTabFocus.bind(this)),
            (this.firstTouch = this.firstTouch.bind(this));
        }
        return (
          i(e, [
            {
              key: "handleKey",
              value: function (e) {
                var t = this.player,
                  n = t.elements,
                  i = e.keyCode ? e.keyCode : e.which,
                  a = "keydown" === e.type,
                  r = a && i === this.lastKey;
                if (
                  !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) &&
                  Y(i)
                ) {
                  if (a) {
                    var o = document.activeElement;
                    if (Z(o)) {
                      var s = t.config.selectors.editable;
                      if (o !== n.inputs.seek && Te(o, s)) return;
                      if (32 === e.which && Te(o, 'button, [role^="menuitem"]'))
                        return;
                    }
                    switch (
                      ([
                        32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57,
                        67, 70, 73, 75, 76, 77, 79,
                      ].includes(i) &&
                        (e.preventDefault(), e.stopPropagation()),
                      i)
                    ) {
                      case 48:
                      case 49:
                      case 50:
                      case 51:
                      case 52:
                      case 53:
                      case 54:
                      case 55:
                      case 56:
                      case 57:
                        r || (t.currentTime = (t.duration / 10) * (i - 48));
                        break;
                      case 32:
                      case 75:
                        r || qe(t.togglePlay());
                        break;
                      case 38:
                        t.increaseVolume(0.1);
                        break;
                      case 40:
                        t.decreaseVolume(0.1);
                        break;
                      case 77:
                        r || (t.muted = !t.muted);
                        break;
                      case 39:
                        t.forward();
                        break;
                      case 37:
                        t.rewind();
                        break;
                      case 70:
                        t.fullscreen.toggle();
                        break;
                      case 67:
                        r || t.toggleCaptions();
                        break;
                      case 76:
                        t.loop = !t.loop;
                    }
                    27 === i &&
                      !t.fullscreen.usingNative &&
                      t.fullscreen.active &&
                      t.fullscreen.toggle(),
                      (this.lastKey = i);
                  } else this.lastKey = null;
                }
              },
            },
            {
              key: "toggleMenu",
              value: function (e) {
                at.toggleMenu.call(this.player, e);
              },
            },
          ]),
          e
        );
      })();
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self && self;
    var wt = (function (e, t) {
      return e((t = { exports: {} }), t.exports), t.exports;
    })(function (e, t) {
      e.exports = (function () {
        var e = function () {},
          t = {},
          n = {},
          i = {};
        function a(e, t) {
          e = e.push ? e : [e];
          var a,
            r,
            o,
            s = [],
            l = e.length,
            c = l;
          for (
            a = function (e, n) {
              n.length && s.push(e), --c || t(s);
            };
            l--;

          )
            (r = e[l]), (o = n[r]) ? a(r, o) : (i[r] = i[r] || []).push(a);
        }
        function r(e, t) {
          if (e) {
            var a = i[e];
            if (((n[e] = t), a)) for (; a.length; ) a[0](e, t), a.splice(0, 1);
          }
        }
        function o(t, n) {
          t.call && (t = { success: t }),
            n.length ? (t.error || e)(n) : (t.success || e)(t);
        }
        function s(t, n, i, a) {
          var r,
            o,
            l = document,
            c = i.async,
            u = (i.numRetries || 0) + 1,
            d = i.before || e,
            h = t.replace(/[\?|#].*$/, ""),
            m = t.replace(/^(css|img)!/, "");
          (a = a || 0),
            /(^css!|\.css$)/.test(h)
              ? (((o = l.createElement("link")).rel = "stylesheet"),
                (o.href = m),
                (r = "hideFocus" in o) &&
                  o.relList &&
                  ((r = 0), (o.rel = "preload"), (o.as = "style")))
              : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(h)
              ? ((o = l.createElement("img")).src = m)
              : (((o = l.createElement("script")).src = t),
                (o.async = void 0 === c || c)),
            (o.onload =
              o.onerror =
              o.onbeforeload =
                function (e) {
                  var l = e.type[0];
                  if (r)
                    try {
                      o.sheet.cssText.length || (l = "e");
                    } catch (e) {
                      18 != e.code && (l = "e");
                    }
                  if ("e" == l) {
                    if ((a += 1) < u) return s(t, n, i, a);
                  } else if ("preload" == o.rel && "style" == o.as)
                    return (o.rel = "stylesheet");
                  n(t, l, e.defaultPrevented);
                }),
            !1 !== d(t, o) && l.head.appendChild(o);
        }
        function l(e, t, n) {
          var i,
            a,
            r = (e = e.push ? e : [e]).length,
            o = r,
            l = [];
          for (
            i = function (e, n, i) {
              if (("e" == n && l.push(e), "b" == n)) {
                if (!i) return;
                l.push(e);
              }
              --r || t(l);
            },
              a = 0;
            a < o;
            a++
          )
            s(e[a], i, n);
        }
        function c(e, n, i) {
          var a, s;
          if ((n && n.trim && (a = n), (s = (a ? i : n) || {}), a)) {
            if (a in t) throw "LoadJS";
            t[a] = !0;
          }
          function c(t, n) {
            l(
              e,
              function (e) {
                o(s, e), t && o({ success: t, error: n }, e), r(a, e);
              },
              s
            );
          }
          if (s.returnPromise) return new Promise(c);
          c();
        }
        return (
          (c.ready = function (e, t) {
            return (
              a(e, function (e) {
                o(t, e);
              }),
              c
            );
          }),
          (c.done = function (e) {
            r(e, []);
          }),
          (c.reset = function () {
            (t = {}), (n = {}), (i = {});
          }),
          (c.isDefined = function (e) {
            return e in t;
          }),
          c
        );
      })();
    });
    function kt(e) {
      return new Promise(function (t, n) {
        wt(e, { success: t, error: n });
      });
    }
    function Tt(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
        this.media.paused === e &&
          ((this.media.paused = !e),
          _e.call(this, this.media, e ? "play" : "pause"));
    }
    var Ct = {
      setup: function () {
        var e = this;
        we(e.elements.wrapper, e.config.classNames.embed, !0),
          (e.options.speed = e.config.speed.options),
          Ve.call(e),
          K(window.Vimeo)
            ? Ct.ready.call(e)
            : kt(e.config.urls.vimeo.sdk)
                .then(function () {
                  Ct.ready.call(e);
                })
                .catch(function (t) {
                  e.debug.warn("Vimeo SDK (player.js) failed to load", t);
                });
      },
      ready: function () {
        var e = this,
          t = this,
          n = t.config.vimeo,
          i = n.premium,
          a = n.referrerPolicy,
          r = s(n, ["premium", "referrerPolicy"]);
        i && Object.assign(r, { controls: !1, sidedock: !1 });
        var c = ot(
            o(
              {
                loop: t.config.loop.active,
                autoplay: t.autoplay,
                muted: t.muted,
                gesture: "media",
                playsinline: !this.config.fullscreen.iosNative,
              },
              r
            )
          ),
          u = t.media.getAttribute("src");
        re(u) && (u = t.media.getAttribute(t.config.attributes.embed.id));
        var d,
          h = re((d = u))
            ? null
            : Y(Number(d))
            ? d
            : d.match(/^.*(vimeo.com\/|video\/)(\d+).*/)
            ? RegExp.$2
            : d,
          m = me("iframe"),
          p = We(t.config.urls.vimeo.iframe, h, c);
        if (
          (m.setAttribute("src", p),
          m.setAttribute("allowfullscreen", ""),
          m.setAttribute(
            "allow",
            ["autoplay", "fullscreen", "picture-in-picture"].join("; ")
          ),
          re(a) || m.setAttribute("referrerPolicy", a),
          i || !n.customControls)
        )
          m.setAttribute("data-poster", t.poster), (t.media = ye(m, t.media));
        else {
          var f = me("div", {
            class: t.config.classNames.embedContainer,
            "data-poster": t.poster,
          });
          f.appendChild(m), (t.media = ye(f, t.media));
        }
        n.customControls ||
          Ge(We(t.config.urls.vimeo.api, p)).then(function (e) {
            !re(e) &&
              e.thumbnail_url &&
              bt.setPoster.call(t, e.thumbnail_url).catch(function () {});
          }),
          (t.embed = new window.Vimeo.Player(m, {
            autopause: t.config.autopause,
            muted: t.muted,
          })),
          (t.media.paused = !0),
          (t.media.currentTime = 0),
          t.supported.ui && t.embed.disableTextTrack(),
          (t.media.play = function () {
            return Tt.call(t, !0), t.embed.play();
          }),
          (t.media.pause = function () {
            return Tt.call(t, !1), t.embed.pause();
          }),
          (t.media.stop = function () {
            t.pause(), (t.currentTime = 0);
          });
        var g = t.media.currentTime;
        Object.defineProperty(t.media, "currentTime", {
          get: function () {
            return g;
          },
          set: function (e) {
            var n = t.embed,
              i = t.media,
              a = t.paused,
              r = t.volume,
              o = a && !n.hasPlayed;
            (i.seeking = !0),
              _e.call(t, i, "seeking"),
              Promise.resolve(o && n.setVolume(0))
                .then(function () {
                  return n.setCurrentTime(e);
                })
                .then(function () {
                  return o && n.pause();
                })
                .then(function () {
                  return o && n.setVolume(r);
                })
                .catch(function () {});
          },
        });
        var y = t.config.speed.selected;
        Object.defineProperty(t.media, "playbackRate", {
          get: function () {
            return y;
          },
          set: function (e) {
            t.embed
              .setPlaybackRate(e)
              .then(function () {
                (y = e), _e.call(t, t.media, "ratechange");
              })
              .catch(function () {
                t.options.speed = [1];
              });
          },
        });
        var b = t.config.volume;
        Object.defineProperty(t.media, "volume", {
          get: function () {
            return b;
          },
          set: function (e) {
            t.embed.setVolume(e).then(function () {
              (b = e), _e.call(t, t.media, "volumechange");
            });
          },
        });
        var v = t.config.muted;
        Object.defineProperty(t.media, "muted", {
          get: function () {
            return v;
          },
          set: function (e) {
            var n = !!X(e) && e;
            t.embed.setVolume(n ? 0 : t.config.volume).then(function () {
              (v = n), _e.call(t, t.media, "volumechange");
            });
          },
        });
        var w,
          k = t.config.loop;
        Object.defineProperty(t.media, "loop", {
          get: function () {
            return k;
          },
          set: function (e) {
            var n = X(e) ? e : t.config.loop.active;
            t.embed.setLoop(n).then(function () {
              k = n;
            });
          },
        }),
          t.embed
            .getVideoUrl()
            .then(function (e) {
              (w = e), at.setDownloadUrl.call(t);
            })
            .catch(function (t) {
              e.debug.warn(t);
            }),
          Object.defineProperty(t.media, "currentSrc", {
            get: function () {
              return w;
            },
          }),
          Object.defineProperty(t.media, "ended", {
            get: function () {
              return t.currentTime === t.duration;
            },
          }),
          Promise.all([t.embed.getVideoWidth(), t.embed.getVideoHeight()]).then(
            function (n) {
              var i = l(n, 2),
                a = i[0],
                r = i[1];
              (t.embed.ratio = [a, r]), Ve.call(e);
            }
          ),
          t.embed.setAutopause(t.config.autopause).then(function (e) {
            t.config.autopause = e;
          }),
          t.embed.getVideoTitle().then(function (n) {
            (t.config.title = n), bt.setTitle.call(e);
          }),
          t.embed.getCurrentTime().then(function (e) {
            (g = e), _e.call(t, t.media, "timeupdate");
          }),
          t.embed.getDuration().then(function (e) {
            (t.media.duration = e), _e.call(t, t.media, "durationchange");
          }),
          t.embed.getTextTracks().then(function (e) {
            (t.media.textTracks = e), st.setup.call(t);
          }),
          t.embed.on("cuechange", function (e) {
            var n = e.cues,
              i = (void 0 === n ? [] : n).map(function (e) {
                return (function (e) {
                  var t = document.createDocumentFragment(),
                    n = document.createElement("div");
                  return (
                    t.appendChild(n), (n.innerHTML = e), t.firstChild.innerText
                  );
                })(e.text);
              });
            st.updateCues.call(t, i);
          }),
          t.embed.on("loaded", function () {
            (t.embed.getPaused().then(function (e) {
              Tt.call(t, !e), e || _e.call(t, t.media, "playing");
            }),
            Z(t.embed.element) && t.supported.ui) &&
              t.embed.element.setAttribute("tabindex", -1);
          }),
          t.embed.on("bufferstart", function () {
            _e.call(t, t.media, "waiting");
          }),
          t.embed.on("bufferend", function () {
            _e.call(t, t.media, "playing");
          }),
          t.embed.on("play", function () {
            Tt.call(t, !0), _e.call(t, t.media, "playing");
          }),
          t.embed.on("pause", function () {
            Tt.call(t, !1);
          }),
          t.embed.on("timeupdate", function (e) {
            (t.media.seeking = !1),
              (g = e.seconds),
              _e.call(t, t.media, "timeupdate");
          }),
          t.embed.on("progress", function (e) {
            (t.media.buffered = e.percent),
              _e.call(t, t.media, "progress"),
              1 === parseInt(e.percent, 10) &&
                _e.call(t, t.media, "canplaythrough"),
              t.embed.getDuration().then(function (e) {
                e !== t.media.duration &&
                  ((t.media.duration = e),
                  _e.call(t, t.media, "durationchange"));
              });
          }),
          t.embed.on("seeked", function () {
            (t.media.seeking = !1), _e.call(t, t.media, "seeked");
          }),
          t.embed.on("ended", function () {
            (t.media.paused = !0), _e.call(t, t.media, "ended");
          }),
          t.embed.on("error", function (e) {
            (t.media.error = e), _e.call(t, t.media, "error");
          }),
          n.customControls &&
            setTimeout(function () {
              return bt.build.call(t);
            }, 0);
      },
    };
    function At(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
        this.media.paused === e &&
          ((this.media.paused = !e),
          _e.call(this, this.media, e ? "play" : "pause"));
    }
    function St(e) {
      return e.noCookie
        ? "https://www.youtube-nocookie.com"
        : "http:" === window.location.protocol
        ? "http://www.youtube.com"
        : void 0;
    }
    var Pt = {
        setup: function () {
          var e = this;
          if (
            (we(this.elements.wrapper, this.config.classNames.embed, !0),
            K(window.YT) && $(window.YT.Player))
          )
            Pt.ready.call(this);
          else {
            var t = window.onYouTubeIframeAPIReady;
            (window.onYouTubeIframeAPIReady = function () {
              $(t) && t(), Pt.ready.call(e);
            }),
              kt(this.config.urls.youtube.sdk).catch(function (t) {
                e.debug.warn("YouTube API failed to load", t);
              });
          }
        },
        getTitle: function (e) {
          var t = this;
          Ge(We(this.config.urls.youtube.api, e))
            .then(function (e) {
              if (K(e)) {
                var n = e.title,
                  i = e.height,
                  a = e.width;
                (t.config.title = n),
                  bt.setTitle.call(t),
                  (t.embed.ratio = [a, i]);
              }
              Ve.call(t);
            })
            .catch(function () {
              Ve.call(t);
            });
        },
        ready: function () {
          var e = this,
            t = e.config.youtube,
            n = e.media && e.media.getAttribute("id");
          if (re(n) || !n.startsWith("youtube-")) {
            var i = e.media.getAttribute("src");
            re(i) &&
              (i = e.media.getAttribute(this.config.attributes.embed.id));
            var a,
              r,
              o = re((a = i))
                ? null
                : a.match(
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                  )
                ? RegExp.$2
                : a,
              s = me("div", {
                id:
                  ((r = e.provider),
                  "".concat(r, "-").concat(Math.floor(1e4 * Math.random()))),
                "data-poster": t.customControls ? e.poster : void 0,
              });
            if (((e.media = ye(s, e.media)), t.customControls)) {
              var l = function (e) {
                return "https://i.ytimg.com/vi/"
                  .concat(o, "/")
                  .concat(e, "default.jpg");
              };
              yt(l("maxres"), 121)
                .catch(function () {
                  return yt(l("sd"), 121);
                })
                .catch(function () {
                  return yt(l("hq"));
                })
                .then(function (t) {
                  return bt.setPoster.call(e, t.src);
                })
                .then(function (t) {
                  t.includes("maxres") ||
                    (e.elements.poster.style.backgroundSize = "cover");
                })
                .catch(function () {});
            }
            e.embed = new window.YT.Player(e.media, {
              videoId: o,
              host: St(t),
              playerVars: ue(
                {},
                {
                  autoplay: e.config.autoplay ? 1 : 0,
                  hl: e.config.hl,
                  controls: e.supported.ui && t.customControls ? 0 : 1,
                  disablekb: 1,
                  playsinline: e.config.fullscreen.iosNative ? 0 : 1,
                  cc_load_policy: e.captions.active ? 1 : 0,
                  cc_lang_pref: e.config.captions.language,
                  widget_referrer: window ? window.location.href : null,
                },
                t
              ),
              events: {
                onError: function (t) {
                  if (!e.media.error) {
                    var n = t.data,
                      i =
                        {
                          2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                          5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                          100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                          101: "The owner of the requested video does not allow it to be played in embedded players.",
                          150: "The owner of the requested video does not allow it to be played in embedded players.",
                        }[n] || "An unknown error occured";
                    (e.media.error = { code: n, message: i }),
                      _e.call(e, e.media, "error");
                  }
                },
                onPlaybackRateChange: function (t) {
                  var n = t.target;
                  (e.media.playbackRate = n.getPlaybackRate()),
                    _e.call(e, e.media, "ratechange");
                },
                onReady: function (n) {
                  if (!$(e.media.play)) {
                    var i = n.target;
                    Pt.getTitle.call(e, o),
                      (e.media.play = function () {
                        At.call(e, !0), i.playVideo();
                      }),
                      (e.media.pause = function () {
                        At.call(e, !1), i.pauseVideo();
                      }),
                      (e.media.stop = function () {
                        i.stopVideo();
                      }),
                      (e.media.duration = i.getDuration()),
                      (e.media.paused = !0),
                      (e.media.currentTime = 0),
                      Object.defineProperty(e.media, "currentTime", {
                        get: function () {
                          return Number(i.getCurrentTime());
                        },
                        set: function (t) {
                          e.paused && !e.embed.hasPlayed && e.embed.mute(),
                            (e.media.seeking = !0),
                            _e.call(e, e.media, "seeking"),
                            i.seekTo(t);
                        },
                      }),
                      Object.defineProperty(e.media, "playbackRate", {
                        get: function () {
                          return i.getPlaybackRate();
                        },
                        set: function (e) {
                          i.setPlaybackRate(e);
                        },
                      });
                    var a = e.config.volume;
                    Object.defineProperty(e.media, "volume", {
                      get: function () {
                        return a;
                      },
                      set: function (t) {
                        (a = t),
                          i.setVolume(100 * a),
                          _e.call(e, e.media, "volumechange");
                      },
                    });
                    var r = e.config.muted;
                    Object.defineProperty(e.media, "muted", {
                      get: function () {
                        return r;
                      },
                      set: function (t) {
                        var n = X(t) ? t : r;
                        (r = n),
                          i[n ? "mute" : "unMute"](),
                          i.setVolume(100 * a),
                          _e.call(e, e.media, "volumechange");
                      },
                    }),
                      Object.defineProperty(e.media, "currentSrc", {
                        get: function () {
                          return i.getVideoUrl();
                        },
                      }),
                      Object.defineProperty(e.media, "ended", {
                        get: function () {
                          return e.currentTime === e.duration;
                        },
                      });
                    var s = i.getAvailablePlaybackRates();
                    (e.options.speed = s.filter(function (t) {
                      return e.config.speed.options.includes(t);
                    })),
                      e.supported.ui &&
                        t.customControls &&
                        e.media.setAttribute("tabindex", -1),
                      _e.call(e, e.media, "timeupdate"),
                      _e.call(e, e.media, "durationchange"),
                      clearInterval(e.timers.buffering),
                      (e.timers.buffering = setInterval(function () {
                        (e.media.buffered = i.getVideoLoadedFraction()),
                          (null === e.media.lastBuffered ||
                            e.media.lastBuffered < e.media.buffered) &&
                            _e.call(e, e.media, "progress"),
                          (e.media.lastBuffered = e.media.buffered),
                          1 === e.media.buffered &&
                            (clearInterval(e.timers.buffering),
                            _e.call(e, e.media, "canplaythrough"));
                      }, 200)),
                      t.customControls &&
                        setTimeout(function () {
                          return bt.build.call(e);
                        }, 50);
                  }
                },
                onStateChange: function (n) {
                  var i = n.target;
                  switch (
                    (clearInterval(e.timers.playing),
                    e.media.seeking &&
                      [1, 2].includes(n.data) &&
                      ((e.media.seeking = !1), _e.call(e, e.media, "seeked")),
                    n.data)
                  ) {
                    case -1:
                      _e.call(e, e.media, "timeupdate"),
                        (e.media.buffered = i.getVideoLoadedFraction()),
                        _e.call(e, e.media, "progress");
                      break;
                    case 0:
                      At.call(e, !1),
                        e.media.loop
                          ? (i.stopVideo(), i.playVideo())
                          : _e.call(e, e.media, "ended");
                      break;
                    case 1:
                      t.customControls &&
                      !e.config.autoplay &&
                      e.media.paused &&
                      !e.embed.hasPlayed
                        ? e.media.pause()
                        : (At.call(e, !0),
                          _e.call(e, e.media, "playing"),
                          (e.timers.playing = setInterval(function () {
                            _e.call(e, e.media, "timeupdate");
                          }, 50)),
                          e.media.duration !== i.getDuration() &&
                            ((e.media.duration = i.getDuration()),
                            _e.call(e, e.media, "durationchange")));
                      break;
                    case 2:
                      e.muted || e.embed.unMute(), At.call(e, !1);
                      break;
                    case 3:
                      _e.call(e, e.media, "waiting");
                  }
                  _e.call(e, e.elements.container, "statechange", !1, {
                    code: n.data,
                  });
                },
              },
            });
          }
        },
      },
      Et = {
        setup: function () {
          this.media
            ? (we(
                this.elements.container,
                this.config.classNames.type.replace("{0}", this.type),
                !0
              ),
              we(
                this.elements.container,
                this.config.classNames.provider.replace("{0}", this.provider),
                !0
              ),
              this.isEmbed &&
                we(
                  this.elements.container,
                  this.config.classNames.type.replace("{0}", "video"),
                  !0
                ),
              this.isVideo &&
                ((this.elements.wrapper = me("div", {
                  class: this.config.classNames.video,
                })),
                de(this.media, this.elements.wrapper),
                (this.elements.poster = me("div", {
                  class: this.config.classNames.poster,
                  hidden: "",
                })),
                this.elements.wrapper.appendChild(this.elements.poster)),
              this.isHTML5
                ? Be.setup.call(this)
                : this.isYouTube
                ? Pt.setup.call(this)
                : this.isVimeo && Ct.setup.call(this))
            : this.debug.warn("No media element found!");
        },
      },
      Nt = (function () {
        function e(n) {
          var i = this;
          t(this, e),
            a(this, "load", function () {
              i.enabled &&
                (K(window.google) && K(window.google.ima)
                  ? i.ready()
                  : kt(i.player.config.urls.googleIMA.sdk)
                      .then(function () {
                        i.ready();
                      })
                      .catch(function () {
                        i.trigger(
                          "error",
                          new Error("Google IMA SDK failed to load")
                        );
                      }));
            }),
            a(this, "ready", function () {
              var e;
              i.enabled ||
                ((e = i).manager && e.manager.destroy(),
                e.elements.displayContainer &&
                  e.elements.displayContainer.destroy(),
                e.elements.container.remove()),
                i.startSafetyTimer(12e3, "ready()"),
                i.managerPromise.then(function () {
                  i.clearSafetyTimer("onAdsManagerLoaded()");
                }),
                i.listeners(),
                i.setupIMA();
            }),
            a(this, "setupIMA", function () {
              (i.elements.container = me("div", {
                class: i.player.config.classNames.ads,
              })),
                i.player.elements.container.appendChild(i.elements.container),
                google.ima.settings.setVpaidMode(
                  google.ima.ImaSdkSettings.VpaidMode.ENABLED
                ),
                google.ima.settings.setLocale(i.player.config.ads.language),
                google.ima.settings.setDisableCustomPlaybackForIOS10Plus(
                  i.player.config.playsinline
                ),
                (i.elements.displayContainer =
                  new google.ima.AdDisplayContainer(
                    i.elements.container,
                    i.player.media
                  )),
                (i.loader = new google.ima.AdsLoader(
                  i.elements.displayContainer
                )),
                i.loader.addEventListener(
                  google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                  function (e) {
                    return i.onAdsManagerLoaded(e);
                  },
                  !1
                ),
                i.loader.addEventListener(
                  google.ima.AdErrorEvent.Type.AD_ERROR,
                  function (e) {
                    return i.onAdError(e);
                  },
                  !1
                ),
                i.requestAds();
            }),
            a(this, "requestAds", function () {
              var e = i.player.elements.container;
              try {
                var t = new google.ima.AdsRequest();
                (t.adTagUrl = i.tagUrl),
                  (t.linearAdSlotWidth = e.offsetWidth),
                  (t.linearAdSlotHeight = e.offsetHeight),
                  (t.nonLinearAdSlotWidth = e.offsetWidth),
                  (t.nonLinearAdSlotHeight = e.offsetHeight),
                  (t.forceNonLinearFullSlot = !1),
                  t.setAdWillPlayMuted(!i.player.muted),
                  i.loader.requestAds(t);
              } catch (e) {
                i.onAdError(e);
              }
            }),
            a(this, "pollCountdown", function () {
              var e =
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              if (!e)
                return (
                  clearInterval(i.countdownTimer),
                  void i.elements.container.removeAttribute("data-badge-text")
                );
              var t = function () {
                var e = it(Math.max(i.manager.getRemainingTime(), 0)),
                  t = ""
                    .concat($e("advertisement", i.player.config), " - ")
                    .concat(e);
                i.elements.container.setAttribute("data-badge-text", t);
              };
              i.countdownTimer = setInterval(t, 100);
            }),
            a(this, "onAdsManagerLoaded", function (e) {
              if (i.enabled) {
                var t = new google.ima.AdsRenderingSettings();
                (t.restoreCustomPlaybackStateOnAdBreakComplete = !0),
                  (t.enablePreloading = !0),
                  (i.manager = e.getAdsManager(i.player, t)),
                  (i.cuePoints = i.manager.getCuePoints()),
                  i.manager.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    function (e) {
                      return i.onAdError(e);
                    }
                  ),
                  Object.keys(google.ima.AdEvent.Type).forEach(function (e) {
                    i.manager.addEventListener(
                      google.ima.AdEvent.Type[e],
                      function (e) {
                        return i.onAdEvent(e);
                      }
                    );
                  }),
                  i.trigger("loaded");
              }
            }),
            a(this, "addCuePoints", function () {
              re(i.cuePoints) ||
                i.cuePoints.forEach(function (e) {
                  if (0 !== e && -1 !== e && e < i.player.duration) {
                    var t = i.player.elements.progress;
                    if (Z(t)) {
                      var n = (100 / i.player.duration) * e,
                        a = me("span", {
                          class: i.player.config.classNames.cues,
                        });
                      (a.style.left = "".concat(n.toString(), "%")),
                        t.appendChild(a);
                    }
                  }
                });
            }),
            a(this, "onAdEvent", function (e) {
              var t = i.player.elements.container,
                n = e.getAd(),
                a = e.getAdData();
              switch (
                ((function (e) {
                  _e.call(
                    i.player,
                    i.player.media,
                    "ads".concat(e.replace(/_/g, "").toLowerCase())
                  );
                })(e.type),
                e.type)
              ) {
                case google.ima.AdEvent.Type.LOADED:
                  i.trigger("loaded"),
                    i.pollCountdown(!0),
                    n.isLinear() ||
                      ((n.width = t.offsetWidth), (n.height = t.offsetHeight));
                  break;
                case google.ima.AdEvent.Type.STARTED:
                  i.manager.setVolume(i.player.volume);
                  break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                  i.player.ended ? i.loadAds() : i.loader.contentComplete();
                  break;
                case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                  i.pauseContent();
                  break;
                case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                  i.pollCountdown(), i.resumeContent();
                  break;
                case google.ima.AdEvent.Type.LOG:
                  a.adError &&
                    i.player.debug.warn(
                      "Non-fatal ad error: ".concat(a.adError.getMessage())
                    );
              }
            }),
            a(this, "onAdError", function (e) {
              i.cancel(), i.player.debug.warn("Ads error", e);
            }),
            a(this, "listeners", function () {
              var e,
                t = i.player.elements.container;
              i.player.on("canplay", function () {
                i.addCuePoints();
              }),
                i.player.on("ended", function () {
                  i.loader.contentComplete();
                }),
                i.player.on("timeupdate", function () {
                  e = i.player.currentTime;
                }),
                i.player.on("seeked", function () {
                  var t = i.player.currentTime;
                  re(i.cuePoints) ||
                    i.cuePoints.forEach(function (n, a) {
                      e < n &&
                        n < t &&
                        (i.manager.discardAdBreak(), i.cuePoints.splice(a, 1));
                    });
                }),
                window.addEventListener("resize", function () {
                  i.manager &&
                    i.manager.resize(
                      t.offsetWidth,
                      t.offsetHeight,
                      google.ima.ViewMode.NORMAL
                    );
                });
            }),
            a(this, "play", function () {
              var e = i.player.elements.container;
              i.managerPromise || i.resumeContent(),
                i.managerPromise
                  .then(function () {
                    i.manager.setVolume(i.player.volume),
                      i.elements.displayContainer.initialize();
                    try {
                      i.initialized ||
                        (i.manager.init(
                          e.offsetWidth,
                          e.offsetHeight,
                          google.ima.ViewMode.NORMAL
                        ),
                        i.manager.start()),
                        (i.initialized = !0);
                    } catch (e) {
                      i.onAdError(e);
                    }
                  })
                  .catch(function () {});
            }),
            a(this, "resumeContent", function () {
              (i.elements.container.style.zIndex = ""),
                (i.playing = !1),
                qe(i.player.media.play());
            }),
            a(this, "pauseContent", function () {
              (i.elements.container.style.zIndex = 3),
                (i.playing = !0),
                i.player.media.pause();
            }),
            a(this, "cancel", function () {
              i.initialized && i.resumeContent(),
                i.trigger("error"),
                i.loadAds();
            }),
            a(this, "loadAds", function () {
              i.managerPromise
                .then(function () {
                  i.manager && i.manager.destroy(),
                    (i.managerPromise = new Promise(function (e) {
                      i.on("loaded", e), i.player.debug.log(i.manager);
                    })),
                    (i.initialized = !1),
                    i.requestAds();
                })
                .catch(function () {});
            }),
            a(this, "trigger", function (e) {
              for (
                var t = arguments.length,
                  n = new Array(t > 1 ? t - 1 : 0),
                  a = 1;
                a < t;
                a++
              )
                n[a - 1] = arguments[a];
              var r = i.events[e];
              J(r) &&
                r.forEach(function (e) {
                  $(e) && e.apply(i, n);
                });
            }),
            a(this, "on", function (e, t) {
              return (
                J(i.events[e]) || (i.events[e] = []), i.events[e].push(t), i
              );
            }),
            a(this, "startSafetyTimer", function (e, t) {
              i.player.debug.log("Safety timer invoked from: ".concat(t)),
                (i.safetyTimer = setTimeout(function () {
                  i.cancel(), i.clearSafetyTimer("startSafetyTimer()");
                }, e));
            }),
            a(this, "clearSafetyTimer", function (e) {
              z(i.safetyTimer) ||
                (i.player.debug.log("Safety timer cleared from: ".concat(e)),
                clearTimeout(i.safetyTimer),
                (i.safetyTimer = null));
            }),
            (this.player = n),
            (this.config = n.config.ads),
            (this.playing = !1),
            (this.initialized = !1),
            (this.elements = { container: null, displayContainer: null }),
            (this.manager = null),
            (this.loader = null),
            (this.cuePoints = null),
            (this.events = {}),
            (this.safetyTimer = null),
            (this.countdownTimer = null),
            (this.managerPromise = new Promise(function (e, t) {
              i.on("loaded", e), i.on("error", t);
            })),
            this.load();
        }
        return (
          i(e, [
            {
              key: "enabled",
              get: function () {
                var e = this.config;
                return (
                  this.player.isHTML5 &&
                  this.player.isVideo &&
                  e.enabled &&
                  (!re(e.publisherId) || ae(e.tagUrl))
                );
              },
            },
            {
              key: "tagUrl",
              get: function () {
                var e = this.config;
                if (ae(e.tagUrl)) return e.tagUrl;
                var t = {
                  AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
                  AV_CHANNELID: "5a0458dc28a06145e4519d21",
                  AV_URL: window.location.hostname,
                  cb: Date.now(),
                  AV_WIDTH: 640,
                  AV_HEIGHT: 480,
                  AV_CDIM2: e.publisherId,
                };
                return ""
                  .concat("https://go.aniview.com/api/adserver6/vast/", "?")
                  .concat(ot(t));
              },
            },
          ]),
          e
        );
      })(),
      Mt = function (e, t) {
        var n = {};
        return (
          e > t.width / t.height
            ? ((n.width = t.width), (n.height = (1 / e) * t.width))
            : ((n.height = t.height), (n.width = e * t.height)),
          n
        );
      },
      xt = (function () {
        function e(n) {
          var i = this;
          t(this, e),
            a(this, "load", function () {
              i.player.elements.display.seekTooltip &&
                (i.player.elements.display.seekTooltip.hidden = i.enabled),
                i.enabled &&
                  i.getThumbnails().then(function () {
                    i.enabled &&
                      (i.render(),
                      i.determineContainerAutoSizing(),
                      (i.loaded = !0));
                  });
            }),
            a(this, "getThumbnails", function () {
              return new Promise(function (e) {
                var t = i.player.config.previewThumbnails.src;
                if (re(t))
                  throw new Error(
                    "Missing previewThumbnails.src config attribute"
                  );
                var n = function () {
                  i.thumbnails.sort(function (e, t) {
                    return e.height - t.height;
                  }),
                    i.player.debug.log("Preview thumbnails", i.thumbnails),
                    e();
                };
                if ($(t))
                  t(function (e) {
                    (i.thumbnails = e), n();
                  });
                else {
                  var a = (Q(t) ? [t] : t).map(function (e) {
                    return i.getThumbnail(e);
                  });
                  Promise.all(a).then(n);
                }
              });
            }),
            a(this, "getThumbnail", function (e) {
              return new Promise(function (t) {
                Ge(e).then(function (n) {
                  var a,
                    r,
                    o = {
                      frames:
                        ((a = n),
                        (r = []),
                        a.split(/\r\n\r\n|\n\n|\r\r/).forEach(function (e) {
                          var t = {};
                          e.split(/\r\n|\n|\r/).forEach(function (e) {
                            if (Y(t.startTime)) {
                              if (!re(e.trim()) && re(t.text)) {
                                var n = e.trim().split("#xywh="),
                                  i = l(n, 1);
                                if (((t.text = i[0]), n[1])) {
                                  var a = l(n[1].split(","), 4);
                                  (t.x = a[0]),
                                    (t.y = a[1]),
                                    (t.w = a[2]),
                                    (t.h = a[3]);
                                }
                              }
                            } else {
                              var r = e.match(
                                /([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/
                              );
                              r &&
                                ((t.startTime =
                                  60 * Number(r[1] || 0) * 60 +
                                  60 * Number(r[2]) +
                                  Number(r[3]) +
                                  Number("0.".concat(r[4]))),
                                (t.endTime =
                                  60 * Number(r[6] || 0) * 60 +
                                  60 * Number(r[7]) +
                                  Number(r[8]) +
                                  Number("0.".concat(r[9]))));
                            }
                          }),
                            t.text && r.push(t);
                        }),
                        r),
                      height: null,
                      urlPrefix: "",
                    };
                  o.frames[0].text.startsWith("/") ||
                    o.frames[0].text.startsWith("http://") ||
                    o.frames[0].text.startsWith("https://") ||
                    (o.urlPrefix = e.substring(0, e.lastIndexOf("/") + 1));
                  var s = new Image();
                  (s.onload = function () {
                    (o.height = s.naturalHeight),
                      (o.width = s.naturalWidth),
                      i.thumbnails.push(o),
                      t();
                  }),
                    (s.src = o.urlPrefix + o.frames[0].text);
                });
              });
            }),
            a(this, "startMove", function (e) {
              if (
                i.loaded &&
                ee(e) &&
                ["touchmove", "mousemove"].includes(e.type) &&
                i.player.media.duration
              ) {
                if ("touchmove" === e.type)
                  i.seekTime =
                    i.player.media.duration *
                    (i.player.elements.inputs.seek.value / 100);
                else {
                  var t = i.player.elements.progress.getBoundingClientRect(),
                    n = (100 / t.width) * (e.pageX - t.left);
                  (i.seekTime = i.player.media.duration * (n / 100)),
                    i.seekTime < 0 && (i.seekTime = 0),
                    i.seekTime > i.player.media.duration - 1 &&
                      (i.seekTime = i.player.media.duration - 1),
                    (i.mousePosX = e.pageX),
                    (i.elements.thumb.time.innerText = it(i.seekTime));
                }
                i.showImageAtCurrentTime();
              }
            }),
            a(this, "endMove", function () {
              i.toggleThumbContainer(!1, !0);
            }),
            a(this, "startScrubbing", function (e) {
              (z(e.button) || !1 === e.button || 0 === e.button) &&
                ((i.mouseDown = !0),
                i.player.media.duration &&
                  (i.toggleScrubbingContainer(!0),
                  i.toggleThumbContainer(!1, !0),
                  i.showImageAtCurrentTime()));
            }),
            a(this, "endScrubbing", function () {
              (i.mouseDown = !1),
                Math.ceil(i.lastTime) === Math.ceil(i.player.media.currentTime)
                  ? i.toggleScrubbingContainer(!1)
                  : Oe.call(
                      i.player,
                      i.player.media,
                      "timeupdate",
                      function () {
                        i.mouseDown || i.toggleScrubbingContainer(!1);
                      }
                    );
            }),
            a(this, "listeners", function () {
              i.player.on("play", function () {
                i.toggleThumbContainer(!1, !0);
              }),
                i.player.on("seeked", function () {
                  i.toggleThumbContainer(!1);
                }),
                i.player.on("timeupdate", function () {
                  i.lastTime = i.player.media.currentTime;
                });
            }),
            a(this, "render", function () {
              (i.elements.thumb.container = me("div", {
                class:
                  i.player.config.classNames.previewThumbnails.thumbContainer,
              })),
                (i.elements.thumb.imageContainer = me("div", {
                  class:
                    i.player.config.classNames.previewThumbnails.imageContainer,
                })),
                i.elements.thumb.container.appendChild(
                  i.elements.thumb.imageContainer
                );
              var e = me("div", {
                class:
                  i.player.config.classNames.previewThumbnails.timeContainer,
              });
              (i.elements.thumb.time = me("span", {}, "00:00")),
                e.appendChild(i.elements.thumb.time),
                i.elements.thumb.container.appendChild(e),
                Z(i.player.elements.progress) &&
                  i.player.elements.progress.appendChild(
                    i.elements.thumb.container
                  ),
                (i.elements.scrubbing.container = me("div", {
                  class:
                    i.player.config.classNames.previewThumbnails
                      .scrubbingContainer,
                })),
                i.player.elements.wrapper.appendChild(
                  i.elements.scrubbing.container
                );
            }),
            a(this, "destroy", function () {
              i.elements.thumb.container && i.elements.thumb.container.remove(),
                i.elements.scrubbing.container &&
                  i.elements.scrubbing.container.remove();
            }),
            a(this, "showImageAtCurrentTime", function () {
              i.mouseDown
                ? i.setScrubbingContainerSize()
                : i.setThumbContainerSizeAndPos();
              var e = i.thumbnails[0].frames.findIndex(function (e) {
                  return i.seekTime >= e.startTime && i.seekTime <= e.endTime;
                }),
                t = e >= 0,
                n = 0;
              i.mouseDown || i.toggleThumbContainer(t),
                t &&
                  (i.thumbnails.forEach(function (t, a) {
                    i.loadedImages.includes(t.frames[e].text) && (n = a);
                  }),
                  e !== i.showingThumb &&
                    ((i.showingThumb = e), i.loadImage(n)));
            }),
            a(this, "loadImage", function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0,
                t = i.showingThumb,
                n = i.thumbnails[e],
                a = n.urlPrefix,
                r = n.frames[t],
                o = n.frames[t].text,
                s = a + o;
              if (
                i.currentImageElement &&
                i.currentImageElement.dataset.filename === o
              )
                i.showImage(i.currentImageElement, r, e, t, o, !1),
                  (i.currentImageElement.dataset.index = t),
                  i.removeOldImages(i.currentImageElement);
              else {
                i.loadingImage &&
                  i.usingSprites &&
                  (i.loadingImage.onload = null);
                var l = new Image();
                (l.src = s),
                  (l.dataset.index = t),
                  (l.dataset.filename = o),
                  (i.showingThumbFilename = o),
                  i.player.debug.log("Loading image: ".concat(s)),
                  (l.onload = function () {
                    return i.showImage(l, r, e, t, o, !0);
                  }),
                  (i.loadingImage = l),
                  i.removeOldImages(l);
              }
            }),
            a(this, "showImage", function (e, t, n, a, r) {
              var o =
                !(arguments.length > 5 && void 0 !== arguments[5]) ||
                arguments[5];
              i.player.debug.log(
                "Showing thumb: "
                  .concat(r, ". num: ")
                  .concat(a, ". qual: ")
                  .concat(n, ". newimg: ")
                  .concat(o)
              ),
                i.setImageSizeAndOffset(e, t),
                o &&
                  (i.currentImageContainer.appendChild(e),
                  (i.currentImageElement = e),
                  i.loadedImages.includes(r) || i.loadedImages.push(r)),
                i
                  .preloadNearby(a, !0)
                  .then(i.preloadNearby(a, !1))
                  .then(i.getHigherQuality(n, e, t, r));
            }),
            a(this, "removeOldImages", function (e) {
              Array.from(i.currentImageContainer.children).forEach(function (
                t
              ) {
                if ("img" === t.tagName.toLowerCase()) {
                  var n = i.usingSprites ? 500 : 1e3;
                  if (
                    t.dataset.index !== e.dataset.index &&
                    !t.dataset.deleting
                  ) {
                    t.dataset.deleting = !0;
                    var a = i.currentImageContainer;
                    setTimeout(function () {
                      a.removeChild(t),
                        i.player.debug.log(
                          "Removing thumb: ".concat(t.dataset.filename)
                        );
                    }, n);
                  }
                }
              });
            }),
            a(this, "preloadNearby", function (e) {
              var t =
                !(arguments.length > 1 && void 0 !== arguments[1]) ||
                arguments[1];
              return new Promise(function (n) {
                setTimeout(function () {
                  var a = i.thumbnails[0].frames[e].text;
                  if (i.showingThumbFilename === a) {
                    var r;
                    r = t
                      ? i.thumbnails[0].frames.slice(e)
                      : i.thumbnails[0].frames.slice(0, e).reverse();
                    var o = !1;
                    r.forEach(function (e) {
                      var t = e.text;
                      if (t !== a && !i.loadedImages.includes(t)) {
                        (o = !0),
                          i.player.debug.log(
                            "Preloading thumb filename: ".concat(t)
                          );
                        var r = i.thumbnails[0].urlPrefix + t,
                          s = new Image();
                        (s.src = r),
                          (s.onload = function () {
                            i.player.debug.log(
                              "Preloaded thumb filename: ".concat(t)
                            ),
                              i.loadedImages.includes(t) ||
                                i.loadedImages.push(t),
                              n();
                          });
                      }
                    }),
                      o || n();
                  }
                }, 300);
              });
            }),
            a(this, "getHigherQuality", function (e, t, n, a) {
              if (e < i.thumbnails.length - 1) {
                var r = t.naturalHeight;
                i.usingSprites && (r = n.h),
                  r < i.thumbContainerHeight &&
                    setTimeout(function () {
                      i.showingThumbFilename === a &&
                        (i.player.debug.log(
                          "Showing higher quality thumb for: ".concat(a)
                        ),
                        i.loadImage(e + 1));
                    }, 300);
              }
            }),
            a(this, "toggleThumbContainer", function () {
              var e =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0],
                t =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1],
                n =
                  i.player.config.classNames.previewThumbnails
                    .thumbContainerShown;
              i.elements.thumb.container.classList.toggle(n, e),
                !e &&
                  t &&
                  ((i.showingThumb = null), (i.showingThumbFilename = null));
            }),
            a(this, "toggleScrubbingContainer", function () {
              var e =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0],
                t =
                  i.player.config.classNames.previewThumbnails
                    .scrubbingContainerShown;
              i.elements.scrubbing.container.classList.toggle(t, e),
                e || ((i.showingThumb = null), (i.showingThumbFilename = null));
            }),
            a(this, "determineContainerAutoSizing", function () {
              (i.elements.thumb.imageContainer.clientHeight > 20 ||
                i.elements.thumb.imageContainer.clientWidth > 20) &&
                (i.sizeSpecifiedInCSS = !0);
            }),
            a(this, "setThumbContainerSizeAndPos", function () {
              if (i.sizeSpecifiedInCSS) {
                if (
                  i.elements.thumb.imageContainer.clientHeight > 20 &&
                  i.elements.thumb.imageContainer.clientWidth < 20
                ) {
                  var e = Math.floor(
                    i.elements.thumb.imageContainer.clientHeight *
                      i.thumbAspectRatio
                  );
                  i.elements.thumb.imageContainer.style.width = "".concat(
                    e,
                    "px"
                  );
                } else if (
                  i.elements.thumb.imageContainer.clientHeight < 20 &&
                  i.elements.thumb.imageContainer.clientWidth > 20
                ) {
                  var t = Math.floor(
                    i.elements.thumb.imageContainer.clientWidth /
                      i.thumbAspectRatio
                  );
                  i.elements.thumb.imageContainer.style.height = "".concat(
                    t,
                    "px"
                  );
                }
              } else {
                var n = Math.floor(i.thumbContainerHeight * i.thumbAspectRatio);
                (i.elements.thumb.imageContainer.style.height = "".concat(
                  i.thumbContainerHeight,
                  "px"
                )),
                  (i.elements.thumb.imageContainer.style.width = "".concat(
                    n,
                    "px"
                  ));
              }
              i.setThumbContainerPos();
            }),
            a(this, "setThumbContainerPos", function () {
              var e = i.player.elements.progress.getBoundingClientRect(),
                t = i.player.elements.container.getBoundingClientRect(),
                n = i.elements.thumb.container,
                a = t.left - e.left + 10,
                r = t.right - e.left - n.clientWidth - 10,
                o = i.mousePosX - e.left - n.clientWidth / 2;
              o < a && (o = a),
                o > r && (o = r),
                (n.style.left = "".concat(o, "px"));
            }),
            a(this, "setScrubbingContainerSize", function () {
              var e = Mt(i.thumbAspectRatio, {
                  width: i.player.media.clientWidth,
                  height: i.player.media.clientHeight,
                }),
                t = e.width,
                n = e.height;
              (i.elements.scrubbing.container.style.width = "".concat(t, "px")),
                (i.elements.scrubbing.container.style.height = "".concat(
                  n,
                  "px"
                ));
            }),
            a(this, "setImageSizeAndOffset", function (e, t) {
              if (i.usingSprites) {
                var n = i.thumbContainerHeight / t.h;
                (e.style.height = "".concat(e.naturalHeight * n, "px")),
                  (e.style.width = "".concat(e.naturalWidth * n, "px")),
                  (e.style.left = "-".concat(t.x * n, "px")),
                  (e.style.top = "-".concat(t.y * n, "px"));
              }
            }),
            (this.player = n),
            (this.thumbnails = []),
            (this.loaded = !1),
            (this.lastMouseMoveTime = Date.now()),
            (this.mouseDown = !1),
            (this.loadedImages = []),
            (this.elements = { thumb: {}, scrubbing: {} }),
            this.load();
        }
        return (
          i(e, [
            {
              key: "enabled",
              get: function () {
                return (
                  this.player.isHTML5 &&
                  this.player.isVideo &&
                  this.player.config.previewThumbnails.enabled
                );
              },
            },
            {
              key: "currentImageContainer",
              get: function () {
                return this.mouseDown
                  ? this.elements.scrubbing.container
                  : this.elements.thumb.imageContainer;
              },
            },
            {
              key: "usingSprites",
              get: function () {
                return Object.keys(this.thumbnails[0].frames[0]).includes("w");
              },
            },
            {
              key: "thumbAspectRatio",
              get: function () {
                return this.usingSprites
                  ? this.thumbnails[0].frames[0].w /
                      this.thumbnails[0].frames[0].h
                  : this.thumbnails[0].width / this.thumbnails[0].height;
              },
            },
            {
              key: "thumbContainerHeight",
              get: function () {
                return this.mouseDown
                  ? Mt(this.thumbAspectRatio, {
                      width: this.player.media.clientWidth,
                      height: this.player.media.clientHeight,
                    }).height
                  : this.sizeSpecifiedInCSS
                  ? this.elements.thumb.imageContainer.clientHeight
                  : Math.floor(
                      this.player.media.clientWidth / this.thumbAspectRatio / 4
                    );
              },
            },
            {
              key: "currentImageElement",
              get: function () {
                return this.mouseDown
                  ? this.currentScrubbingImageElement
                  : this.currentThumbnailImageElement;
              },
              set: function (e) {
                this.mouseDown
                  ? (this.currentScrubbingImageElement = e)
                  : (this.currentThumbnailImageElement = e);
              },
            },
          ]),
          e
        );
      })(),
      It = {
        insertElements: function (e, t) {
          var n = this;
          Q(t)
            ? pe(e, this.media, { src: t })
            : J(t) &&
              t.forEach(function (t) {
                pe(e, n.media, t);
              });
        },
        change: function (e) {
          var t = this;
          ce(e, "sources.length")
            ? (Be.cancelRequests.call(this),
              this.destroy.call(
                this,
                function () {
                  (t.options.quality = []),
                    fe(t.media),
                    (t.media = null),
                    Z(t.elements.container) &&
                      t.elements.container.removeAttribute("class");
                  var n = e.sources,
                    i = e.type,
                    a = l(n, 1)[0],
                    r = a.provider,
                    o = void 0 === r ? dt.html5 : r,
                    s = a.src,
                    c = "html5" === o ? i : "div",
                    u = "html5" === o ? {} : { src: s };
                  Object.assign(t, {
                    provider: o,
                    type: i,
                    supported: Ne.check(i, o, t.config.playsinline),
                    media: me(c, u),
                  }),
                    t.elements.container.appendChild(t.media),
                    X(e.autoplay) && (t.config.autoplay = e.autoplay),
                    t.isHTML5 &&
                      (t.config.crossorigin &&
                        t.media.setAttribute("crossorigin", ""),
                      t.config.autoplay && t.media.setAttribute("autoplay", ""),
                      re(e.poster) || (t.poster = e.poster),
                      t.config.loop.active && t.media.setAttribute("loop", ""),
                      t.config.muted && t.media.setAttribute("muted", ""),
                      t.config.playsinline &&
                        t.media.setAttribute("playsinline", "")),
                    bt.addStyleHook.call(t),
                    t.isHTML5 && It.insertElements.call(t, "source", n),
                    (t.config.title = e.title),
                    Et.setup.call(t),
                    t.isHTML5 &&
                      Object.keys(e).includes("tracks") &&
                      It.insertElements.call(t, "track", e.tracks),
                    (t.isHTML5 || (t.isEmbed && !t.supported.ui)) &&
                      bt.build.call(t),
                    t.isHTML5 && t.media.load(),
                    re(e.previewThumbnails) ||
                      (Object.assign(
                        t.config.previewThumbnails,
                        e.previewThumbnails
                      ),
                      t.previewThumbnails &&
                        t.previewThumbnails.loaded &&
                        (t.previewThumbnails.destroy(),
                        (t.previewThumbnails = null)),
                      t.config.previewThumbnails.enabled &&
                        (t.previewThumbnails = new xt(t))),
                    t.fullscreen.update();
                },
                !0
              ))
            : this.debug.warn("Invalid source format");
        },
      };
    var Lt,
      Ot = (function () {
        function e(n, i) {
          var r = this;
          if (
            (t(this, e),
            a(this, "play", function () {
              return $(r.media.play)
                ? (r.ads &&
                    r.ads.enabled &&
                    r.ads.managerPromise
                      .then(function () {
                        return r.ads.play();
                      })
                      .catch(function () {
                        return qe(r.media.play());
                      }),
                  r.media.play())
                : null;
            }),
            a(this, "pause", function () {
              return r.playing && $(r.media.pause) ? r.media.pause() : null;
            }),
            a(this, "togglePlay", function (e) {
              return (X(e) ? e : !r.playing) ? r.play() : r.pause();
            }),
            a(this, "stop", function () {
              r.isHTML5
                ? (r.pause(), r.restart())
                : $(r.media.stop) && r.media.stop();
            }),
            a(this, "restart", function () {
              r.currentTime = 0;
            }),
            a(this, "rewind", function (e) {
              r.currentTime -= Y(e) ? e : r.config.seekTime;
            }),
            a(this, "forward", function (e) {
              r.currentTime += Y(e) ? e : r.config.seekTime;
            }),
            a(this, "increaseVolume", function (e) {
              var t = r.media.muted ? 0 : r.volume;
              r.volume = t + (Y(e) ? e : 0);
            }),
            a(this, "decreaseVolume", function (e) {
              r.increaseVolume(-e);
            }),
            a(this, "airplay", function () {
              Ne.airplay && r.media.webkitShowPlaybackTargetPicker();
            }),
            a(this, "toggleControls", function (e) {
              if (r.supported.ui && !r.isAudio) {
                var t = ke(
                    r.elements.container,
                    r.config.classNames.hideControls
                  ),
                  n = void 0 === e ? void 0 : !e,
                  i = we(
                    r.elements.container,
                    r.config.classNames.hideControls,
                    n
                  );
                if (
                  (i &&
                    J(r.config.controls) &&
                    r.config.controls.includes("settings") &&
                    !re(r.config.settings) &&
                    at.toggleMenu.call(r, !1),
                  i !== t)
                ) {
                  var a = i ? "controlshidden" : "controlsshown";
                  _e.call(r, r.media, a);
                }
                return !i;
              }
              return !1;
            }),
            a(this, "on", function (e, t) {
              Ie.call(r, r.elements.container, e, t);
            }),
            a(this, "once", function (e, t) {
              Oe.call(r, r.elements.container, e, t);
            }),
            a(this, "off", function (e, t) {
              Le(r.elements.container, e, t);
            }),
            a(this, "destroy", function (e) {
              var t =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
              if (r.ready) {
                var n = function () {
                  (document.body.style.overflow = ""),
                    (r.embed = null),
                    t
                      ? (Object.keys(r.elements).length &&
                          (fe(r.elements.buttons.play),
                          fe(r.elements.captions),
                          fe(r.elements.controls),
                          fe(r.elements.wrapper),
                          (r.elements.buttons.play = null),
                          (r.elements.captions = null),
                          (r.elements.controls = null),
                          (r.elements.wrapper = null)),
                        $(e) && e())
                      : (je.call(r),
                        Be.cancelRequests.call(r),
                        ye(r.elements.original, r.elements.container),
                        _e.call(r, r.elements.original, "destroyed", !0),
                        $(e) && e.call(r.elements.original),
                        (r.ready = !1),
                        setTimeout(function () {
                          (r.elements = null), (r.media = null);
                        }, 200));
                };
                r.stop(),
                  clearTimeout(r.timers.loading),
                  clearTimeout(r.timers.controls),
                  clearTimeout(r.timers.resized),
                  r.isHTML5
                    ? (bt.toggleNativeControls.call(r, !0), n())
                    : r.isYouTube
                    ? (clearInterval(r.timers.buffering),
                      clearInterval(r.timers.playing),
                      null !== r.embed &&
                        $(r.embed.destroy) &&
                        r.embed.destroy(),
                      n())
                    : r.isVimeo &&
                      (null !== r.embed && r.embed.unload().then(n),
                      setTimeout(n, 200));
              }
            }),
            a(this, "supports", function (e) {
              return Ne.mime.call(r, e);
            }),
            (this.timers = {}),
            (this.ready = !1),
            (this.loading = !1),
            (this.failed = !1),
            (this.touch = Ne.touch),
            (this.media = n),
            Q(this.media) &&
              (this.media = document.querySelectorAll(this.media)),
            ((window.jQuery && this.media instanceof jQuery) ||
              G(this.media) ||
              J(this.media)) &&
              (this.media = this.media[0]),
            (this.config = ue(
              {},
              lt,
              e.defaults,
              i || {},
              (function () {
                try {
                  return JSON.parse(r.media.getAttribute("data-plyr-config"));
                } catch (e) {
                  return {};
                }
              })()
            )),
            (this.elements = {
              container: null,
              fullscreen: null,
              captions: null,
              buttons: {},
              display: {},
              progress: {},
              inputs: {},
              settings: { popup: null, menu: null, panels: {}, buttons: {} },
            }),
            (this.captions = {
              active: null,
              currentTrack: -1,
              meta: new WeakMap(),
            }),
            (this.fullscreen = { active: !1 }),
            (this.options = { speed: [], quality: [] }),
            (this.debug = new ft(this.config.debug)),
            this.debug.log("Config", this.config),
            this.debug.log("Support", Ne),
            !z(this.media) && Z(this.media))
          )
            if (this.media.plyr) this.debug.warn("Target already setup");
            else if (this.config.enabled)
              if (Ne.check().api) {
                var o = this.media.cloneNode(!0);
                (o.autoplay = !1), (this.elements.original = o);
                var s = this.media.tagName.toLowerCase(),
                  l = null,
                  c = null;
                switch (s) {
                  case "div":
                    if (((l = this.media.querySelector("iframe")), Z(l))) {
                      if (
                        ((c = rt(l.getAttribute("src"))),
                        (this.provider = (function (e) {
                          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
                            e
                          )
                            ? dt.youtube
                            : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(
                                e
                              )
                            ? dt.vimeo
                            : null;
                        })(c.toString())),
                        (this.elements.container = this.media),
                        (this.media = l),
                        (this.elements.container.className = ""),
                        c.search.length)
                      ) {
                        var u = ["1", "true"];
                        u.includes(c.searchParams.get("autoplay")) &&
                          (this.config.autoplay = !0),
                          u.includes(c.searchParams.get("loop")) &&
                            (this.config.loop.active = !0),
                          this.isYouTube
                            ? ((this.config.playsinline = u.includes(
                                c.searchParams.get("playsinline")
                              )),
                              (this.config.youtube.hl =
                                c.searchParams.get("hl")))
                            : (this.config.playsinline = !0);
                      }
                    } else
                      (this.provider = this.media.getAttribute(
                        this.config.attributes.embed.provider
                      )),
                        this.media.removeAttribute(
                          this.config.attributes.embed.provider
                        );
                    if (
                      re(this.provider) ||
                      !Object.values(dt).includes(this.provider)
                    )
                      return void this.debug.error(
                        "Setup failed: Invalid provider"
                      );
                    this.type = mt;
                    break;
                  case "video":
                  case "audio":
                    (this.type = s),
                      (this.provider = dt.html5),
                      this.media.hasAttribute("crossorigin") &&
                        (this.config.crossorigin = !0),
                      this.media.hasAttribute("autoplay") &&
                        (this.config.autoplay = !0),
                      (this.media.hasAttribute("playsinline") ||
                        this.media.hasAttribute("webkit-playsinline")) &&
                        (this.config.playsinline = !0),
                      this.media.hasAttribute("muted") &&
                        (this.config.muted = !0),
                      this.media.hasAttribute("loop") &&
                        (this.config.loop.active = !0);
                    break;
                  default:
                    return void this.debug.error(
                      "Setup failed: unsupported type"
                    );
                }
                (this.supported = Ne.check(
                  this.type,
                  this.provider,
                  this.config.playsinline
                )),
                  this.supported.api
                    ? ((this.eventListeners = []),
                      (this.listeners = new vt(this)),
                      (this.storage = new Je(this)),
                      (this.media.plyr = this),
                      Z(this.elements.container) ||
                        ((this.elements.container = me("div", { tabindex: 0 })),
                        de(this.media, this.elements.container)),
                      bt.migrateStyles.call(this),
                      bt.addStyleHook.call(this),
                      Et.setup.call(this),
                      this.config.debug &&
                        Ie.call(
                          this,
                          this.elements.container,
                          this.config.events.join(" "),
                          function (e) {
                            r.debug.log("event: ".concat(e.type));
                          }
                        ),
                      (this.fullscreen = new gt(this)),
                      (this.isHTML5 || (this.isEmbed && !this.supported.ui)) &&
                        bt.build.call(this),
                      this.listeners.container(),
                      this.listeners.global(),
                      this.config.ads.enabled && (this.ads = new Nt(this)),
                      this.isHTML5 &&
                        this.config.autoplay &&
                        this.once("canplay", function () {
                          return qe(r.play());
                        }),
                      (this.lastSeekTime = 0),
                      this.config.previewThumbnails.enabled &&
                        (this.previewThumbnails = new xt(this)))
                    : this.debug.error("Setup failed: no support");
              } else this.debug.error("Setup failed: no support");
            else this.debug.error("Setup failed: disabled by config");
          else this.debug.error("Setup failed: no suitable element passed");
        }
        return (
          i(
            e,
            [
              {
                key: "toggleCaptions",
                value: function (e) {
                  st.toggle.call(this, e, !1);
                },
              },
              {
                key: "isHTML5",
                get: function () {
                  return this.provider === dt.html5;
                },
              },
              {
                key: "isEmbed",
                get: function () {
                  return this.isYouTube || this.isVimeo;
                },
              },
              {
                key: "isYouTube",
                get: function () {
                  return this.provider === dt.youtube;
                },
              },
              {
                key: "isVimeo",
                get: function () {
                  return this.provider === dt.vimeo;
                },
              },
              {
                key: "isVideo",
                get: function () {
                  return this.type === mt;
                },
              },
              {
                key: "isAudio",
                get: function () {
                  return this.type === ht;
                },
              },
              {
                key: "playing",
                get: function () {
                  return Boolean(this.ready && !this.paused && !this.ended);
                },
              },
              {
                key: "paused",
                get: function () {
                  return Boolean(this.media.paused);
                },
              },
              {
                key: "stopped",
                get: function () {
                  return Boolean(this.paused && 0 === this.currentTime);
                },
              },
              {
                key: "ended",
                get: function () {
                  return Boolean(this.media.ended);
                },
              },
              {
                key: "currentTime",
                set: function (e) {
                  if (this.duration) {
                    var t = Y(e) && e > 0;
                    (this.media.currentTime = t
                      ? Math.min(e, this.duration)
                      : 0),
                      this.debug.log(
                        "Seeking to ".concat(this.currentTime, " seconds")
                      );
                  }
                },
                get: function () {
                  return Number(this.media.currentTime);
                },
              },
              {
                key: "buffered",
                get: function () {
                  var e = this.media.buffered;
                  return Y(e)
                    ? e
                    : e && e.length && this.duration > 0
                    ? e.end(0) / this.duration
                    : 0;
                },
              },
              {
                key: "seeking",
                get: function () {
                  return Boolean(this.media.seeking);
                },
              },
              {
                key: "duration",
                get: function () {
                  var e = parseFloat(this.config.duration),
                    t = (this.media || {}).duration,
                    n = Y(t) && t !== 1 / 0 ? t : 0;
                  return e || n;
                },
              },
              {
                key: "volume",
                set: function (e) {
                  var t = e;
                  Q(t) && (t = Number(t)),
                    Y(t) || (t = this.storage.get("volume")),
                    Y(t) || (t = this.config.volume),
                    t > 1 && (t = 1),
                    t < 0 && (t = 0),
                    (this.config.volume = t),
                    (this.media.volume = t),
                    !re(e) && this.muted && t > 0 && (this.muted = !1);
                },
                get: function () {
                  return Number(this.media.volume);
                },
              },
              {
                key: "muted",
                set: function (e) {
                  var t = e;
                  X(t) || (t = this.storage.get("muted")),
                    X(t) || (t = this.config.muted),
                    (this.config.muted = t),
                    (this.media.muted = t);
                },
                get: function () {
                  return Boolean(this.media.muted);
                },
              },
              {
                key: "hasAudio",
                get: function () {
                  return (
                    !this.isHTML5 ||
                    !!this.isAudio ||
                    Boolean(this.media.mozHasAudio) ||
                    Boolean(this.media.webkitAudioDecodedByteCount) ||
                    Boolean(
                      this.media.audioTracks && this.media.audioTracks.length
                    )
                  );
                },
              },
              {
                key: "speed",
                set: function (e) {
                  var t = this,
                    n = null;
                  Y(e) && (n = e),
                    Y(n) || (n = this.storage.get("speed")),
                    Y(n) || (n = this.config.speed.selected);
                  var i = this.minimumSpeed,
                    a = this.maximumSpeed;
                  (n = (function () {
                    var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : 0,
                      t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : 0,
                      n =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : 255;
                    return Math.min(Math.max(e, t), n);
                  })(n, i, a)),
                    (this.config.speed.selected = n),
                    setTimeout(function () {
                      t.media.playbackRate = n;
                    }, 0);
                },
                get: function () {
                  return Number(this.media.playbackRate);
                },
              },
              {
                key: "minimumSpeed",
                get: function () {
                  return this.isYouTube
                    ? Math.min.apply(Math, c(this.options.speed))
                    : this.isVimeo
                    ? 0.5
                    : 0.0625;
                },
              },
              {
                key: "maximumSpeed",
                get: function () {
                  return this.isYouTube
                    ? Math.max.apply(Math, c(this.options.speed))
                    : this.isVimeo
                    ? 2
                    : 16;
                },
              },
              {
                key: "quality",
                set: function (e) {
                  var t = this.config.quality,
                    n = this.options.quality;
                  if (n.length) {
                    var i = [
                        !re(e) && Number(e),
                        this.storage.get("quality"),
                        t.selected,
                        t.default,
                      ].find(Y),
                      a = !0;
                    if (!n.includes(i)) {
                      var r = (function (e, t) {
                        return J(e) && e.length
                          ? e.reduce(function (e, n) {
                              return Math.abs(n - t) < Math.abs(e - t) ? n : e;
                            })
                          : null;
                      })(n, i);
                      this.debug.warn(
                        "Unsupported quality option: "
                          .concat(i, ", using ")
                          .concat(r, " instead")
                      ),
                        (i = r),
                        (a = !1);
                    }
                    (t.selected = i),
                      (this.media.quality = i),
                      a && this.storage.set({ quality: i });
                  }
                },
                get: function () {
                  return this.media.quality;
                },
              },
              {
                key: "loop",
                set: function (e) {
                  var t = X(e) ? e : this.config.loop.active;
                  (this.config.loop.active = t), (this.media.loop = t);
                },
                get: function () {
                  return Boolean(this.media.loop);
                },
              },
              {
                key: "source",
                set: function (e) {
                  It.change.call(this, e);
                },
                get: function () {
                  return this.media.currentSrc;
                },
              },
              {
                key: "download",
                get: function () {
                  var e = this.config.urls.download;
                  return ae(e) ? e : this.source;
                },
                set: function (e) {
                  ae(e) &&
                    ((this.config.urls.download = e),
                    at.setDownloadUrl.call(this));
                },
              },
              {
                key: "poster",
                set: function (e) {
                  this.isVideo
                    ? bt.setPoster.call(this, e, !1).catch(function () {})
                    : this.debug.warn("Poster can only be set for video");
                },
                get: function () {
                  return this.isVideo
                    ? this.media.getAttribute("poster") ||
                        this.media.getAttribute("data-poster")
                    : null;
                },
              },
              {
                key: "ratio",
                get: function () {
                  if (!this.isVideo) return null;
                  var e = Fe(Re.call(this));
                  return J(e) ? e.join(":") : e;
                },
                set: function (e) {
                  this.isVideo
                    ? Q(e) && He(e)
                      ? ((this.config.ratio = e), Ve.call(this))
                      : this.debug.error(
                          "Invalid aspect ratio specified (".concat(e, ")")
                        )
                    : this.debug.warn("Aspect ratio can only be set for video");
                },
              },
              {
                key: "autoplay",
                set: function (e) {
                  var t = X(e) ? e : this.config.autoplay;
                  this.config.autoplay = t;
                },
                get: function () {
                  return Boolean(this.config.autoplay);
                },
              },
              {
                key: "currentTrack",
                set: function (e) {
                  st.set.call(this, e, !1);
                },
                get: function () {
                  var e = this.captions,
                    t = e.toggled,
                    n = e.currentTrack;
                  return t ? n : -1;
                },
              },
              {
                key: "language",
                set: function (e) {
                  st.setLanguage.call(this, e, !1);
                },
                get: function () {
                  return (st.getCurrentTrack.call(this) || {}).language;
                },
              },
              {
                key: "pip",
                set: function (e) {
                  if (Ne.pip) {
                    var t = X(e) ? e : !this.pip;
                    $(this.media.webkitSetPresentationMode) &&
                      this.media.webkitSetPresentationMode(t ? ct : ut),
                      $(this.media.requestPictureInPicture) &&
                        (!this.pip && t
                          ? this.media.requestPictureInPicture()
                          : this.pip && !t && document.exitPictureInPicture());
                  }
                },
                get: function () {
                  return Ne.pip
                    ? re(this.media.webkitPresentationMode)
                      ? this.media === document.pictureInPictureElement
                      : this.media.webkitPresentationMode === ct
                    : null;
                },
              },
            ],
            [
              {
                key: "supported",
                value: function (e, t, n) {
                  return Ne.check(e, t, n);
                },
              },
              {
                key: "loadSprite",
                value: function (e, t) {
                  return Ze(e, t);
                },
              },
              {
                key: "setup",
                value: function (t) {
                  var n =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : {},
                    i = null;
                  return (
                    Q(t)
                      ? (i = Array.from(document.querySelectorAll(t)))
                      : G(t)
                      ? (i = Array.from(t))
                      : J(t) && (i = t.filter(Z)),
                    re(i)
                      ? null
                      : i.map(function (t) {
                          return new e(t, n);
                        })
                  );
                },
              },
            ]
          ),
          e
        );
      })();
    return (Ot.defaults = ((Lt = lt), JSON.parse(JSON.stringify(Lt)))), Ot;
  });
/*-----------------------------------------------------------------------------------*/
/*	07. LIGHTGALLERY
/*-----------------------------------------------------------------------------------*/
/*! lightgallery - v1.6.12 - 2019-02-19
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2019 Sachin N; Licensed GPLv3 */
!(function (a, b) {
  "function" == typeof define && define.amd
    ? define(["jquery"], function (a) {
        return b(a);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = b(require("jquery")))
    : b(a.jQuery);
})(this, function (a) {
  !(function () {
    "use strict";
    function b(b, d) {
      if (
        ((this.el = b),
        (this.$el = a(b)),
        (this.s = a.extend({}, c, d)),
        this.s.dynamic &&
          "undefined" !== this.s.dynamicEl &&
          this.s.dynamicEl.constructor === Array &&
          !this.s.dynamicEl.length)
      )
        throw "When using dynamic mode, you must also define dynamicEl as an Array.";
      return (
        (this.modules = {}),
        (this.lGalleryOn = !1),
        (this.lgBusy = !1),
        (this.hideBartimeout = !1),
        (this.isTouch = "ontouchstart" in document.documentElement),
        this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1),
        this.s.dynamic
          ? (this.$items = this.s.dynamicEl)
          : "this" === this.s.selector
          ? (this.$items = this.$el)
          : "" !== this.s.selector
          ? this.s.selectWithin
            ? (this.$items = a(this.s.selectWithin).find(this.s.selector))
            : (this.$items = this.$el.find(a(this.s.selector)))
          : (this.$items = this.$el.children()),
        (this.$slide = ""),
        (this.$outer = ""),
        this.init(),
        this
      );
    }
    var c = {
      mode: "lg-slide",
      cssEasing: "ease",
      easing: "linear",
      speed: 600,
      height: "100%",
      width: "100%",
      addClass: "",
      startClass: "lg-start-zoom",
      backdropDuration: 150,
      hideBarsDelay: 6e3,
      useLeft: !1,
      closable: !0,
      loop: !0,
      escKey: !0,
      keyPress: !0,
      controls: !0,
      slideEndAnimatoin: !0,
      hideControlOnEnd: !1,
      mousewheel: !0,
      getCaptionFromTitleOrAlt: !0,
      appendSubHtmlTo: ".lg-sub-html",
      subHtmlSelectorRelative: !1,
      preload: 1,
      showAfterLoad: !0,
      selector: "",
      selectWithin: "",
      nextHtml: "",
      prevHtml: "",
      index: !1,
      iframeMaxWidth: "100%",
      download: !0,
      counter: !0,
      appendCounterTo: ".lg-toolbar",
      swipeThreshold: 50,
      enableSwipe: !0,
      enableDrag: !0,
      dynamic: !1,
      dynamicEl: [],
      galleryId: 1,
    };
    (b.prototype.init = function () {
      var b = this;
      b.s.preload > b.$items.length && (b.s.preload = b.$items.length);
      var c = window.location.hash;
      c.indexOf("lg=" + this.s.galleryId) > 0 &&
        ((b.index = parseInt(c.split("&slide=")[1], 10)),
        a("body").addClass("lg-from-hash"),
        a("body").hasClass("lg-on") ||
          (setTimeout(function () {
            b.build(b.index);
          }),
          a("body").addClass("lg-on"))),
        b.s.dynamic
          ? (b.$el.trigger("onBeforeOpen.lg"),
            (b.index = b.s.index || 0),
            a("body").hasClass("lg-on") ||
              setTimeout(function () {
                b.build(b.index), a("body").addClass("lg-on");
              }))
          : b.$items.on("click.lgcustom", function (c) {
              try {
                c.preventDefault(), c.preventDefault();
              } catch (a) {
                c.returnValue = !1;
              }
              b.$el.trigger("onBeforeOpen.lg"),
                (b.index = b.s.index || b.$items.index(this)),
                a("body").hasClass("lg-on") ||
                  (b.build(b.index), a("body").addClass("lg-on"));
            });
    }),
      (b.prototype.build = function (b) {
        var c = this;
        c.structure(),
          a.each(a.fn.lightGallery.modules, function (b) {
            c.modules[b] = new a.fn.lightGallery.modules[b](c.el);
          }),
          c.slide(b, !1, !1, !1),
          c.s.keyPress && c.keyPress(),
          c.$items.length > 1
            ? (c.arrow(),
              setTimeout(function () {
                c.enableDrag(), c.enableSwipe();
              }, 50),
              c.s.mousewheel && c.mousewheel())
            : c.$slide.on("click.lg", function () {
                c.$el.trigger("onSlideClick.lg");
              }),
          c.counter(),
          c.closeGallery(),
          c.$el.trigger("onAfterOpen.lg"),
          c.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
            c.$outer.removeClass("lg-hide-items"),
              clearTimeout(c.hideBartimeout),
              (c.hideBartimeout = setTimeout(function () {
                c.$outer.addClass("lg-hide-items");
              }, c.s.hideBarsDelay));
          }),
          c.$outer.trigger("mousemove.lg");
      }),
      (b.prototype.structure = function () {
        var b,
          c = "",
          d = "",
          e = 0,
          f = "",
          g = this;
        for (
          a("body").append('<div class="lg-backdrop"></div>'),
            a(".lg-backdrop").css(
              "transition-duration",
              this.s.backdropDuration + "ms"
            ),
            e = 0;
          e < this.$items.length;
          e++
        )
          c += '<div class="lg-item"></div>';
        if (
          (this.s.controls &&
            this.$items.length > 1 &&
            (d =
              '<div class="lg-actions"><button class="lg-prev lg-icon">' +
              this.s.prevHtml +
              '</button><button class="lg-next lg-icon">' +
              this.s.nextHtml +
              "</button></div>"),
          ".lg-sub-html" === this.s.appendSubHtmlTo &&
            (f = '<div class="lg-sub-html"></div>'),
          (b =
            '<div class="lg-outer ' +
            this.s.addClass +
            " " +
            this.s.startClass +
            '"><div class="lg" style="width:' +
            this.s.width +
            "; height:" +
            this.s.height +
            '"><div class="lg-inner">' +
            c +
            '</div><div class="lg-toolbar lg-group"><span class="lg-close lg-icon"></span></div>' +
            d +
            f +
            "</div></div>"),
          a("body").append(b),
          (this.$outer = a(".lg-outer")),
          (this.$slide = this.$outer.find(".lg-item")),
          this.s.useLeft
            ? (this.$outer.addClass("lg-use-left"), (this.s.mode = "lg-slide"))
            : this.$outer.addClass("lg-use-css3"),
          g.setTop(),
          a(window).on("resize.lg orientationchange.lg", function () {
            setTimeout(function () {
              g.setTop();
            }, 100);
          }),
          this.$slide.eq(this.index).addClass("lg-current"),
          this.doCss()
            ? this.$outer.addClass("lg-css3")
            : (this.$outer.addClass("lg-css"), (this.s.speed = 0)),
          this.$outer.addClass(this.s.mode),
          this.s.enableDrag &&
            this.$items.length > 1 &&
            this.$outer.addClass("lg-grab"),
          this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"),
          this.doCss())
        ) {
          var h = this.$outer.find(".lg-inner");
          h.css("transition-timing-function", this.s.cssEasing),
            h.css("transition-duration", this.s.speed + "ms");
        }
        setTimeout(function () {
          a(".lg-backdrop").addClass("in");
        }),
          setTimeout(function () {
            g.$outer.addClass("lg-visible");
          }, this.s.backdropDuration),
          this.s.download &&
            this.$outer
              .find(".lg-toolbar")
              .append(
                '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'
              ),
          (this.prevScrollTop = a(window).scrollTop());
      }),
      (b.prototype.setTop = function () {
        if ("100%" !== this.s.height) {
          var b = a(window).height(),
            c = (b - parseInt(this.s.height, 10)) / 2,
            d = this.$outer.find(".lg");
          b >= parseInt(this.s.height, 10)
            ? d.css("top", c + "px")
            : d.css("top", "0px");
        }
      }),
      (b.prototype.doCss = function () {
        return !!(function () {
          var a = [
              "transition",
              "MozTransition",
              "WebkitTransition",
              "OTransition",
              "msTransition",
              "KhtmlTransition",
            ],
            b = document.documentElement,
            c = 0;
          for (c = 0; c < a.length; c++) if (a[c] in b.style) return !0;
        })();
      }),
      (b.prototype.isVideo = function (a, b) {
        var c;
        if (
          ((c = this.s.dynamic
            ? this.s.dynamicEl[b].html
            : this.$items.eq(b).attr("data-html")),
          !a)
        )
          return c
            ? { html5: !0 }
            : (console.error(
                "lightGallery :- data-src is not pvovided on slide item " +
                  (b + 1) +
                  ". Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html"
              ),
              !1);
        var d = a.match(
            /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i
          ),
          e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
          f = a.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
          g = a.match(
            /\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i
          );
        return d
          ? { youtube: d }
          : e
          ? { vimeo: e }
          : f
          ? { dailymotion: f }
          : g
          ? { vk: g }
          : void 0;
      }),
      (b.prototype.counter = function () {
        this.s.counter &&
          a(this.s.appendCounterTo).append(
            '<div id="lg-counter"><span id="lg-counter-current">' +
              (parseInt(this.index, 10) + 1) +
              '</span> / <span id="lg-counter-all">' +
              this.$items.length +
              "</span></div>"
          );
      }),
      (b.prototype.addHtml = function (b) {
        var c,
          d,
          e = null;
        if (
          (this.s.dynamic
            ? this.s.dynamicEl[b].subHtmlUrl
              ? (c = this.s.dynamicEl[b].subHtmlUrl)
              : (e = this.s.dynamicEl[b].subHtml)
            : ((d = this.$items.eq(b)),
              d.attr("data-sub-html-url")
                ? (c = d.attr("data-sub-html-url"))
                : ((e = d.attr("data-sub-html")),
                  this.s.getCaptionFromTitleOrAlt &&
                    !e &&
                    (e =
                      d.attr("title") || d.find("img").first().attr("alt")))),
          !c)
        )
          if (void 0 !== e && null !== e) {
            var f = e.substring(0, 1);
            ("." !== f && "#" !== f) ||
              (e =
                this.s.subHtmlSelectorRelative && !this.s.dynamic
                  ? d.find(e).html()
                  : a(e).html());
          } else e = "";
        ".lg-sub-html" === this.s.appendSubHtmlTo
          ? c
            ? this.$outer.find(this.s.appendSubHtmlTo).load(c)
            : this.$outer.find(this.s.appendSubHtmlTo).html(e)
          : c
          ? this.$slide.eq(b).load(c)
          : this.$slide.eq(b).append(e),
          void 0 !== e &&
            null !== e &&
            ("" === e
              ? this.$outer
                  .find(this.s.appendSubHtmlTo)
                  .addClass("lg-empty-html")
              : this.$outer
                  .find(this.s.appendSubHtmlTo)
                  .removeClass("lg-empty-html")),
          this.$el.trigger("onAfterAppendSubHtml.lg", [b]);
      }),
      (b.prototype.preload = function (a) {
        var b = 1,
          c = 1;
        for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++)
          this.loadContent(a + b, !1, 0);
        for (c = 1; c <= this.s.preload && !(a - c < 0); c++)
          this.loadContent(a - c, !1, 0);
      }),
      (b.prototype.loadContent = function (b, c, d) {
        var e,
          f,
          g,
          h,
          i,
          j,
          k = this,
          l = !1,
          m = function (b) {
            for (var c = [], d = [], e = 0; e < b.length; e++) {
              var g = b[e].split(" ");
              "" === g[0] && g.splice(0, 1), d.push(g[0]), c.push(g[1]);
            }
            for (var h = a(window).width(), i = 0; i < c.length; i++)
              if (parseInt(c[i], 10) > h) {
                f = d[i];
                break;
              }
          };
        if (k.s.dynamic) {
          if (
            (k.s.dynamicEl[b].poster &&
              ((l = !0), (g = k.s.dynamicEl[b].poster)),
            (j = k.s.dynamicEl[b].html),
            (f = k.s.dynamicEl[b].src),
            k.s.dynamicEl[b].responsive)
          ) {
            m(k.s.dynamicEl[b].responsive.split(","));
          }
          (h = k.s.dynamicEl[b].srcset), (i = k.s.dynamicEl[b].sizes);
        } else {
          if (
            (k.$items.eq(b).attr("data-poster") &&
              ((l = !0), (g = k.$items.eq(b).attr("data-poster"))),
            (j = k.$items.eq(b).attr("data-html")),
            (f =
              k.$items.eq(b).attr("href") || k.$items.eq(b).attr("data-src")),
            k.$items.eq(b).attr("data-responsive"))
          ) {
            m(k.$items.eq(b).attr("data-responsive").split(","));
          }
          (h = k.$items.eq(b).attr("data-srcset")),
            (i = k.$items.eq(b).attr("data-sizes"));
        }
        var n = !1;
        k.s.dynamic
          ? k.s.dynamicEl[b].iframe && (n = !0)
          : "true" === k.$items.eq(b).attr("data-iframe") && (n = !0);
        var o = k.isVideo(f, b);
        if (!k.$slide.eq(b).hasClass("lg-loaded")) {
          if (n)
            k.$slide
              .eq(b)
              .prepend(
                '<div class="lg-video-cont lg-has-iframe" style="max-width:' +
                  k.s.iframeMaxWidth +
                  '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' +
                  f +
                  '"  allowfullscreen="true"></iframe></div></div>'
              );
          else if (l) {
            var p = "";
            (p =
              o && o.youtube
                ? "lg-has-youtube"
                : o && o.vimeo
                ? "lg-has-vimeo"
                : "lg-has-html5"),
              k.$slide
                .eq(b)
                .prepend(
                  '<div class="lg-video-cont ' +
                    p +
                    ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' +
                    g +
                    '" /></div></div>'
                );
          } else
            o
              ? (k.$slide
                  .eq(b)
                  .prepend(
                    '<div class="lg-video-cont "><div class="lg-video"></div></div>'
                  ),
                k.$el.trigger("hasVideo.lg", [b, f, j]))
              : k.$slide
                  .eq(b)
                  .prepend(
                    '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' +
                      f +
                      '" /></div>'
                  );
          if (
            (k.$el.trigger("onAferAppendSlide.lg", [b]),
            (e = k.$slide.eq(b).find(".lg-object")),
            i && e.attr("sizes", i),
            h)
          ) {
            e.attr("srcset", h);
            try {
              picturefill({ elements: [e[0]] });
            } catch (a) {
              console.warn(
                "lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document."
              );
            }
          }
          ".lg-sub-html" !== this.s.appendSubHtmlTo && k.addHtml(b),
            k.$slide.eq(b).addClass("lg-loaded");
        }
        k.$slide
          .eq(b)
          .find(".lg-object")
          .on("load.lg error.lg", function () {
            var c = 0;
            d && !a("body").hasClass("lg-from-hash") && (c = d),
              setTimeout(function () {
                k.$slide.eq(b).addClass("lg-complete"),
                  k.$el.trigger("onSlideItemLoad.lg", [b, d || 0]);
              }, c);
          }),
          o && o.html5 && !l && k.$slide.eq(b).addClass("lg-complete"),
          !0 === c &&
            (k.$slide.eq(b).hasClass("lg-complete")
              ? k.preload(b)
              : k.$slide
                  .eq(b)
                  .find(".lg-object")
                  .on("load.lg error.lg", function () {
                    k.preload(b);
                  }));
      }),
      (b.prototype.slide = function (b, c, d, e) {
        var f = this.$outer.find(".lg-current").index(),
          g = this;
        if (!g.lGalleryOn || f !== b) {
          var h = this.$slide.length,
            i = g.lGalleryOn ? this.s.speed : 0;
          if (!g.lgBusy) {
            if (this.s.download) {
              var j;
              (j = g.s.dynamic
                ? !1 !== g.s.dynamicEl[b].downloadUrl &&
                  (g.s.dynamicEl[b].downloadUrl || g.s.dynamicEl[b].src)
                : "false" !== g.$items.eq(b).attr("data-download-url") &&
                  (g.$items.eq(b).attr("data-download-url") ||
                    g.$items.eq(b).attr("href") ||
                    g.$items.eq(b).attr("data-src"))),
                j
                  ? (a("#lg-download").attr("href", j),
                    g.$outer.removeClass("lg-hide-download"))
                  : g.$outer.addClass("lg-hide-download");
            }
            if (
              (this.$el.trigger("onBeforeSlide.lg", [f, b, c, d]),
              (g.lgBusy = !0),
              clearTimeout(g.hideBartimeout),
              ".lg-sub-html" === this.s.appendSubHtmlTo &&
                setTimeout(function () {
                  g.addHtml(b);
                }, i),
              this.arrowDisable(b),
              e || (b < f ? (e = "prev") : b > f && (e = "next")),
              c)
            ) {
              this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide");
              var k, l;
              h > 2
                ? ((k = b - 1),
                  (l = b + 1),
                  0 === b && f === h - 1
                    ? ((l = 0), (k = h - 1))
                    : b === h - 1 && 0 === f && ((l = 0), (k = h - 1)))
                : ((k = 0), (l = 1)),
                "prev" === e
                  ? g.$slide.eq(l).addClass("lg-next-slide")
                  : g.$slide.eq(k).addClass("lg-prev-slide"),
                g.$slide.eq(b).addClass("lg-current");
            } else
              g.$outer.addClass("lg-no-trans"),
                this.$slide.removeClass("lg-prev-slide lg-next-slide"),
                "prev" === e
                  ? (this.$slide.eq(b).addClass("lg-prev-slide"),
                    this.$slide.eq(f).addClass("lg-next-slide"))
                  : (this.$slide.eq(b).addClass("lg-next-slide"),
                    this.$slide.eq(f).addClass("lg-prev-slide")),
                setTimeout(function () {
                  g.$slide.removeClass("lg-current"),
                    g.$slide.eq(b).addClass("lg-current"),
                    g.$outer.removeClass("lg-no-trans");
                }, 50);
            g.lGalleryOn
              ? (setTimeout(function () {
                  g.loadContent(b, !0, 0);
                }, this.s.speed + 50),
                setTimeout(function () {
                  (g.lgBusy = !1),
                    g.$el.trigger("onAfterSlide.lg", [f, b, c, d]);
                }, this.s.speed))
              : (g.loadContent(b, !0, g.s.backdropDuration),
                (g.lgBusy = !1),
                g.$el.trigger("onAfterSlide.lg", [f, b, c, d])),
              (g.lGalleryOn = !0),
              this.s.counter && a("#lg-counter-current").text(b + 1);
          }
          g.index = b;
        }
      }),
      (b.prototype.goToNextSlide = function (a) {
        var b = this,
          c = b.s.loop;
        a && b.$slide.length < 3 && (c = !1),
          b.lgBusy ||
            (b.index + 1 < b.$slide.length
              ? (b.index++,
                b.$el.trigger("onBeforeNextSlide.lg", [b.index]),
                b.slide(b.index, a, !1, "next"))
              : c
              ? ((b.index = 0),
                b.$el.trigger("onBeforeNextSlide.lg", [b.index]),
                b.slide(b.index, a, !1, "next"))
              : b.s.slideEndAnimatoin &&
                !a &&
                (b.$outer.addClass("lg-right-end"),
                setTimeout(function () {
                  b.$outer.removeClass("lg-right-end");
                }, 400)));
      }),
      (b.prototype.goToPrevSlide = function (a) {
        var b = this,
          c = b.s.loop;
        a && b.$slide.length < 3 && (c = !1),
          b.lgBusy ||
            (b.index > 0
              ? (b.index--,
                b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]),
                b.slide(b.index, a, !1, "prev"))
              : c
              ? ((b.index = b.$items.length - 1),
                b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]),
                b.slide(b.index, a, !1, "prev"))
              : b.s.slideEndAnimatoin &&
                !a &&
                (b.$outer.addClass("lg-left-end"),
                setTimeout(function () {
                  b.$outer.removeClass("lg-left-end");
                }, 400)));
      }),
      (b.prototype.keyPress = function () {
        var b = this;
        this.$items.length > 1 &&
          a(window).on("keyup.lg", function (a) {
            b.$items.length > 1 &&
              (37 === a.keyCode && (a.preventDefault(), b.goToPrevSlide()),
              39 === a.keyCode && (a.preventDefault(), b.goToNextSlide()));
          }),
          a(window).on("keydown.lg", function (a) {
            !0 === b.s.escKey &&
              27 === a.keyCode &&
              (a.preventDefault(),
              b.$outer.hasClass("lg-thumb-open")
                ? b.$outer.removeClass("lg-thumb-open")
                : b.destroy());
          });
      }),
      (b.prototype.arrow = function () {
        var a = this;
        this.$outer.find(".lg-prev").on("click.lg", function () {
          a.goToPrevSlide();
        }),
          this.$outer.find(".lg-next").on("click.lg", function () {
            a.goToNextSlide();
          });
      }),
      (b.prototype.arrowDisable = function (a) {
        !this.s.loop &&
          this.s.hideControlOnEnd &&
          (a + 1 < this.$slide.length
            ? this.$outer
                .find(".lg-next")
                .removeAttr("disabled")
                .removeClass("disabled")
            : this.$outer
                .find(".lg-next")
                .attr("disabled", "disabled")
                .addClass("disabled"),
          a > 0
            ? this.$outer
                .find(".lg-prev")
                .removeAttr("disabled")
                .removeClass("disabled")
            : this.$outer
                .find(".lg-prev")
                .attr("disabled", "disabled")
                .addClass("disabled"));
      }),
      (b.prototype.setTranslate = function (a, b, c) {
        this.s.useLeft
          ? a.css("left", b)
          : a.css({ transform: "translate3d(" + b + "px, " + c + "px, 0px)" });
      }),
      (b.prototype.touchMove = function (b, c) {
        var d = c - b;
        Math.abs(d) > 15 &&
          (this.$outer.addClass("lg-dragging"),
          this.setTranslate(this.$slide.eq(this.index), d, 0),
          this.setTranslate(
            a(".lg-prev-slide"),
            -this.$slide.eq(this.index).width() + d,
            0
          ),
          this.setTranslate(
            a(".lg-next-slide"),
            this.$slide.eq(this.index).width() + d,
            0
          ));
      }),
      (b.prototype.touchEnd = function (a) {
        var b = this;
        "lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"),
          this.$slide
            .not(".lg-current, .lg-prev-slide, .lg-next-slide")
            .css("opacity", "0"),
          setTimeout(function () {
            b.$outer.removeClass("lg-dragging"),
              a < 0 && Math.abs(a) > b.s.swipeThreshold
                ? b.goToNextSlide(!0)
                : a > 0 && Math.abs(a) > b.s.swipeThreshold
                ? b.goToPrevSlide(!0)
                : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"),
              b.$slide.removeAttr("style");
          }),
          setTimeout(function () {
            b.$outer.hasClass("lg-dragging") ||
              "lg-slide" === b.s.mode ||
              b.$outer.removeClass("lg-slide");
          }, b.s.speed + 100);
      }),
      (b.prototype.enableSwipe = function () {
        var a = this,
          b = 0,
          c = 0,
          d = !1;
        a.s.enableSwipe &&
          a.doCss() &&
          (a.$slide.on("touchstart.lg", function (c) {
            a.$outer.hasClass("lg-zoomed") ||
              a.lgBusy ||
              (c.preventDefault(),
              a.manageSwipeClass(),
              (b = c.originalEvent.targetTouches[0].pageX));
          }),
          a.$slide.on("touchmove.lg", function (e) {
            a.$outer.hasClass("lg-zoomed") ||
              (e.preventDefault(),
              (c = e.originalEvent.targetTouches[0].pageX),
              a.touchMove(b, c),
              (d = !0));
          }),
          a.$slide.on("touchend.lg", function () {
            a.$outer.hasClass("lg-zoomed") ||
              (d
                ? ((d = !1), a.touchEnd(c - b))
                : a.$el.trigger("onSlideClick.lg"));
          }));
      }),
      (b.prototype.enableDrag = function () {
        var b = this,
          c = 0,
          d = 0,
          e = !1,
          f = !1;
        b.s.enableDrag &&
          b.doCss() &&
          (b.$slide.on("mousedown.lg", function (d) {
            b.$outer.hasClass("lg-zoomed") ||
              b.lgBusy ||
              a(d.target).text().trim() ||
              (d.preventDefault(),
              b.manageSwipeClass(),
              (c = d.pageX),
              (e = !0),
              (b.$outer.scrollLeft += 1),
              (b.$outer.scrollLeft -= 1),
              b.$outer.removeClass("lg-grab").addClass("lg-grabbing"),
              b.$el.trigger("onDragstart.lg"));
          }),
          a(window).on("mousemove.lg", function (a) {
            e &&
              ((f = !0),
              (d = a.pageX),
              b.touchMove(c, d),
              b.$el.trigger("onDragmove.lg"));
          }),
          a(window).on("mouseup.lg", function (g) {
            f
              ? ((f = !1), b.touchEnd(d - c), b.$el.trigger("onDragend.lg"))
              : (a(g.target).hasClass("lg-object") ||
                  a(g.target).hasClass("lg-video-play")) &&
                b.$el.trigger("onSlideClick.lg"),
              e &&
                ((e = !1),
                b.$outer.removeClass("lg-grabbing").addClass("lg-grab"));
          }));
      }),
      (b.prototype.manageSwipeClass = function () {
        var a = this.index + 1,
          b = this.index - 1;
        this.s.loop &&
          this.$slide.length > 2 &&
          (0 === this.index
            ? (b = this.$slide.length - 1)
            : this.index === this.$slide.length - 1 && (a = 0)),
          this.$slide.removeClass("lg-next-slide lg-prev-slide"),
          b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"),
          this.$slide.eq(a).addClass("lg-next-slide");
      }),
      (b.prototype.mousewheel = function () {
        var a = this;
        a.$outer.on("mousewheel.lg", function (b) {
          b.deltaY &&
            (b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(),
            b.preventDefault());
        });
      }),
      (b.prototype.closeGallery = function () {
        var b = this,
          c = !1;
        this.$outer.find(".lg-close").on("click.lg", function () {
          b.destroy();
        }),
          b.s.closable &&
            (b.$outer.on("mousedown.lg", function (b) {
              c = !!(
                a(b.target).is(".lg-outer") ||
                a(b.target).is(".lg-item ") ||
                a(b.target).is(".lg-img-wrap")
              );
            }),
            b.$outer.on("mousemove.lg", function () {
              c = !1;
            }),
            b.$outer.on("mouseup.lg", function (d) {
              (a(d.target).is(".lg-outer") ||
                a(d.target).is(".lg-item ") ||
                (a(d.target).is(".lg-img-wrap") && c)) &&
                (b.$outer.hasClass("lg-dragging") || b.destroy());
            }));
      }),
      (b.prototype.destroy = function (b) {
        var c = this;
        b ||
          (c.$el.trigger("onBeforeClose.lg"),
          a(window).scrollTop(c.prevScrollTop)),
          b &&
            (c.s.dynamic || this.$items.off("click.lg click.lgcustom"),
            a.removeData(c.el, "lightGallery")),
          this.$el.off(".lg.tm"),
          a.each(a.fn.lightGallery.modules, function (a) {
            c.modules[a] && c.modules[a].destroy();
          }),
          (this.lGalleryOn = !1),
          clearTimeout(c.hideBartimeout),
          (this.hideBartimeout = !1),
          a(window).off(".lg"),
          a("body").removeClass("lg-on lg-from-hash"),
          c.$outer && c.$outer.removeClass("lg-visible"),
          a(".lg-backdrop").removeClass("in"),
          setTimeout(function () {
            c.$outer && c.$outer.remove(),
              a(".lg-backdrop").remove(),
              b || c.$el.trigger("onCloseAfter.lg");
          }, c.s.backdropDuration + 50);
      }),
      (a.fn.lightGallery = function (c) {
        return this.each(function () {
          if (a.data(this, "lightGallery"))
            try {
              a(this).data("lightGallery").init();
            } catch (a) {
              console.error("lightGallery has not initiated properly");
            }
          else a.data(this, "lightGallery", new b(this, c));
        });
      }),
      (a.fn.lightGallery.modules = {});
  })();
}),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          autoplay: !1,
          pause: 5e3,
          progressBar: !0,
          fourceAutoplay: !1,
          autoplayControls: !0,
          appendAutoplayControlsTo: ".lg-toolbar",
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.$el = a(c)),
            !(this.core.$items.length < 2) &&
              ((this.core.s = a.extend({}, b, this.core.s)),
              (this.interval = !1),
              (this.fromAuto = !0),
              (this.canceledOnTouch = !1),
              (this.fourceAutoplayTemp = this.core.s.fourceAutoplay),
              this.core.doCss() || (this.core.s.progressBar = !1),
              this.init(),
              this)
          );
        };
      (c.prototype.init = function () {
        var a = this;
        a.core.s.autoplayControls && a.controls(),
          a.core.s.progressBar &&
            a.core.$outer
              .find(".lg")
              .append(
                '<div class="lg-progress-bar"><div class="lg-progress"></div></div>'
              ),
          a.progress(),
          a.core.s.autoplay &&
            a.$el.one("onSlideItemLoad.lg.tm", function () {
              a.startlAuto();
            }),
          a.$el.on("onDragstart.lg.tm touchstart.lg.tm", function () {
            a.interval && (a.cancelAuto(), (a.canceledOnTouch = !0));
          }),
          a.$el.on(
            "onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm",
            function () {
              !a.interval &&
                a.canceledOnTouch &&
                (a.startlAuto(), (a.canceledOnTouch = !1));
            }
          );
      }),
        (c.prototype.progress = function () {
          var a,
            b,
            c = this;
          c.$el.on("onBeforeSlide.lg.tm", function () {
            c.core.s.progressBar &&
              c.fromAuto &&
              ((a = c.core.$outer.find(".lg-progress-bar")),
              (b = c.core.$outer.find(".lg-progress")),
              c.interval &&
                (b.removeAttr("style"),
                a.removeClass("lg-start"),
                setTimeout(function () {
                  b.css(
                    "transition",
                    "width " + (c.core.s.speed + c.core.s.pause) + "ms ease 0s"
                  ),
                    a.addClass("lg-start");
                }, 20))),
              c.fromAuto || c.core.s.fourceAutoplay || c.cancelAuto(),
              (c.fromAuto = !1);
          });
        }),
        (c.prototype.controls = function () {
          var b = this;
          a(this.core.s.appendAutoplayControlsTo).append(
            '<span class="lg-autoplay-button lg-icon"></span>'
          ),
            b.core.$outer
              .find(".lg-autoplay-button")
              .on("click.lg", function () {
                a(b.core.$outer).hasClass("lg-show-autoplay")
                  ? (b.cancelAuto(), (b.core.s.fourceAutoplay = !1))
                  : b.interval ||
                    (b.startlAuto(),
                    (b.core.s.fourceAutoplay = b.fourceAutoplayTemp));
              });
        }),
        (c.prototype.startlAuto = function () {
          var a = this;
          a.core.$outer
            .find(".lg-progress")
            .css(
              "transition",
              "width " + (a.core.s.speed + a.core.s.pause) + "ms ease 0s"
            ),
            a.core.$outer.addClass("lg-show-autoplay"),
            a.core.$outer.find(".lg-progress-bar").addClass("lg-start"),
            (a.interval = setInterval(function () {
              a.core.index + 1 < a.core.$items.length
                ? a.core.index++
                : (a.core.index = 0),
                (a.fromAuto = !0),
                a.core.slide(a.core.index, !1, !1, "next");
            }, a.core.s.speed + a.core.s.pause));
        }),
        (c.prototype.cancelAuto = function () {
          clearInterval(this.interval),
            (this.interval = !1),
            this.core.$outer.find(".lg-progress").removeAttr("style"),
            this.core.$outer.removeClass("lg-show-autoplay"),
            this.core.$outer.find(".lg-progress-bar").removeClass("lg-start");
        }),
        (c.prototype.destroy = function () {
          this.cancelAuto(), this.core.$outer.find(".lg-progress-bar").remove();
        }),
        (a.fn.lightGallery.modules.autoplay = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = b(require("jquery")))
      : b(a.jQuery);
  })(this, function (a) {
    !(function () {
      "use strict";
      function b() {
        return (
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        );
      }
      var c = { fullScreen: !0 },
        d = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.$el = a(b)),
            (this.core.s = a.extend({}, c, this.core.s)),
            this.init(),
            this
          );
        };
      (d.prototype.init = function () {
        var a = "";
        if (this.core.s.fullScreen) {
          if (
            !(
              document.fullscreenEnabled ||
              document.webkitFullscreenEnabled ||
              document.mozFullScreenEnabled ||
              document.msFullscreenEnabled
            )
          )
            return;
          (a = '<span class="lg-fullscreen lg-icon"></span>'),
            this.core.$outer.find(".lg-toolbar").append(a),
            this.fullScreen();
        }
      }),
        (d.prototype.requestFullscreen = function () {
          var a = document.documentElement;
          a.requestFullscreen
            ? a.requestFullscreen()
            : a.msRequestFullscreen
            ? a.msRequestFullscreen()
            : a.mozRequestFullScreen
            ? a.mozRequestFullScreen()
            : a.webkitRequestFullscreen && a.webkitRequestFullscreen();
        }),
        (d.prototype.exitFullscreen = function () {
          document.exitFullscreen
            ? document.exitFullscreen()
            : document.msExitFullscreen
            ? document.msExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.webkitExitFullscreen && document.webkitExitFullscreen();
        }),
        (d.prototype.fullScreen = function () {
          var c = this;
          a(document).on(
            "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg",
            function () {
              c.core.$outer.toggleClass("lg-fullscreen-on");
            }
          ),
            this.core.$outer.find(".lg-fullscreen").on("click.lg", function () {
              b() ? c.exitFullscreen() : c.requestFullscreen();
            });
        }),
        (d.prototype.destroy = function () {
          b() && this.exitFullscreen(),
            a(document).off(
              "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg"
            );
        }),
        (a.fn.lightGallery.modules.fullscreen = d);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = { pager: !1 },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.$el = a(c)),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.pager && this.core.$items.length > 1 && this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var b,
          c,
          d,
          e = this,
          f = "";
        if (
          (e.core.$outer
            .find(".lg")
            .append('<div class="lg-pager-outer"></div>'),
          e.core.s.dynamic)
        )
          for (var g = 0; g < e.core.s.dynamicEl.length; g++)
            f +=
              '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
              e.core.s.dynamicEl[g].thumb +
              '" /></div></span>';
        else
          e.core.$items.each(function () {
            e.core.s.exThumbImage
              ? (f +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  a(this).attr(e.core.s.exThumbImage) +
                  '" /></div></span>')
              : (f +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  a(this).find("img").attr("src") +
                  '" /></div></span>');
          });
        (c = e.core.$outer.find(".lg-pager-outer")),
          c.html(f),
          (b = e.core.$outer.find(".lg-pager-cont")),
          b.on("click.lg touchend.lg", function () {
            var b = a(this);
            (e.core.index = b.index()), e.core.slide(e.core.index, !1, !0, !1);
          }),
          c.on("mouseover.lg", function () {
            clearTimeout(d), c.addClass("lg-pager-hover");
          }),
          c.on("mouseout.lg", function () {
            d = setTimeout(function () {
              c.removeClass("lg-pager-hover");
            });
          }),
          e.core.$el.on("onBeforeSlide.lg.tm", function (a, c, d) {
            b.removeClass("lg-pager-active"),
              b.eq(d).addClass("lg-pager-active");
          });
      }),
        (c.prototype.destroy = function () {}),
        (a.fn.lightGallery.modules.pager = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          thumbnail: !0,
          animateThumb: !0,
          currentPagerPosition: "middle",
          thumbWidth: 100,
          thumbHeight: "80px",
          thumbContHeight: 100,
          thumbMargin: 5,
          exThumbImage: !1,
          showThumbByDefault: !0,
          toogleThumb: !0,
          pullCaptionUp: !0,
          enableThumbDrag: !0,
          enableThumbSwipe: !0,
          swipeThreshold: 50,
          loadYoutubeThumbnail: !0,
          youtubeThumbSize: 1,
          loadVimeoThumbnail: !0,
          vimeoThumbSize: "thumbnail_small",
          loadDailymotionThumbnail: !0,
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            (this.$el = a(c)),
            (this.$thumbOuter = null),
            (this.thumbOuterWidth = 0),
            (this.thumbTotalWidth =
              this.core.$items.length *
              (this.core.s.thumbWidth + this.core.s.thumbMargin)),
            (this.thumbIndex = this.core.index),
            this.core.s.animateThumb && (this.core.s.thumbHeight = "100%"),
            (this.left = 0),
            this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var a = this;
        this.core.s.thumbnail &&
          this.core.$items.length > 1 &&
          (this.core.s.showThumbByDefault &&
            setTimeout(function () {
              a.core.$outer.addClass("lg-thumb-open");
            }, 700),
          this.core.s.pullCaptionUp &&
            this.core.$outer.addClass("lg-pull-caption-up"),
          this.build(),
          this.core.s.animateThumb && this.core.doCss()
            ? (this.core.s.enableThumbDrag && this.enableThumbDrag(),
              this.core.s.enableThumbSwipe && this.enableThumbSwipe(),
              (this.thumbClickable = !1))
            : (this.thumbClickable = !0),
          this.toogle(),
          this.thumbkeyPress());
      }),
        (c.prototype.build = function () {
          function b(a, b, c) {
            var g,
              h = d.core.isVideo(a, c) || {},
              i = "";
            h.youtube || h.vimeo || h.dailymotion
              ? h.youtube
                ? (g = d.core.s.loadYoutubeThumbnail
                    ? "//img.youtube.com/vi/" +
                      h.youtube[1] +
                      "/" +
                      d.core.s.youtubeThumbSize +
                      ".jpg"
                    : b)
                : h.vimeo
                ? d.core.s.loadVimeoThumbnail
                  ? ((g = "//i.vimeocdn.com/video/error_" + f + ".jpg"),
                    (i = h.vimeo[1]))
                  : (g = b)
                : h.dailymotion &&
                  (g = d.core.s.loadDailymotionThumbnail
                    ? "//www.dailymotion.com/thumbnail/video/" +
                      h.dailymotion[1]
                    : b)
              : (g = b),
              (e +=
                '<div data-vimeo-id="' +
                i +
                '" class="lg-thumb-item" style="width:' +
                d.core.s.thumbWidth +
                "px; height: " +
                d.core.s.thumbHeight +
                "; margin-right: " +
                d.core.s.thumbMargin +
                'px"><img src="' +
                g +
                '" /></div>'),
              (i = "");
          }
          var c,
            d = this,
            e = "",
            f = "",
            g =
              '<div class="lg-thumb-outer"><div class="lg-thumb lg-group"></div></div>';
          switch (this.core.s.vimeoThumbSize) {
            case "thumbnail_large":
              f = "640";
              break;
            case "thumbnail_medium":
              f = "200x150";
              break;
            case "thumbnail_small":
              f = "100x75";
          }
          if (
            (d.core.$outer.addClass("lg-has-thumb"),
            d.core.$outer.find(".lg").append(g),
            (d.$thumbOuter = d.core.$outer.find(".lg-thumb-outer")),
            (d.thumbOuterWidth = d.$thumbOuter.width()),
            d.core.s.animateThumb &&
              d.core.$outer
                .find(".lg-thumb")
                .css({ width: d.thumbTotalWidth + "px", position: "relative" }),
            this.core.s.animateThumb &&
              d.$thumbOuter.css("height", d.core.s.thumbContHeight + "px"),
            d.core.s.dynamic)
          )
            for (var h = 0; h < d.core.s.dynamicEl.length; h++)
              b(d.core.s.dynamicEl[h].src, d.core.s.dynamicEl[h].thumb, h);
          else
            d.core.$items.each(function (c) {
              d.core.s.exThumbImage
                ? b(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).attr(d.core.s.exThumbImage),
                    c
                  )
                : b(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).find("img").attr("src"),
                    c
                  );
            });
          d.core.$outer.find(".lg-thumb").html(e),
            (c = d.core.$outer.find(".lg-thumb-item")),
            c.each(function () {
              var b = a(this),
                c = b.attr("data-vimeo-id");
              c &&
                a.getJSON(
                  "//www.vimeo.com/api/v2/video/" + c + ".json?callback=?",
                  { format: "json" },
                  function (a) {
                    b.find("img").attr("src", a[0][d.core.s.vimeoThumbSize]);
                  }
                );
            }),
            c.eq(d.core.index).addClass("active"),
            d.core.$el.on("onBeforeSlide.lg.tm", function () {
              c.removeClass("active"), c.eq(d.core.index).addClass("active");
            }),
            c.on("click.lg touchend.lg", function () {
              var b = a(this);
              setTimeout(function () {
                ((d.thumbClickable && !d.core.lgBusy) || !d.core.doCss()) &&
                  ((d.core.index = b.index()),
                  d.core.slide(d.core.index, !1, !0, !1));
              }, 50);
            }),
            d.core.$el.on("onBeforeSlide.lg.tm", function () {
              d.animateThumb(d.core.index);
            }),
            a(window).on(
              "resize.lg.thumb orientationchange.lg.thumb",
              function () {
                setTimeout(function () {
                  d.animateThumb(d.core.index),
                    (d.thumbOuterWidth = d.$thumbOuter.width());
                }, 200);
              }
            );
        }),
        (c.prototype.setTranslate = function (a) {
          this.core.$outer
            .find(".lg-thumb")
            .css({ transform: "translate3d(-" + a + "px, 0px, 0px)" });
        }),
        (c.prototype.animateThumb = function (a) {
          var b = this.core.$outer.find(".lg-thumb");
          if (this.core.s.animateThumb) {
            var c;
            switch (this.core.s.currentPagerPosition) {
              case "left":
                c = 0;
                break;
              case "middle":
                c = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
                break;
              case "right":
                c = this.thumbOuterWidth - this.core.s.thumbWidth;
            }
            (this.left =
              (this.core.s.thumbWidth + this.core.s.thumbMargin) * a - 1 - c),
              this.left > this.thumbTotalWidth - this.thumbOuterWidth &&
                (this.left = this.thumbTotalWidth - this.thumbOuterWidth),
              this.left < 0 && (this.left = 0),
              this.core.lGalleryOn
                ? (b.hasClass("on") ||
                    this.core.$outer
                      .find(".lg-thumb")
                      .css("transition-duration", this.core.s.speed + "ms"),
                  this.core.doCss() ||
                    b.animate({ left: -this.left + "px" }, this.core.s.speed))
                : this.core.doCss() || b.css("left", -this.left + "px"),
              this.setTranslate(this.left);
          }
        }),
        (c.prototype.enableThumbDrag = function () {
          var b = this,
            c = 0,
            d = 0,
            e = !1,
            f = !1,
            g = 0;
          b.$thumbOuter.addClass("lg-grab"),
            b.core.$outer
              .find(".lg-thumb")
              .on("mousedown.lg.thumb", function (a) {
                b.thumbTotalWidth > b.thumbOuterWidth &&
                  (a.preventDefault(),
                  (c = a.pageX),
                  (e = !0),
                  (b.core.$outer.scrollLeft += 1),
                  (b.core.$outer.scrollLeft -= 1),
                  (b.thumbClickable = !1),
                  b.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"));
              }),
            a(window).on("mousemove.lg.thumb", function (a) {
              e &&
                ((g = b.left),
                (f = !0),
                (d = a.pageX),
                b.$thumbOuter.addClass("lg-dragging"),
                (g -= d - c),
                g > b.thumbTotalWidth - b.thumbOuterWidth &&
                  (g = b.thumbTotalWidth - b.thumbOuterWidth),
                g < 0 && (g = 0),
                b.setTranslate(g));
            }),
            a(window).on("mouseup.lg.thumb", function () {
              f
                ? ((f = !1),
                  b.$thumbOuter.removeClass("lg-dragging"),
                  (b.left = g),
                  Math.abs(d - c) < b.core.s.swipeThreshold &&
                    (b.thumbClickable = !0))
                : (b.thumbClickable = !0),
                e &&
                  ((e = !1),
                  b.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab"));
            });
        }),
        (c.prototype.enableThumbSwipe = function () {
          var a = this,
            b = 0,
            c = 0,
            d = !1,
            e = 0;
          a.core.$outer.find(".lg-thumb").on("touchstart.lg", function (c) {
            a.thumbTotalWidth > a.thumbOuterWidth &&
              (c.preventDefault(),
              (b = c.originalEvent.targetTouches[0].pageX),
              (a.thumbClickable = !1));
          }),
            a.core.$outer.find(".lg-thumb").on("touchmove.lg", function (f) {
              a.thumbTotalWidth > a.thumbOuterWidth &&
                (f.preventDefault(),
                (c = f.originalEvent.targetTouches[0].pageX),
                (d = !0),
                a.$thumbOuter.addClass("lg-dragging"),
                (e = a.left),
                (e -= c - b),
                e > a.thumbTotalWidth - a.thumbOuterWidth &&
                  (e = a.thumbTotalWidth - a.thumbOuterWidth),
                e < 0 && (e = 0),
                a.setTranslate(e));
            }),
            a.core.$outer.find(".lg-thumb").on("touchend.lg", function () {
              a.thumbTotalWidth > a.thumbOuterWidth && d
                ? ((d = !1),
                  a.$thumbOuter.removeClass("lg-dragging"),
                  Math.abs(c - b) < a.core.s.swipeThreshold &&
                    (a.thumbClickable = !0),
                  (a.left = e))
                : (a.thumbClickable = !0);
            });
        }),
        (c.prototype.toogle = function () {
          var a = this;
          a.core.s.toogleThumb &&
            (a.core.$outer.addClass("lg-can-toggle"),
            a.$thumbOuter.append(
              '<span class="lg-toogle-thumb lg-icon"></span>'
            ),
            a.core.$outer.find(".lg-toogle-thumb").on("click.lg", function () {
              a.core.$outer.toggleClass("lg-thumb-open");
            }));
        }),
        (c.prototype.thumbkeyPress = function () {
          var b = this;
          a(window).on("keydown.lg.thumb", function (a) {
            38 === a.keyCode
              ? (a.preventDefault(), b.core.$outer.addClass("lg-thumb-open"))
              : 40 === a.keyCode &&
                (a.preventDefault(),
                b.core.$outer.removeClass("lg-thumb-open"));
          });
        }),
        (c.prototype.destroy = function () {
          this.core.s.thumbnail &&
            this.core.$items.length > 1 &&
            (a(window).off(
              "resize.lg.thumb orientationchange.lg.thumb keydown.lg.thumb"
            ),
            this.$thumbOuter.remove(),
            this.core.$outer.removeClass("lg-has-thumb"));
        }),
        (a.fn.lightGallery.modules.Thumbnail = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = b(require("jquery")))
      : b(a.jQuery);
  })(this, function (a) {
    !(function () {
      "use strict";
      function b(a, b, c, d) {
        var e = this;
        if (
          (e.core.$slide
            .eq(b)
            .find(".lg-video")
            .append(e.loadVideo(c, "lg-object", !0, b, d)),
          d)
        )
          if (e.core.s.videojs)
            try {
              videojs(
                e.core.$slide.eq(b).find(".lg-html5").get(0),
                e.core.s.videojsOptions,
                function () {
                  !e.videoLoaded && e.core.s.autoplayFirstVideo && this.play();
                }
              );
            } catch (a) {
              console.error("Make sure you have included videojs");
            }
          else
            !e.videoLoaded &&
              e.core.s.autoplayFirstVideo &&
              e.core.$slide.eq(b).find(".lg-html5").get(0).play();
      }
      function c(a, b) {
        var c = this.core.$slide.eq(b).find(".lg-video-cont");
        c.hasClass("lg-has-iframe") ||
          (c.css("max-width", this.core.s.videoMaxWidth),
          (this.videoLoaded = !0));
      }
      function d(b, c, d) {
        var e = this,
          f = e.core.$slide.eq(c),
          g = f.find(".lg-youtube").get(0),
          h = f.find(".lg-vimeo").get(0),
          i = f.find(".lg-dailymotion").get(0),
          j = f.find(".lg-vk").get(0),
          k = f.find(".lg-html5").get(0);
        if (g)
          g.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        else if (h)
          try {
            $f(h).api("pause");
          } catch (a) {
            console.error("Make sure you have included froogaloop2 js");
          }
        else if (i) i.contentWindow.postMessage("pause", "*");
        else if (k)
          if (e.core.s.videojs)
            try {
              videojs(k).pause();
            } catch (a) {
              console.error("Make sure you have included videojs");
            }
          else k.pause();
        j && a(j).attr("src", a(j).attr("src").replace("&autoplay", "&noplay"));
        var l;
        l = e.core.s.dynamic
          ? e.core.s.dynamicEl[d].src
          : e.core.$items.eq(d).attr("href") ||
            e.core.$items.eq(d).attr("data-src");
        var m = e.core.isVideo(l, d) || {};
        (m.youtube || m.vimeo || m.dailymotion || m.vk) &&
          e.core.$outer.addClass("lg-hide-download");
      }
      var e = {
          videoMaxWidth: "855px",
          autoplayFirstVideo: !0,
          youtubePlayerParams: !1,
          vimeoPlayerParams: !1,
          dailymotionPlayerParams: !1,
          vkPlayerParams: !1,
          videojs: !1,
          videojsOptions: {},
        },
        f = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.$el = a(b)),
            (this.core.s = a.extend({}, e, this.core.s)),
            (this.videoLoaded = !1),
            this.init(),
            this
          );
        };
      (f.prototype.init = function () {
        var e = this;
        e.core.$el.on("hasVideo.lg.tm", b.bind(this)),
          e.core.$el.on("onAferAppendSlide.lg.tm", c.bind(this)),
          e.core.doCss() &&
          e.core.$items.length > 1 &&
          (e.core.s.enableSwipe || e.core.s.enableDrag)
            ? e.core.$el.on("onSlideClick.lg.tm", function () {
                var a = e.core.$slide.eq(e.core.index);
                e.loadVideoOnclick(a);
              })
            : e.core.$slide.on("click.lg", function () {
                e.loadVideoOnclick(a(this));
              }),
          e.core.$el.on("onBeforeSlide.lg.tm", d.bind(this)),
          e.core.$el.on("onAfterSlide.lg.tm", function (a, b) {
            e.core.$slide.eq(b).removeClass("lg-video-playing");
          }),
          e.core.s.autoplayFirstVideo &&
            e.core.$el.on("onAferAppendSlide.lg.tm", function (a, b) {
              if (!e.core.lGalleryOn) {
                var c = e.core.$slide.eq(b);
                setTimeout(function () {
                  e.loadVideoOnclick(c);
                }, 100);
              }
            });
      }),
        (f.prototype.loadVideo = function (b, c, d, e, f) {
          var g = "",
            h = 1,
            i = "",
            j = this.core.isVideo(b, e) || {};
          if (
            (d &&
              (h = this.videoLoaded
                ? 0
                : this.core.s.autoplayFirstVideo
                ? 1
                : 0),
            j.youtube)
          )
            (i = "?wmode=opaque&autoplay=" + h + "&enablejsapi=1"),
              this.core.s.youtubePlayerParams &&
                (i = i + "&" + a.param(this.core.s.youtubePlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-youtube ' +
                c +
                '" width="560" height="315" src="//www.youtube.com/embed/' +
                j.youtube[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>');
          else if (j.vimeo)
            (i = "?autoplay=" + h + "&api=1"),
              this.core.s.vimeoPlayerParams &&
                (i = i + "&" + a.param(this.core.s.vimeoPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-vimeo ' +
                c +
                '" width="560" height="315"  src="//player.vimeo.com/video/' +
                j.vimeo[1] +
                i +
                '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
          else if (j.dailymotion)
            (i = "?wmode=opaque&autoplay=" + h + "&api=postMessage"),
              this.core.s.dailymotionPlayerParams &&
                (i = i + "&" + a.param(this.core.s.dailymotionPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-dailymotion ' +
                c +
                '" width="560" height="315" src="//www.dailymotion.com/embed/video/' +
                j.dailymotion[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>');
          else if (j.html5) {
            var k = f.substring(0, 1);
            ("." !== k && "#" !== k) || (f = a(f).html()), (g = f);
          } else
            j.vk &&
              ((i = "&autoplay=" + h),
              this.core.s.vkPlayerParams &&
                (i = i + "&" + a.param(this.core.s.vkPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-vk ' +
                c +
                '" width="560" height="315" src="//vk.com/video_ext.php?' +
                j.vk[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>'));
          return g;
        }),
        (f.prototype.loadVideoOnclick = function (a) {
          var b = this;
          if (
            a.find(".lg-object").hasClass("lg-has-poster") &&
            a.find(".lg-object").is(":visible")
          )
            if (a.hasClass("lg-has-video")) {
              var c = a.find(".lg-youtube").get(0),
                d = a.find(".lg-vimeo").get(0),
                e = a.find(".lg-dailymotion").get(0),
                f = a.find(".lg-html5").get(0);
              if (c)
                c.contentWindow.postMessage(
                  '{"event":"command","func":"playVideo","args":""}',
                  "*"
                );
              else if (d)
                try {
                  $f(d).api("play");
                } catch (a) {
                  console.error("Make sure you have included froogaloop2 js");
                }
              else if (e) e.contentWindow.postMessage("play", "*");
              else if (f)
                if (b.core.s.videojs)
                  try {
                    videojs(f).play();
                  } catch (a) {
                    console.error("Make sure you have included videojs");
                  }
                else f.play();
              a.addClass("lg-video-playing");
            } else {
              a.addClass("lg-video-playing lg-has-video");
              var g,
                h,
                i = function (c, d) {
                  if (
                    (a
                      .find(".lg-video")
                      .append(b.loadVideo(c, "", !1, b.core.index, d)),
                    d)
                  )
                    if (b.core.s.videojs)
                      try {
                        videojs(
                          b.core.$slide
                            .eq(b.core.index)
                            .find(".lg-html5")
                            .get(0),
                          b.core.s.videojsOptions,
                          function () {
                            this.play();
                          }
                        );
                      } catch (a) {
                        console.error("Make sure you have included videojs");
                      }
                    else
                      b.core.$slide
                        .eq(b.core.index)
                        .find(".lg-html5")
                        .get(0)
                        .play();
                };
              b.core.s.dynamic
                ? ((g = b.core.s.dynamicEl[b.core.index].src),
                  (h = b.core.s.dynamicEl[b.core.index].html),
                  i(g, h))
                : ((g =
                    b.core.$items.eq(b.core.index).attr("href") ||
                    b.core.$items.eq(b.core.index).attr("data-src")),
                  (h = b.core.$items.eq(b.core.index).attr("data-html")),
                  i(g, h));
              var j = a.find(".lg-object");
              a.find(".lg-video").append(j),
                a.find(".lg-video-object").hasClass("lg-html5") ||
                  (a.removeClass("lg-complete"),
                  a
                    .find(".lg-video-object")
                    .on("load.lg error.lg", function () {
                      a.addClass("lg-complete");
                    }));
            }
        }),
        (f.prototype.destroy = function () {
          this.videoLoaded = !1;
        }),
        (a.fn.lightGallery.modules.video = f);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = function () {
          var a = !1,
            b = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
          return b && parseInt(b[2], 10) < 54 && (a = !0), a;
        },
        c = {
          scale: 1,
          zoom: !0,
          actualSize: !0,
          enableZoomAfter: 300,
          useLeftForZoom: b(),
        },
        d = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.core.s = a.extend({}, c, this.core.s)),
            this.core.s.zoom &&
              this.core.doCss() &&
              (this.init(),
              (this.zoomabletimeout = !1),
              (this.pageX = a(window).width() / 2),
              (this.pageY = a(window).height() / 2 + a(window).scrollTop())),
            this
          );
        };
      (d.prototype.init = function () {
        var b = this,
          c =
            '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
        b.core.s.actualSize &&
          (c += '<span id="lg-actual-size" class="lg-icon"></span>'),
          b.core.s.useLeftForZoom
            ? b.core.$outer.addClass("lg-use-left-for-zoom")
            : b.core.$outer.addClass("lg-use-transition-for-zoom"),
          this.core.$outer.find(".lg-toolbar").append(c),
          b.core.$el.on("onSlideItemLoad.lg.tm.zoom", function (c, d, e) {
            var f = b.core.s.enableZoomAfter + e;
            a("body").hasClass("lg-from-hash") && e
              ? (f = 0)
              : a("body").removeClass("lg-from-hash"),
              (b.zoomabletimeout = setTimeout(function () {
                b.core.$slide.eq(d).addClass("lg-zoomable");
              }, f + 30));
          });
        var d = 1,
          e = function (c) {
            var d,
              e,
              f = b.core.$outer.find(".lg-current .lg-image"),
              g = (a(window).width() - f.prop("offsetWidth")) / 2,
              h =
                (a(window).height() - f.prop("offsetHeight")) / 2 +
                a(window).scrollTop();
            (d = b.pageX - g), (e = b.pageY - h);
            var i = (c - 1) * d,
              j = (c - 1) * e;
            f
              .css("transform", "scale3d(" + c + ", " + c + ", 1)")
              .attr("data-scale", c),
              b.core.s.useLeftForZoom
                ? f
                    .parent()
                    .css({ left: -i + "px", top: -j + "px" })
                    .attr("data-x", i)
                    .attr("data-y", j)
                : f
                    .parent()
                    .css(
                      "transform",
                      "translate3d(-" + i + "px, -" + j + "px, 0)"
                    )
                    .attr("data-x", i)
                    .attr("data-y", j);
          },
          f = function () {
            d > 1 ? b.core.$outer.addClass("lg-zoomed") : b.resetZoom(),
              d < 1 && (d = 1),
              e(d);
          },
          g = function (c, e, g, h) {
            var i,
              j = e.prop("offsetWidth");
            i = b.core.s.dynamic
              ? b.core.s.dynamicEl[g].width || e[0].naturalWidth || j
              : b.core.$items.eq(g).attr("data-width") ||
                e[0].naturalWidth ||
                j;
            var k;
            b.core.$outer.hasClass("lg-zoomed")
              ? (d = 1)
              : i > j && ((k = i / j), (d = k || 2)),
              h
                ? ((b.pageX = a(window).width() / 2),
                  (b.pageY = a(window).height() / 2 + a(window).scrollTop()))
                : ((b.pageX =
                    c.pageX || c.originalEvent.targetTouches[0].pageX),
                  (b.pageY =
                    c.pageY || c.originalEvent.targetTouches[0].pageY)),
              f(),
              setTimeout(function () {
                b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
              }, 10);
          },
          h = !1;
        b.core.$el.on("onAferAppendSlide.lg.tm.zoom", function (a, c) {
          var d = b.core.$slide.eq(c).find(".lg-image");
          d.on("dblclick", function (a) {
            g(a, d, c);
          }),
            d.on("touchstart", function (a) {
              h
                ? (clearTimeout(h), (h = null), g(a, d, c))
                : (h = setTimeout(function () {
                    h = null;
                  }, 300)),
                a.preventDefault();
            });
        }),
          a(window).on(
            "resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom",
            function () {
              (b.pageX = a(window).width() / 2),
                (b.pageY = a(window).height() / 2 + a(window).scrollTop()),
                e(d);
            }
          ),
          a("#lg-zoom-out").on("click.lg", function () {
            b.core.$outer.find(".lg-current .lg-image").length &&
              ((d -= b.core.s.scale), f());
          }),
          a("#lg-zoom-in").on("click.lg", function () {
            b.core.$outer.find(".lg-current .lg-image").length &&
              ((d += b.core.s.scale), f());
          }),
          a("#lg-actual-size").on("click.lg", function (a) {
            g(
              a,
              b.core.$slide.eq(b.core.index).find(".lg-image"),
              b.core.index,
              !0
            );
          }),
          b.core.$el.on("onBeforeSlide.lg.tm", function () {
            (d = 1), b.resetZoom();
          }),
          b.zoomDrag(),
          b.zoomSwipe();
      }),
        (d.prototype.resetZoom = function () {
          this.core.$outer.removeClass("lg-zoomed"),
            this.core.$slide
              .find(".lg-img-wrap")
              .removeAttr("style data-x data-y"),
            this.core.$slide.find(".lg-image").removeAttr("style data-scale"),
            (this.pageX = a(window).width() / 2),
            (this.pageY = a(window).height() / 2 + a(window).scrollTop());
        }),
        (d.prototype.zoomSwipe = function () {
          var a = this,
            b = {},
            c = {},
            d = !1,
            e = !1,
            f = !1;
          a.core.$slide.on("touchstart.lg", function (c) {
            if (a.core.$outer.hasClass("lg-zoomed")) {
              var d = a.core.$slide.eq(a.core.index).find(".lg-object");
              (f =
                d.prop("offsetHeight") * d.attr("data-scale") >
                a.core.$outer.find(".lg").height()),
                (e =
                  d.prop("offsetWidth") * d.attr("data-scale") >
                  a.core.$outer.find(".lg").width()),
                (e || f) &&
                  (c.preventDefault(),
                  (b = {
                    x: c.originalEvent.targetTouches[0].pageX,
                    y: c.originalEvent.targetTouches[0].pageY,
                  }));
            }
          }),
            a.core.$slide.on("touchmove.lg", function (g) {
              if (a.core.$outer.hasClass("lg-zoomed")) {
                var h,
                  i,
                  j = a.core.$slide.eq(a.core.index).find(".lg-img-wrap");
                g.preventDefault(),
                  (d = !0),
                  (c = {
                    x: g.originalEvent.targetTouches[0].pageX,
                    y: g.originalEvent.targetTouches[0].pageY,
                  }),
                  a.core.$outer.addClass("lg-zoom-dragging"),
                  (i = f
                    ? -Math.abs(j.attr("data-y")) + (c.y - b.y)
                    : -Math.abs(j.attr("data-y"))),
                  (h = e
                    ? -Math.abs(j.attr("data-x")) + (c.x - b.x)
                    : -Math.abs(j.attr("data-x"))),
                  (Math.abs(c.x - b.x) > 15 || Math.abs(c.y - b.y) > 15) &&
                    (a.core.s.useLeftForZoom
                      ? j.css({ left: h + "px", top: i + "px" })
                      : j.css(
                          "transform",
                          "translate3d(" + h + "px, " + i + "px, 0)"
                        ));
              }
            }),
            a.core.$slide.on("touchend.lg", function () {
              a.core.$outer.hasClass("lg-zoomed") &&
                d &&
                ((d = !1),
                a.core.$outer.removeClass("lg-zoom-dragging"),
                a.touchendZoom(b, c, e, f));
            });
        }),
        (d.prototype.zoomDrag = function () {
          var b = this,
            c = {},
            d = {},
            e = !1,
            f = !1,
            g = !1,
            h = !1;
          b.core.$slide.on("mousedown.lg.zoom", function (d) {
            var f = b.core.$slide.eq(b.core.index).find(".lg-object");
            (h =
              f.prop("offsetHeight") * f.attr("data-scale") >
              b.core.$outer.find(".lg").height()),
              (g =
                f.prop("offsetWidth") * f.attr("data-scale") >
                b.core.$outer.find(".lg").width()),
              b.core.$outer.hasClass("lg-zoomed") &&
                a(d.target).hasClass("lg-object") &&
                (g || h) &&
                (d.preventDefault(),
                (c = { x: d.pageX, y: d.pageY }),
                (e = !0),
                (b.core.$outer.scrollLeft += 1),
                (b.core.$outer.scrollLeft -= 1),
                b.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"));
          }),
            a(window).on("mousemove.lg.zoom", function (a) {
              if (e) {
                var i,
                  j,
                  k = b.core.$slide.eq(b.core.index).find(".lg-img-wrap");
                (f = !0),
                  (d = { x: a.pageX, y: a.pageY }),
                  b.core.$outer.addClass("lg-zoom-dragging"),
                  (j = h
                    ? -Math.abs(k.attr("data-y")) + (d.y - c.y)
                    : -Math.abs(k.attr("data-y"))),
                  (i = g
                    ? -Math.abs(k.attr("data-x")) + (d.x - c.x)
                    : -Math.abs(k.attr("data-x"))),
                  b.core.s.useLeftForZoom
                    ? k.css({ left: i + "px", top: j + "px" })
                    : k.css(
                        "transform",
                        "translate3d(" + i + "px, " + j + "px, 0)"
                      );
              }
            }),
            a(window).on("mouseup.lg.zoom", function (a) {
              e &&
                ((e = !1),
                b.core.$outer.removeClass("lg-zoom-dragging"),
                !f ||
                  (c.x === d.x && c.y === d.y) ||
                  ((d = { x: a.pageX, y: a.pageY }),
                  b.touchendZoom(c, d, g, h)),
                (f = !1)),
                b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
            });
        }),
        (d.prototype.touchendZoom = function (a, b, c, d) {
          var e = this,
            f = e.core.$slide.eq(e.core.index).find(".lg-img-wrap"),
            g = e.core.$slide.eq(e.core.index).find(".lg-object"),
            h = -Math.abs(f.attr("data-x")) + (b.x - a.x),
            i = -Math.abs(f.attr("data-y")) + (b.y - a.y),
            j =
              (e.core.$outer.find(".lg").height() - g.prop("offsetHeight")) / 2,
            k = Math.abs(
              g.prop("offsetHeight") * Math.abs(g.attr("data-scale")) -
                e.core.$outer.find(".lg").height() +
                j
            ),
            l = (e.core.$outer.find(".lg").width() - g.prop("offsetWidth")) / 2,
            m = Math.abs(
              g.prop("offsetWidth") * Math.abs(g.attr("data-scale")) -
                e.core.$outer.find(".lg").width() +
                l
            );
          (Math.abs(b.x - a.x) > 15 || Math.abs(b.y - a.y) > 15) &&
            (d && (i <= -k ? (i = -k) : i >= -j && (i = -j)),
            c && (h <= -m ? (h = -m) : h >= -l && (h = -l)),
            d
              ? f.attr("data-y", Math.abs(i))
              : (i = -Math.abs(f.attr("data-y"))),
            c
              ? f.attr("data-x", Math.abs(h))
              : (h = -Math.abs(f.attr("data-x"))),
            e.core.s.useLeftForZoom
              ? f.css({ left: h + "px", top: i + "px" })
              : f.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
        }),
        (d.prototype.destroy = function () {
          var b = this;
          b.core.$el.off(".lg.zoom"),
            a(window).off(".lg.zoom"),
            b.core.$slide.off(".lg.zoom"),
            b.core.$el.off(".lg.tm.zoom"),
            b.resetZoom(),
            clearTimeout(b.zoomabletimeout),
            (b.zoomabletimeout = !1);
        }),
        (a.fn.lightGallery.modules.zoom = d);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = { hash: !0 },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.hash &&
              ((this.oldHash = window.location.hash), this.init()),
            this
          );
        };
      (c.prototype.init = function () {
        var b,
          c = this;
        c.core.$el.on("onAfterSlide.lg.tm", function (a, b, d) {
          history.replaceState
            ? history.replaceState(
                null,
                null,
                window.location.pathname +
                  window.location.search +
                  "#lg=" +
                  c.core.s.galleryId +
                  "&slide=" +
                  d
              )
            : (window.location.hash =
                "lg=" + c.core.s.galleryId + "&slide=" + d);
        }),
          a(window).on("hashchange.lg.hash", function () {
            b = window.location.hash;
            var a = parseInt(b.split("&slide=")[1], 10);
            b.indexOf("lg=" + c.core.s.galleryId) > -1
              ? c.core.slide(a, !1, !1)
              : c.core.lGalleryOn && c.core.destroy();
          });
      }),
        (c.prototype.destroy = function () {
          this.core.s.hash &&
            (this.oldHash &&
            this.oldHash.indexOf("lg=" + this.core.s.galleryId) < 0
              ? history.replaceState
                ? history.replaceState(null, null, this.oldHash)
                : (window.location.hash = this.oldHash)
              : history.replaceState
              ? history.replaceState(
                  null,
                  document.title,
                  window.location.pathname + window.location.search
                )
              : (window.location.hash = ""),
            this.core.$el.off(".lg.hash"));
        }),
        (a.fn.lightGallery.modules.hash = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          share: !0,
          facebook: !0,
          facebookDropdownText: "Facebook",
          twitter: !0,
          twitterDropdownText: "Twitter",
          googlePlus: !0,
          googlePlusDropdownText: "GooglePlus",
          pinterest: !0,
          pinterestDropdownText: "Pinterest",
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.share && this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var b = this,
          c =
            '<span id="lg-share" class="lg-icon"><ul class="lg-dropdown" style="position: absolute;">';
        (c += b.core.s.facebook
          ? '<li><a id="lg-share-facebook" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
            this.core.s.facebookDropdownText +
            "</span></a></li>"
          : ""),
          (c += b.core.s.twitter
            ? '<li><a id="lg-share-twitter" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.twitterDropdownText +
              "</span></a></li>"
            : ""),
          (c += b.core.s.googlePlus
            ? '<li><a id="lg-share-googleplus" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.googlePlusDropdownText +
              "</span></a></li>"
            : ""),
          (c += b.core.s.pinterest
            ? '<li><a id="lg-share-pinterest" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.pinterestDropdownText +
              "</span></a></li>"
            : ""),
          (c += "</ul></span>"),
          this.core.$outer.find(".lg-toolbar").append(c),
          this.core.$outer
            .find(".lg")
            .append('<div id="lg-dropdown-overlay"></div>'),
          a("#lg-share").on("click.lg", function () {
            b.core.$outer.toggleClass("lg-dropdown-active");
          }),
          a("#lg-dropdown-overlay").on("click.lg", function () {
            b.core.$outer.removeClass("lg-dropdown-active");
          }),
          b.core.$el.on("onAfterSlide.lg.tm", function (c, d, e) {
            setTimeout(function () {
              a("#lg-share-facebook").attr(
                "href",
                "https://www.facebook.com/sharer/sharer.php?u=" +
                  encodeURIComponent(
                    b.getSahreProps(e, "facebookShareUrl") ||
                      window.location.href
                  )
              ),
                a("#lg-share-twitter").attr(
                  "href",
                  "https://twitter.com/intent/tweet?text=" +
                    b.getSahreProps(e, "tweetText") +
                    "&url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "twitterShareUrl") ||
                        window.location.href
                    )
                ),
                a("#lg-share-googleplus").attr(
                  "href",
                  "https://plus.google.com/share?url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "googleplusShareUrl") ||
                        window.location.href
                    )
                ),
                a("#lg-share-pinterest").attr(
                  "href",
                  "http://www.pinterest.com/pin/create/button/?url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "pinterestShareUrl") ||
                        window.location.href
                    ) +
                    "&media=" +
                    encodeURIComponent(b.getSahreProps(e, "src")) +
                    "&description=" +
                    b.getSahreProps(e, "pinterestText")
                );
            }, 100);
          });
      }),
        (c.prototype.getSahreProps = function (a, b) {
          var c = "";
          if (this.core.s.dynamic) c = this.core.s.dynamicEl[a][b];
          else {
            var d = this.core.$items.eq(a).attr("href"),
              e = this.core.$items.eq(a).data(b);
            c = "src" === b ? d || e : e;
          }
          return c;
        }),
        (c.prototype.destroy = function () {}),
        (a.fn.lightGallery.modules.share = c);
    })();
  });
/*-----------------------------------------------------------------------------------*/
/*	08. MOUSEWHEEL
/*-----------------------------------------------------------------------------------*/
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : "object" == typeof exports
    ? (module.exports = a)
    : a(jQuery);
})(function (a) {
  function b(b) {
    var g = b || window.event,
      h = i.call(arguments, 1),
      j = 0,
      l = 0,
      m = 0,
      n = 0,
      o = 0,
      p = 0;
    if (
      ((b = a.event.fix(g)),
      (b.type = "mousewheel"),
      "detail" in g && (m = -1 * g.detail),
      "wheelDelta" in g && (m = g.wheelDelta),
      "wheelDeltaY" in g && (m = g.wheelDeltaY),
      "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX),
      "axis" in g && g.axis === g.HORIZONTAL_AXIS && ((l = -1 * m), (m = 0)),
      (j = 0 === m ? l : m),
      "deltaY" in g && ((m = -1 * g.deltaY), (j = m)),
      "deltaX" in g && ((l = g.deltaX), 0 === m && (j = -1 * l)),
      0 !== m || 0 !== l)
    ) {
      if (1 === g.deltaMode) {
        var q = a.data(this, "mousewheel-line-height");
        (j *= q), (m *= q), (l *= q);
      } else if (2 === g.deltaMode) {
        var r = a.data(this, "mousewheel-page-height");
        (j *= r), (m *= r), (l *= r);
      }
      if (
        ((n = Math.max(Math.abs(m), Math.abs(l))),
        (!f || f > n) && ((f = n), d(g, n) && (f /= 40)),
        d(g, n) && ((j /= 40), (l /= 40), (m /= 40)),
        (j = Math[j >= 1 ? "floor" : "ceil"](j / f)),
        (l = Math[l >= 1 ? "floor" : "ceil"](l / f)),
        (m = Math[m >= 1 ? "floor" : "ceil"](m / f)),
        k.settings.normalizeOffset && this.getBoundingClientRect)
      ) {
        var s = this.getBoundingClientRect();
        (o = b.clientX - s.left), (p = b.clientY - s.top);
      }
      return (
        (b.deltaX = l),
        (b.deltaY = m),
        (b.deltaFactor = f),
        (b.offsetX = o),
        (b.offsetY = p),
        (b.deltaMode = 0),
        h.unshift(b, j, l, m),
        e && clearTimeout(e),
        (e = setTimeout(c, 200)),
        (a.event.dispatch || a.event.handle).apply(this, h)
      );
    }
  }
  function c() {
    f = null;
  }
  function d(a, b) {
    return (
      k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
    );
  }
  var e,
    f,
    g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
    h =
      "onwheel" in document || document.documentMode >= 9
        ? ["wheel"]
        : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
    i = Array.prototype.slice;
  if (a.event.fixHooks)
    for (var j = g.length; j; ) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
  var k = (a.event.special.mousewheel = {
    version: "3.1.12",
    setup: function () {
      if (this.addEventListener)
        for (var c = h.length; c; ) this.addEventListener(h[--c], b, !1);
      else this.onmousewheel = b;
      a.data(this, "mousewheel-line-height", k.getLineHeight(this)),
        a.data(this, "mousewheel-page-height", k.getPageHeight(this));
    },
    teardown: function () {
      if (this.removeEventListener)
        for (var c = h.length; c; ) this.removeEventListener(h[--c], b, !1);
      else this.onmousewheel = null;
      a.removeData(this, "mousewheel-line-height"),
        a.removeData(this, "mousewheel-page-height");
    },
    getLineHeight: function (b) {
      var c = a(b),
        d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
      return (
        d.length || (d = a("body")),
        parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
      );
    },
    getPageHeight: function (b) {
      return a(b).height();
    },
    settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
  });
  a.fn.extend({
    mousewheel: function (a) {
      return a ? this.bind("mousewheel", a) : this.trigger("mousewheel");
    },
    unmousewheel: function (a) {
      return this.unbind("mousewheel", a);
    },
  });
});
/*-----------------------------------------------------------------------------------*/
/*	09. VALIDATOR
/*-----------------------------------------------------------------------------------*/
/*!
 * Validator v0.11.9 for Bootstrap 3, by @1000hz
 * Copyright 2017 Cina Saffary
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */

+(function (a) {
  "use strict";
  function b(b) {
    return b.is('[type="checkbox"]')
      ? b.prop("checked")
      : b.is('[type="radio"]')
      ? !!a('[name="' + b.attr("name") + '"]:checked').length
      : b.is("select[multiple]")
      ? (b.val() || []).length
      : b.val();
  }
  function c(b) {
    return this.each(function () {
      var c = a(this),
        e = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b),
        f = c.data("bs.validator");
      (f || "destroy" != b) &&
        (f || c.data("bs.validator", (f = new d(this, e))),
        "string" == typeof b && f[b]());
    });
  }
  var d = function (c, e) {
    (this.options = e),
      (this.validators = a.extend({}, d.VALIDATORS, e.custom)),
      (this.$element = a(c)),
      (this.$btn = a('button[type="submit"], input[type="submit"]')
        .filter('[form="' + this.$element.attr("id") + '"]')
        .add(
          this.$element.find('input[type="submit"], button[type="submit"]')
        )),
      this.update(),
      this.$element.on(
        "input.bs.validator change.bs.validator focusout.bs.validator",
        a.proxy(this.onInput, this)
      ),
      this.$element.on("submit.bs.validator", a.proxy(this.onSubmit, this)),
      this.$element.on("reset.bs.validator", a.proxy(this.reset, this)),
      this.$element.find("[data-match]").each(function () {
        var c = a(this),
          d = c.attr("data-match");
        a(d).on("input.bs.validator", function () {
          b(c) && c.trigger("input.bs.validator");
        });
      }),
      this.$inputs
        .filter(function () {
          return b(a(this)) && !a(this).closest(".has-error").length;
        })
        .trigger("focusout"),
      this.$element.attr("novalidate", !0);
  };
  (d.VERSION = "0.11.9"),
    (d.INPUT_SELECTOR =
      ':input:not([type="hidden"], [type="submit"], [type="reset"], button)'),
    (d.FOCUS_OFFSET = 20),
    (d.DEFAULTS = {
      delay: 500,
      html: !1,
      disable: !0,
      focus: !0,
      custom: {},
      errors: { match: "Does not match", minlength: "Not long enough" },
      feedback: { success: "glyphicon-ok", error: "glyphicon-remove" },
    }),
    (d.VALIDATORS = {
      native: function (a) {
        var b = a[0];
        return b.checkValidity
          ? !b.checkValidity() &&
              !b.validity.valid &&
              (b.validationMessage || "error!")
          : void 0;
      },
      match: function (b) {
        var c = b.attr("data-match");
        return b.val() !== a(c).val() && d.DEFAULTS.errors.match;
      },
      minlength: function (a) {
        var b = a.attr("data-minlength");
        return a.val().length < b && d.DEFAULTS.errors.minlength;
      },
    }),
    (d.prototype.update = function () {
      var b = this;
      return (
        (this.$inputs = this.$element
          .find(d.INPUT_SELECTOR)
          .add(this.$element.find('[data-validate="true"]'))
          .not(
            this.$element.find('[data-validate="false"]').each(function () {
              b.clearErrors(a(this));
            })
          )),
        this.toggleSubmit(),
        this
      );
    }),
    (d.prototype.onInput = function (b) {
      var c = this,
        d = a(b.target),
        e = "focusout" !== b.type;
      this.$inputs.is(d) &&
        this.validateInput(d, e).done(function () {
          c.toggleSubmit();
        });
    }),
    (d.prototype.validateInput = function (c, d) {
      var e = (b(c), c.data("bs.validator.errors"));
      c.is('[type="radio"]') &&
        (c = this.$element.find('input[name="' + c.attr("name") + '"]'));
      var f = a.Event("validate.bs.validator", { relatedTarget: c[0] });
      if ((this.$element.trigger(f), !f.isDefaultPrevented())) {
        var g = this;
        return this.runValidators(c).done(function (b) {
          c.data("bs.validator.errors", b),
            b.length
              ? d
                ? g.defer(c, g.showErrors)
                : g.showErrors(c)
              : g.clearErrors(c),
            (e && b.toString() === e.toString()) ||
              ((f = b.length
                ? a.Event("invalid.bs.validator", {
                    relatedTarget: c[0],
                    detail: b,
                  })
                : a.Event("valid.bs.validator", {
                    relatedTarget: c[0],
                    detail: e,
                  })),
              g.$element.trigger(f)),
            g.toggleSubmit(),
            g.$element.trigger(
              a.Event("validated.bs.validator", { relatedTarget: c[0] })
            );
        });
      }
    }),
    (d.prototype.runValidators = function (c) {
      function d(a) {
        return c.attr("data-" + a + "-error");
      }
      function e() {
        var a = c[0].validity;
        return a.typeMismatch
          ? c.attr("data-type-error")
          : a.patternMismatch
          ? c.attr("data-pattern-error")
          : a.stepMismatch
          ? c.attr("data-step-error")
          : a.rangeOverflow
          ? c.attr("data-max-error")
          : a.rangeUnderflow
          ? c.attr("data-min-error")
          : a.valueMissing
          ? c.attr("data-required-error")
          : null;
      }
      function f() {
        return c.attr("data-error");
      }
      function g(a) {
        return d(a) || e() || f();
      }
      var h = [],
        i = a.Deferred();
      return (
        c.data("bs.validator.deferred") &&
          c.data("bs.validator.deferred").reject(),
        c.data("bs.validator.deferred", i),
        a.each(
          this.validators,
          a.proxy(function (a, d) {
            var e = null;
            (!b(c) && !c.attr("required")) ||
              (void 0 === c.attr("data-" + a) && "native" != a) ||
              !(e = d.call(this, c)) ||
              ((e = g(a) || e), !~h.indexOf(e) && h.push(e));
          }, this)
        ),
        !h.length && b(c) && c.attr("data-remote")
          ? this.defer(c, function () {
              var d = {};
              (d[c.attr("name")] = b(c)),
                a
                  .get(c.attr("data-remote"), d)
                  .fail(function (a, b, c) {
                    h.push(g("remote") || c);
                  })
                  .always(function () {
                    i.resolve(h);
                  });
            })
          : i.resolve(h),
        i.promise()
      );
    }),
    (d.prototype.validate = function () {
      var b = this;
      return (
        a
          .when(
            this.$inputs.map(function () {
              return b.validateInput(a(this), !1);
            })
          )
          .then(function () {
            b.toggleSubmit(), b.focusError();
          }),
        this
      );
    }),
    (d.prototype.focusError = function () {
      if (this.options.focus) {
        var b = this.$element.find(".has-error :input:first");
        0 !== b.length &&
          (a("html, body").animate(
            { scrollTop: b.offset().top - d.FOCUS_OFFSET },
            250
          ),
          b.focus());
      }
    }),
    (d.prototype.showErrors = function (b) {
      var c = this.options.html ? "html" : "text",
        d = b.data("bs.validator.errors"),
        e = b.closest(".form-label-group"),
        f = e.find(".help-block.with-errors"),
        g = e.find(".form-control-feedback");
      d.length &&
        ((d = a("<ul/>")
          .addClass("list-unstyled mb-0")
          .append(
            a.map(d, function (b) {
              return a("<li/>")[c](b);
            })
          )),
        void 0 === f.data("bs.validator.originalContent") &&
          f.data("bs.validator.originalContent", f.html()),
        f.empty().append(d),
        e.addClass("has-error has-danger"),
        e.hasClass("has-feedback") &&
          g.removeClass(this.options.feedback.success) &&
          g.addClass(this.options.feedback.error) &&
          e.removeClass("has-success"));
    }),
    (d.prototype.clearErrors = function (a) {
      var c = a.closest(".form-label-group"),
        d = c.find(".help-block.with-errors"),
        e = c.find(".form-control-feedback");
      d.html(d.data("bs.validator.originalContent")),
        c.removeClass("has-error has-danger has-success"),
        c.hasClass("has-feedback") &&
          e.removeClass(this.options.feedback.error) &&
          e.removeClass(this.options.feedback.success) &&
          b(a) &&
          e.addClass(this.options.feedback.success) &&
          c.addClass("has-success");
    }),
    (d.prototype.hasErrors = function () {
      function b() {
        return !!(a(this).data("bs.validator.errors") || []).length;
      }
      return !!this.$inputs.filter(b).length;
    }),
    (d.prototype.isIncomplete = function () {
      function c() {
        var c = b(a(this));
        return !("string" == typeof c ? a.trim(c) : c);
      }
      return !!this.$inputs.filter("[required]").filter(c).length;
    }),
    (d.prototype.onSubmit = function (a) {
      this.validate(),
        (this.isIncomplete() || this.hasErrors()) && a.preventDefault();
    }),
    (d.prototype.toggleSubmit = function () {
      this.options.disable &&
        this.$btn.toggleClass(
          "disabled",
          this.isIncomplete() || this.hasErrors()
        );
    }),
    (d.prototype.defer = function (b, c) {
      return (
        (c = a.proxy(c, this, b)),
        this.options.delay
          ? (window.clearTimeout(b.data("bs.validator.timeout")),
            void b.data(
              "bs.validator.timeout",
              window.setTimeout(c, this.options.delay)
            ))
          : c()
      );
    }),
    (d.prototype.reset = function () {
      return (
        this.$element
          .find(".form-control-feedback")
          .removeClass(this.options.feedback.error)
          .removeClass(this.options.feedback.success),
        this.$inputs
          .removeData(["bs.validator.errors", "bs.validator.deferred"])
          .each(function () {
            var b = a(this),
              c = b.data("bs.validator.timeout");
            window.clearTimeout(c) && b.removeData("bs.validator.timeout");
          }),
        this.$element.find(".help-block.with-errors").each(function () {
          var b = a(this),
            c = b.data("bs.validator.originalContent");
          b.removeData("bs.validator.originalContent").html(c);
        }),
        this.$btn.removeClass("disabled"),
        this.$element
          .find(".has-error, .has-danger, .has-success")
          .removeClass("has-error has-danger has-success"),
        this
      );
    }),
    (d.prototype.destroy = function () {
      return (
        this.reset(),
        this.$element
          .removeAttr("novalidate")
          .removeData("bs.validator")
          .off(".bs.validator"),
        this.$inputs.off(".bs.validator"),
        (this.options = null),
        (this.validators = null),
        (this.$element = null),
        (this.$btn = null),
        (this.$inputs = null),
        this
      );
    });
  var e = a.fn.validator;
  (a.fn.validator = c),
    (a.fn.validator.Constructor = d),
    (a.fn.validator.noConflict = function () {
      return (a.fn.validator = e), this;
    }),
    a(window).on("load", function () {
      a('form[data-toggle="validator"]').each(function () {
        var b = a(this);
        c.call(b, b.data());
      });
    });
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	10. PROGRESSBAR
/*-----------------------------------------------------------------------------------*/
// ProgressBar.js 1.0.1
// https://kimmobrunfeldt.github.io/progressbar.js
// License: MIT
!(function (a) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    (b =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (b.ProgressBar = a());
  }
})(function () {
  var a;
  return (function b(a, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!a[g]) {
          var i = "function" == typeof require && require;
          if (!h && i) return i(g, !0);
          if (f) return f(g, !0);
          var j = new Error("Cannot find module '" + g + "'");
          throw ((j.code = "MODULE_NOT_FOUND"), j);
        }
        var k = (c[g] = { exports: {} });
        a[g][0].call(
          k.exports,
          function (b) {
            var c = a[g][1][b];
            return e(c ? c : b);
          },
          k,
          k.exports,
          b,
          a,
          c,
          d
        );
      }
      return c[g].exports;
    }
    for (
      var f = "function" == typeof require && require, g = 0;
      g < d.length;
      g++
    )
      e(d[g]);
    return e;
  })(
    {
      1: [
        function (b, c, d) {
          (function () {
            var b = this || Function("return this")(),
              e = (function () {
                "use strict";
                function e() {}
                function f(a, b) {
                  var c;
                  for (c in a) Object.hasOwnProperty.call(a, c) && b(c);
                }
                function g(a, b) {
                  return (
                    f(b, function (c) {
                      a[c] = b[c];
                    }),
                    a
                  );
                }
                function h(a, b) {
                  f(b, function (c) {
                    "undefined" == typeof a[c] && (a[c] = b[c]);
                  });
                }
                function i(a, b, c, d, e, f, g) {
                  var h,
                    i,
                    k,
                    l = f > a ? 0 : (a - f) / e;
                  for (h in b)
                    b.hasOwnProperty(h) &&
                      ((i = g[h]),
                      (k = "function" == typeof i ? i : o[i]),
                      (b[h] = j(c[h], d[h], k, l)));
                  return b;
                }
                function j(a, b, c, d) {
                  return a + (b - a) * c(d);
                }
                function k(a, b) {
                  var c = n.prototype.filter,
                    d = a._filterArgs;
                  f(c, function (e) {
                    "undefined" != typeof c[e][b] && c[e][b].apply(a, d);
                  });
                }
                function l(a, b, c, d, e, f, g, h, j, l, m) {
                  (v = b + c + d),
                    (w = Math.min(m || u(), v)),
                    (x = w >= v),
                    (y = d - (v - w)),
                    a.isPlaying() &&
                      (x
                        ? (j(g, a._attachment, y), a.stop(!0))
                        : ((a._scheduleId = l(a._timeoutHandler, s)),
                          k(a, "beforeTween"),
                          b + c > w
                            ? i(1, e, f, g, 1, 1, h)
                            : i(w, e, f, g, d, b + c, h),
                          k(a, "afterTween"),
                          j(e, a._attachment, y)));
                }
                function m(a, b) {
                  var c = {},
                    d = typeof b;
                  return (
                    "string" === d || "function" === d
                      ? f(a, function (a) {
                          c[a] = b;
                        })
                      : f(a, function (a) {
                          c[a] || (c[a] = b[a] || q);
                        }),
                    c
                  );
                }
                function n(a, b) {
                  (this._currentState = a || {}),
                    (this._configured = !1),
                    (this._scheduleFunction = p),
                    "undefined" != typeof b && this.setConfig(b);
                }
                var o,
                  p,
                  q = "linear",
                  r = 500,
                  s = 1e3 / 60,
                  t = Date.now
                    ? Date.now
                    : function () {
                        return +new Date();
                      },
                  u =
                    "undefined" != typeof SHIFTY_DEBUG_NOW
                      ? SHIFTY_DEBUG_NOW
                      : t;
                p =
                  "undefined" != typeof window
                    ? window.requestAnimationFrame ||
                      window.webkitRequestAnimationFrame ||
                      window.oRequestAnimationFrame ||
                      window.msRequestAnimationFrame ||
                      (window.mozCancelRequestAnimationFrame &&
                        window.mozRequestAnimationFrame) ||
                      setTimeout
                    : setTimeout;
                var v, w, x, y;
                return (
                  (n.prototype.tween = function (a) {
                    return this._isTweening
                      ? this
                      : ((void 0 === a && this._configured) ||
                          this.setConfig(a),
                        (this._timestamp = u()),
                        this._start(this.get(), this._attachment),
                        this.resume());
                  }),
                  (n.prototype.setConfig = function (a) {
                    (a = a || {}),
                      (this._configured = !0),
                      (this._attachment = a.attachment),
                      (this._pausedAtTime = null),
                      (this._scheduleId = null),
                      (this._delay = a.delay || 0),
                      (this._start = a.start || e),
                      (this._step = a.step || e),
                      (this._finish = a.finish || e),
                      (this._duration = a.duration || r),
                      (this._currentState = g({}, a.from) || this.get()),
                      (this._originalState = this.get()),
                      (this._targetState = g({}, a.to) || this.get());
                    var b = this;
                    this._timeoutHandler = function () {
                      l(
                        b,
                        b._timestamp,
                        b._delay,
                        b._duration,
                        b._currentState,
                        b._originalState,
                        b._targetState,
                        b._easing,
                        b._step,
                        b._scheduleFunction
                      );
                    };
                    var c = this._currentState,
                      d = this._targetState;
                    return (
                      h(d, c),
                      (this._easing = m(c, a.easing || q)),
                      (this._filterArgs = [
                        c,
                        this._originalState,
                        d,
                        this._easing,
                      ]),
                      k(this, "tweenCreated"),
                      this
                    );
                  }),
                  (n.prototype.get = function () {
                    return g({}, this._currentState);
                  }),
                  (n.prototype.set = function (a) {
                    this._currentState = a;
                  }),
                  (n.prototype.pause = function () {
                    return (
                      (this._pausedAtTime = u()), (this._isPaused = !0), this
                    );
                  }),
                  (n.prototype.resume = function () {
                    return (
                      this._isPaused &&
                        (this._timestamp += u() - this._pausedAtTime),
                      (this._isPaused = !1),
                      (this._isTweening = !0),
                      this._timeoutHandler(),
                      this
                    );
                  }),
                  (n.prototype.seek = function (a) {
                    a = Math.max(a, 0);
                    var b = u();
                    return this._timestamp + a === 0
                      ? this
                      : ((this._timestamp = b - a),
                        this.isPlaying() ||
                          ((this._isTweening = !0),
                          (this._isPaused = !1),
                          l(
                            this,
                            this._timestamp,
                            this._delay,
                            this._duration,
                            this._currentState,
                            this._originalState,
                            this._targetState,
                            this._easing,
                            this._step,
                            this._scheduleFunction,
                            b
                          ),
                          this.pause()),
                        this);
                  }),
                  (n.prototype.stop = function (a) {
                    return (
                      (this._isTweening = !1),
                      (this._isPaused = !1),
                      (this._timeoutHandler = e),
                      (
                        b.cancelAnimationFrame ||
                        b.webkitCancelAnimationFrame ||
                        b.oCancelAnimationFrame ||
                        b.msCancelAnimationFrame ||
                        b.mozCancelRequestAnimationFrame ||
                        b.clearTimeout
                      )(this._scheduleId),
                      a &&
                        (k(this, "beforeTween"),
                        i(
                          1,
                          this._currentState,
                          this._originalState,
                          this._targetState,
                          1,
                          0,
                          this._easing
                        ),
                        k(this, "afterTween"),
                        k(this, "afterTweenEnd"),
                        this._finish.call(
                          this,
                          this._currentState,
                          this._attachment
                        )),
                      this
                    );
                  }),
                  (n.prototype.isPlaying = function () {
                    return this._isTweening && !this._isPaused;
                  }),
                  (n.prototype.setScheduleFunction = function (a) {
                    this._scheduleFunction = a;
                  }),
                  (n.prototype.dispose = function () {
                    var a;
                    for (a in this) this.hasOwnProperty(a) && delete this[a];
                  }),
                  (n.prototype.filter = {}),
                  (n.prototype.formula = {
                    linear: function (a) {
                      return a;
                    },
                  }),
                  (o = n.prototype.formula),
                  g(n, {
                    now: u,
                    each: f,
                    tweenProps: i,
                    tweenProp: j,
                    applyFilter: k,
                    shallowCopy: g,
                    defaults: h,
                    composeEasingObject: m,
                  }),
                  "function" == typeof SHIFTY_DEBUG_NOW &&
                    (b.timeoutHandler = l),
                  "object" == typeof d
                    ? (c.exports = n)
                    : "function" == typeof a && a.amd
                    ? a(function () {
                        return n;
                      })
                    : "undefined" == typeof b.Tweenable && (b.Tweenable = n),
                  n
                );
              })();
            !(function () {
              e.shallowCopy(e.prototype.formula, {
                easeInQuad: function (a) {
                  return Math.pow(a, 2);
                },
                easeOutQuad: function (a) {
                  return -(Math.pow(a - 1, 2) - 1);
                },
                easeInOutQuad: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 2)
                    : -0.5 * ((a -= 2) * a - 2);
                },
                easeInCubic: function (a) {
                  return Math.pow(a, 3);
                },
                easeOutCubic: function (a) {
                  return Math.pow(a - 1, 3) + 1;
                },
                easeInOutCubic: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 3)
                    : 0.5 * (Math.pow(a - 2, 3) + 2);
                },
                easeInQuart: function (a) {
                  return Math.pow(a, 4);
                },
                easeOutQuart: function (a) {
                  return -(Math.pow(a - 1, 4) - 1);
                },
                easeInOutQuart: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 4)
                    : -0.5 * ((a -= 2) * Math.pow(a, 3) - 2);
                },
                easeInQuint: function (a) {
                  return Math.pow(a, 5);
                },
                easeOutQuint: function (a) {
                  return Math.pow(a - 1, 5) + 1;
                },
                easeInOutQuint: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 5)
                    : 0.5 * (Math.pow(a - 2, 5) + 2);
                },
                easeInSine: function (a) {
                  return -Math.cos(a * (Math.PI / 2)) + 1;
                },
                easeOutSine: function (a) {
                  return Math.sin(a * (Math.PI / 2));
                },
                easeInOutSine: function (a) {
                  return -0.5 * (Math.cos(Math.PI * a) - 1);
                },
                easeInExpo: function (a) {
                  return 0 === a ? 0 : Math.pow(2, 10 * (a - 1));
                },
                easeOutExpo: function (a) {
                  return 1 === a ? 1 : -Math.pow(2, -10 * a) + 1;
                },
                easeInOutExpo: function (a) {
                  return 0 === a
                    ? 0
                    : 1 === a
                    ? 1
                    : (a /= 0.5) < 1
                    ? 0.5 * Math.pow(2, 10 * (a - 1))
                    : 0.5 * (-Math.pow(2, -10 * --a) + 2);
                },
                easeInCirc: function (a) {
                  return -(Math.sqrt(1 - a * a) - 1);
                },
                easeOutCirc: function (a) {
                  return Math.sqrt(1 - Math.pow(a - 1, 2));
                },
                easeInOutCirc: function (a) {
                  return (a /= 0.5) < 1
                    ? -0.5 * (Math.sqrt(1 - a * a) - 1)
                    : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
                },
                easeOutBounce: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75
                    : 2.5 / 2.75 > a
                    ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375
                    : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
                },
                easeInBack: function (a) {
                  var b = 1.70158;
                  return a * a * ((b + 1) * a - b);
                },
                easeOutBack: function (a) {
                  var b = 1.70158;
                  return (a -= 1) * a * ((b + 1) * a + b) + 1;
                },
                easeInOutBack: function (a) {
                  var b = 1.70158;
                  return (a /= 0.5) < 1
                    ? 0.5 * (a * a * (((b *= 1.525) + 1) * a - b))
                    : 0.5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2);
                },
                elastic: function (a) {
                  return (
                    -1 *
                      Math.pow(4, -8 * a) *
                      Math.sin(((6 * a - 1) * (2 * Math.PI)) / 2) +
                    1
                  );
                },
                swingFromTo: function (a) {
                  var b = 1.70158;
                  return (a /= 0.5) < 1
                    ? 0.5 * (a * a * (((b *= 1.525) + 1) * a - b))
                    : 0.5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2);
                },
                swingFrom: function (a) {
                  var b = 1.70158;
                  return a * a * ((b + 1) * a - b);
                },
                swingTo: function (a) {
                  var b = 1.70158;
                  return (a -= 1) * a * ((b + 1) * a + b) + 1;
                },
                bounce: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75
                    : 2.5 / 2.75 > a
                    ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375
                    : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
                },
                bouncePast: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 2 - (7.5625 * (a -= 1.5 / 2.75) * a + 0.75)
                    : 2.5 / 2.75 > a
                    ? 2 - (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375)
                    : 2 - (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375);
                },
                easeFromTo: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 4)
                    : -0.5 * ((a -= 2) * Math.pow(a, 3) - 2);
                },
                easeFrom: function (a) {
                  return Math.pow(a, 4);
                },
                easeTo: function (a) {
                  return Math.pow(a, 0.25);
                },
              });
            })(),
              (function () {
                function a(a, b, c, d, e, f) {
                  function g(a) {
                    return ((n * a + o) * a + p) * a;
                  }
                  function h(a) {
                    return ((q * a + r) * a + s) * a;
                  }
                  function i(a) {
                    return (3 * n * a + 2 * o) * a + p;
                  }
                  function j(a) {
                    return 1 / (200 * a);
                  }
                  function k(a, b) {
                    return h(m(a, b));
                  }
                  function l(a) {
                    return a >= 0 ? a : 0 - a;
                  }
                  function m(a, b) {
                    var c, d, e, f, h, j;
                    for (e = a, j = 0; 8 > j; j++) {
                      if (((f = g(e) - a), l(f) < b)) return e;
                      if (((h = i(e)), l(h) < 1e-6)) break;
                      e -= f / h;
                    }
                    if (((c = 0), (d = 1), (e = a), c > e)) return c;
                    if (e > d) return d;
                    for (; d > c; ) {
                      if (((f = g(e)), l(f - a) < b)) return e;
                      a > f ? (c = e) : (d = e), (e = 0.5 * (d - c) + c);
                    }
                    return e;
                  }
                  var n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0;
                  return (
                    (p = 3 * b),
                    (o = 3 * (d - b) - p),
                    (n = 1 - p - o),
                    (s = 3 * c),
                    (r = 3 * (e - c) - s),
                    (q = 1 - s - r),
                    k(a, j(f))
                  );
                }
                function b(b, c, d, e) {
                  return function (f) {
                    return a(f, b, c, d, e, 1);
                  };
                }
                (e.setBezierFunction = function (a, c, d, f, g) {
                  var h = b(c, d, f, g);
                  return (
                    (h.displayName = a),
                    (h.x1 = c),
                    (h.y1 = d),
                    (h.x2 = f),
                    (h.y2 = g),
                    (e.prototype.formula[a] = h)
                  );
                }),
                  (e.unsetBezierFunction = function (a) {
                    delete e.prototype.formula[a];
                  });
              })(),
              (function () {
                function a(a, b, c, d, f, g) {
                  return e.tweenProps(d, b, a, c, 1, g, f);
                }
                var b = new e();
                (b._filterArgs = []),
                  (e.interpolate = function (c, d, f, g, h) {
                    var i = e.shallowCopy({}, c),
                      j = h || 0,
                      k = e.composeEasingObject(c, g || "linear");
                    b.set({});
                    var l = b._filterArgs;
                    (l.length = 0),
                      (l[0] = i),
                      (l[1] = c),
                      (l[2] = d),
                      (l[3] = k),
                      e.applyFilter(b, "tweenCreated"),
                      e.applyFilter(b, "beforeTween");
                    var m = a(c, i, d, f, k, j);
                    return e.applyFilter(b, "afterTween"), m;
                  });
              })(),
              (function (a) {
                function b(a, b) {
                  var c,
                    d = [],
                    e = a.length;
                  for (c = 0; e > c; c++) d.push("_" + b + "_" + c);
                  return d;
                }
                function c(a) {
                  var b = a.match(v);
                  return (
                    b
                      ? (1 === b.length || a[0].match(u)) && b.unshift("")
                      : (b = ["", ""]),
                    b.join(A)
                  );
                }
                function d(b) {
                  a.each(b, function (a) {
                    var c = b[a];
                    "string" == typeof c && c.match(z) && (b[a] = e(c));
                  });
                }
                function e(a) {
                  return i(z, a, f);
                }
                function f(a) {
                  var b = g(a);
                  return "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")";
                }
                function g(a) {
                  return (
                    (a = a.replace(/#/, "")),
                    3 === a.length &&
                      ((a = a.split("")),
                      (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2])),
                    (B[0] = h(a.substr(0, 2))),
                    (B[1] = h(a.substr(2, 2))),
                    (B[2] = h(a.substr(4, 2))),
                    B
                  );
                }
                function h(a) {
                  return parseInt(a, 16);
                }
                function i(a, b, c) {
                  var d = b.match(a),
                    e = b.replace(a, A);
                  if (d)
                    for (var f, g = d.length, h = 0; g > h; h++)
                      (f = d.shift()), (e = e.replace(A, c(f)));
                  return e;
                }
                function j(a) {
                  return i(x, a, k);
                }
                function k(a) {
                  for (
                    var b = a.match(w), c = b.length, d = a.match(y)[0], e = 0;
                    c > e;
                    e++
                  )
                    d += parseInt(b[e], 10) + ",";
                  return (d = d.slice(0, -1) + ")");
                }
                function l(d) {
                  var e = {};
                  return (
                    a.each(d, function (a) {
                      var f = d[a];
                      if ("string" == typeof f) {
                        var g = r(f);
                        e[a] = { formatString: c(f), chunkNames: b(g, a) };
                      }
                    }),
                    e
                  );
                }
                function m(b, c) {
                  a.each(c, function (a) {
                    for (
                      var d = b[a], e = r(d), f = e.length, g = 0;
                      f > g;
                      g++
                    )
                      b[c[a].chunkNames[g]] = +e[g];
                    delete b[a];
                  });
                }
                function n(b, c) {
                  a.each(c, function (a) {
                    var d = b[a],
                      e = o(b, c[a].chunkNames),
                      f = p(e, c[a].chunkNames);
                    (d = q(c[a].formatString, f)), (b[a] = j(d));
                  });
                }
                function o(a, b) {
                  for (var c, d = {}, e = b.length, f = 0; e > f; f++)
                    (c = b[f]), (d[c] = a[c]), delete a[c];
                  return d;
                }
                function p(a, b) {
                  C.length = 0;
                  for (var c = b.length, d = 0; c > d; d++) C.push(a[b[d]]);
                  return C;
                }
                function q(a, b) {
                  for (var c = a, d = b.length, e = 0; d > e; e++)
                    c = c.replace(A, +b[e].toFixed(4));
                  return c;
                }
                function r(a) {
                  return a.match(w);
                }
                function s(b, c) {
                  a.each(c, function (a) {
                    var d,
                      e = c[a],
                      f = e.chunkNames,
                      g = f.length,
                      h = b[a];
                    if ("string" == typeof h) {
                      var i = h.split(" "),
                        j = i[i.length - 1];
                      for (d = 0; g > d; d++) b[f[d]] = i[d] || j;
                    } else for (d = 0; g > d; d++) b[f[d]] = h;
                    delete b[a];
                  });
                }
                function t(b, c) {
                  a.each(c, function (a) {
                    var d = c[a],
                      e = d.chunkNames,
                      f = e.length,
                      g = b[e[0]],
                      h = typeof g;
                    if ("string" === h) {
                      for (var i = "", j = 0; f > j; j++)
                        (i += " " + b[e[j]]), delete b[e[j]];
                      b[a] = i.substr(1);
                    } else b[a] = g;
                  });
                }
                var u = /(\d|\-|\.)/,
                  v = /([^\-0-9\.]+)/g,
                  w = /[0-9.\-]+/g,
                  x = new RegExp(
                    "rgb\\(" +
                      w.source +
                      /,\s*/.source +
                      w.source +
                      /,\s*/.source +
                      w.source +
                      "\\)",
                    "g"
                  ),
                  y = /^.*\(/,
                  z = /#([0-9]|[a-f]){3,6}/gi,
                  A = "VAL",
                  B = [],
                  C = [];
                a.prototype.filter.token = {
                  tweenCreated: function (a, b, c, e) {
                    d(a), d(b), d(c), (this._tokenData = l(a));
                  },
                  beforeTween: function (a, b, c, d) {
                    s(d, this._tokenData),
                      m(a, this._tokenData),
                      m(b, this._tokenData),
                      m(c, this._tokenData);
                  },
                  afterTween: function (a, b, c, d) {
                    n(a, this._tokenData),
                      n(b, this._tokenData),
                      n(c, this._tokenData),
                      t(d, this._tokenData);
                  },
                };
              })(e);
          }.call(null));
        },
        {},
      ],
      2: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./utils"),
            f = function (a, b) {
              (this._pathTemplate =
                "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}"),
                (this.containerAspectRatio = 1),
                d.apply(this, arguments);
            };
          (f.prototype = new d()),
            (f.prototype.constructor = f),
            (f.prototype._pathString = function (a) {
              var b = a.strokeWidth;
              a.trailWidth &&
                a.trailWidth > a.strokeWidth &&
                (b = a.trailWidth);
              var c = 50 - b / 2;
              return e.render(this._pathTemplate, {
                radius: c,
                "2radius": 2 * c,
              });
            }),
            (f.prototype._trailString = function (a) {
              return this._pathString(a);
            }),
            (b.exports = f);
        },
        { "./shape": 7, "./utils": 8 },
      ],
      3: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./utils"),
            f = function (a, b) {
              (this._pathTemplate = "M 0,{center} L 100,{center}"),
                d.apply(this, arguments);
            };
          (f.prototype = new d()),
            (f.prototype.constructor = f),
            (f.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 " + b.strokeWidth),
                a.setAttribute("preserveAspectRatio", "none");
            }),
            (f.prototype._pathString = function (a) {
              return e.render(this._pathTemplate, {
                center: a.strokeWidth / 2,
              });
            }),
            (f.prototype._trailString = function (a) {
              return this._pathString(a);
            }),
            (b.exports = f);
        },
        { "./shape": 7, "./utils": 8 },
      ],
      4: [
        function (a, b, c) {
          b.exports = {
            Line: a("./line"),
            Circle: a("./circle"),
            SemiCircle: a("./semicircle"),
            Path: a("./path"),
            Shape: a("./shape"),
            utils: a("./utils"),
          };
        },
        {
          "./circle": 2,
          "./line": 3,
          "./path": 5,
          "./semicircle": 6,
          "./shape": 7,
          "./utils": 8,
        },
      ],
      5: [
        function (a, b, c) {
          var d = a("shifty"),
            e = a("./utils"),
            f = {
              easeIn: "easeInCubic",
              easeOut: "easeOutCubic",
              easeInOut: "easeInOutCubic",
            },
            g = function h(a, b) {
              if (!(this instanceof h))
                throw new Error("Constructor was called without new keyword");
              b = e.extend(
                {
                  duration: 800,
                  easing: "linear",
                  from: {},
                  to: {},
                  step: function () {},
                },
                b
              );
              var c;
              (c = e.isString(a) ? document.querySelector(a) : a),
                (this.path = c),
                (this._opts = b),
                (this._tweenable = null);
              var d = this.path.getTotalLength();
              (this.path.style.strokeDasharray = d + " " + d), this.set(0);
            };
          (g.prototype.value = function () {
            var a = this._getComputedDashOffset(),
              b = this.path.getTotalLength(),
              c = 1 - a / b;
            return parseFloat(c.toFixed(6), 10);
          }),
            (g.prototype.set = function (a) {
              this.stop(),
                (this.path.style.strokeDashoffset = this._progressToOffset(a));
              var b = this._opts.step;
              if (e.isFunction(b)) {
                var c = this._easing(this._opts.easing),
                  d = this._calculateTo(a, c),
                  f = this._opts.shape || this;
                b(d, f, this._opts.attachment);
              }
            }),
            (g.prototype.stop = function () {
              this._stopTween(),
                (this.path.style.strokeDashoffset =
                  this._getComputedDashOffset());
            }),
            (g.prototype.animate = function (a, b, c) {
              (b = b || {}), e.isFunction(b) && ((c = b), (b = {}));
              var f = e.extend({}, b),
                g = e.extend({}, this._opts);
              b = e.extend(g, b);
              var h = this._easing(b.easing),
                i = this._resolveFromAndTo(a, h, f);
              this.stop(), this.path.getBoundingClientRect();
              var j = this._getComputedDashOffset(),
                k = this._progressToOffset(a),
                l = this;
              (this._tweenable = new d()),
                this._tweenable.tween({
                  from: e.extend({ offset: j }, i.from),
                  to: e.extend({ offset: k }, i.to),
                  duration: b.duration,
                  easing: h,
                  step: function (a) {
                    l.path.style.strokeDashoffset = a.offset;
                    var c = b.shape || l;
                    b.step(a, c, b.attachment);
                  },
                  finish: function (a) {
                    e.isFunction(c) && c();
                  },
                });
            }),
            (g.prototype._getComputedDashOffset = function () {
              var a = window.getComputedStyle(this.path, null);
              return parseFloat(a.getPropertyValue("stroke-dashoffset"), 10);
            }),
            (g.prototype._progressToOffset = function (a) {
              var b = this.path.getTotalLength();
              return b - a * b;
            }),
            (g.prototype._resolveFromAndTo = function (a, b, c) {
              return c.from && c.to
                ? { from: c.from, to: c.to }
                : { from: this._calculateFrom(b), to: this._calculateTo(a, b) };
            }),
            (g.prototype._calculateFrom = function (a) {
              return d.interpolate(
                this._opts.from,
                this._opts.to,
                this.value(),
                a
              );
            }),
            (g.prototype._calculateTo = function (a, b) {
              return d.interpolate(this._opts.from, this._opts.to, a, b);
            }),
            (g.prototype._stopTween = function () {
              null !== this._tweenable &&
                (this._tweenable.stop(), (this._tweenable = null));
            }),
            (g.prototype._easing = function (a) {
              return f.hasOwnProperty(a) ? f[a] : a;
            }),
            (b.exports = g);
        },
        { "./utils": 8, shifty: 1 },
      ],
      6: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./circle"),
            f = a("./utils"),
            g = function (a, b) {
              (this._pathTemplate =
                "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0"),
                (this.containerAspectRatio = 2),
                d.apply(this, arguments);
            };
          (g.prototype = new d()),
            (g.prototype.constructor = g),
            (g.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 50");
            }),
            (g.prototype._initializeTextContainer = function (a, b, c) {
              a.text.style &&
                ((c.style.top = "auto"),
                (c.style.bottom = "0"),
                a.text.alignToBottom
                  ? f.setStyle(c, "transform", "translate(-50%, 0)")
                  : f.setStyle(c, "transform", "translate(-50%, 50%)"));
            }),
            (g.prototype._pathString = e.prototype._pathString),
            (g.prototype._trailString = e.prototype._trailString),
            (b.exports = g);
        },
        { "./circle": 2, "./shape": 7, "./utils": 8 },
      ],
      7: [
        function (a, b, c) {
          var d = a("./path"),
            e = a("./utils"),
            f = "Object is destroyed",
            g = function h(a, b) {
              if (!(this instanceof h))
                throw new Error("Constructor was called without new keyword");
              if (0 !== arguments.length) {
                (this._opts = e.extend(
                  {
                    color: "#555",
                    strokeWidth: 1,
                    trailColor: null,
                    trailWidth: null,
                    fill: null,
                    text: {
                      style: {
                        color: null,
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        padding: 0,
                        margin: 0,
                        transform: {
                          prefix: !0,
                          value: "translate(-50%, -50%)",
                        },
                      },
                      autoStyleContainer: !0,
                      alignToBottom: !0,
                      value: null,
                      className: "progressbar-text",
                    },
                    svgStyle: { display: "block", width: "100%" },
                    warnings: !1,
                  },
                  b,
                  !0
                )),
                  e.isObject(b) &&
                    void 0 !== b.svgStyle &&
                    (this._opts.svgStyle = b.svgStyle),
                  e.isObject(b) &&
                    e.isObject(b.text) &&
                    void 0 !== b.text.style &&
                    (this._opts.text.style = b.text.style);
                var c,
                  f = this._createSvgView(this._opts);
                if (((c = e.isString(a) ? document.querySelector(a) : a), !c))
                  throw new Error("Container does not exist: " + a);
                (this._container = c),
                  this._container.appendChild(f.svg),
                  this._opts.warnings &&
                    this._warnContainerAspectRatio(this._container),
                  this._opts.svgStyle &&
                    e.setStyles(f.svg, this._opts.svgStyle),
                  (this.svg = f.svg),
                  (this.path = f.path),
                  (this.trail = f.trail),
                  (this.text = null);
                var g = e.extend(
                  { attachment: void 0, shape: this },
                  this._opts
                );
                (this._progressPath = new d(f.path, g)),
                  e.isObject(this._opts.text) &&
                    null !== this._opts.text.value &&
                    this.setText(this._opts.text.value);
              }
            };
          (g.prototype.animate = function (a, b, c) {
            if (null === this._progressPath) throw new Error(f);
            this._progressPath.animate(a, b, c);
          }),
            (g.prototype.stop = function () {
              if (null === this._progressPath) throw new Error(f);
              void 0 !== this._progressPath && this._progressPath.stop();
            }),
            (g.prototype.destroy = function () {
              if (null === this._progressPath) throw new Error(f);
              this.stop(),
                this.svg.parentNode.removeChild(this.svg),
                (this.svg = null),
                (this.path = null),
                (this.trail = null),
                (this._progressPath = null),
                null !== this.text &&
                  (this.text.parentNode.removeChild(this.text),
                  (this.text = null));
            }),
            (g.prototype.set = function (a) {
              if (null === this._progressPath) throw new Error(f);
              this._progressPath.set(a);
            }),
            (g.prototype.value = function () {
              if (null === this._progressPath) throw new Error(f);
              return void 0 === this._progressPath
                ? 0
                : this._progressPath.value();
            }),
            (g.prototype.setText = function (a) {
              if (null === this._progressPath) throw new Error(f);
              null === this.text &&
                ((this.text = this._createTextContainer(
                  this._opts,
                  this._container
                )),
                this._container.appendChild(this.text)),
                e.isObject(a)
                  ? (e.removeChildren(this.text), this.text.appendChild(a))
                  : (this.text.innerHTML = a);
            }),
            (g.prototype._createSvgView = function (a) {
              var b = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              this._initializeSvg(b, a);
              var c = null;
              (a.trailColor || a.trailWidth) &&
                ((c = this._createTrail(a)), b.appendChild(c));
              var d = this._createPath(a);
              return b.appendChild(d), { svg: b, path: d, trail: c };
            }),
            (g.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 100");
            }),
            (g.prototype._createPath = function (a) {
              var b = this._pathString(a);
              return this._createPathElement(b, a);
            }),
            (g.prototype._createTrail = function (a) {
              var b = this._trailString(a),
                c = e.extend({}, a);
              return (
                c.trailColor || (c.trailColor = "#eee"),
                c.trailWidth || (c.trailWidth = c.strokeWidth),
                (c.color = c.trailColor),
                (c.strokeWidth = c.trailWidth),
                (c.fill = null),
                this._createPathElement(b, c)
              );
            }),
            (g.prototype._createPathElement = function (a, b) {
              var c = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              return (
                c.setAttribute("d", a),
                c.setAttribute("stroke", b.color),
                c.setAttribute("stroke-width", b.strokeWidth),
                b.fill
                  ? c.setAttribute("fill", b.fill)
                  : c.setAttribute("fill-opacity", "0"),
                c
              );
            }),
            (g.prototype._createTextContainer = function (a, b) {
              var c = document.createElement("div");
              c.className = a.text.className;
              var d = a.text.style;
              return (
                d &&
                  (a.text.autoStyleContainer && (b.style.position = "relative"),
                  e.setStyles(c, d),
                  d.color || (c.style.color = a.color)),
                this._initializeTextContainer(a, b, c),
                c
              );
            }),
            (g.prototype._initializeTextContainer = function (a, b, c) {}),
            (g.prototype._pathString = function (a) {
              throw new Error("Override this function for each progress bar");
            }),
            (g.prototype._trailString = function (a) {
              throw new Error("Override this function for each progress bar");
            }),
            (g.prototype._warnContainerAspectRatio = function (a) {
              if (this.containerAspectRatio) {
                var b = window.getComputedStyle(a, null),
                  c = parseFloat(b.getPropertyValue("width"), 10),
                  d = parseFloat(b.getPropertyValue("height"), 10);
                e.floatEquals(this.containerAspectRatio, c / d) ||
                  (console.warn(
                    "Incorrect aspect ratio of container",
                    "#" + a.id,
                    "detected:",
                    b.getPropertyValue("width") + "(width)",
                    "/",
                    b.getPropertyValue("height") + "(height)",
                    "=",
                    c / d
                  ),
                  console.warn(
                    "Aspect ratio of should be",
                    this.containerAspectRatio
                  ));
              }
            }),
            (b.exports = g);
        },
        { "./path": 5, "./utils": 8 },
      ],
      8: [
        function (a, b, c) {
          function d(a, b, c) {
            (a = a || {}), (b = b || {}), (c = c || !1);
            for (var e in b)
              if (b.hasOwnProperty(e)) {
                var f = a[e],
                  g = b[e];
                c && l(f) && l(g) ? (a[e] = d(f, g, c)) : (a[e] = g);
              }
            return a;
          }
          function e(a, b) {
            var c = a;
            for (var d in b)
              if (b.hasOwnProperty(d)) {
                var e = b[d],
                  f = "\\{" + d + "\\}",
                  g = new RegExp(f, "g");
                c = c.replace(g, e);
              }
            return c;
          }
          function f(a, b, c) {
            for (var d = a.style, e = 0; e < p.length; ++e) {
              var f = p[e];
              d[f + h(b)] = c;
            }
            d[b] = c;
          }
          function g(a, b) {
            m(b, function (b, c) {
              null !== b &&
                void 0 !== b &&
                (l(b) && b.prefix === !0 ? f(a, c, b.value) : (a.style[c] = b));
            });
          }
          function h(a) {
            return a.charAt(0).toUpperCase() + a.slice(1);
          }
          function i(a) {
            return "string" == typeof a || a instanceof String;
          }
          function j(a) {
            return "function" == typeof a;
          }
          function k(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
          }
          function l(a) {
            if (k(a)) return !1;
            var b = typeof a;
            return "object" === b && !!a;
          }
          function m(a, b) {
            for (var c in a)
              if (a.hasOwnProperty(c)) {
                var d = a[c];
                b(d, c);
              }
          }
          function n(a, b) {
            return Math.abs(a - b) < q;
          }
          function o(a) {
            for (; a.firstChild; ) a.removeChild(a.firstChild);
          }
          var p = "Webkit Moz O ms".split(" "),
            q = 0.001;
          b.exports = {
            extend: d,
            render: e,
            setStyle: f,
            setStyles: g,
            capitalize: h,
            isString: i,
            isFunction: j,
            isObject: l,
            forEachObject: m,
            floatEquals: n,
            removeChildren: o,
          };
        },
        {},
      ],
    },
    {},
    [4]
  )(4);
});
/*-----------------------------------------------------------------------------------*/
/*	11. WAYPOINTS
/*-----------------------------------------------------------------------------------*/
/*!
Waypoints - 4.0.1
Copyright Â© 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!(function () {
  "use strict";
  function t(o) {
    if (!o) throw new Error("No options passed to Waypoint constructor");
    if (!o.element)
      throw new Error("No element option passed to Waypoint constructor");
    if (!o.handler)
      throw new Error("No handler option passed to Waypoint constructor");
    (this.key = "waypoint-" + e),
      (this.options = t.Adapter.extend({}, t.defaults, o)),
      (this.element = this.options.element),
      (this.adapter = new t.Adapter(this.element)),
      (this.callback = o.handler),
      (this.axis = this.options.horizontal ? "horizontal" : "vertical"),
      (this.enabled = this.options.enabled),
      (this.triggerPoint = null),
      (this.group = t.Group.findOrCreate({
        name: this.options.group,
        axis: this.axis,
      })),
      (this.context = t.Context.findOrCreateByElement(this.options.context)),
      t.offsetAliases[this.options.offset] &&
        (this.options.offset = t.offsetAliases[this.options.offset]),
      this.group.add(this),
      this.context.add(this),
      (i[this.key] = this),
      (e += 1);
  }
  var e = 0,
    i = {};
  (t.prototype.queueTrigger = function (t) {
    this.group.queueTrigger(this, t);
  }),
    (t.prototype.trigger = function (t) {
      this.enabled && this.callback && this.callback.apply(this, t);
    }),
    (t.prototype.destroy = function () {
      this.context.remove(this), this.group.remove(this), delete i[this.key];
    }),
    (t.prototype.disable = function () {
      return (this.enabled = !1), this;
    }),
    (t.prototype.enable = function () {
      return this.context.refresh(), (this.enabled = !0), this;
    }),
    (t.prototype.next = function () {
      return this.group.next(this);
    }),
    (t.prototype.previous = function () {
      return this.group.previous(this);
    }),
    (t.invokeAll = function (t) {
      var e = [];
      for (var o in i) e.push(i[o]);
      for (var n = 0, r = e.length; r > n; n++) e[n][t]();
    }),
    (t.destroyAll = function () {
      t.invokeAll("destroy");
    }),
    (t.disableAll = function () {
      t.invokeAll("disable");
    }),
    (t.enableAll = function () {
      t.Context.refreshAll();
      for (var e in i) i[e].enabled = !0;
      return this;
    }),
    (t.refreshAll = function () {
      t.Context.refreshAll();
    }),
    (t.viewportHeight = function () {
      return window.innerHeight || document.documentElement.clientHeight;
    }),
    (t.viewportWidth = function () {
      return document.documentElement.clientWidth;
    }),
    (t.adapters = []),
    (t.defaults = {
      context: window,
      continuous: !0,
      enabled: !0,
      group: "default",
      horizontal: !1,
      offset: 0,
    }),
    (t.offsetAliases = {
      "bottom-in-view": function () {
        return this.context.innerHeight() - this.adapter.outerHeight();
      },
      "right-in-view": function () {
        return this.context.innerWidth() - this.adapter.outerWidth();
      },
    }),
    (window.Waypoint = t);
})(),
  (function () {
    "use strict";
    function t(t) {
      window.setTimeout(t, 1e3 / 60);
    }
    function e(t) {
      (this.element = t),
        (this.Adapter = n.Adapter),
        (this.adapter = new this.Adapter(t)),
        (this.key = "waypoint-context-" + i),
        (this.didScroll = !1),
        (this.didResize = !1),
        (this.oldScroll = {
          x: this.adapter.scrollLeft(),
          y: this.adapter.scrollTop(),
        }),
        (this.waypoints = { vertical: {}, horizontal: {} }),
        (t.waypointContextKey = this.key),
        (o[t.waypointContextKey] = this),
        (i += 1),
        n.windowContext ||
          ((n.windowContext = !0), (n.windowContext = new e(window))),
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler();
    }
    var i = 0,
      o = {},
      n = window.Waypoint,
      r = window.onload;
    (e.prototype.add = function (t) {
      var e = t.options.horizontal ? "horizontal" : "vertical";
      (this.waypoints[e][t.key] = t), this.refresh();
    }),
      (e.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
          e = this.Adapter.isEmptyObject(this.waypoints.vertical),
          i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete o[this.key]);
      }),
      (e.prototype.createThrottledResizeHandler = function () {
        function t() {
          e.handleResize(), (e.didResize = !1);
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
          e.didResize || ((e.didResize = !0), n.requestAnimationFrame(t));
        });
      }),
      (e.prototype.createThrottledScrollHandler = function () {
        function t() {
          e.handleScroll(), (e.didScroll = !1);
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
          (!e.didScroll || n.isTouch) &&
            ((e.didScroll = !0), n.requestAnimationFrame(t));
        });
      }),
      (e.prototype.handleResize = function () {
        n.Context.refreshAll();
      }),
      (e.prototype.handleScroll = function () {
        var t = {},
          e = {
            horizontal: {
              newScroll: this.adapter.scrollLeft(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
            },
            vertical: {
              newScroll: this.adapter.scrollTop(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
            },
          };
        for (var i in e) {
          var o = e[i],
            n = o.newScroll > o.oldScroll,
            r = n ? o.forward : o.backward;
          for (var s in this.waypoints[i]) {
            var a = this.waypoints[i][s];
            if (null !== a.triggerPoint) {
              var l = o.oldScroll < a.triggerPoint,
                h = o.newScroll >= a.triggerPoint,
                p = l && h,
                u = !l && !h;
              (p || u) && (a.queueTrigger(r), (t[a.group.id] = a.group));
            }
          }
        }
        for (var c in t) t[c].flushTriggers();
        this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll };
      }),
      (e.prototype.innerHeight = function () {
        return this.element == this.element.window
          ? n.viewportHeight()
          : this.adapter.innerHeight();
      }),
      (e.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty();
      }),
      (e.prototype.innerWidth = function () {
        return this.element == this.element.window
          ? n.viewportWidth()
          : this.adapter.innerWidth();
      }),
      (e.prototype.destroy = function () {
        var t = [];
        for (var e in this.waypoints)
          for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++) t[o].destroy();
      }),
      (e.prototype.refresh = function () {
        var t,
          e = this.element == this.element.window,
          i = e ? void 0 : this.adapter.offset(),
          o = {};
        this.handleScroll(),
          (t = {
            horizontal: {
              contextOffset: e ? 0 : i.left,
              contextScroll: e ? 0 : this.oldScroll.x,
              contextDimension: this.innerWidth(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
              offsetProp: "left",
            },
            vertical: {
              contextOffset: e ? 0 : i.top,
              contextScroll: e ? 0 : this.oldScroll.y,
              contextDimension: this.innerHeight(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
              offsetProp: "top",
            },
          });
        for (var r in t) {
          var s = t[r];
          for (var a in this.waypoints[r]) {
            var l,
              h,
              p,
              u,
              c,
              d = this.waypoints[r][a],
              f = d.options.offset,
              w = d.triggerPoint,
              y = 0,
              g = null == w;
            d.element !== d.element.window &&
              (y = d.adapter.offset()[s.offsetProp]),
              "function" == typeof f
                ? (f = f.apply(d))
                : "string" == typeof f &&
                  ((f = parseFloat(f)),
                  d.options.offset.indexOf("%") > -1 &&
                    (f = Math.ceil((s.contextDimension * f) / 100))),
              (l = s.contextScroll - s.contextOffset),
              (d.triggerPoint = Math.floor(y + l - f)),
              (h = w < s.oldScroll),
              (p = d.triggerPoint >= s.oldScroll),
              (u = h && p),
              (c = !h && !p),
              !g && u
                ? (d.queueTrigger(s.backward), (o[d.group.id] = d.group))
                : !g && c
                ? (d.queueTrigger(s.forward), (o[d.group.id] = d.group))
                : g &&
                  s.oldScroll >= d.triggerPoint &&
                  (d.queueTrigger(s.forward), (o[d.group.id] = d.group));
          }
        }
        return (
          n.requestAnimationFrame(function () {
            for (var t in o) o[t].flushTriggers();
          }),
          this
        );
      }),
      (e.findOrCreateByElement = function (t) {
        return e.findByElement(t) || new e(t);
      }),
      (e.refreshAll = function () {
        for (var t in o) o[t].refresh();
      }),
      (e.findByElement = function (t) {
        return o[t.waypointContextKey];
      }),
      (window.onload = function () {
        r && r(), e.refreshAll();
      }),
      (n.requestAnimationFrame = function (e) {
        var i =
          window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          t;
        i.call(window, e);
      }),
      (n.Context = e);
  })(),
  (function () {
    "use strict";
    function t(t, e) {
      return t.triggerPoint - e.triggerPoint;
    }
    function e(t, e) {
      return e.triggerPoint - t.triggerPoint;
    }
    function i(t) {
      (this.name = t.name),
        (this.axis = t.axis),
        (this.id = this.name + "-" + this.axis),
        (this.waypoints = []),
        this.clearTriggerQueues(),
        (o[this.axis][this.name] = this);
    }
    var o = { vertical: {}, horizontal: {} },
      n = window.Waypoint;
    (i.prototype.add = function (t) {
      this.waypoints.push(t);
    }),
      (i.prototype.clearTriggerQueues = function () {
        this.triggerQueues = { up: [], down: [], left: [], right: [] };
      }),
      (i.prototype.flushTriggers = function () {
        for (var i in this.triggerQueues) {
          var o = this.triggerQueues[i],
            n = "up" === i || "left" === i;
          o.sort(n ? e : t);
          for (var r = 0, s = o.length; s > r; r += 1) {
            var a = o[r];
            (a.options.continuous || r === o.length - 1) && a.trigger([i]);
          }
        }
        this.clearTriggerQueues();
      }),
      (i.prototype.next = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints),
          o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1];
      }),
      (i.prototype.previous = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null;
      }),
      (i.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t);
      }),
      (i.prototype.remove = function (t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1);
      }),
      (i.prototype.first = function () {
        return this.waypoints[0];
      }),
      (i.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1];
      }),
      (i.findOrCreate = function (t) {
        return o[t.axis][t.name] || new i(t);
      }),
      (n.Group = i);
  })(),
  (function () {
    "use strict";
    function t(t) {
      this.$element = e(t);
    }
    var e = window.jQuery,
      i = window.Waypoint;
    e.each(
      [
        "innerHeight",
        "innerWidth",
        "off",
        "offset",
        "on",
        "outerHeight",
        "outerWidth",
        "scrollLeft",
        "scrollTop",
      ],
      function (e, i) {
        t.prototype[i] = function () {
          var t = Array.prototype.slice.call(arguments);
          return this.$element[i].apply(this.$element, t);
        };
      }
    ),
      e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
        t[o] = e[o];
      }),
      i.adapters.push({ name: "jquery", Adapter: t }),
      (i.Adapter = t);
  })(),
  (function () {
    "use strict";
    function t(t) {
      return function () {
        var i = [],
          o = arguments[0];
        return (
          t.isFunction(arguments[0]) &&
            ((o = t.extend({}, arguments[1])), (o.handler = arguments[0])),
          this.each(function () {
            var n = t.extend({}, o, { element: this });
            "string" == typeof n.context &&
              (n.context = t(this).closest(n.context)[0]),
              i.push(new e(n));
          }),
          i
        );
      };
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
      window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
  })();
/*-----------------------------------------------------------------------------------*/
/*	12. COUNTER UP
/*-----------------------------------------------------------------------------------*/
//
///*!
//* Counter-Up2 - counterup2-1.0.1.min.js
//* Counter-Up2 is a lightweight module that counts up to a targeted number when the number becomes visible
//*
//* Copyright 2019, Benjamin Intal https://github.com/bfintal/Counter-Up2/blob/master/LICENSE
//* Released under the MIT License
//*
//* Date: Jan 3, 2019
!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.counterUp = e())
    : (t.counterUp = e());
})(window, function () {
  return (function (t) {
    var e = {};
    function n(r) {
      if (e[r]) return e[r].exports;
      var o = (e[r] = { i: r, l: !1, exports: {} });
      return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = t),
      (n.c = e),
      (n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
      }),
      (n.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (n.t = function (t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var o in t)
            n.d(
              r,
              o,
              function (e) {
                return t[e];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return n.d(e, "a", e), e;
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ""),
      n((n.s = 0))
    );
  })([
    function (t, e, n) {
      "use strict";
      n.r(e),
        n.d(e, "divideNumbers", function () {
          return o;
        }),
        n.d(e, "hasComma", function () {
          return i;
        }),
        n.d(e, "isFloat", function () {
          return u;
        }),
        n.d(e, "decimalPlaces", function () {
          return l;
        });
      e.default = function (t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = e.action,
          i = void 0 === n ? "start" : n,
          u = e.duration,
          l = void 0 === u ? 1e3 : u,
          a = e.delay,
          c = void 0 === a ? 16 : a,
          d = e.lang,
          f = void 0 === d ? void 0 : d;
        if ("stop" !== i) {
          if ((r(t), /[0-9]/.test(t.innerHTML))) {
            var s = o(t.innerHTML, {
              duration: l || t.getAttribute("data-duration"),
              lang:
                f ||
                document.querySelector("html").getAttribute("lang") ||
                void 0,
              delay: c || t.getAttribute("data-delay"),
            });
            (t._countUpOrigInnerHTML = t.innerHTML),
              (t.innerHTML = s[0]),
              (t.style.visibility = "visible"),
              (t.countUpTimeout = setTimeout(function e() {
                (t.innerHTML = s.shift()),
                  s.length
                    ? (clearTimeout(t.countUpTimeout),
                      (t.countUpTimeout = setTimeout(e, c)))
                    : (t._countUpOrigInnerHTML = void 0);
              }, c));
          }
        } else r(t);
      };
      var r = function (t) {
          clearTimeout(t.countUpTimeout),
            t._countUpOrigInnerHTML &&
              ((t.innerHTML = t._countUpOrigInnerHTML),
              (t._countUpOrigInnerHTML = void 0)),
            (t.style.visibility = "");
        },
        o = function (t) {
          for (
            var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              n = e.duration,
              r = void 0 === n ? 1e3 : n,
              o = e.delay,
              i = void 0 === o ? 16 : o,
              u = e.lang,
              l = void 0 === u ? void 0 : u,
              a = r / i,
              c = t.toString().split(/(<[^>]+>|[0-9.][,.0-9]*[0-9]*)/),
              d = [],
              f = 0;
            f < a;
            f++
          )
            d.push("");
          for (var s = 0; s < c.length; s++)
            if (/([0-9.][,.0-9]*[0-9]*)/.test(c[s]) && !/<[^>]+>/.test(c[s])) {
              var p = c[s],
                v = /[0-9]+,[0-9]+/.test(p);
              p = p.replace(/,/g, "");
              for (
                var g = /^[0-9]+\.[0-9]+$/.test(p),
                  y = g ? (p.split(".")[1] || []).length : 0,
                  b = d.length - 1,
                  m = a;
                m >= 1;
                m--
              ) {
                var T = parseInt((p / a) * m, 10);
                g &&
                  ((T = parseFloat((p / a) * m).toFixed(y)),
                  (T = parseFloat(T).toLocaleString(l))),
                  v && (T = T.toLocaleString(l)),
                  (d[b--] += T);
              }
            } else for (var M = 0; M < a; M++) d[M] += c[s];
          return (d[d.length] = t.toString()), d;
        },
        i = function (t) {
          return /[0-9]+,[0-9]+/.test(t);
        },
        u = function (t) {
          return /^[0-9]+\.[0-9]+$/.test(t);
        },
        l = function (t) {
          return u(t) ? (t.split(".")[1] || []).length : 0;
        };
    },
  ]);
});
/*-----------------------------------------------------------------------------------*/
/*	13. VIDEO WRAPPER
/*-----------------------------------------------------------------------------------*/
!(function (a, b, c, d) {
  "use strict";
  function e(b, c) {
    function d() {
      (e.options.originalVideoW = e.options.$video[0].videoWidth),
        (e.options.originalVideoH = e.options.$video[0].videoHeight),
        e.initialised || e.init();
    }
    var e = this;
    (this.element = b),
      (this.options = a.extend({}, g, c)),
      (this._defaults = g),
      (this._name = f),
      (this.options.$video = a(b)),
      this.detectBrowser(),
      this.shimRequestAnimationFrame(),
      (this.options.has3d = this.detect3d()),
      this.options.$videoWrap.css({
        position: "relative",
        overflow: "hidden",
        "z-index": "10",
      }),
      this.options.$video.css({ position: "absolute", "z-index": "1" }),
      this.options.$video.on("canplay canplaythrough", d),
      this.options.$video[0].readyState > 3 && d();
  }
  var f = "backgroundVideo",
    g = {
      $videoWrap: a(".video-wrapper-inner"),
      $outerWrap: a(b),
      $window: a(b),
      minimumVideoWidth: 400,
      preventContextMenu: !1,
      parallax: !0,
      parallaxOptions: { effect: 1.5 },
      pauseVideoOnViewLoss: !1,
    };
  (e.prototype = {
    init: function () {
      var a = this;
      (this.initialised = !0),
        (this.lastPosition = -1),
        (this.ticking = !1),
        this.options.$window.resize(function () {
          a.positionObject();
        }),
        this.options.parallax &&
          this.options.$window.on("scroll", function () {
            a.update();
          }),
        this.options.pauseVideoOnViewLoss && this.playPauseVideo(),
        this.options.preventContextMenu &&
          this.options.$video.on("contextmenu", function () {
            return !1;
          }),
        this.options.$window.trigger("resize");
    },
    requestTick: function () {
      var a = this;
      this.ticking ||
        (b.requestAnimationFrame(a.positionObject.bind(a)),
        (this.ticking = !0));
    },
    update: function () {
      (this.lastPosition = b.pageYOffset), this.requestTick();
    },
    detect3d: function () {
      var a,
        e,
        f = c.createElement("p"),
        g = {
          WebkitTransform: "-webkit-transform",
          OTransform: "-o-transform",
          MSTransform: "-ms-transform",
          MozTransform: "-moz-transform",
          transform: "transform",
        };
      c.body.insertBefore(f, c.body.lastChild);
      for (a in g)
        f.style[a] !== d &&
          ((f.style[a] =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"),
          (e = b.getComputedStyle(f).getPropertyValue(g[a])));
      return f.parentNode.removeChild(f), e !== d && "none" !== e;
    },
    detectBrowser: function () {
      var a = navigator.userAgent.toLowerCase();
      a.indexOf("chrome") > -1 || a.indexOf("safari") > -1
        ? ((this.options.browser = "webkit"),
          (this.options.browserPrexix = "-webkit-"))
        : a.indexOf("firefox") > -1
        ? ((this.options.browser = "firefox"),
          (this.options.browserPrexix = "-moz-"))
        : -1 !== a.indexOf("MSIE") || a.indexOf("Trident/") > 0
        ? ((this.options.browser = "ie"), (this.options.browserPrexix = "-ms-"))
        : a.indexOf("Opera") > -1 &&
          ((this.options.browser = "opera"),
          (this.options.browserPrexix = "-o-"));
    },
    scaleObject: function () {
      var a, b, c;
      return (
        this.options.$videoWrap.width(this.options.$outerWrap.width()),
        this.options.$videoWrap.height(this.options.$outerWrap.height()),
        (a = this.options.$window.width() / this.options.originalVideoW),
        (b = this.options.$window.height() / this.options.originalVideoH),
        (c = a > b ? a : b),
        c * this.options.originalVideoW < this.options.minimumVideoWidth &&
          (c = this.options.minimumVideoWidth / this.options.originalVideoW),
        this.options.$video.width(c * this.options.originalVideoW),
        this.options.$video.height(c * this.options.originalVideoH),
        {
          xPos:
            -parseInt(
              this.options.$video.width() - this.options.$window.width()
            ) / 2,
          yPos:
            parseInt(
              this.options.$video.height() - this.options.$window.height()
            ) / 2,
        }
      );
    },
    positionObject: function () {
      var a = this,
        c = b.pageYOffset,
        d = this.scaleObject(this.options.$video, a.options.$videoWrap),
        e = d.xPos,
        f = d.yPos;
      (f = this.options.parallax
        ? c >= 0
          ? this.calculateYPos(f, c)
          : this.calculateYPos(f, 0)
        : -f),
        a.options.has3d
          ? (this.options.$video.css(
              a.options.browserPrexix + "transform3d",
              "translate3d(-" + e + "px, " + f + "px, 0)"
            ),
            this.options.$video.css(
              "transform",
              "translate3d(" + e + "px, " + f + "px, 0)"
            ))
          : (this.options.$video.css(
              a.options.browserPrexix + "transform",
              "translate(-" + e + "px, " + f + "px)"
            ),
            this.options.$video.css(
              "transform",
              "translate(" + e + "px, " + f + "px)"
            )),
        (this.ticking = !1);
    },
    calculateYPos: function (a, b) {
      var c, d;
      return (
        (c = parseInt(this.options.$videoWrap.offset().top)),
        (d = c - b),
        (a = -(d / this.options.parallaxOptions.effect + a))
      );
    },
    disableParallax: function () {
      this.options.$window.unbind(".backgroundVideoParallax");
    },
    playPauseVideo: function () {
      var a = this;
      this.options.$window.on("scroll.backgroundVideoPlayPause", function () {
        a.options.$window.scrollTop() < a.options.$videoWrap.height()
          ? a.options.$video.get(0).play()
          : a.options.$video.get(0).pause();
      });
    },
    shimRequestAnimationFrame: function () {
      for (
        var a = 0, c = ["ms", "moz", "webkit", "o"], d = 0;
        d < c.length && !b.requestAnimationFrame;
        ++d
      )
        (b.requestAnimationFrame = b[c[d] + "RequestAnimationFrame"]),
          (b.cancelAnimationFrame =
            b[c[d] + "CancelAnimationFrame"] ||
            b[c[d] + "CancelRequestAnimationFrame"]);
      b.requestAnimationFrame ||
        (b.requestAnimationFrame = function (c) {
          var d = new Date().getTime(),
            e = Math.max(0, 16 - (d - a)),
            f = b.setTimeout(function () {
              c(d + e);
            }, e);
          return (a = d + e), f;
        }),
        b.cancelAnimationFrame ||
          (b.cancelAnimationFrame = function (a) {
            clearTimeout(a);
          });
    },
  }),
    (a.fn[f] = function (b) {
      return this.each(function () {
        a.data(this, "plugin_" + f) ||
          a.data(this, "plugin_" + f, new e(this, b));
      });
    });
})(jQuery, window, document);
/*-----------------------------------------------------------------------------------*/
/*	14. TYPER
/*-----------------------------------------------------------------------------------*/
function TyperSetup() {
  (typers = {}), (elements = document.getElementsByClassName("typer"));
  for (var b, a = 0; (b = elements[a++]); ) typers[b.id] = new Typer(b);
  elements = document.getElementsByClassName("typer-stop");
  for (var b, a = 0; (b = elements[a++]); ) {
    var c = typers[b.dataset.owner];
    b.onclick = function () {
      c.stop();
    };
  }
  elements = document.getElementsByClassName("typer-start");
  for (var b, a = 0; (b = elements[a++]); ) {
    var c = typers[b.dataset.owner];
    b.onclick = function () {
      c.start();
    };
  }
  elements2 = document.getElementsByClassName("cursor");
  for (var b, a = 0; (b = elements2[a++]); ) {
    var d = new Cursor(b);
    (d.owner.cursor = d), console.log(d.owner.cursor);
  }
}
var Typer = function (a) {
  console.log("constructor called"), (this.element = a);
  var b = a.dataset.delim || ",",
    c = a.dataset.words || "override these,sample typing";
  (this.words = c.split(b).filter(function (a) {
    return a;
  })),
    (this.delay = a.dataset.delay || 200),
    (this.deleteDelay = a.dataset.deleteDelay || 800),
    (this.progress = { word: 0, char: 0, building: !0, atWordEnd: !1 }),
    (this.typing = !0);
  var d = a.dataset.colors || "";
  (this.colors = d.split(",")),
    (this.element.style.color = this.colors[0]),
    (this.colorIndex = 0),
    this.doTyping();
};
(Typer.prototype.start = function () {
  this.typing || ((this.typing = !0), this.doTyping());
}),
  (Typer.prototype.stop = function () {
    this.typing = !1;
  }),
  (Typer.prototype.doTyping = function () {
    var a = this.element,
      b = this.progress,
      c = b.word,
      d = b.char,
      e = this.words[c][d];
    if (((b.atWordEnd = !1), this.cursor)) {
      (this.cursor.element.style.opacity = "1"),
        (this.cursor.on = !0),
        clearInterval(this.cursor.interval);
      var f = this.cursor;
      this.cursor.interval = setInterval(function () {
        f.updateBlinkState();
      }, 400);
    }
    b.building
      ? ((a.innerHTML += e),
        (b.char += 1),
        b.char == this.words[c].length &&
          ((b.building = !1), (b.atWordEnd = !0)))
      : ((a.innerHTML = a.innerHTML.slice(0, -1)),
        this.element.innerHTML ||
          ((b.building = !0),
          (b.word = (b.word + 1) % this.words.length),
          (b.char = 0),
          (this.colorIndex = (this.colorIndex + 1) % this.colors.length),
          (this.element.style.color = this.colors[this.colorIndex])));
    var g = this;
    setTimeout(
      function () {
        g.typing && g.doTyping();
      },
      b.atWordEnd ? this.deleteDelay : this.delay
    );
  });
var Cursor = function (a) {
  (this.element = a),
    (this.cursorDisplay = a.dataset.cursorDisplay || "|"),
    (this.owner = typers[a.dataset.owner] || ""),
    (a.innerHTML = this.cursorDisplay),
    (this.on = !0),
    (a.style.transition = "all 0.1s");
  var b = this;
  this.interval = setInterval(function () {
    b.updateBlinkState();
  }, 400);
};
(Cursor.prototype.updateBlinkState = function () {
  this.on
    ? ((this.element.style.opacity = "0"), (this.on = !1))
    : ((this.element.style.opacity = "1"), (this.on = !0));
}),
  TyperSetup();
/*-----------------------------------------------------------------------------------*/
/*	15. RELLAX
/*-----------------------------------------------------------------------------------*/
(function (q, g) {
  "function" === typeof define && define.amd
    ? define([], g)
    : "object" === typeof module && module.exports
    ? (module.exports = g())
    : (q.Rellax = g());
})("undefined" !== typeof window ? window : global, function () {
  var q = function (g, u) {
    function C() {
      if (
        3 === a.options.breakpoints.length &&
        Array.isArray(a.options.breakpoints)
      ) {
        var f = !0,
          c = !0,
          b;
        a.options.breakpoints.forEach(function (a) {
          "number" !== typeof a && (c = !1);
          null !== b && a < b && (f = !1);
          b = a;
        });
        if (f && c) return;
      }
      a.options.breakpoints = [576, 768, 1201];
      console.warn(
        "Rellax: You must pass an array of 3 numbers in ascending order to the breakpoints option. Defaults reverted"
      );
    }
    var a = Object.create(q.prototype),
      l = 0,
      v = 0,
      m = 0,
      n = 0,
      d = [],
      w = !0,
      A =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (a) {
          return setTimeout(a, 1e3 / 60);
        },
      p = null,
      x = !1;
    try {
      var k = Object.defineProperty({}, "passive", {
        get: function () {
          x = !0;
        },
      });
      window.addEventListener("testPassive", null, k);
      window.removeEventListener("testPassive", null, k);
    } catch (f) {}
    var D =
        window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        clearTimeout,
      E =
        window.transformProp ||
        (function () {
          var a = document.createElement("div");
          if (null === a.style.transform) {
            var c = ["Webkit", "Moz", "ms"],
              b;
            for (b in c)
              if (void 0 !== a.style[c[b] + "Transform"])
                return c[b] + "Transform";
          }
          return "transform";
        })();
    a.options = {
      speed: -2,
      verticalSpeed: null,
      horizontalSpeed: null,
      breakpoints: [576, 768, 1201],
      center: !1,
      wrapper: null,
      relativeToWrapper: !1,
      round: !0,
      vertical: !0,
      horizontal: !1,
      verticalScrollAxis: "y",
      horizontalScrollAxis: "x",
      callback: function () {},
    };
    u &&
      Object.keys(u).forEach(function (d) {
        a.options[d] = u[d];
      });
    u && u.breakpoints && C();
    g || (g = ".rellax");
    k = "string" === typeof g ? document.querySelectorAll(g) : [g];
    if (0 < k.length) {
      a.elems = k;
      if (a.options.wrapper && !a.options.wrapper.nodeType)
        if ((k = document.querySelector(a.options.wrapper)))
          a.options.wrapper = k;
        else {
          console.warn(
            "Rellax: The wrapper you're trying to use doesn't exist."
          );
          return;
        }
      var F,
        B = function () {
          for (var f = 0; f < d.length; f++)
            a.elems[f].style.cssText = d[f].style;
          d = [];
          v = window.innerHeight;
          n = window.innerWidth;
          f = a.options.breakpoints;
          F =
            n < f[0]
              ? "xs"
              : n >= f[0] && n < f[1]
              ? "sm"
              : n >= f[1] && n < f[2]
              ? "md"
              : "lg";
          H();
          for (f = 0; f < a.elems.length; f++) {
            var c = void 0,
              b = a.elems[f],
              e = b.getAttribute("data-rellax-percentage"),
              y = b.getAttribute("data-rellax-speed"),
              t = b.getAttribute("data-rellax-xs-speed"),
              g = b.getAttribute("data-rellax-mobile-speed"),
              h = b.getAttribute("data-rellax-tablet-speed"),
              k = b.getAttribute("data-rellax-desktop-speed"),
              l = b.getAttribute("data-rellax-vertical-speed"),
              m = b.getAttribute("data-rellax-horizontal-speed"),
              p = b.getAttribute("data-rellax-vertical-scroll-axis"),
              q = b.getAttribute("data-rellax-horizontal-scroll-axis"),
              u = b.getAttribute("data-rellax-zindex") || 0,
              x = b.getAttribute("data-rellax-min"),
              A = b.getAttribute("data-rellax-max"),
              C = b.getAttribute("data-rellax-min-x"),
              D = b.getAttribute("data-rellax-max-x"),
              E = b.getAttribute("data-rellax-min-y"),
              L = b.getAttribute("data-rellax-max-y"),
              r = !0;
            t || g || h || k ? (c = { xs: t, sm: g, md: h, lg: k }) : (r = !1);
            t = a.options.wrapper
              ? a.options.wrapper.scrollTop
              : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            a.options.relativeToWrapper &&
              (t =
                (window.pageYOffset ||
                  document.documentElement.scrollTop ||
                  document.body.scrollTop) - a.options.wrapper.offsetTop);
            var z = a.options.vertical ? (e || a.options.center ? t : 0) : 0,
              I = a.options.horizontal
                ? e || a.options.center
                  ? a.options.wrapper
                    ? a.options.wrapper.scrollLeft
                    : window.pageXOffset ||
                      document.documentElement.scrollLeft ||
                      document.body.scrollLeft
                  : 0
                : 0;
            t = z + b.getBoundingClientRect().top;
            g = b.clientHeight || b.offsetHeight || b.scrollHeight;
            h = I + b.getBoundingClientRect().left;
            k = b.clientWidth || b.offsetWidth || b.scrollWidth;
            z = e ? e : (z - t + v) / (g + v);
            e = e ? e : (I - h + n) / (k + n);
            a.options.center && (z = e = 0.5);
            c = r && null !== c[F] ? Number(c[F]) : y ? y : a.options.speed;
            l = l ? l : a.options.verticalSpeed;
            m = m ? m : a.options.horizontalSpeed;
            p = p ? p : a.options.verticalScrollAxis;
            q = q ? q : a.options.horizontalScrollAxis;
            y = J(e, z, c, l, m);
            b = b.style.cssText;
            r = "";
            if ((e = /transform\s*:/i.exec(b)))
              (r = b.slice(e.index)),
                (r = (e = r.indexOf(";"))
                  ? " " + r.slice(11, e).replace(/\s/g, "")
                  : " " + r.slice(11).replace(/\s/g, ""));
            d.push({
              baseX: y.x,
              baseY: y.y,
              top: t,
              left: h,
              height: g,
              width: k,
              speed: c,
              verticalSpeed: l,
              horizontalSpeed: m,
              verticalScrollAxis: p,
              horizontalScrollAxis: q,
              style: b,
              transform: r,
              zindex: u,
              min: x,
              max: A,
              minX: C,
              maxX: D,
              minY: E,
              maxY: L,
            });
          }
          K();
          w && (window.addEventListener("resize", B), (w = !1), G());
        },
        H = function () {
          var d = l,
            c = m;
          l = a.options.wrapper
            ? a.options.wrapper.scrollTop
            : (
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollTop || window.pageYOffset;
          m = a.options.wrapper
            ? a.options.wrapper.scrollLeft
            : (
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollLeft || window.pageXOffset;
          a.options.relativeToWrapper &&
            (l =
              ((
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollTop || window.pageYOffset) - a.options.wrapper.offsetTop);
          return (d != l && a.options.vertical) ||
            (c != m && a.options.horizontal)
            ? !0
            : !1;
        },
        J = function (d, c, b, e, g) {
          var f = {};
          d = 100 * (g ? g : b) * (1 - d);
          c = 100 * (e ? e : b) * (1 - c);
          f.x = a.options.round ? Math.round(d) : Math.round(100 * d) / 100;
          f.y = a.options.round ? Math.round(c) : Math.round(100 * c) / 100;
          return f;
        },
        h = function () {
          window.removeEventListener("resize", h);
          window.removeEventListener("orientationchange", h);
          (a.options.wrapper ? a.options.wrapper : window).removeEventListener(
            "scroll",
            h
          );
          (a.options.wrapper
            ? a.options.wrapper
            : document
          ).removeEventListener("touchmove", h);
          p = A(G);
        },
        G = function () {
          H() && !1 === w
            ? (K(), (p = A(G)))
            : ((p = null),
              window.addEventListener("resize", h),
              window.addEventListener("orientationchange", h),
              (a.options.wrapper ? a.options.wrapper : window).addEventListener(
                "scroll",
                h,
                x ? { passive: !0 } : !1
              ),
              (a.options.wrapper
                ? a.options.wrapper
                : document
              ).addEventListener("touchmove", h, x ? { passive: !0 } : !1));
        },
        K = function () {
          for (var f, c = 0; c < a.elems.length; c++) {
            var b = d[c].verticalScrollAxis.toLowerCase(),
              e = d[c].horizontalScrollAxis.toLowerCase();
            f = -1 != b.indexOf("x") ? l : 0;
            b = -1 != b.indexOf("y") ? l : 0;
            var g = -1 != e.indexOf("x") ? m : 0;
            e = -1 != e.indexOf("y") ? m : 0;
            f = J(
              (f + g - d[c].left + n) / (d[c].width + n),
              (b + e - d[c].top + v) / (d[c].height + v),
              d[c].speed,
              d[c].verticalSpeed,
              d[c].horizontalSpeed
            );
            e = f.y - d[c].baseY;
            b = f.x - d[c].baseX;
            null !== d[c].min &&
              (a.options.vertical &&
                !a.options.horizontal &&
                (e = e <= d[c].min ? d[c].min : e),
              a.options.horizontal &&
                !a.options.vertical &&
                (b = b <= d[c].min ? d[c].min : b));
            null != d[c].minY && (e = e <= d[c].minY ? d[c].minY : e);
            null != d[c].minX && (b = b <= d[c].minX ? d[c].minX : b);
            null !== d[c].max &&
              (a.options.vertical &&
                !a.options.horizontal &&
                (e = e >= d[c].max ? d[c].max : e),
              a.options.horizontal &&
                !a.options.vertical &&
                (b = b >= d[c].max ? d[c].max : b));
            null != d[c].maxY && (e = e >= d[c].maxY ? d[c].maxY : e);
            null != d[c].maxX && (b = b >= d[c].maxX ? d[c].maxX : b);
            a.elems[c].style[E] =
              "translate3d(" +
              (a.options.horizontal ? b : "0") +
              "px," +
              (a.options.vertical ? e : "0") +
              "px," +
              d[c].zindex +
              "px) " +
              d[c].transform;
          }
          a.options.callback(f);
        };
      a.destroy = function () {
        for (var f = 0; f < a.elems.length; f++)
          a.elems[f].style.cssText = d[f].style;
        w || (window.removeEventListener("resize", B), (w = !0));
        D(p);
        p = null;
      };
      B();
      a.refresh = B;
      return a;
    }
    console.warn("Rellax: The elements you're trying to select don't exist.");
  };
  return q;
});
/*-----------------------------------------------------------------------------------*/
/*	16. ITOOLTIP
/*-----------------------------------------------------------------------------------*/
class DoubleCenterException {
  constructor() {
    window.console.error(
      'iTooltip Error: positionX and positionY properties cannot be "center" at the same time.'
    );
  }
}
class iTooltip {
  constructor(t = "*") {
    const e = "*" !== t ? t : "*[title]";
    this.objects = document.querySelectorAll(e);
  }
  init(t = {}) {
    if (
      ((this.settings = Object.assign(
        {
          className: "tooltip",
          indentX: 10,
          indentY: 15,
          positionX: "right",
          positionY: "bottom",
        },
        t
      )),
      "center" === this.settings.positionX &&
        "center" === this.settings.positionY)
    )
      throw new DoubleCenterException();
    this.objects.forEach((t) => {
      t.getAttribute("title") &&
        (t.addEventListener("mouseenter", (t) => this.createTooltip(t)),
        t.addEventListener("mouseleave", (t) => this.removeTooltip(t)));
    });
  }
  createTooltip(t) {
    const e = t.target;
    (this.tooltip = document.createElement("div")),
      this.tooltip.classList.add(this.settings.className),
      (this.tooltip.innerHTML = e.getAttribute("title"));
    var i = t.target.className
      .split(" ")
      .find((t) => t.startsWith("itooltip-"));
    i && this.tooltip.classList.add(i),
      (this.tooltip.style.position = "absolute"),
      this.changePosition(t),
      e.removeAttribute("title"),
      document.body.appendChild(this.tooltip),
      e.addEventListener("mousemove", (t) => this.changePosition(t));
  }
  removeTooltip(t) {
    t.target.setAttribute("title", this.tooltip.innerHTML),
      this.tooltip.remove();
  }
  changePosition(t) {
    const [e, i] = this.getSizeTooltip(),
      o = this.getEdges(t),
      s = window.pageYOffset || document.documentElement.scrollTop;
    let n = t.pageY,
      l = t.pageX;
    if (
      ((l =
        "right" === this.settings.positionX
          ? o.right <= e
            ? t.clientX - e - this.settings.indentX
            : t.clientX + this.settings.indentX
          : "left" === this.settings.positionX
          ? o.left <= e
            ? o.left + this.settings.indentX
            : t.clientX - e - this.settings.indentX
          : o.left <= Math.round(e / 2)
          ? t.clientX - o.left
          : t.clientX - Math.round(e / 2)),
      "top" === this.settings.positionY)
    )
      n =
        o.top <= i
          ? s + t.clientY + this.settings.indentY
          : t.pageY - i - this.settings.indentY;
    else if ("bottom" === this.settings.positionY)
      n =
        o.bottom < i && o.top > i + this.settings.indentY
          ? t.pageY - i - this.settings.indentY
          : s + t.clientY + this.settings.indentY;
    else {
      let t = Math.round(i / 2);
      o.bottom <= t && (t = Math.round(i - o.bottom)),
        o.top <= t && (t = o.top),
        (n -= t);
    }
    (this.tooltip.style.top = `${n}px`), (this.tooltip.style.left = `${l}px`);
  }
  getSizeTooltip() {
    const t = this.tooltip.getBoundingClientRect();
    return [t.right - t.left, t.bottom - t.top];
  }
  getEdges(t) {
    const e = document.documentElement;
    return {
      left: t.clientX,
      right: e.clientWidth - t.clientX,
      top: t.clientY,
      bottom: e.clientHeight - t.clientY,
    };
  }
}
/*-----------------------------------------------------------------------------------*/
/*	17. SHOW MORE ITEMS
/*-----------------------------------------------------------------------------------*/
/*!
 * showMoreItem.js Version:1.0.1
 * @copyright 2020 PeggyHsieh
 * @license MIT (https://github.com/peggy-hsieh/showMoreItems)
 */
!(function (t) {
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "undefined" != typeof exports
    ? (module.exports = t(require("jquery")))
    : t(jQuery);
})(function ($) {
  var ShowMoreItems = window.ShowMoreItems || {};
  (ShowMoreItems = (function () {
    return function (t, e) {
      $(t).addClass("showMoreItemsList");
      var o,
        r = this,
        n = {
          nowNum: 1,
          startNum: 1,
          afterNum: 1,
          original: !1,
          moreText: "Show more",
          noMoreText: "No more",
          backMoreText: "Reset",
          responsive: "",
          after: function () {},
        };
      (o = $(t).data("showMoreItems") || {}),
        (r.defaults = $.extend({}, n, e, o)),
        (r.options = $.extend({}, n, e, o)),
        r.registerBreakpoints(t),
        r.init(t);
    };
  })()),
    (ShowMoreItems.prototype.init = function (t) {
      var e = this;
      return (e.sum = $(t).children().length), e.runData(t, e), !1;
    }),
    (ShowMoreItems.prototype.runData = function (t, e) {
      var o = this;
      (o.goOut = !1),
        $(t).children().hide(),
        $(t).next(".button-box").remove(),
        (o.nowNum = e.options.nowNum - 1),
        (o.goNum = o.nowNum + e.options.startNum),
        o.sum <= e.options.startNum && ((o.goNum = o.sum), (o.goOut = !0));
      for (var r = o.nowNum; r < o.goNum; r++)
        $(t).children().eq(r).show(), (o.nowNum += 1);
      o.goOut ||
        $(t).after(
          '<div class="button-box text-center mt-10"><button class="btn rounded-pill btn-soft-ash addListData">' +
            e.options.moreText +
            "</button></div>"
        ),
        $(t)
          .next()
          .on("click", ".addListData", function (r) {
            (o.goNum = o.nowNum + e.options.afterNum),
              o.sum <= o.goNum && ((o.goNum = o.sum), (o.goOut = !0));
            for (var n = o.nowNum; n < o.goNum; n++)
              $(t).children().eq(n).show(), (o.nowNum += 1);
            o.goOut && e.options.original
              ? $(this).text(e.options.backMoreText).addClass("original")
              : o.goOut &&
                $(this).text(e.options.noMoreText).addClass("d-none"),
              e.options.after();
          }),
        $(t)
          .next()
          .on("click", ".original", function (t) {
            return $(this).removeClass("original"), o.reflesh($(this)), !1;
          });
    }),
    (ShowMoreItems.prototype.reflesh = function (t) {
      (thisE = t.parent().prev()),
        t.remove(),
        this.registerBreakpoints(t),
        this.init(thisE);
    }),
    (ShowMoreItems.prototype.registerBreakpoints = function (t) {
      var e = this;
      e.options.responsive &&
        ((ResponsiveArr = e.options.responsive),
        (ResponsiveArr = ResponsiveArr.sort(function (t, e) {
          return t.breakpoint > e.breakpoint ? -1 : 1;
        })),
        (e.options.responsive = ResponsiveArr),
        (e.Oindex = -1),
        (e.Owidth = $(window).width()),
        $.each(e.options.responsive, function (t, o) {
          $(window).width() <= o.breakpoint &&
            ((e.Oindex = t),
            (o = o.settings),
            (e.options = $.extend({}, e.options, o)));
        }),
        $(window).resize(function () {
          return (
            (run = !1),
            $(window).width() < e.Owidth &&
              ((e.Owidth = $(window).width()),
              $.each(e.options.responsive, function (t, o) {
                if (e.Owidth <= o.breakpoint && e.Oindex < t)
                  return (
                    (e.Oindex = t),
                    (o = o.settings),
                    (e.options = $.extend({}, e.options, e.defaults)),
                    (e.options = $.extend({}, e.options, o)),
                    (run = !0),
                    e.Oindex
                  );
              })),
            $(window).width() > e.Owidth &&
              ((e.Owidth = $(window).width()),
              $.each(ResponsiveArr, function (t, o) {
                if (e.Owidth > o.breakpoint && e.Oindex > t - 1)
                  return (
                    (e.Oindex = t - 1),
                    -1 != e.Oindex
                      ? ((o = ResponsiveArr[t - 1].settings),
                        (e.options = $.extend({}, e.options, e.defaults)),
                        (e.options = $.extend({}, e.options, o)),
                        (run = !0))
                      : ((e.options = $.extend({}, e.options, e.defaults)),
                        (run = !0)),
                    e.Oindex
                  );
              })),
            1 == run && e.runData(t, e),
            !1
          );
        }));
    }),
    ($.fn.showMoreItems = function () {
      var t,
        e,
        o = this,
        r = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        s = o.length;
      for (t = 0; t < s; t++)
        if (
          ("object" == typeof r || void 0 === r
            ? (o[t].showMoreItems = new ShowMoreItems(o[t], r))
            : (e = o[t].showMoreItems[r].apply(o[t].showMoreItems, n)),
          void 0 !== e)
        )
          return e;
      return o;
    }),
    $(function () {
      if ($('[data-showMoreItems="true"]').length) {
        if (
          ((selecter = $('[data-showMoreItems="true"]')),
          "true" == selecter.attr("data-showMoreItems"))
        ) {
          var settings = {
            nowNum: 1,
            getView: 0,
            startNum: 1,
            afterNum: 1,
            original: !1,
            moreText: "Show more",
            noMoreText: "No more",
            backMoreText: "Reset",
            responsive: "",
            after: function () {},
          };
          selecter.attr("data-nowNum") &&
            (settings.nowNum = parseInt(selecter.attr("data-nowNum"))),
            selecter.attr("data-startNum") &&
              (settings.startNum = parseInt(selecter.attr("data-startNum"))),
            selecter.attr("data-afterNum") &&
              (settings.afterNum = parseInt(selecter.attr("data-afterNum"))),
            selecter.attr("data-original") &&
              (settings.original = Boolean(selecter.attr("data-original"))),
            selecter.attr("data-moreText") &&
              (settings.moreText = selecter.attr("data-moreText")),
            selecter.attr("data-noMoreText") &&
              (settings.noMoreText = selecter.attr("data-noMoreText")),
            selecter.attr("data-backMoreText") &&
              (settings.backMoreText = selecter.attr("data-backMoreText")),
            selecter.attr("data-responsive") &&
              (settings.responsive = eval(selecter.attr("data-responsive")));
        }
        $('[data-showMoreItems="true"]').showMoreItems(settings);
      }
    });
});
/*-----------------------------------------------------------------------------------*/
/*	18. SCROLLCUE
/*-----------------------------------------------------------------------------------*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, e) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = e.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var e = a[b];
    if (e && e.Math == Math) return e;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var e = $jscomp.propertyToPolyfillSymbol[b];
  if (null == e) return a[b];
  e = a[e];
  return void 0 !== e ? e : a[b];
};
$jscomp.polyfill = function (a, b, e, f) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, e, f)
      : $jscomp.polyfillUnisolated(a, b, e, f));
};
$jscomp.polyfillUnisolated = function (a, b, e, f) {
  e = $jscomp.global;
  a = a.split(".");
  for (f = 0; f < a.length - 1; f++) {
    var h = a[f];
    h in e || (e[h] = {});
    e = e[h];
  }
  a = a[a.length - 1];
  f = e[a];
  b = b(f);
  b != f &&
    null != b &&
    $jscomp.defineProperty(e, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, e, f) {
  var h = a.split(".");
  a = 1 === h.length;
  f = h[0];
  f = !a && f in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var k = 0; k < h.length - 1; k++) {
    var l = h[k];
    l in f || (f[l] = {});
    f = f[l];
  }
  h = h[h.length - 1];
  e = $jscomp.IS_SYMBOL_NATIVE && "es6" === e ? f[h] : null;
  b = b(e);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, h, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== e &&
        (($jscomp.propertyToPolyfillSymbol[h] = $jscomp.IS_SYMBOL_NATIVE
          ? $jscomp.global.Symbol(h)
          : $jscomp.POLYFILL_PREFIX + h),
        (h = $jscomp.propertyToPolyfillSymbol[h]),
        $jscomp.defineProperty(f, h, {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var b = function (a, b) {
      this.$jscomp$symbol$id_ = a;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: b,
      });
    };
    b.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var e = 0,
      f = function (a) {
        if (this instanceof f)
          throw new TypeError("Symbol is not a constructor");
        return new b("jscomp_symbol_" + (a || "") + "_" + e++, a);
      };
    return f;
  },
  "es6",
  "es3"
);
$jscomp.initSymbolIterator = function () {};
$jscomp.polyfill(
  "Symbol.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        e = 0;
      e < b.length;
      e++
    ) {
      var f = $jscomp.global[b[e]];
      "function" === typeof f &&
        "function" != typeof f.prototype[a] &&
        $jscomp.defineProperty(f.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6",
  "es3"
);
$jscomp.initSymbolAsyncIterator = function () {};
$jscomp.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function (a, b) {
  a instanceof String && (a += "");
  var e = 0,
    f = {
      next: function () {
        if (e < a.length) {
          var h = e++;
          return { value: b(h, a[h]), done: !1 };
        }
        f.next = function () {
          return { done: !0, value: void 0 };
        };
        return f.next();
      },
    };
  f[Symbol.iterator] = function () {
    return f;
  };
  return f;
};
$jscomp.polyfill(
  "Array.prototype.keys",
  function (a) {
    return a
      ? a
      : function () {
          return $jscomp.iteratorFromArray(this, function (a) {
            return a;
          });
        };
  },
  "es6",
  "es3"
);
var scrollCue = (function () {
  var a = {},
    b,
    e,
    f = 0,
    h = !0,
    k = !0,
    l = !1,
    n = !1,
    m,
    p = {
      duration: 600,
      interval: -0.7,
      percentage: 0.75,
      enable: !0,
      docSlider: !1,
      pageChangeReset: !1,
    };
  a = {
    setEvents: function (g) {
      var c = function () {
        h &&
          (requestAnimationFrame(function () {
            h = !0;
            k && (a.setQuery(), a.runQuery());
          }),
          (h = !1));
      };
      k && !g && window.addEventListener("load", a.runQuery);
      window.addEventListener("scroll", c);
      if (l) {
        g = docSlider.getElements().pages;
        for (var d = 0; d < g.length; d++)
          g[d].addEventListener("scroll", function (a) {
            var g = docSlider.getCurrentIndex() + "";
            a = a.target.getAttribute("data-ds-index");
            if (g !== a) return !1;
            docSlider._getWheelEnable() && c();
          });
      }
      window.addEventListener("resize", function () {
        0 < f && clearTimeout(f);
        f = setTimeout(function () {
          k && (a.searchElements(), a.setQuery(), a.runQuery());
        }, 200);
      });
    },
    setOptions: function (g, c) {
      var d = {};
      if ("undefined" !== typeof g)
        return (
          Object.keys(g).forEach(function (b) {
            "[object Object]" === Object.prototype.toString.call(g[b])
              ? (d[b] = a.setOptions(g[b], c[b]))
              : ((d[b] = g[b]),
                "undefined" !== typeof c &&
                  "undefined" !== typeof c[b] &&
                  (d[b] = c[b]));
          }),
          d
        );
    },
    searchElements: function () {
      b = [];
      var g = document.querySelectorAll("[data-cues]:not([data-disabled])");
      for (var c = 0; c < g.length; c++) {
        for (var d = g[c], e = 0; e < d.children.length; e++) {
          var f = d.children[e];
          a.setAttrPtoC(f, "data-cue", d, "data-cues", "");
          a.setAttrPtoC(f, "data-duration", d, "data-duration", !1);
          a.setAttrPtoC(f, "data-interval", d, "data-interval", !1);
          a.setAttrPtoC(f, "data-sort", d, "data-sort", !1);
          a.setAttrPtoC(f, "data-addClass", d, "data-addClass", !1);
          a.setAttrPtoC(f, "data-group", d, "data-group", !1);
          a.setAttrPtoC(f, "data-delay", d, "data-delay", !1);
        }
        d.setAttribute("data-disabled", "true");
      }
      g = document.querySelectorAll('[data-cue]:not([data-show="true"])');
      for (c = 0; c < g.length; c++)
        (d = g[c]),
          b.push({
            elm: d,
            cue: a.getAttr(d, "data-cue", "fadeIn"),
            duration: Number(a.getAttr(d, "data-duration", m.duration)),
            interval: Number(a.getAttr(d, "data-interval", m.interval)),
            order: a.getOrderNumber(d),
            sort: a.getAttr(d, "data-sort", null),
            addClass: a.getAttr(d, "data-addClass", null),
            group: a.getAttr(d, "data-group", null),
            delay: Number(a.getAttr(d, "data-delay", 0)),
          });
      if (l)
        for (g = docSlider.getElements().pages.length, c = 0; c < g; c++)
          for (
            d = document.querySelectorAll(
              '[data-ds-index="' + c + '"] [data-cue]:not([data-scpage])'
            ),
              e = 0;
            e < d.length;
            e++
          )
            d[e].setAttribute("data-scpage", c);
    },
    sortElements: function () {
      for (
        var a = arguments[0],
          c = [].slice.call(arguments).slice(1),
          d = { $jscomp$loop$prop$i$4: 0 };
        d.$jscomp$loop$prop$i$4 < c.length;
        d = { $jscomp$loop$prop$i$4: d.$jscomp$loop$prop$i$4 },
          d.$jscomp$loop$prop$i$4++
      )
        a.sort(
          (function (a) {
            return function (g, d) {
              var b =
                  "undefined" === typeof c[a.$jscomp$loop$prop$i$4][1]
                    ? !0
                    : c[a.$jscomp$loop$prop$i$4][1],
                e = c[a.$jscomp$loop$prop$i$4][0];
              return g[e] > d[e]
                ? b
                  ? 1
                  : -1
                : g[e] < d[e]
                ? b
                  ? -1
                  : 1
                : 0;
            };
          })(d)
        );
    },
    randElements: function (a) {
      for (var g = a.length - 1; 0 < g; g--) {
        var d = Math.floor(Math.random() * (g + 1)),
          b = a[g];
        a[g] = a[d];
        a[d] = b;
      }
      return a;
    },
    setDurationValue: function (a, c, d) {
      if ("undefined" === typeof c) return a;
      c = c.duration;
      a = -1 === (d + "").indexOf(".") ? a + c + d : a + c + c * d;
      return 0 > a ? 0 : a;
    },
    getOrderNumber: function (a) {
      return a.hasAttribute("data-order")
        ? ((a = Number(a.getAttribute("data-order"))),
          0 <= a ? a : Math.pow(2, 53) - 1 + a)
        : Math.pow(2, 52) - 1;
    },
    setAttrPtoC: function (a, c, d, b, e) {
      d.hasAttribute(b)
        ? a.hasAttribute(c) || a.setAttribute(c, d.getAttribute(b))
        : !1 !== e && a.setAttribute(c, e);
    },
    getAttr: function (a, c, d) {
      return a.hasAttribute(c) ? a.getAttribute(c) : d;
    },
    getOffsetTop: function (a) {
      return (
        a.getBoundingClientRect().top +
        (window.pageYOffset || document.documentElement.scrollTop)
      );
    },
    setClassNames: function (a, c) {
      if (c) {
        c = c.split(" ");
        for (var d = 0; d < c.length; d++) a.classList.add(c[d]);
      }
    },
    setQuery: function () {
      e = {};
      for (var g = 0; g < b.length; g++) {
        var c = b[g],
          d = c.group ? c.group : "$" + a.getOffsetTop(c.elm);
        if (!c.elm.hasAttribute("data-show")) {
          if (l) {
            var f = c.elm.getAttribute("data-scpage"),
              h = docSlider.getCurrentIndex() + "";
            if (f !== h && null !== f) continue;
          }
          "undefined" === typeof e[d] && (e[d] = []);
          e[d].push(c);
        }
      }
    },
    runQuery: function () {
      for (
        var b = Object.keys(e), c = {}, d = 0;
        d < b.length;
        c = {
          $jscomp$loop$prop$elms$6: c.$jscomp$loop$prop$elms$6,
          $jscomp$loop$prop$interval$7: c.$jscomp$loop$prop$interval$7,
        },
          d++
      )
        if (
          ((c.$jscomp$loop$prop$elms$6 = e[b[d]]),
          a.isElementIn(c.$jscomp$loop$prop$elms$6[0].elm))
        ) {
          "reverse" === c.$jscomp$loop$prop$elms$6[0].sort
            ? c.$jscomp$loop$prop$elms$6.reverse()
            : "random" === c.$jscomp$loop$prop$elms$6[0].sort &&
              a.randElements(c.$jscomp$loop$prop$elms$6);
          a.sortElements(c.$jscomp$loop$prop$elms$6, ["order"]);
          for (
            var f = (c.$jscomp$loop$prop$interval$7 = 0);
            f < c.$jscomp$loop$prop$elms$6.length;
            f++
          )
            (function (c) {
              return function (b) {
                c.$jscomp$loop$prop$elms$6[b].elm.setAttribute(
                  "data-show",
                  "true"
                );
                a.setClassNames(
                  c.$jscomp$loop$prop$elms$6[b].elm,
                  c.$jscomp$loop$prop$elms$6[b].addClass
                );
                c.$jscomp$loop$prop$interval$7 = a.setDurationValue(
                  c.$jscomp$loop$prop$interval$7,
                  c.$jscomp$loop$prop$elms$6[b - 1],
                  c.$jscomp$loop$prop$elms$6[b].interval
                );
                c.$jscomp$loop$prop$elms$6[b].elm.style.animationName =
                  c.$jscomp$loop$prop$elms$6[b].cue;
                c.$jscomp$loop$prop$elms$6[b].elm.style.animationDuration =
                  c.$jscomp$loop$prop$elms$6[b].duration + "ms";
                c.$jscomp$loop$prop$elms$6[
                  b
                ].elm.style.animationTimingFunction = "ease";
                c.$jscomp$loop$prop$elms$6[b].elm.style.animationDelay =
                  c.$jscomp$loop$prop$interval$7 +
                  c.$jscomp$loop$prop$elms$6[b].delay +
                  "ms";
                c.$jscomp$loop$prop$elms$6[b].elm.style.animationDirection =
                  "normal";
                c.$jscomp$loop$prop$elms$6[b].elm.style.animationFillMode =
                  "both";
              };
            })(c)(f);
          delete e[b[d]];
        }
    },
    isElementIn: function (b) {
      var c = b.hasAttribute("data-scpage")
        ? a.isScrollEndWithDocSlider
        : a.isScrollEnd;
      return (
        window.pageYOffset >
          a.getOffsetTop(b) - window.innerHeight * m.percentage || c()
      );
    },
    isScrollEnd: function () {
      var a = window.document.documentElement;
      return (
        (window.document.body.scrollTop || a.scrollTop) >=
        a.scrollHeight - a.clientHeight
      );
    },
    isScrollEndWithDocSlider: function () {
      var a = docSlider.getCurrentPage();
      return a.scrollTop >= a.scrollHeight - a.clientHeight;
    },
  };
  return {
    init: function (b) {
      m = a.setOptions(p, b);
      k = m.enable;
      l = m.docSlider;
      n = m.pageChangeReset;
      l || (a.setEvents(), a.searchElements(), a.setQuery());
    },
    update: function () {
      k && (a.searchElements(), a.setQuery(), a.runQuery());
    },
    enable: function (a) {
      k = "undefined" === typeof a ? !k : a;
      scrollCue.update();
    },
    _hasDocSlider: function () {
      return l;
    },
    _hasPageChangeReset: function () {
      return n;
    },
    _initWithDocSlider: function (b) {
      a.setEvents(b);
      a.searchElements();
      a.setQuery();
    },
    _updateWithDocSlider: function () {
      k && (a.setQuery(), a.runQuery());
    },
    _searchElements: function () {
      a.searchElements();
    },
  };
})();
/*-----------------------------------------------------------------------------------*/
/*	19. EASING
/*-----------------------------------------------------------------------------------*/
!(function (n) {
  "function" == typeof define && define.amd
    ? define(["jquery"], function (e) {
        return n(e);
      })
    : "object" == typeof module && "object" == typeof module.exports
    ? (exports = n(require("jquery")))
    : n(jQuery);
})(function (n) {
  function e(n) {
    var e = 7.5625,
      t = 2.75;
    return n < 1 / t
      ? e * n * n
      : n < 2 / t
      ? e * (n -= 1.5 / t) * n + 0.75
      : n < 2.5 / t
      ? e * (n -= 2.25 / t) * n + 0.9375
      : e * (n -= 2.625 / t) * n + 0.984375;
  }
  n.easing.jswing = n.easing.swing;
  var t = Math.pow,
    u = Math.sqrt,
    r = Math.sin,
    i = Math.cos,
    a = Math.PI,
    c = 1.70158,
    o = 1.525 * c,
    s = (2 * a) / 3,
    f = (2 * a) / 4.5;
  n.extend(n.easing, {
    def: "easeOutQuad",
    swing: function (e) {
      return n.easing[n.easing.def](e);
    },
    easeInQuad: function (n) {
      return n * n;
    },
    easeOutQuad: function (n) {
      return 1 - (1 - n) * (1 - n);
    },
    easeInOutQuad: function (n) {
      return n < 0.5 ? 2 * n * n : 1 - t(-2 * n + 2, 2) / 2;
    },
    easeInCubic: function (n) {
      return n * n * n;
    },
    easeOutCubic: function (n) {
      return 1 - t(1 - n, 3);
    },
    easeInOutCubic: function (n) {
      return n < 0.5 ? 4 * n * n * n : 1 - t(-2 * n + 2, 3) / 2;
    },
    easeInQuart: function (n) {
      return n * n * n * n;
    },
    easeOutQuart: function (n) {
      return 1 - t(1 - n, 4);
    },
    easeInOutQuart: function (n) {
      return n < 0.5 ? 8 * n * n * n * n : 1 - t(-2 * n + 2, 4) / 2;
    },
    easeInQuint: function (n) {
      return n * n * n * n * n;
    },
    easeOutQuint: function (n) {
      return 1 - t(1 - n, 5);
    },
    easeInOutQuint: function (n) {
      return n < 0.5 ? 16 * n * n * n * n * n : 1 - t(-2 * n + 2, 5) / 2;
    },
    easeInSine: function (n) {
      return 1 - i((n * a) / 2);
    },
    easeOutSine: function (n) {
      return r((n * a) / 2);
    },
    easeInOutSine: function (n) {
      return -(i(a * n) - 1) / 2;
    },
    easeInExpo: function (n) {
      return 0 === n ? 0 : t(2, 10 * n - 10);
    },
    easeOutExpo: function (n) {
      return 1 === n ? 1 : 1 - t(2, -10 * n);
    },
    easeInOutExpo: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : n < 0.5
        ? t(2, 20 * n - 10) / 2
        : (2 - t(2, -20 * n + 10)) / 2;
    },
    easeInCirc: function (n) {
      return 1 - u(1 - t(n, 2));
    },
    easeOutCirc: function (n) {
      return u(1 - t(n - 1, 2));
    },
    easeInOutCirc: function (n) {
      return n < 0.5
        ? (1 - u(1 - t(2 * n, 2))) / 2
        : (u(1 - t(-2 * n + 2, 2)) + 1) / 2;
    },
    easeInElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : -t(2, 10 * n - 10) * r((10 * n - 10.75) * s);
    },
    easeOutElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : t(2, -10 * n) * r((10 * n - 0.75) * s) + 1;
    },
    easeInOutElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : n < 0.5
        ? -(t(2, 20 * n - 10) * r((20 * n - 11.125) * f)) / 2
        : (t(2, -20 * n + 10) * r((20 * n - 11.125) * f)) / 2 + 1;
    },
    easeInBack: function (n) {
      return (c + 1) * n * n * n - c * n * n;
    },
    easeOutBack: function (n) {
      return 1 + (c + 1) * t(n - 1, 3) + c * t(n - 1, 2);
    },
    easeInOutBack: function (n) {
      return n < 0.5
        ? (t(2 * n, 2) * (7.189819 * n - o)) / 2
        : (t(2 * n - 2, 2) * ((o + 1) * (2 * n - 2) + o) + 2) / 2;
    },
    easeInBounce: function (n) {
      return 1 - e(1 - n);
    },
    easeOutBounce: e,
    easeInOutBounce: function (n) {
      return n < 0.5 ? (1 - e(1 - 2 * n)) / 2 : (1 + e(2 * n - 1)) / 2;
    },
  });
});
