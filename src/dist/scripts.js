/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(count){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + count;
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
/*!
 * Fotorama 4.6.4 | http://fotorama.io/license/
 */
fotoramaVersion="4.6.4",function(a,b,c,d,e){"use strict";function f(a){var b="bez_"+d.makeArray(arguments).join("_").replace(".","p");if("function"!=typeof d.easing[b]){var c=function(a,b){var c=[null,null],d=[null,null],e=[null,null],f=function(f,g){return e[g]=3*a[g],d[g]=3*(b[g]-a[g])-e[g],c[g]=1-e[g]-d[g],f*(e[g]+f*(d[g]+f*c[g]))},g=function(a){return e[0]+a*(2*d[0]+3*c[0]*a)},h=function(a){for(var b,c=a,d=0;++d<14&&(b=f(c,0)-a,!(Math.abs(b)<.001));)c-=b/g(c);return c};return function(a){return f(h(a),1)}};d.easing[b]=function(b,d,e,f,g){return f*c([a[0],a[1]],[a[2],a[3]])(d/g)+e}}return b}function g(){}function h(a,b,c){return Math.max(isNaN(b)?-1/0:b,Math.min(isNaN(c)?1/0:c,a))}function i(a){return a.match(/ma/)&&a.match(/-?\d+(?!d)/g)[a.match(/3d/)?12:4]}function j(a){return Ic?+i(a.css("transform")):+a.css("left").replace("px","")}function k(a){var b={};return Ic?b.transform="translate3d("+a+"px,0,0)":b.left=a,b}function l(a){return{"transition-duration":a+"ms"}}function m(a,b){return isNaN(a)?b:a}function n(a,b){return m(+String(a).replace(b||"px",""))}function o(a){return/%$/.test(a)?n(a,"%"):e}function p(a,b){return m(o(a)/100*b,n(a))}function q(a){return(!isNaN(n(a))||!isNaN(n(a,"%")))&&a}function r(a,b,c,d){return(a-(d||0))*(b+(c||0))}function s(a,b,c,d){return-Math.round(a/(b+(c||0))-(d||0))}function t(a){var b=a.data();if(!b.tEnd){var c=a[0],d={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",msTransition:"MSTransitionEnd",transition:"transitionend"};T(c,d[uc.prefixed("transition")],function(a){b.tProp&&a.propertyName.match(b.tProp)&&b.onEndFn()}),b.tEnd=!0}}function u(a,b,c,d){var e,f=a.data();f&&(f.onEndFn=function(){e||(e=!0,clearTimeout(f.tT),c())},f.tProp=b,clearTimeout(f.tT),f.tT=setTimeout(function(){f.onEndFn()},1.5*d),t(a))}function v(a,b){if(a.length){var c=a.data();Ic?(a.css(l(0)),c.onEndFn=g,clearTimeout(c.tT)):a.stop();var d=w(b,function(){return j(a)});return a.css(k(d)),d}}function w(){for(var a,b=0,c=arguments.length;c>b&&(a=b?arguments[b]():arguments[b],"number"!=typeof a);b++);return a}function x(a,b){return Math.round(a+(b-a)/1.5)}function y(){return y.p=y.p||("https:"===c.protocol?"https://":"http://"),y.p}function z(a){var c=b.createElement("a");return c.href=a,c}function A(a,b){if("string"!=typeof a)return a;a=z(a);var c,d;if(a.host.match(/youtube\.com/)&&a.search){if(c=a.search.split("v=")[1]){var e=c.indexOf("&");-1!==e&&(c=c.substring(0,e)),d="youtube"}}else a.host.match(/youtube\.com|youtu\.be/)?(c=a.pathname.replace(/^\/(embed\/|v\/)?/,"").replace(/\/.*/,""),d="youtube"):a.host.match(/vimeo\.com/)&&(d="vimeo",c=a.pathname.replace(/^\/(video\/)?/,"").replace(/\/.*/,""));return c&&d||!b||(c=a.href,d="custom"),c?{id:c,type:d,s:a.search.replace(/^\?/,""),p:y()}:!1}function B(a,b,c){var e,f,g=a.video;return"youtube"===g.type?(f=y()+"img.youtube.com/vi/"+g.id+"/default.jpg",e=f.replace(/\/default.jpg$/,"/hqdefault.jpg"),a.thumbsReady=!0):"vimeo"===g.type?d.ajax({url:y()+"vimeo.com/api/v2/video/"+g.id+".json",dataType:"jsonp",success:function(d){a.thumbsReady=!0,C(b,{img:d[0].thumbnail_large,thumb:d[0].thumbnail_small},a.i,c)}}):a.thumbsReady=!0,{img:e,thumb:f}}function C(a,b,c,e){for(var f=0,g=a.length;g>f;f++){var h=a[f];if(h.i===c&&h.thumbsReady){var i={videoReady:!0};i[Xc]=i[Zc]=i[Yc]=!1,e.splice(f,1,d.extend({},h,i,b));break}}}function D(a){function b(a,b,e){var f=a.children("img").eq(0),g=a.attr("href"),h=a.attr("src"),i=f.attr("src"),j=b.video,k=e?A(g,j===!0):!1;k?g=!1:k=j,c(a,f,d.extend(b,{video:k,img:b.img||g||h||i,thumb:b.thumb||i||h||g}))}function c(a,b,c){var e=c.thumb&&c.img!==c.thumb,f=n(c.width||a.attr("width")),g=n(c.height||a.attr("height"));d.extend(c,{width:f,height:g,thumbratio:S(c.thumbratio||n(c.thumbwidth||b&&b.attr("width")||e||f)/n(c.thumbheight||b&&b.attr("height")||e||g))})}var e=[];return a.children().each(function(){var a=d(this),f=R(d.extend(a.data(),{id:a.attr("id")}));if(a.is("a, img"))b(a,f,!0);else{if(a.is(":empty"))return;c(a,null,d.extend(f,{html:this,_html:a.html()}))}e.push(f)}),e}function E(a){return 0===a.offsetWidth&&0===a.offsetHeight}function F(a){return!d.contains(b.documentElement,a)}function G(a,b,c,d){return G.i||(G.i=1,G.ii=[!0]),d=d||G.i,"undefined"==typeof G.ii[d]&&(G.ii[d]=!0),a()?b():G.ii[d]&&setTimeout(function(){G.ii[d]&&G(a,b,c,d)},c||100),G.i++}function H(a){c.replace(c.protocol+"//"+c.host+c.pathname.replace(/^\/?/,"/")+c.search+"#"+a)}function I(a,b,c,d){var e=a.data(),f=e.measures;if(f&&(!e.l||e.l.W!==f.width||e.l.H!==f.height||e.l.r!==f.ratio||e.l.w!==b.w||e.l.h!==b.h||e.l.m!==c||e.l.p!==d)){var g=f.width,i=f.height,j=b.w/b.h,k=f.ratio>=j,l="scaledown"===c,m="contain"===c,n="cover"===c,o=$(d);k&&(l||m)||!k&&n?(g=h(b.w,0,l?g:1/0),i=g/f.ratio):(k&&n||!k&&(l||m))&&(i=h(b.h,0,l?i:1/0),g=i*f.ratio),a.css({width:g,height:i,left:p(o.x,b.w-g),top:p(o.y,b.h-i)}),e.l={W:f.width,H:f.height,r:f.ratio,w:b.w,h:b.h,m:c,p:d}}return!0}function J(a,b){var c=a[0];c.styleSheet?c.styleSheet.cssText=b:a.html(b)}function K(a,b,c){return b===c?!1:b>=a?"left":a>=c?"right":"left right"}function L(a,b,c,d){if(!c)return!1;if(!isNaN(a))return a-(d?0:1);for(var e,f=0,g=b.length;g>f;f++){var h=b[f];if(h.id===a){e=f;break}}return e}function M(a,b,c){c=c||{},a.each(function(){var a,e=d(this),f=e.data();f.clickOn||(f.clickOn=!0,d.extend(cb(e,{onStart:function(b){a=b,(c.onStart||g).call(this,b)},onMove:c.onMove||g,onTouchEnd:c.onTouchEnd||g,onEnd:function(c){c.moved||b.call(this,a)}}),{noMove:!0}))})}function N(a,b){return'<div class="'+a+'">'+(b||"")+"</div>"}function O(a){for(var b=a.length;b;){var c=Math.floor(Math.random()*b--),d=a[b];a[b]=a[c],a[c]=d}return a}function P(a){return"[object Array]"==Object.prototype.toString.call(a)&&d.map(a,function(a){return d.extend({},a)})}function Q(a,b,c){a.scrollLeft(b||0).scrollTop(c||0)}function R(a){if(a){var b={};return d.each(a,function(a,c){b[a.toLowerCase()]=c}),b}}function S(a){if(a){var b=+a;return isNaN(b)?(b=a.split("/"),+b[0]/+b[1]||e):b}}function T(a,b,c,d){b&&(a.addEventListener?a.addEventListener(b,c,!!d):a.attachEvent("on"+b,c))}function U(a){return!!a.getAttribute("disabled")}function V(a){return{tabindex:-1*a+"",disabled:a}}function W(a,b){T(a,"keyup",function(c){U(a)||13==c.keyCode&&b.call(a,c)})}function X(a,b){T(a,"focus",a.onfocusin=function(c){b.call(a,c)},!0)}function Y(a,b){a.preventDefault?a.preventDefault():a.returnValue=!1,b&&a.stopPropagation&&a.stopPropagation()}function Z(a){return a?">":"<"}function $(a){return a=(a+"").split(/\s+/),{x:q(a[0])||bd,y:q(a[1])||bd}}function _(a,b){var c=a.data(),e=Math.round(b.pos),f=function(){c.sliding=!1,(b.onEnd||g)()};"undefined"!=typeof b.overPos&&b.overPos!==b.pos&&(e=b.overPos,f=function(){_(a,d.extend({},b,{overPos:b.pos,time:Math.max(Qc,b.time/2)}))});var h=d.extend(k(e),b.width&&{width:b.width});c.sliding=!0,Ic?(a.css(d.extend(l(b.time),h)),b.time>10?u(a,"transform",f,b.time):f()):a.stop().animate(h,b.time,_c,f)}function ab(a,b,c,e,f,h){var i="undefined"!=typeof h;if(i||(f.push(arguments),Array.prototype.push.call(arguments,f.length),!(f.length>1))){a=a||d(a),b=b||d(b);var j=a[0],k=b[0],l="crossfade"===e.method,m=function(){if(!m.done){m.done=!0;var a=(i||f.shift())&&f.shift();a&&ab.apply(this,a),(e.onEnd||g)(!!a)}},n=e.time/(h||1);c.removeClass(Rb+" "+Qb),a.stop().addClass(Rb),b.stop().addClass(Qb),l&&k&&a.fadeTo(0,0),a.fadeTo(l?n:0,1,l&&m),b.fadeTo(n,0,m),j&&l||k||m()}}function bb(a){var b=(a.touches||[])[0]||a;a._x=b.pageX,a._y=b.clientY,a._now=d.now()}function cb(a,c){function e(a){return m=d(a.target),u.checked=p=q=s=!1,k||u.flow||a.touches&&a.touches.length>1||a.which>1||ed&&ed.type!==a.type&&gd||(p=c.select&&m.is(c.select,t))?p:(o="touchstart"===a.type,q=m.is("a, a *",t),n=u.control,r=u.noMove||u.noSwipe||n?16:u.snap?0:4,bb(a),l=ed=a,fd=a.type.replace(/down|start/,"move").replace(/Down/,"Move"),(c.onStart||g).call(t,a,{control:n,$target:m}),k=u.flow=!0,void((!o||u.go)&&Y(a)))}function f(a){if(a.touches&&a.touches.length>1||Nc&&!a.isPrimary||fd!==a.type||!k)return k&&h(),void(c.onTouchEnd||g)();bb(a);var b=Math.abs(a._x-l._x),d=Math.abs(a._y-l._y),e=b-d,f=(u.go||u.x||e>=0)&&!u.noSwipe,i=0>e;o&&!u.checked?(k=f)&&Y(a):(Y(a),(c.onMove||g).call(t,a,{touch:o})),!s&&Math.sqrt(Math.pow(b,2)+Math.pow(d,2))>r&&(s=!0),u.checked=u.checked||f||i}function h(a){(c.onTouchEnd||g)();var b=k;u.control=k=!1,b&&(u.flow=!1),!b||q&&!u.checked||(a&&Y(a),gd=!0,clearTimeout(hd),hd=setTimeout(function(){gd=!1},1e3),(c.onEnd||g).call(t,{moved:s,$target:m,control:n,touch:o,startEvent:l,aborted:!a||"MSPointerCancel"===a.type}))}function i(){u.flow||setTimeout(function(){u.flow=!0},10)}function j(){u.flow&&setTimeout(function(){u.flow=!1},Pc)}var k,l,m,n,o,p,q,r,s,t=a[0],u={};return Nc?(T(t,"MSPointerDown",e),T(b,"MSPointerMove",f),T(b,"MSPointerCancel",h),T(b,"MSPointerUp",h)):(T(t,"touchstart",e),T(t,"touchmove",f),T(t,"touchend",h),T(b,"touchstart",i),T(b,"touchend",j),T(b,"touchcancel",j),Ec.on("scroll",j),a.on("mousedown",e),Fc.on("mousemove",f).on("mouseup",h)),a.on("click","a",function(a){u.checked&&Y(a)}),u}function db(a,b){function c(c,d){A=!0,j=l=c._x,q=c._now,p=[[q,j]],m=n=D.noMove||d?0:v(a,(b.getPos||g)()),(b.onStart||g).call(B,c)}function e(a,b){s=D.min,t=D.max,u=D.snap,w=a.altKey,A=z=!1,y=b.control,y||C.sliding||c(a)}function f(d,e){D.noSwipe||(A||c(d),l=d._x,p.push([d._now,l]),n=m-(j-l),o=K(n,s,t),s>=n?n=x(n,s):n>=t&&(n=x(n,t)),D.noMove||(a.css(k(n)),z||(z=!0,e.touch||Nc||a.addClass(ec)),(b.onMove||g).call(B,d,{pos:n,edge:o})))}function i(e){if(!D.noSwipe||!e.moved){A||c(e.startEvent,!0),e.touch||Nc||a.removeClass(ec),r=d.now();for(var f,i,j,k,o,q,v,x,y,z=r-Pc,C=null,E=Qc,F=b.friction,G=p.length-1;G>=0;G--){if(f=p[G][0],i=Math.abs(f-z),null===C||j>i)C=f,k=p[G][1];else if(C===z||i>j)break;j=i}v=h(n,s,t);var H=k-l,I=H>=0,J=r-C,K=J>Pc,L=!K&&n!==m&&v===n;u&&(v=h(Math[L?I?"floor":"ceil":"round"](n/u)*u,s,t),s=t=v),L&&(u||v===n)&&(y=-(H/J),E*=h(Math.abs(y),b.timeLow,b.timeHigh),o=Math.round(n+y*E/F),u||(v=o),(!I&&o>t||I&&s>o)&&(q=I?s:t,x=o-q,u||(v=q),x=h(v+.03*x,q-50,q+50),E=Math.abs((n-x)/(y/F)))),E*=w?10:1,(b.onEnd||g).call(B,d.extend(e,{moved:e.moved||K&&u,pos:n,newPos:v,overPos:x,time:E}))}}var j,l,m,n,o,p,q,r,s,t,u,w,y,z,A,B=a[0],C=a.data(),D={};return D=d.extend(cb(b.$wrap,d.extend({},b,{onStart:e,onMove:f,onEnd:i})),D)}function eb(a,b){var c,e,f,h=a[0],i={prevent:{}};return T(h,Oc,function(a){var h=a.wheelDeltaY||-1*a.deltaY||0,j=a.wheelDeltaX||-1*a.deltaX||0,k=Math.abs(j)&&!Math.abs(h),l=Z(0>j),m=e===l,n=d.now(),o=Pc>n-f;e=l,f=n,k&&i.ok&&(!i.prevent[l]||c)&&(Y(a,!0),c&&m&&o||(b.shift&&(c=!0,clearTimeout(i.t),i.t=setTimeout(function(){c=!1},Rc)),(b.onEnd||g)(a,b.shift?l:j)))}),i}function fb(){d.each(d.Fotorama.instances,function(a,b){b.index=a})}function gb(a){d.Fotorama.instances.push(a),fb()}function hb(a){d.Fotorama.instances.splice(a.index,1),fb()}var ib="fotorama",jb="fullscreen",kb=ib+"__wrap",lb=kb+"--css2",mb=kb+"--css3",nb=kb+"--video",ob=kb+"--fade",pb=kb+"--slide",qb=kb+"--no-controls",rb=kb+"--no-shadows",sb=kb+"--pan-y",tb=kb+"--rtl",ub=kb+"--only-active",vb=kb+"--no-captions",wb=kb+"--toggle-arrows",xb=ib+"__stage",yb=xb+"__frame",zb=yb+"--video",Ab=xb+"__shaft",Bb=ib+"__grab",Cb=ib+"__pointer",Db=ib+"__arr",Eb=Db+"--disabled",Fb=Db+"--prev",Gb=Db+"--next",Hb=ib+"__nav",Ib=Hb+"-wrap",Jb=Hb+"__shaft",Kb=Hb+"--dots",Lb=Hb+"--thumbs",Mb=Hb+"__frame",Nb=Mb+"--dot",Ob=Mb+"--thumb",Pb=ib+"__fade",Qb=Pb+"-front",Rb=Pb+"-rear",Sb=ib+"__shadow",Tb=Sb+"s",Ub=Tb+"--left",Vb=Tb+"--right",Wb=ib+"__active",Xb=ib+"__select",Yb=ib+"--hidden",Zb=ib+"--fullscreen",$b=ib+"__fullscreen-icon",_b=ib+"__error",ac=ib+"__loading",bc=ib+"__loaded",cc=bc+"--full",dc=bc+"--img",ec=ib+"__grabbing",fc=ib+"__img",gc=fc+"--full",hc=ib+"__dot",ic=ib+"__thumb",jc=ic+"-border",kc=ib+"__html",lc=ib+"__video",mc=lc+"-play",nc=lc+"-close",oc=ib+"__caption",pc=ib+"__caption__wrap",qc=ib+"__spinner",rc='" tabindex="0" role="button',sc=d&&d.fn.jquery.split(".");if(!sc||sc[0]<1||1==sc[0]&&sc[1]<8)throw"Fotorama requires jQuery 1.8 or later and will not run without it.";var tc={},uc=function(a,b,c){function d(a){r.cssText=a}function e(a,b){return typeof a===b}function f(a,b){return!!~(""+a).indexOf(b)}function g(a,b){for(var d in a){var e=a[d];if(!f(e,"-")&&r[e]!==c)return"pfx"==b?e:!0}return!1}function h(a,b,d){for(var f in a){var g=b[a[f]];if(g!==c)return d===!1?a[f]:e(g,"function")?g.bind(d||b):g}return!1}function i(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),f=(a+" "+u.join(d+" ")+d).split(" ");return e(b,"string")||e(b,"undefined")?g(f,b):(f=(a+" "+v.join(d+" ")+d).split(" "),h(f,b,c))}var j,k,l,m="2.6.2",n={},o=b.documentElement,p="modernizr",q=b.createElement(p),r=q.style,s=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),t="Webkit Moz O ms",u=t.split(" "),v=t.toLowerCase().split(" "),w={},x=[],y=x.slice,z=function(a,c,d,e){var f,g,h,i,j=b.createElement("div"),k=b.body,l=k||b.createElement("body");if(parseInt(d,10))for(;d--;)h=b.createElement("div"),h.id=e?e[d]:p+(d+1),j.appendChild(h);return f=["&#173;",'<style id="s',p,'">',a,"</style>"].join(""),j.id=p,(k?j:l).innerHTML+=f,l.appendChild(j),k||(l.style.background="",l.style.overflow="hidden",i=o.style.overflow,o.style.overflow="hidden",o.appendChild(l)),g=c(j,a),k?j.parentNode.removeChild(j):(l.parentNode.removeChild(l),o.style.overflow=i),!!g},A={}.hasOwnProperty;l=e(A,"undefined")||e(A.call,"undefined")?function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:function(a,b){return A.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=y.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(y.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(y.call(arguments)))};return d}),w.csstransforms3d=function(){var a=!!i("perspective");return a};for(var B in w)l(w,B)&&(k=B.toLowerCase(),n[k]=w[B](),x.push((n[k]?"":"no-")+k));return n.addTest=function(a,b){if("object"==typeof a)for(var d in a)l(a,d)&&n.addTest(d,a[d]);else{if(a=a.toLowerCase(),n[a]!==c)return n;b="function"==typeof b?b():b,"undefined"!=typeof enableClasses&&enableClasses&&(o.className+=" "+(b?"":"no-")+a),n[a]=b}return n},d(""),q=j=null,n._version=m,n._prefixes=s,n._domPrefixes=v,n._cssomPrefixes=u,n.testProp=function(a){return g([a])},n.testAllProps=i,n.testStyles=z,n.prefixed=function(a,b,c){return b?i(a,b,c):i(a,"pfx")},n}(a,b),vc={ok:!1,is:function(){return!1},request:function(){},cancel:function(){},event:"",prefix:""},wc="webkit moz o ms khtml".split(" ");if("undefined"!=typeof b.cancelFullScreen)vc.ok=!0;else for(var xc=0,yc=wc.length;yc>xc;xc++)if(vc.prefix=wc[xc],"undefined"!=typeof b[vc.prefix+"CancelFullScreen"]){vc.ok=!0;break}vc.ok&&(vc.event=vc.prefix+"fullscreenchange",vc.is=function(){switch(this.prefix){case"":return b.fullScreen;case"webkit":return b.webkitIsFullScreen;default:return b[this.prefix+"FullScreen"]}},vc.request=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},vc.cancel=function(){return""===this.prefix?b.cancelFullScreen():b[this.prefix+"CancelFullScreen"]()});var zc,Ac={lines:12,length:5,width:2,radius:7,corners:1,rotate:15,color:"rgba(128, 128, 128, .75)",hwaccel:!0},Bc={top:"auto",left:"auto",className:""};!function(a,b){zc=b()}(this,function(){function a(a,c){var d,e=b.createElement(a||"div");for(d in c)e[d]=c[d];return e}function c(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function d(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=m.substring(0,m.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return o[e]||(p.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",p.cssRules.length),o[e]=1),e}function f(a,b){var c,d,f=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<n.length;d++)if(c=n[d]+b,f[c]!==e)return c;return f[b]!==e?b:void 0}function g(a,b){for(var c in b)a.style[f(a,c)||c]=b[c];return a}function h(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)a[d]===e&&(a[d]=c[d])}return a}function i(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a=a.offsetParent;)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}function j(a,b){return"string"==typeof a?a:a[b%a.length]}function k(a){return"undefined"==typeof this?new k(a):void(this.opts=h(a||{},k.defaults,q))}function l(){function b(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}p.addRule(".spin-vml","behavior:url(#default#VML)"),k.prototype.lines=function(a,d){function e(){return g(b("group",{coordsize:k+" "+k,coordorigin:-i+" "+-i}),{width:k,height:k})}function f(a,f,h){c(m,c(g(e(),{rotation:360/d.lines*a+"deg",left:~~f}),c(g(b("roundrect",{arcsize:d.corners}),{width:i,height:d.width,left:d.radius,top:-d.width>>1,filter:h}),b("fill",{color:j(d.color,a),opacity:d.opacity}),b("stroke",{opacity:0}))))}var h,i=d.length+d.width,k=2*i,l=2*-(d.width+d.length)+"px",m=g(e(),{position:"absolute",top:l,left:l});if(d.shadow)for(h=1;h<=d.lines;h++)f(h,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(h=1;h<=d.lines;h++)f(h);return c(a,m)},k.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var m,n=["webkit","Moz","ms","O"],o={},p=function(){var d=a("style",{type:"text/css"});return c(b.getElementsByTagName("head")[0],d),d.sheet||d.styleSheet}(),q={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};k.defaults={},h(k.prototype,{spin:function(b){this.stop();var c,d,e=this,f=e.opts,h=e.el=g(a(0,{className:f.className}),{position:f.position,width:0,zIndex:f.zIndex}),j=f.radius+f.length+f.width;if(b&&(b.insertBefore(h,b.firstChild||null),d=i(b),c=i(h),g(h,{left:("auto"==f.left?d.x-c.x+(b.offsetWidth>>1):parseInt(f.left,10)+j)+"px",top:("auto"==f.top?d.y-c.y+(b.offsetHeight>>1):parseInt(f.top,10)+j)+"px"})),h.setAttribute("role","progressbar"),e.lines(h,e.opts),!m){var k,l=0,n=(f.lines-1)*(1-f.direction)/2,o=f.fps,p=o/f.speed,q=(1-f.opacity)/(p*f.trail/100),r=p/f.lines;!function s(){l++;for(var a=0;a<f.lines;a++)k=Math.max(1-(l+(f.lines-a)*r)%p*q,f.opacity),e.opacity(h,a*f.direction+n,k,f);e.timeout=e.el&&setTimeout(s,~~(1e3/o))}()}return e},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=e),this},lines:function(b,e){function f(b,c){return g(a(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*i+e.rotate)+"deg) translate("+e.radius+"px,0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(var h,i=0,k=(e.lines-1)*(1-e.direction)/2;i<e.lines;i++)h=g(a(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:m&&d(e.opacity,e.trail,k+i*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"}),e.shadow&&c(h,g(f("#000","0 0 4px #000"),{top:"2px"})),c(b,c(h,f(j(e.color,i),"0 0 1px rgba(0,0,0,.1)")));return b},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var r=g(a("group"),{behavior:"url(#default#VML)"});return!f(r,"transform")&&r.adj?l():m=f(r,"animation"),k});var Cc,Dc,Ec=d(a),Fc=d(b),Gc="quirks"===c.hash.replace("#",""),Hc=uc.csstransforms3d,Ic=Hc&&!Gc,Jc=Hc||"CSS1Compat"===b.compatMode,Kc=vc.ok,Lc=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i),Mc=!Ic||Lc,Nc=navigator.msPointerEnabled,Oc="onwheel"in b.createElement("div")?"wheel":b.onmousewheel!==e?"mousewheel":"DOMMouseScroll",Pc=250,Qc=300,Rc=1400,Sc=5e3,Tc=2,Uc=64,Vc=500,Wc=333,Xc="$stageFrame",Yc="$navDotFrame",Zc="$navThumbFrame",$c="auto",_c=f([.1,0,.25,1]),ad=99999,bd="50%",cd={width:null,minwidth:null,maxwidth:"100%",height:null,minheight:null,maxheight:null,ratio:null,margin:Tc,glimpse:0,fit:"contain",position:bd,thumbposition:bd,nav:"dots",navposition:"bottom",navwidth:null,thumbwidth:Uc,thumbheight:Uc,thumbmargin:Tc,thumbborderwidth:Tc,thumbfit:"cover",allowfullscreen:!1,transition:"slide",clicktransition:null,transitionduration:Qc,captions:!0,hash:!1,startindex:0,loop:!1,autoplay:!1,stopautoplayontouch:!0,keyboard:!1,arrows:!0,click:!0,swipe:!0,trackpad:!1,enableifsingleframe:!1,controlsonstart:!0,shuffle:!1,direction:"ltr",shadows:!0,spinner:null},dd={left:!0,right:!0,down:!1,up:!1,space:!1,home:!1,end:!1};G.stop=function(a){G.ii[a]=!1};var ed,fd,gd,hd;jQuery.Fotorama=function(a,e){function f(){d.each(yd,function(a,b){if(!b.i){b.i=me++;var c=A(b.video,!0);if(c){var d={};b.video=c,b.img||b.thumb?b.thumbsReady=!0:d=B(b,yd,ie),C(yd,{img:d.img,thumb:d.thumb},b.i,ie)}}})}function g(a){return Zd[a]||ie.fullScreen}function i(a){var b="keydown."+ib,c=ib+je,d="keydown."+c,f="resize."+c+" orientationchange."+c;a?(Fc.on(d,function(a){var b,c;Cd&&27===a.keyCode?(b=!0,md(Cd,!0,!0)):(ie.fullScreen||e.keyboard&&!ie.index)&&(27===a.keyCode?(b=!0,ie.cancelFullScreen()):a.shiftKey&&32===a.keyCode&&g("space")||37===a.keyCode&&g("left")||38===a.keyCode&&g("up")?c="<":32===a.keyCode&&g("space")||39===a.keyCode&&g("right")||40===a.keyCode&&g("down")?c=">":36===a.keyCode&&g("home")?c="<<":35===a.keyCode&&g("end")&&(c=">>")),(b||c)&&Y(a),c&&ie.show({index:c,slow:a.altKey,user:!0})}),ie.index||Fc.off(b).on(b,"textarea, input, select",function(a){!Dc.hasClass(jb)&&a.stopPropagation()}),Ec.on(f,ie.resize)):(Fc.off(d),Ec.off(f))}function j(b){b!==j.f&&(b?(a.html("").addClass(ib+" "+ke).append(qe).before(oe).before(pe),gb(ie)):(qe.detach(),oe.detach(),pe.detach(),a.html(ne.urtext).removeClass(ke),hb(ie)),i(b),j.f=b)}function m(){yd=ie.data=yd||P(e.data)||D(a),zd=ie.size=yd.length,!xd.ok&&e.shuffle&&O(yd),f(),Je=y(Je),zd&&j(!0)}function o(){var a=2>zd&&!e.enableifsingleframe||Cd;Me.noMove=a||Sd,Me.noSwipe=a||!e.swipe,!Wd&&se.toggleClass(Bb,!e.click&&!Me.noMove&&!Me.noSwipe),Nc&&qe.toggleClass(sb,!Me.noSwipe)}function t(a){a===!0&&(a=""),e.autoplay=Math.max(+a||Sc,1.5*Vd)}function u(){function a(a,c){b[a?"add":"remove"].push(c)}ie.options=e=R(e),Sd="crossfade"===e.transition||"dissolve"===e.transition,Md=e.loop&&(zd>2||Sd&&(!Wd||"slide"!==Wd)),Vd=+e.transitionduration||Qc,Yd="rtl"===e.direction,Zd=d.extend({},e.keyboard&&dd,e.keyboard);var b={add:[],remove:[]};zd>1||e.enableifsingleframe?(Nd=e.nav,Pd="top"===e.navposition,b.remove.push(Xb),we.toggle(!!e.arrows)):(Nd=!1,we.hide()),Rb(),Bd=new zc(d.extend(Ac,e.spinner,Bc,{direction:Yd?-1:1})),Gc(),Hc(),e.autoplay&&t(e.autoplay),Td=n(e.thumbwidth)||Uc,Ud=n(e.thumbheight)||Uc,Ne.ok=Pe.ok=e.trackpad&&!Mc,o(),ed(e,[Le]),Od="thumbs"===Nd,Od?(lc(zd,"navThumb"),Ad=Be,he=Zc,J(oe,d.Fotorama.jst.style({w:Td,h:Ud,b:e.thumbborderwidth,m:e.thumbmargin,s:je,q:!Jc})),ye.addClass(Lb).removeClass(Kb)):"dots"===Nd?(lc(zd,"navDot"),Ad=Ae,he=Yc,ye.addClass(Kb).removeClass(Lb)):(Nd=!1,ye.removeClass(Lb+" "+Kb)),Nd&&(Pd?xe.insertBefore(re):xe.insertAfter(re),wc.nav=!1,wc(Ad,ze,"nav")),Qd=e.allowfullscreen,Qd?(De.prependTo(re),Rd=Kc&&"native"===Qd):(De.detach(),Rd=!1),a(Sd,ob),a(!Sd,pb),a(!e.captions,vb),a(Yd,tb),a("always"!==e.arrows,wb),Xd=e.shadows&&!Mc,a(!Xd,rb),qe.addClass(b.add.join(" ")).removeClass(b.remove.join(" ")),Ke=d.extend({},e)}function x(a){return 0>a?(zd+a%zd)%zd:a>=zd?a%zd:a}function y(a){return h(a,0,zd-1)}function z(a){return Md?x(a):y(a)}function E(a){return a>0||Md?a-1:!1}function U(a){return zd-1>a||Md?a+1:!1}function $(){Me.min=Md?-1/0:-r(zd-1,Le.w,e.margin,Fd),Me.max=Md?1/0:-r(0,Le.w,e.margin,Fd),Me.snap=Le.w+e.margin}function bb(){Oe.min=Math.min(0,Le.nw-ze.width()),Oe.max=0,ze.toggleClass(Bb,!(Oe.noMove=Oe.min===Oe.max))}function cb(a,b,c){if("number"==typeof a){a=new Array(a);var e=!0}return d.each(a,function(a,d){if(e&&(d=a),"number"==typeof d){var f=yd[x(d)];if(f){var g="$"+b+"Frame",h=f[g];c.call(this,a,d,f,h,g,h&&h.data())}}})}function fb(a,b,c,d){(!$d||"*"===$d&&d===Ld)&&(a=q(e.width)||q(a)||Vc,b=q(e.height)||q(b)||Wc,ie.resize({width:a,ratio:e.ratio||c||a/b},0,d!==Ld&&"*"))}function Pb(a,b,c,f,g,h){cb(a,b,function(a,i,j,k,l,m){function n(a){var b=x(i);fd(a,{index:b,src:w,frame:yd[b]})}function o(){t.remove(),d.Fotorama.cache[w]="error",j.html&&"stage"===b||!y||y===w?(!w||j.html||r?"stage"===b&&(k.trigger("f:load").removeClass(ac+" "+_b).addClass(bc),n("load"),fb()):(k.trigger("f:error").removeClass(ac).addClass(_b),n("error")),m.state="error",!(zd>1&&yd[i]===j)||j.html||j.deleted||j.video||r||(j.deleted=!0,ie.splice(i,1))):(j[v]=w=y,Pb([i],b,c,f,g,!0))}function p(){d.Fotorama.measures[w]=u.measures=d.Fotorama.measures[w]||{width:s.width,height:s.height,ratio:s.width/s.height},fb(u.measures.width,u.measures.height,u.measures.ratio,i),t.off("load error").addClass(fc+(r?" "+gc:"")).prependTo(k),I(t,(d.isFunction(c)?c():c)||Le,f||j.fit||e.fit,g||j.position||e.position),d.Fotorama.cache[w]=m.state="loaded",setTimeout(function(){k.trigger("f:load").removeClass(ac+" "+_b).addClass(bc+" "+(r?cc:dc)),"stage"===b?n("load"):(j.thumbratio===$c||!j.thumbratio&&e.thumbratio===$c)&&(j.thumbratio=u.measures.ratio,vd())},0)}function q(){var a=10;G(function(){return!fe||!a--&&!Mc},function(){p()})}if(k){var r=ie.fullScreen&&j.full&&j.full!==j.img&&!m.$full&&"stage"===b;if(!m.$img||h||r){var s=new Image,t=d(s),u=t.data();m[r?"$full":"$img"]=t;var v="stage"===b?r?"full":"img":"thumb",w=j[v],y=r?null:j["stage"===b?"thumb":"img"];if("navThumb"===b&&(k=m.$wrap),!w)return void o();d.Fotorama.cache[w]?!function z(){"error"===d.Fotorama.cache[w]?o():"loaded"===d.Fotorama.cache[w]?setTimeout(q,0):setTimeout(z,100)}():(d.Fotorama.cache[w]="*",t.on("load",q).on("error",o)),m.state="",s.src=w}}})}function Qb(a){Ie.append(Bd.spin().el).appendTo(a)}function Rb(){Ie.detach(),Bd&&Bd.stop()}function Sb(){var a=Dd[Xc];a&&!a.data().state&&(Qb(a),a.on("f:load f:error",function(){a.off("f:load f:error"),Rb()}))}function ec(a){W(a,sd),X(a,function(){setTimeout(function(){Q(ye)},0),Rc({time:Vd,guessIndex:d(this).data().eq,minMax:Oe})})}function lc(a,b){cb(a,b,function(a,c,e,f,g,h){if(!f){f=e[g]=qe[g].clone(),h=f.data(),h.data=e;var i=f[0];"stage"===b?(e.html&&d('<div class="'+kc+'"></div>').append(e._html?d(e.html).removeAttr("id").html(e._html):e.html).appendTo(f),e.caption&&d(N(oc,N(pc,e.caption))).appendTo(f),e.video&&f.addClass(zb).append(Fe.clone()),X(i,function(){setTimeout(function(){Q(re)},0),pd({index:h.eq,user:!0})}),te=te.add(f)):"navDot"===b?(ec(i),Ae=Ae.add(f)):"navThumb"===b&&(ec(i),h.$wrap=f.children(":first"),Be=Be.add(f),e.video&&h.$wrap.append(Fe.clone()))}})}function sc(a,b,c,d){return a&&a.length&&I(a,b,c,d)}function tc(a){cb(a,"stage",function(a,b,c,f,g,h){if(f){var i=x(b),j=c.fit||e.fit,k=c.position||e.position;h.eq=i,Re[Xc][i]=f.css(d.extend({left:Sd?0:r(b,Le.w,e.margin,Fd)},Sd&&l(0))),F(f[0])&&(f.appendTo(se),md(c.$video)),sc(h.$img,Le,j,k),sc(h.$full,Le,j,k)}})}function uc(a,b){if("thumbs"===Nd&&!isNaN(a)){var c=-a,f=-a+Le.nw;Be.each(function(){var a=d(this),g=a.data(),h=g.eq,i=function(){return{h:Ud,w:g.w}},j=i(),k=yd[h]||{},l=k.thumbfit||e.thumbfit,m=k.thumbposition||e.thumbposition;j.w=g.w,g.l+g.w<c||g.l>f||sc(g.$img,j,l,m)||b&&Pb([h],"navThumb",i,l,m)})}}function wc(a,b,c){if(!wc[c]){var f="nav"===c&&Od,g=0;b.append(a.filter(function(){for(var a,b=d(this),c=b.data(),e=0,f=yd.length;f>e;e++)if(c.data===yd[e]){a=!0,c.eq=e;break}return a||b.remove()&&!1}).sort(function(a,b){return d(a).data().eq-d(b).data().eq}).each(function(){if(f){var a=d(this),b=a.data(),c=Math.round(Ud*b.data.thumbratio)||Td;b.l=g,b.w=c,a.css({width:c}),g+=c+e.thumbmargin}})),wc[c]=!0}}function xc(a){return a-Se>Le.w/3}function yc(a){return!(Md||Je+a&&Je-zd+a||Cd)}function Gc(){var a=yc(0),b=yc(1);ue.toggleClass(Eb,a).attr(V(a)),ve.toggleClass(Eb,b).attr(V(b))}function Hc(){Ne.ok&&(Ne.prevent={"<":yc(0),">":yc(1)})}function Lc(a){var b,c,d=a.data();return Od?(b=d.l,c=d.w):(b=a.position().left,c=a.width()),{c:b+c/2,min:-b+10*e.thumbmargin,max:-b+Le.w-c-10*e.thumbmargin}}function Oc(a){var b=Dd[he].data();_(Ce,{time:1.2*a,pos:b.l,width:b.w-2*e.thumbborderwidth})}function Rc(a){var b=yd[a.guessIndex][he];if(b){var c=Oe.min!==Oe.max,d=a.minMax||c&&Lc(Dd[he]),e=c&&(a.keep&&Rc.l?Rc.l:h((a.coo||Le.nw/2)-Lc(b).c,d.min,d.max)),f=c&&h(e,Oe.min,Oe.max),g=1.1*a.time;_(ze,{time:g,pos:f||0,onEnd:function(){uc(f,!0)}}),ld(ye,K(f,Oe.min,Oe.max)),Rc.l=e}}function Tc(){_c(he),Qe[he].push(Dd[he].addClass(Wb))}function _c(a){for(var b=Qe[a];b.length;)b.shift().removeClass(Wb)}function bd(a){var b=Re[a];d.each(Ed,function(a,c){delete b[x(c)]}),d.each(b,function(a,c){delete b[a],c.detach()})}function cd(a){Fd=Gd=Je;var b=Dd[Xc];b&&(_c(Xc),Qe[Xc].push(b.addClass(Wb)),a||ie.show.onEnd(!0),v(se,0,!0),bd(Xc),tc(Ed),$(),bb())}function ed(a,b){a&&d.each(b,function(b,c){c&&d.extend(c,{width:a.width||c.width,height:a.height,minwidth:a.minwidth,maxwidth:a.maxwidth,minheight:a.minheight,maxheight:a.maxheight,ratio:S(a.ratio)})})}function fd(b,c){a.trigger(ib+":"+b,[ie,c])}function gd(){clearTimeout(hd.t),fe=1,e.stopautoplayontouch?ie.stopAutoplay():ce=!0}function hd(){fe&&(e.stopautoplayontouch||(id(),jd()),hd.t=setTimeout(function(){fe=0},Qc+Pc))}function id(){ce=!(!Cd&&!de)}function jd(){if(clearTimeout(jd.t),G.stop(jd.w),!e.autoplay||ce)return void(ie.autoplay&&(ie.autoplay=!1,fd("stopautoplay")));ie.autoplay||(ie.autoplay=!0,fd("startautoplay"));var a=Je,b=Dd[Xc].data();jd.w=G(function(){return b.state||a!==Je},function(){jd.t=setTimeout(function(){if(!ce&&a===Je){var b=Kd,c=yd[b][Xc].data();jd.w=G(function(){return c.state||b!==Kd},function(){ce||b!==Kd||ie.show(Md?Z(!Yd):Kd)})}},e.autoplay)})}function kd(){ie.fullScreen&&(ie.fullScreen=!1,Kc&&vc.cancel(le),Dc.removeClass(jb),Cc.removeClass(jb),a.removeClass(Zb).insertAfter(pe),Le=d.extend({},ee),md(Cd,!0,!0),rd("x",!1),ie.resize(),Pb(Ed,"stage"),Q(Ec,ae,_d),fd("fullscreenexit"))}function ld(a,b){Xd&&(a.removeClass(Ub+" "+Vb),b&&!Cd&&a.addClass(b.replace(/^|\s/g," "+Tb+"--")))}function md(a,b,c){b&&(qe.removeClass(nb),Cd=!1,o()),a&&a!==Cd&&(a.remove(),fd("unloadvideo")),c&&(id(),jd())}function nd(a){qe.toggleClass(qb,a)}function od(a){if(!Me.flow){var b=a?a.pageX:od.x,c=b&&!yc(xc(b))&&e.click;od.p!==c&&re.toggleClass(Cb,c)&&(od.p=c,od.x=b)}}function pd(a){clearTimeout(pd.t),e.clicktransition&&e.clicktransition!==e.transition?setTimeout(function(){var b=e.transition;ie.setOptions({transition:e.clicktransition}),Wd=b,pd.t=setTimeout(function(){ie.show(a)},10)},0):ie.show(a)}function qd(a,b){var c=a.target,f=d(c);f.hasClass(mc)?ie.playVideo():c===Ee?ie.toggleFullScreen():Cd?c===He&&md(Cd,!0,!0):b?nd():e.click&&pd({index:a.shiftKey||Z(xc(a._x)),slow:a.altKey,user:!0})}function rd(a,b){Me[a]=Oe[a]=b}function sd(a){var b=d(this).data().eq;pd({index:b,slow:a.altKey,user:!0,coo:a._x-ye.offset().left})}function td(a){pd({index:we.index(this)?">":"<",slow:a.altKey,user:!0})}function ud(a){X(a,function(){setTimeout(function(){Q(re)},0),nd(!1)})}function vd(){if(m(),u(),!vd.i){vd.i=!0;var a=e.startindex;(a||e.hash&&c.hash)&&(Ld=L(a||c.hash.replace(/^#/,""),yd,0===ie.index||a,a)),Je=Fd=Gd=Hd=Ld=z(Ld)||0}if(zd){if(wd())return;Cd&&md(Cd,!0),Ed=[],bd(Xc),vd.ok=!0,ie.show({index:Je,time:0}),ie.resize()}else ie.destroy()}function wd(){return!wd.f===Yd?(wd.f=Yd,Je=zd-1-Je,ie.reverse(),!0):void 0}function xd(){xd.ok||(xd.ok=!0,fd("ready"))}Cc=d("html"),Dc=d("body");var yd,zd,Ad,Bd,Cd,Dd,Ed,Fd,Gd,Hd,Id,Jd,Kd,Ld,Md,Nd,Od,Pd,Qd,Rd,Sd,Td,Ud,Vd,Wd,Xd,Yd,Zd,$d,_d,ae,be,ce,de,ee,fe,ge,he,ie=this,je=d.now(),ke=ib+je,le=a[0],me=1,ne=a.data(),oe=d("<style></style>"),pe=d(N(Yb)),qe=d(N(kb)),re=d(N(xb)).appendTo(qe),se=(re[0],d(N(Ab)).appendTo(re)),te=d(),ue=d(N(Db+" "+Fb+rc)),ve=d(N(Db+" "+Gb+rc)),we=ue.add(ve).appendTo(re),xe=d(N(Ib)),ye=d(N(Hb)).appendTo(xe),ze=d(N(Jb)).appendTo(ye),Ae=d(),Be=d(),Ce=(se.data(),ze.data(),d(N(jc)).appendTo(ze)),De=d(N($b+rc)),Ee=De[0],Fe=d(N(mc)),Ge=d(N(nc)).appendTo(re),He=Ge[0],Ie=d(N(qc)),Je=!1,Ke={},Le={},Me={},Ne={},Oe={},Pe={},Qe={},Re={},Se=0,Te=[];
qe[Xc]=d(N(yb)),qe[Zc]=d(N(Mb+" "+Ob+rc,N(ic))),qe[Yc]=d(N(Mb+" "+Nb+rc,N(hc))),Qe[Xc]=[],Qe[Zc]=[],Qe[Yc]=[],Re[Xc]={},qe.addClass(Ic?mb:lb).toggleClass(qb,!e.controlsonstart),ne.fotorama=this,ie.startAutoplay=function(a){return ie.autoplay?this:(ce=de=!1,t(a||e.autoplay),jd(),this)},ie.stopAutoplay=function(){return ie.autoplay&&(ce=de=!0,jd()),this},ie.show=function(a){var b;"object"!=typeof a?(b=a,a={}):b=a.index,b=">"===b?Gd+1:"<"===b?Gd-1:"<<"===b?0:">>"===b?zd-1:b,b=isNaN(b)?L(b,yd,!0):b,b="undefined"==typeof b?Je||0:b,ie.activeIndex=Je=z(b),Id=E(Je),Jd=U(Je),Kd=x(Je+(Yd?-1:1)),Ed=[Je,Id,Jd],Gd=Md?b:Je;var c=Math.abs(Hd-Gd),d=w(a.time,function(){return Math.min(Vd*(1+(c-1)/12),2*Vd)}),f=a.overPos;a.slow&&(d*=10);var g=Dd;ie.activeFrame=Dd=yd[Je];var i=g===Dd&&!a.user;md(Cd,Dd.i!==yd[x(Fd)].i),lc(Ed,"stage"),tc(Mc?[Gd]:[Gd,E(Gd),U(Gd)]),rd("go",!0),i||fd("show",{user:a.user,time:d}),ce=!0;var j=ie.show.onEnd=function(b){if(!j.ok){if(j.ok=!0,b||cd(!0),i||fd("showend",{user:a.user}),!b&&Wd&&Wd!==e.transition)return ie.setOptions({transition:Wd}),void(Wd=!1);Sb(),Pb(Ed,"stage"),rd("go",!1),Hc(),od(),id(),jd()}};if(Sd){var k=Dd[Xc],l=Je!==Hd?yd[Hd][Xc]:null;ab(k,l,te,{time:d,method:e.transition,onEnd:j},Te)}else _(se,{pos:-r(Gd,Le.w,e.margin,Fd),overPos:f,time:d,onEnd:j});if(Gc(),Nd){Tc();var m=y(Je+h(Gd-Hd,-1,1));Rc({time:d,coo:m!==Je&&a.coo,guessIndex:"undefined"!=typeof a.coo?m:Je,keep:i}),Od&&Oc(d)}return be="undefined"!=typeof Hd&&Hd!==Je,Hd=Je,e.hash&&be&&!ie.eq&&H(Dd.id||Je+1),this},ie.requestFullScreen=function(){return Qd&&!ie.fullScreen&&(_d=Ec.scrollTop(),ae=Ec.scrollLeft(),Q(Ec),rd("x",!0),ee=d.extend({},Le),a.addClass(Zb).appendTo(Dc.addClass(jb)),Cc.addClass(jb),md(Cd,!0,!0),ie.fullScreen=!0,Rd&&vc.request(le),ie.resize(),Pb(Ed,"stage"),Sb(),fd("fullscreenenter")),this},ie.cancelFullScreen=function(){return Rd&&vc.is()?vc.cancel(b):kd(),this},ie.toggleFullScreen=function(){return ie[(ie.fullScreen?"cancel":"request")+"FullScreen"]()},T(b,vc.event,function(){!yd||vc.is()||Cd||kd()}),ie.resize=function(a){if(!yd)return this;var b=arguments[1]||0,c=arguments[2];ed(ie.fullScreen?{width:"100%",maxwidth:null,minwidth:null,height:"100%",maxheight:null,minheight:null}:R(a),[Le,c||ie.fullScreen||e]);var d=Le.width,f=Le.height,g=Le.ratio,i=Ec.height()-(Nd?ye.height():0);return q(d)&&(qe.addClass(ub).css({width:d,minWidth:Le.minwidth||0,maxWidth:Le.maxwidth||ad}),d=Le.W=Le.w=qe.width(),Le.nw=Nd&&p(e.navwidth,d)||d,e.glimpse&&(Le.w-=Math.round(2*(p(e.glimpse,d)||0))),se.css({width:Le.w,marginLeft:(Le.W-Le.w)/2}),f=p(f,i),f=f||g&&d/g,f&&(d=Math.round(d),f=Le.h=Math.round(h(f,p(Le.minheight,i),p(Le.maxheight,i))),re.stop().animate({width:d,height:f},b,function(){qe.removeClass(ub)}),cd(),Nd&&(ye.stop().animate({width:Le.nw},b),Rc({guessIndex:Je,time:b,keep:!0}),Od&&wc.nav&&Oc(b)),$d=c||!0,xd())),Se=re.offset().left,this},ie.setOptions=function(a){return d.extend(e,a),vd(),this},ie.shuffle=function(){return yd&&O(yd)&&vd(),this},ie.destroy=function(){return ie.cancelFullScreen(),ie.stopAutoplay(),yd=ie.data=null,j(),Ed=[],bd(Xc),vd.ok=!1,this},ie.playVideo=function(){var a=Dd,b=a.video,c=Je;return"object"==typeof b&&a.videoReady&&(Rd&&ie.fullScreen&&ie.cancelFullScreen(),G(function(){return!vc.is()||c!==Je},function(){c===Je&&(a.$video=a.$video||d(d.Fotorama.jst.video(b)),a.$video.appendTo(a[Xc]),qe.addClass(nb),Cd=a.$video,o(),we.blur(),De.blur(),fd("loadvideo"))})),this},ie.stopVideo=function(){return md(Cd,!0,!0),this},re.on("mousemove",od),Me=db(se,{onStart:gd,onMove:function(a,b){ld(re,b.edge)},onTouchEnd:hd,onEnd:function(a){ld(re);var b=(Nc&&!ge||a.touch)&&e.arrows&&"always"!==e.arrows;if(a.moved||b&&a.pos!==a.newPos&&!a.control){var c=s(a.newPos,Le.w,e.margin,Fd);ie.show({index:c,time:Sd?Vd:a.time,overPos:a.overPos,user:!0})}else a.aborted||a.control||qd(a.startEvent,b)},timeLow:1,timeHigh:1,friction:2,select:"."+Xb+", ."+Xb+" *",$wrap:re}),Oe=db(ze,{onStart:gd,onMove:function(a,b){ld(ye,b.edge)},onTouchEnd:hd,onEnd:function(a){function b(){Rc.l=a.newPos,id(),jd(),uc(a.newPos,!0)}if(a.moved)a.pos!==a.newPos?(ce=!0,_(ze,{time:a.time,pos:a.newPos,overPos:a.overPos,onEnd:b}),uc(a.newPos),Xd&&ld(ye,K(a.newPos,Oe.min,Oe.max))):b();else{var c=a.$target.closest("."+Mb,ze)[0];c&&sd.call(c,a.startEvent)}},timeLow:.5,timeHigh:2,friction:5,$wrap:ye}),Ne=eb(re,{shift:!0,onEnd:function(a,b){gd(),hd(),ie.show({index:b,slow:a.altKey})}}),Pe=eb(ye,{onEnd:function(a,b){gd(),hd();var c=v(ze)+.25*b;ze.css(k(h(c,Oe.min,Oe.max))),Xd&&ld(ye,K(c,Oe.min,Oe.max)),Pe.prevent={"<":c>=Oe.max,">":c<=Oe.min},clearTimeout(Pe.t),Pe.t=setTimeout(function(){Rc.l=c,uc(c,!0)},Pc),uc(c)}}),qe.hover(function(){setTimeout(function(){fe||nd(!(ge=!0))},0)},function(){ge&&nd(!(ge=!1))}),M(we,function(a){Y(a),td.call(this,a)},{onStart:function(){gd(),Me.control=!0},onTouchEnd:hd}),we.each(function(){W(this,function(a){td.call(this,a)}),ud(this)}),W(Ee,ie.toggleFullScreen),ud(Ee),d.each("load push pop shift unshift reverse sort splice".split(" "),function(a,b){ie[b]=function(){return yd=yd||[],"load"!==b?Array.prototype[b].apply(yd,arguments):arguments[0]&&"object"==typeof arguments[0]&&arguments[0].length&&(yd=P(arguments[0])),vd(),ie}}),vd()},d.fn.fotorama=function(b){return this.each(function(){var c=this,e=d(this),f=e.data(),g=f.fotorama;g?g.setOptions(b,!0):G(function(){return!E(c)},function(){f.urtext=e.html(),new d.Fotorama(e,d.extend({},cd,a.fotoramaDefaults,b,f))})})},d.Fotorama.instances=[],d.Fotorama.cache={},d.Fotorama.measures={},d=d||{},d.Fotorama=d.Fotorama||{},d.Fotorama.jst=d.Fotorama.jst||{},d.Fotorama.jst.style=function(a){{var b,c="";tc.escape}return c+=".fotorama"+(null==(b=a.s)?"":b)+" .fotorama__nav--thumbs .fotorama__nav__frame{\npadding:"+(null==(b=a.m)?"":b)+"px;\nheight:"+(null==(b=a.h)?"":b)+"px}\n.fotorama"+(null==(b=a.s)?"":b)+" .fotorama__thumb-border{\nheight:"+(null==(b=a.h-a.b*(a.q?0:2))?"":b)+"px;\nborder-width:"+(null==(b=a.b)?"":b)+"px;\nmargin-top:"+(null==(b=a.m)?"":b)+"px}"},d.Fotorama.jst.video=function(a){function b(){c+=d.call(arguments,"")}var c="",d=(tc.escape,Array.prototype.join);return c+='<div class="fotorama__video"><iframe src="',b(("youtube"==a.type?a.p+"youtube.com/embed/"+a.id+"?autoplay=1":"vimeo"==a.type?a.p+"player.vimeo.com/video/"+a.id+"?autoplay=1&badge=0":a.id)+(a.s&&"custom"!=a.type?"&"+a.s:"")),c+='" frameborder="0" allowfullscreen></iframe></div>\n'},d(function(){d("."+ib+':not([data-auto="false"])').fotorama()})}(window,document,location,"undefined"!=typeof jQuery&&jQuery);
// Generated by CoffeeScript 1.3.3
(function() {
  var Instafeed, root;

  Instafeed = (function() {

    function Instafeed(params, context) {
      var option, value;
      this.options = {
        target: 'instafeed',
        get: 'popular',
        resolution: 'thumbnail',
        sortBy: 'none',
        links: true,
        mock: false,
        useHttp: false
      };
      if (typeof params === 'object') {
        for (option in params) {
          value = params[option];
          this.options[option] = value;
        }
      }
      this.context = context != null ? context : this;
      this.unique = this._genKey();
    }

    Instafeed.prototype.hasNext = function() {
      return typeof this.context.nextUrl === 'string' && this.context.nextUrl.length > 0;
    };

    Instafeed.prototype.next = function() {
      if (!this.hasNext()) {
        return false;
      }
      return this.run(this.context.nextUrl);
    };

    Instafeed.prototype.run = function(url) {
      var header, instanceName, script;
      if (typeof this.options.clientId !== 'string') {
        if (typeof this.options.accessToken !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if (typeof this.options.accessToken !== 'string') {
        if (typeof this.options.clientId !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if ((this.options.before != null) && typeof this.options.before === 'function') {
        this.options.before.call(this);
      }
      if (typeof document !== "undefined" && document !== null) {
        script = document.createElement('script');
        script.id = 'instafeed-fetcher';
        script.src = url || this._buildUrl();
        header = document.getElementsByTagName('head');
        header[0].appendChild(script);
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = new Instafeed(this.options, this);
        window[instanceName].unique = this.unique;
      }
      return true;
    };

    Instafeed.prototype.parse = function(response) {
      var anchor, fragment, header, htmlString, image, imageString, imageUrl, images, img, imgUrl, instanceName, node, reverse, sortSettings, tmpEl, _i, _j, _k, _len, _len1, _len2, _ref;
      if (typeof response !== 'object') {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'Invalid JSON data');
          return false;
        } else {
          throw new Error('Invalid JSON response');
        }
      }
      if (response.meta.code !== 200) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, response.meta.error_message);
          return false;
        } else {
          throw new Error("Error from Instagram: " + response.meta.error_message);
        }
      }
      if (response.data.length === 0) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'No images were returned from Instagram');
          return false;
        } else {
          throw new Error('No images were returned from Instagram');
        }
      }
      if ((this.options.success != null) && typeof this.options.success === 'function') {
        this.options.success.call(this, response);
      }
      this.context.nextUrl = '';
      if (response.pagination != null) {
        this.context.nextUrl = response.pagination.next_url;
      }
      if (this.options.sortBy !== 'none') {
        if (this.options.sortBy === 'random') {
          sortSettings = ['', 'random'];
        } else {
          sortSettings = this.options.sortBy.split('-');
        }
        reverse = sortSettings[0] === 'least' ? true : false;
        switch (sortSettings[1]) {
          case 'random':
            response.data.sort(function() {
              return 0.5 - Math.random();
            });
            break;
          case 'recent':
            response.data = this._sortBy(response.data, 'created_time', reverse);
            break;
          case 'liked':
            response.data = this._sortBy(response.data, 'likes.count', reverse);
            break;
          case 'commented':
            response.data = this._sortBy(response.data, 'comments.count', reverse);
            break;
          default:
            throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
        }
      }
      if ((typeof document !== "undefined" && document !== null) && this.options.mock === false) {
        images = response.data;
        if (this.options.limit != null) {
          if (images.length > this.options.limit) {
            images = images.slice(0, this.options.limit + 1 || 9e9);
          }
        }
        fragment = document.createDocumentFragment();
        if ((this.options.filter != null) && typeof this.options.filter === 'function') {
          images = this._filter(images, this.options.filter);
        }
        if ((this.options.template != null) && typeof this.options.template === 'string') {
          htmlString = '';
          imageString = '';
          imgUrl = '';
          tmpEl = document.createElement('div');
          for (_i = 0, _len = images.length; _i < _len; _i++) {
            image = images[_i];
            imageUrl = image.images[this.options.resolution].url;
            if (!this.options.useHttp) {
              imageUrl = imageUrl.replace('http://', '//');
            }
            imageString = this._makeTemplate(this.options.template, {
              model: image,
              id: image.id,
              link: image.link,
              image: imageUrl,
              caption: this._getObjectProperty(image, 'caption.text'),
              likes: image.likes.count,
              comments: image.comments.count,
              location: this._getObjectProperty(image, 'location.name')
            });
            htmlString += imageString;
          }
          tmpEl.innerHTML = htmlString;
          _ref = [].slice.call(tmpEl.childNodes);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            node = _ref[_j];
            fragment.appendChild(node);
          }
        } else {
          for (_k = 0, _len2 = images.length; _k < _len2; _k++) {
            image = images[_k];
            img = document.createElement('img');
            imageUrl = image.images[this.options.resolution].url;
            if (!this.options.useHttp) {
              imageUrl = imageUrl.replace('http://', '//');
            }
            img.src = imageUrl;
            if (this.options.links === true) {
              anchor = document.createElement('a');
              anchor.href = image.link;
              anchor.appendChild(img);
              fragment.appendChild(anchor);
            } else {
              fragment.appendChild(img);
            }
          }
        }
        document.getElementById(this.options.target).appendChild(fragment);
        header = document.getElementsByTagName('head')[0];
        header.removeChild(document.getElementById('instafeed-fetcher'));
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = void 0;
        try {
          delete window[instanceName];
        } catch (e) {

        }
      }
      if ((this.options.after != null) && typeof this.options.after === 'function') {
        this.options.after.call(this);
      }
      return true;
    };

    Instafeed.prototype._buildUrl = function() {
      var base, endpoint, final;
      base = "https://api.instagram.com/v1";
      switch (this.options.get) {
        case "popular":
          endpoint = "media/popular";
          break;
        case "tagged":
          if (typeof this.options.tagName !== 'string') {
            throw new Error("No tag name specified. Use the 'tagName' option.");
          }
          endpoint = "tags/" + this.options.tagName + "/media/recent";
          break;
        case "location":
          if (typeof this.options.locationId !== 'number') {
            throw new Error("No location specified. Use the 'locationId' option.");
          }
          endpoint = "locations/" + this.options.locationId + "/media/recent";
          break;
        case "user":
          if (typeof this.options.userId !== 'number') {
            throw new Error("No user specified. Use the 'userId' option.");
          }
          if (typeof this.options.accessToken !== 'string') {
            throw new Error("No access token. Use the 'accessToken' option.");
          }
          endpoint = "users/" + this.options.userId + "/media/recent";
          break;
        default:
          throw new Error("Invalid option for get: '" + this.options.get + "'.");
      }
      final = "" + base + "/" + endpoint;
      if (this.options.accessToken != null) {
        final += "?access_token=" + this.options.accessToken;
      } else {
        final += "?client_id=" + this.options.clientId;
      }
      if (this.options.limit != null) {
        final += "&count=" + this.options.limit;
      }
      final += "&callback=instafeedCache" + this.unique + ".parse";
      return final;
    };

    Instafeed.prototype._genKey = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return "" + (S4()) + (S4()) + (S4()) + (S4());
    };

    Instafeed.prototype._makeTemplate = function(template, data) {
      var output, pattern, varName, varValue, _ref;
      pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
      output = template;
      while (pattern.test(output)) {
        varName = output.match(pattern)[1];
        varValue = (_ref = this._getObjectProperty(data, varName)) != null ? _ref : '';
        output = output.replace(pattern, "" + varValue);
      }
      return output;
    };

    Instafeed.prototype._getObjectProperty = function(object, property) {
      var piece, pieces;
      property = property.replace(/\[(\w+)\]/g, '.$1');
      pieces = property.split('.');
      while (pieces.length) {
        piece = pieces.shift();
        if ((object != null) && piece in object) {
          object = object[piece];
        } else {
          return null;
        }
      }
      return object;
    };

    Instafeed.prototype._sortBy = function(data, property, reverse) {
      var sorter;
      sorter = function(a, b) {
        var valueA, valueB;
        valueA = this._getObjectProperty(a, property);
        valueB = this._getObjectProperty(b, property);
        if (reverse) {
          if (valueA > valueB) {
            return 1;
          } else {
            return -1;
          }
        }
        if (valueA < valueB) {
          return 1;
        } else {
          return -1;
        }
      };
      data.sort(sorter.bind(this));
      return data;
    };

    Instafeed.prototype._filter = function(images, filter) {
      var filteredImages, image, _fn, _i, _len;
      filteredImages = [];
      _fn = function(image) {
        if (filter(image)) {
          return filteredImages.push(image);
        }
      };
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        _fn(image);
      }
      return filteredImages;
    };

    return Instafeed;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Instafeed = Instafeed;

}).call(this);
// ----------------------------------------------------------------------------------------------------
// ScrollMe
// A jQuery plugin for adding simple scrolling effects to web pages
// http://scrollme.nckprsn.com
// ----------------------------------------------------------------------------------------------------

var scrollme = ( function( $ )
{
	// ----------------------------------------------------------------------------------------------------
	// ScrollMe object

	var _this = {};

	// ----------------------------------------------------------------------------------------------------
	// Properties

	var $document = $( document );
	var $window = $( window );

	_this.body_height = 0;

	_this.viewport_height = 0;

	_this.viewport_top = 0;
	_this.viewport_bottom = 0;

	_this.viewport_top_previous = -1;

	_this.elements = [];
	_this.elements_in_view = [];

	_this.property_defaults =
	{
		'opacity' : 1,
		'translatex' : 0,
		'translatey' : 0,
		'translatez' : 0,
		'rotatex' : 0,
		'rotatey' : 0,
		'rotatez' : 0,
		'scale' : 1,
		'scalex' : 1,
		'scaley' : 1,
		'scalez' : 1
	};

	_this.scrollme_selector = '.scrollme';
	_this.animateme_selector = '.animateme';

	_this.update_interval = 10;

	// Easing functions

	_this.easing_functions =
	{
		'linear' : function( x )
		{
			return x;
		},

		'easeout' : function( x )
		{
			return x * x * x;
		},

		'easein' : function( x )
		{
			x = 1 - x;
			return 1 - ( x * x * x );
		},

		'easeinout' : function( x )
		{
			if( x < 0.5 )
			{
				return ( 4 * x * x * x );
			}
			else
			{
				x = 1 - x;
				return 1 - ( 4 * x * x * x ) ;
			}
		}
	};

	// Document events to bind initialisation to

	_this.init_events =
	[
		'ready',
		'page:load', // Turbolinks
		'page:change' // Turbolinks
	];

	// ----------------------------------------------------------------------------------------------------
	// Initialisation conditions

	_this.init_if = function() { return true; }

	// ----------------------------------------------------------------------------------------------------
	// Initialisation

	_this.init = function()
	{
		// Cancel if initialisation conditions not met

		if( !_this.init_if() ) return false;

		// Load all elements to animate

		_this.init_elements();

		// Get element & viewport sizes

		_this.on_resize();

		// Recalculate heights & positions on resize and rotate

		$window.on( 'resize orientationchange' , function(){ _this.on_resize(); } );

		// Recalculate heights & positions when page is fully loaded + a bit just in case

		$window.load( function(){ setTimeout( function(){ _this.on_resize(); } , 100 ) });

		// Start animating

		setInterval( _this.update , _this.update_interval );

		return true;
	}

	// ----------------------------------------------------------------------------------------------------
	// Get list and pre-load animated elements

	_this.init_elements = function()
	{
		// For each reference element

		$( _this.scrollme_selector ).each( function()
		{
			var element = {};

			element.element = $( this );

			var effects = [];

			// For each animated element

			$( this ).find( _this.animateme_selector ).addBack( _this.animateme_selector ).each( function()
			{
				// Get effect details

				var effect = {};

				effect.element = $( this );

				effect.when = effect.element.data( 'when' );
				effect.from = effect.element.data( 'from' );
				effect.to = effect.element.data( 'to' );

				if( effect.element.is( '[data-crop]' ) )
				{
					effect.crop = effect.element.data( 'crop' );
				}
				else
				{
					effect.crop = true;
				}

				if( effect.element.is( '[data-easing]' ) )
				{
					effect.easing = _this.easing_functions[ effect.element.data( 'easing' ) ]
				}
				else
				{
					effect.easing = _this.easing_functions[ 'easeout' ];
				}

				// Get animated properties

				var properties = {};

				if( effect.element.is( '[data-opacity]' ) )    properties.opacity    = effect.element.data( 'opacity' );
				if( effect.element.is( '[data-translatex]' ) ) properties.translatex = effect.element.data( 'translatex' );
				if( effect.element.is( '[data-translatey]' ) ) properties.translatey = effect.element.data( 'translatey' );
				if( effect.element.is( '[data-translatez]' ) ) properties.translatez = effect.element.data( 'translatez' );
				if( effect.element.is( '[data-rotatex]' ) )    properties.rotatex    = effect.element.data( 'rotatex' );
				if( effect.element.is( '[data-rotatey]' ) )    properties.rotatey    = effect.element.data( 'rotatey' );
				if( effect.element.is( '[data-rotatez]' ) )    properties.rotatez    = effect.element.data( 'rotatez' );
				if( effect.element.is( '[data-scale]' ) )      properties.scale      = effect.element.data( 'scale' );
				if( effect.element.is( '[data-scalex]' ) )     properties.scalex     = effect.element.data( 'scalex' );
				if( effect.element.is( '[data-scaley]' ) )     properties.scaley     = effect.element.data( 'scaley' );
				if( effect.element.is( '[data-scalez]' ) )     properties.scalez     = effect.element.data( 'scalez' );

				effect.properties = properties;

				effects.push( effect );
			});

			element.effects = effects;

			_this.elements.push( element );
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Update elements

	_this.update = function()
	{
		window.requestAnimationFrame( function()
		{
			_this.update_viewport_position();

			if( _this.viewport_top_previous != _this.viewport_top )
			{
				_this.update_elements_in_view();
				_this.animate();
			}

			_this.viewport_top_previous = _this.viewport_top;
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Animate stuff

	_this.animate = function()
	{
		// For each element in viewport

		var elements_in_view_length = _this.elements_in_view.length;

		for( var i=0 ; i<elements_in_view_length ; i++ )
		{
			var element = _this.elements_in_view[i];

			// For each effect

			var effects_length = element.effects.length;

			for( var e=0 ; e<effects_length ; e++ )
			{
				var effect = element.effects[e];

				// Get effect animation boundaries

				switch( effect.when )
				{
					case 'view' : // Maintained for backwards compatibility
					case 'span' :
						var start = element.top - _this.viewport_height;
						var end = element.bottom;
						break;

					case 'exit' :
						var start = element.bottom - _this.viewport_height;
						var end = element.bottom;
						break;

					default :
						var start = element.top - _this.viewport_height;
						var end = element.top;
						break;
				}

				// Crop boundaries

				if( effect.crop )
				{
					if( start < 0 ) start = 0;
					if( end > ( _this.body_height - _this.viewport_height ) ) end = _this.body_height - _this.viewport_height;
				}

				// Get scroll position of reference selector

				var scroll = ( _this.viewport_top - start ) / ( end - start );

				// Get relative scroll position for effect

				var from = effect[ 'from' ];
				var to = effect[ 'to' ];

				var length = to - from;

				var scroll_relative = ( scroll - from ) / length;

				// Apply easing

				var scroll_eased = effect.easing( scroll_relative );

				// Get new value for each property

				var opacity    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'opacity' );
				var translatey = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatey' );
				var translatex = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatex' );
				var translatez = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatez' );
				var rotatex    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatex' );
				var rotatey    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatey' );
				var rotatez    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatez' );
				var scale      = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scale' );
				var scalex     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scalex' );
				var scaley     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scaley' );
				var scalez     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scalez' );

				// Override scale values

				if( 'scale' in effect.properties )
				{
					scalex = scale;
					scaley = scale;
					scalez = scale;
				}

				// Update properties

				effect.element.css(
				{
					'opacity' : opacity,
					'transform' : 'translate3d( '+translatex+'px , '+translatey+'px , '+translatez+'px ) rotateX( '+rotatex+'deg ) rotateY( '+rotatey+'deg ) rotateZ( '+rotatez+'deg ) scale3d( '+scalex+' , '+scaley+' , '+scalez+' )'
				} );
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Calculate property values

	_this.animate_value = function( scroll , scroll_eased , from , to , effect , property )
	{
		var value_default = _this.property_defaults[ property ];

		// Return default value if property is not animated

		if( !( property in effect.properties ) ) return value_default;

		var value_target = effect.properties[ property ];

		var forwards = ( to > from ) ? true : false;

		// Return boundary value if outside effect boundaries

		if( scroll < from && forwards ) { return value_default; }
		if( scroll > to && forwards ) { return value_target; }

		if( scroll > from && !forwards ) { return value_default; }
		if( scroll < to && !forwards ) { return value_target; }

		// Calculate new property value

		var new_value = value_default + ( scroll_eased * ( value_target - value_default ) );

		// Round as required

		switch( property )
		{
			case 'opacity'    : new_value = new_value.toFixed(2); break;
			case 'translatex' : new_value = new_value.toFixed(0); break;
			case 'translatey' : new_value = new_value.toFixed(0); break;
			case 'translatez' : new_value = new_value.toFixed(0); break;
			case 'rotatex'    : new_value = new_value.toFixed(1); break;
			case 'rotatey'    : new_value = new_value.toFixed(1); break;
			case 'rotatez'    : new_value = new_value.toFixed(1); break;
			case 'scale'      : new_value = new_value.toFixed(3); break;
			default : break;
		}

		// Done

		return new_value;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport position

	_this.update_viewport_position = function()
	{
		_this.viewport_top = $window.scrollTop();
		_this.viewport_bottom = _this.viewport_top + _this.viewport_height;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update list of elements in view

	_this.update_elements_in_view = function()
	{
		_this.elements_in_view = [];

		var elements_length = _this.elements.length;

		for( var i=0 ; i<elements_length ; i++ )
		{
			if ( ( _this.elements[i].top < _this.viewport_bottom ) && ( _this.elements[i].bottom > _this.viewport_top ) )
			{
				_this.elements_in_view.push( _this.elements[i] );
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Stuff to do on resize

	_this.on_resize = function()
	{
		// Update viewport/element data

		_this.update_viewport();
		_this.update_element_heights();

		// Update display

		_this.update_viewport_position();
		_this.update_elements_in_view();
		_this.animate();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport parameters

	_this.update_viewport = function()
	{
		_this.body_height = $document.height();
		_this.viewport_height = $window.height();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update height of animated elements

	_this.update_element_heights = function()
	{
		var elements_length = _this.elements.length;

		for( var i=0 ; i<elements_length ; i++ )
		{
			var element_height = _this.elements[i].element.outerHeight();
			var position = _this.elements[i].element.offset();

			_this.elements[i].height = element_height;
			_this.elements[i].top = position.top;
			_this.elements[i].bottom = position.top + element_height;
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Bind initialisation

	$document.on( _this.init_events.join( ' ' ) , function(){ _this.init(); } );

	// ----------------------------------------------------------------------------------------------------

	return _this;

	// ----------------------------------------------------------------------------------------------------

})( jQuery );
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.8
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.hidden = 'hidden';
            _.paused = false;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, dataSettings, settings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);
            _.checkResponsive(true);

        }

        return Slick;

    }());

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

        if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator,
                _.options.autoplaySpeed);
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;
        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this;

        if (_.options.infinite === false) {

            if (_.direction === 1) {

                if ((_.currentSlide + 1) === _.slideCount -
                    1) {
                    _.direction = 0;
                }

                _.slideHandler(_.currentSlide + _.options.slidesToScroll);

            } else {

                if ((_.currentSlide - 1 === 0)) {

                    _.direction = 1;

                }

                _.slideHandler(_.currentSlide - _.options.slidesToScroll);

            }

        } else {

            _.slideHandler(_.currentSlide + _.options.slidesToScroll);

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dotString;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            dotString = '<ul class="' + _.options.dotsClass + '">';

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
            }

            dotString += '</ul>';

            _.$dots = $(dotString).appendTo(
                _.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slidesCache = _.$slides;

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.html(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.target),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots).off('click.slick', _.changeSlide);

            if (_.options.pauseOnDotsHover === true && _.options.autoplay === true) {

                $('li', _.$dots)
                    .off('mouseenter.slick', $.proxy(_.setPaused, _, true))
                    .off('mouseleave.slick', $.proxy(_.setPaused, _, false));

            }

        }

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.$list.off('mouseenter.slick', $.proxy(_.setPaused, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.setPaused, _, false));

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.html(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }


        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css("display","");

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css("display","");

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }

        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToShow;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToShow;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;

            if (_.options.centerMode === true) {
                if (_.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.options.autoplay === true) {
            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.setPaused, _, true))
                .on('mouseleave.slick', $.proxy(_.setPaused, _, false));
        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        _.$list.on('mouseenter.slick', $.proxy(_.setPaused, _, true));
        _.$list.on('mouseleave.slick', $.proxy(_.setPaused, _, false));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

        if (_.options.autoplay === true) {

            _.autoPlay();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {
            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {
                    image
                        .animate({ opacity: 0 }, 100, function() {
                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy')
                                        .removeClass('slick-loading');
                                });
                        });
                };

                imageToLoad.src = imageSource;

            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = rangeStart + _.options.slidesToShow;
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.paused = false;
        _.autoPlay();

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        _.$slider.trigger('afterChange', [_, index]);

        _.animating = false;

        _.setPosition();

        _.swipeLeft = null;

        if (_.options.autoplay === true && _.paused === false) {
            _.autoPlay();
        }
        if (_.options.accessibility === true) {
            _.initADA();
        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {
        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function() {

        var _ = this,
            imgCount, targetImage;

        imgCount = $('img[data-lazy]', _.$slider).length;

        if (imgCount > 0) {
            targetImage = $('img[data-lazy]', _.$slider).first();
            targetImage.attr('src', targetImage.attr('data-lazy')).removeClass('slick-loading').load(function() {
                    targetImage.removeAttr('data-lazy');
                    _.progressiveLazyLoad();

                    if (_.options.adaptiveHeight === true) {
                        _.setPosition();
                    }
                })
                .error(function() {
                    targetImage.removeAttr('data-lazy');
                    _.progressiveLazyLoad();
                });
        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this,
            currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === "array" && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(0);

        _.setPosition();

        _.$slider.trigger('reInit', [_]);

        if (_.options.autoplay === true) {
            _.focusHandler();
        }

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function(option, value, refresh) {

        var _ = this, l, item;

        if( option === "responsive" && $.type(value) === "array" ) {
            for ( item in value ) {
                if( $.type( _.options.responsive ) !== "array" ) {
                    _.options.responsive = [ value[item] ];
                } else {
                    l = _.options.responsive.length-1;
                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {
                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {
                            _.options.responsive.splice(l,1);
                        }
                        l--;
                    }
                    _.options.responsive.push( value[item] );
                }
            }
        } else {
            _.options[option] = value;
        }

        if (refresh === true) {
            _.unload();
            _.reinit();
        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = (_.animType !== null && _.animType !== false);

    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides
                        .slice(index - centerOffset, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }

    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.setPaused = function(paused) {

        var _ = this;

        if (_.options.autoplay === true && _.options.pauseOnHover === true) {
            _.paused = paused;
            if (!paused) {
                _.autoPlay();
            } else {
                _.autoPlayClear();
            }
        }
    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay === true) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'left';
            } else {
                return 'right';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount;

        _.dragging = false;

        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            switch (_.swipeDirection()) {
                case 'left':
                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
                    _.slideHandler(slideCount);
                    _.currentDirection = 0;
                    _.touchObject = {};
                    _.$slider.trigger('swipe', [_, 'left']);
                    break;

                case 'right':
                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
                    _.slideHandler(slideCount);
                    _.currentDirection = 1;
                    _.touchObject = {};
                    _.$slider.trigger('swipe', [_, 'right']);
                    break;
            }
        } else {
            if (_.touchObject.startX !== _.touchObject.curX) {
                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(
                Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .attr('aria-hidden', 'true');

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if (document[_.hidden]) {
            _.paused = true;
            _.autoPlayClear();
        } else {
            if (_.options.autoplay === true) {
                _.paused = false;
                _.autoPlay();
            }
        }

    };
    Slick.prototype.initADA = function() {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            })
                .first().attr('aria-selected', 'true').end()
                .find('button').attr('role', 'button').end()
                .closest('div').attr('role', 'toolbar');
        }
        _.activateADA();

    };

    Slick.prototype.activateADA = function() {
        var _ = this,
        _isSlideOnFocus =_.$slider.find('*').is(':focus');
        // _isSlideOnFocus = _.$slides.is(':focus') || _.$slides.find('*').is(':focus');

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false',
            'tabindex': '0'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

        (_isSlideOnFocus) &&  _.$slideTrack.find('.slick-active').focus();

    };

    Slick.prototype.focusHandler = function() {
        var _ = this;
        _.$slider.on('focus.slick blur.slick', '*', function(event) {
            event.stopImmediatePropagation();
            var sf = $(this);
            setTimeout(function() {
                if (_.isPlay) {
                    if (sf.is(':focus')) {
                        _.autoPlayClear();
                        _.paused = true;
                    } else {
                        _.paused = false;
                        _.autoPlay();
                    }
                }
            }, 0);
        });
    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i = 0,
            ret;
        for (i; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

// Generated by CoffeeScript 1.6.2
/*!
jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define('waypoints', ['jquery'], function($) {
        return factory($, root);
      });
    } else {
      return factory(root.jQuery, root);
    }
  })(window, function($, window) {
    var $w, Context, Waypoint, allWaypoints, contextCounter, contextKey, contexts, isTouch, jQMethods, methods, resizeEvent, scrollEvent, waypointCounter, waypointKey, wp, wps;

    $w = $(window);
    isTouch = __indexOf.call(window, 'ontouchstart') >= 0;
    allWaypoints = {
      horizontal: {},
      vertical: {}
    };
    contextCounter = 1;
    contexts = {};
    contextKey = 'waypoints-context-id';
    resizeEvent = 'resize.waypoints';
    scrollEvent = 'scroll.waypoints';
    waypointCounter = 1;
    waypointKey = 'waypoints-waypoint-ids';
    wp = 'waypoint';
    wps = 'waypoints';
    Context = (function() {
      function Context($element) {
        var _this = this;

        this.$element = $element;
        this.element = $element[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = 'context' + contextCounter++;
        this.oldScroll = {
          x: $element.scrollLeft(),
          y: $element.scrollTop()
        };
        this.waypoints = {
          horizontal: {},
          vertical: {}
        };
        this.element[contextKey] = this.id;
        contexts[this.id] = this;
        $element.bind(scrollEvent, function() {
          var scrollHandler;

          if (!(_this.didScroll || isTouch)) {
            _this.didScroll = true;
            scrollHandler = function() {
              _this.doScroll();
              return _this.didScroll = false;
            };
            return window.setTimeout(scrollHandler, $[wps].settings.scrollThrottle);
          }
        });
        $element.bind(resizeEvent, function() {
          var resizeHandler;

          if (!_this.didResize) {
            _this.didResize = true;
            resizeHandler = function() {
              $[wps]('refresh');
              return _this.didResize = false;
            };
            return window.setTimeout(resizeHandler, $[wps].settings.resizeThrottle);
          }
        });
      }

      Context.prototype.doScroll = function() {
        var axes,
          _this = this;

        axes = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left'
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up'
          }
        };
        if (isTouch && (!axes.vertical.oldScroll || !axes.vertical.newScroll)) {
          $[wps]('refresh');
        }
        $.each(axes, function(aKey, axis) {
          var direction, isForward, triggered;

          triggered = [];
          isForward = axis.newScroll > axis.oldScroll;
          direction = isForward ? axis.forward : axis.backward;
          $.each(_this.waypoints[aKey], function(wKey, waypoint) {
            var _ref, _ref1;

            if ((axis.oldScroll < (_ref = waypoint.offset) && _ref <= axis.newScroll)) {
              return triggered.push(waypoint);
            } else if ((axis.newScroll < (_ref1 = waypoint.offset) && _ref1 <= axis.oldScroll)) {
              return triggered.push(waypoint);
            }
          });
          triggered.sort(function(a, b) {
            return a.offset - b.offset;
          });
          if (!isForward) {
            triggered.reverse();
          }
          return $.each(triggered, function(i, waypoint) {
            if (waypoint.options.continuous || i === triggered.length - 1) {
              return waypoint.trigger([direction]);
            }
          });
        });
        return this.oldScroll = {
          x: axes.horizontal.newScroll,
          y: axes.vertical.newScroll
        };
      };

      Context.prototype.refresh = function() {
        var axes, cOffset, isWin,
          _this = this;

        isWin = $.isWindow(this.element);
        cOffset = this.$element.offset();
        this.doScroll();
        axes = {
          horizontal: {
            contextOffset: isWin ? 0 : cOffset.left,
            contextScroll: isWin ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left',
            offsetProp: 'left'
          },
          vertical: {
            contextOffset: isWin ? 0 : cOffset.top,
            contextScroll: isWin ? 0 : this.oldScroll.y,
            contextDimension: isWin ? $[wps]('viewportHeight') : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up',
            offsetProp: 'top'
          }
        };
        return $.each(axes, function(aKey, axis) {
          return $.each(_this.waypoints[aKey], function(i, waypoint) {
            var adjustment, elementOffset, oldOffset, _ref, _ref1;

            adjustment = waypoint.options.offset;
            oldOffset = waypoint.offset;
            elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
            if ($.isFunction(adjustment)) {
              adjustment = adjustment.apply(waypoint.element);
            } else if (typeof adjustment === 'string') {
              adjustment = parseFloat(adjustment);
              if (waypoint.options.offset.indexOf('%') > -1) {
                adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
              }
            }
            waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
            if ((waypoint.options.onlyOnScroll && (oldOffset != null)) || !waypoint.enabled) {
              return;
            }
            if (oldOffset !== null && (oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset)) {
              return waypoint.trigger([axis.backward]);
            } else if (oldOffset !== null && (oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset)) {
              return waypoint.trigger([axis.forward]);
            } else if (oldOffset === null && axis.oldScroll >= waypoint.offset) {
              return waypoint.trigger([axis.forward]);
            }
          });
        });
      };

      Context.prototype.checkEmpty = function() {
        if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
          this.$element.unbind([resizeEvent, scrollEvent].join(' '));
          return delete contexts[this.id];
        }
      };

      return Context;

    })();
    Waypoint = (function() {
      function Waypoint($element, context, options) {
        var idList, _ref;

        if (options.offset === 'bottom-in-view') {
          options.offset = function() {
            var contextHeight;

            contextHeight = $[wps]('viewportHeight');
            if (!$.isWindow(context.element)) {
              contextHeight = context.$element.height();
            }
            return contextHeight - $(this).outerHeight();
          };
        }
        this.$element = $element;
        this.element = $element[0];
        this.axis = options.horizontal ? 'horizontal' : 'vertical';
        this.callback = options.handler;
        this.context = context;
        this.enabled = options.enabled;
        this.id = 'waypoints' + waypointCounter++;
        this.offset = null;
        this.options = options;
        context.waypoints[this.axis][this.id] = this;
        allWaypoints[this.axis][this.id] = this;
        idList = (_ref = this.element[waypointKey]) != null ? _ref : [];
        idList.push(this.id);
        this.element[waypointKey] = idList;
      }

      Waypoint.prototype.trigger = function(args) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, args);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };

      Waypoint.prototype.disable = function() {
        return this.enabled = false;
      };

      Waypoint.prototype.enable = function() {
        this.context.refresh();
        return this.enabled = true;
      };

      Waypoint.prototype.destroy = function() {
        delete allWaypoints[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };

      Waypoint.getWaypointsByElement = function(element) {
        var all, ids;

        ids = element[waypointKey];
        if (!ids) {
          return [];
        }
        all = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
        return $.map(ids, function(id) {
          return all[id];
        });
      };

      return Waypoint;

    })();
    methods = {
      init: function(f, options) {
        var _ref;

        options = $.extend({}, $.fn[wp].defaults, options);
        if ((_ref = options.handler) == null) {
          options.handler = f;
        }
        this.each(function() {
          var $this, context, contextElement, _ref1;

          $this = $(this);
          contextElement = (_ref1 = options.context) != null ? _ref1 : $.fn[wp].defaults.context;
          if (!$.isWindow(contextElement)) {
            contextElement = $this.closest(contextElement);
          }
          contextElement = $(contextElement);
          context = contexts[contextElement[0][contextKey]];
          if (!context) {
            context = new Context(contextElement);
          }
          return new Waypoint($this, context, options);
        });
        $[wps]('refresh');
        return this;
      },
      disable: function() {
        return methods._invoke.call(this, 'disable');
      },
      enable: function() {
        return methods._invoke.call(this, 'enable');
      },
      destroy: function() {
        return methods._invoke.call(this, 'destroy');
      },
      prev: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index > 0) {
            return stack.push(waypoints[index - 1]);
          }
        });
      },
      next: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index < waypoints.length - 1) {
            return stack.push(waypoints[index + 1]);
          }
        });
      },
      _traverse: function(axis, selector, push) {
        var stack, waypoints;

        if (axis == null) {
          axis = 'vertical';
        }
        if (selector == null) {
          selector = window;
        }
        waypoints = jQMethods.aggregate(selector);
        stack = [];
        this.each(function() {
          var index;

          index = $.inArray(this, waypoints[axis]);
          return push(stack, index, waypoints[axis]);
        });
        return this.pushStack(stack);
      },
      _invoke: function(method) {
        this.each(function() {
          var waypoints;

          waypoints = Waypoint.getWaypointsByElement(this);
          return $.each(waypoints, function(i, waypoint) {
            waypoint[method]();
            return true;
          });
        });
        return this;
      }
    };
    $.fn[wp] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (methods[method]) {
        return methods[method].apply(this, args);
      } else if ($.isFunction(method)) {
        return methods.init.apply(this, arguments);
      } else if ($.isPlainObject(method)) {
        return methods.init.apply(this, [null, method]);
      } else if (!method) {
        return $.error("jQuery Waypoints needs a callback function or handler option.");
      } else {
        return $.error("The " + method + " method does not exist in jQuery Waypoints.");
      }
    };
    $.fn[wp].defaults = {
      context: window,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false
    };
    jQMethods = {
      refresh: function() {
        return $.each(contexts, function(i, context) {
          return context.refresh();
        });
      },
      viewportHeight: function() {
        var _ref;

        return (_ref = window.innerHeight) != null ? _ref : $w.height();
      },
      aggregate: function(contextSelector) {
        var collection, waypoints, _ref;

        collection = allWaypoints;
        if (contextSelector) {
          collection = (_ref = contexts[$(contextSelector)[0][contextKey]]) != null ? _ref.waypoints : void 0;
        }
        if (!collection) {
          return [];
        }
        waypoints = {
          horizontal: [],
          vertical: []
        };
        $.each(waypoints, function(axis, arr) {
          $.each(collection[axis], function(key, waypoint) {
            return arr.push(waypoint);
          });
          arr.sort(function(a, b) {
            return a.offset - b.offset;
          });
          waypoints[axis] = $.map(arr, function(waypoint) {
            return waypoint.element;
          });
          return waypoints[axis] = $.unique(waypoints[axis]);
        });
        return waypoints;
      },
      above: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.y;
        });
      },
      below: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.y;
        });
      },
      left: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.x;
        });
      },
      right: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.x;
        });
      },
      enable: function() {
        return jQMethods._invoke('enable');
      },
      disable: function() {
        return jQMethods._invoke('disable');
      },
      destroy: function() {
        return jQMethods._invoke('destroy');
      },
      extendFn: function(methodName, f) {
        return methods[methodName] = f;
      },
      _invoke: function(method) {
        var waypoints;

        waypoints = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
        return $.each(waypoints, function(key, waypoint) {
          waypoint[method]();
          return true;
        });
      },
      _filter: function(selector, axis, test) {
        var context, waypoints;

        context = contexts[$(selector)[0][contextKey]];
        if (!context) {
          return [];
        }
        waypoints = [];
        $.each(context.waypoints[axis], function(i, waypoint) {
          if (test(context, waypoint)) {
            return waypoints.push(waypoint);
          }
        });
        waypoints.sort(function(a, b) {
          return a.offset - b.offset;
        });
        return $.map(waypoints, function(waypoint) {
          return waypoint.element;
        });
      }
    };
    $[wps] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (jQMethods[method]) {
        return jQMethods[method].apply(null, args);
      } else {
        return jQMethods.aggregate.call(null, method);
      }
    };
    $[wps].settings = {
      resizeThrottle: 100,
      scrollThrottle: 30
    };
    return $w.on('load.waypoints', function() {
      return $[wps]('refresh');
    });
  });

}).call(this);



// Generated by CoffeeScript 1.6.2
/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery', 'waypoints'], factory);
    } else {
      return factory(root.jQuery);
    }
  })(this, function($) {
    var defaults, wrap;

    defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'alt'
    };
    wrap = function($elements, options) {
      $elements.wrap(options.wrapper);
      return $elements.parent();
    };
    $.waypoints('extendFn', 'sticky', function(opt) {
      var $wrap, options, originalHandler;

      options = $.extend({}, $.fn.waypoint.defaults, defaults, opt);
      $wrap = wrap(this, options);
      originalHandler = options.handler;
      options.handler = function(direction) {
        var $sticky, shouldBeStuck;

        $sticky = $(this).children(':first');
        shouldBeStuck = direction === 'down' || direction === 'right';
        $sticky.toggleClass(options.stuckClass, shouldBeStuck);
        $wrap.height(shouldBeStuck ? $sticky.outerHeight() : '');
        if (originalHandler != null) {
          return originalHandler.call(this, direction);
        }
      };
      $wrap.waypoint(options);
      return this.data('stuckClass', options.stuckClass);
    });
    return $.waypoints('extendFn', 'unsticky', function() {
      this.parent().waypoint('destroy');
      this.unwrap();
      return this.removeClass(this.data('stuckClass'));
    });
  });

}).call(this);

var labels = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 01'},
      "geometry": {
        "type": "Point",
        "coordinates": [
            -74.319876,41.887054
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 02'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.319554,
          41.888220
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 03'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.318052,
          41.889674
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 04'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.315348,
          41.889454
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 05'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314648,
          41.8899199
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 06'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.313224,
          41.888963
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 07'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.311524,
          41.888183
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 08'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.310004,
          41.887261
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 09'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.310004,
          41.886561
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 10'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.310934,
          41.884865
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 11'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.313117,
          41.883923
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 12'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314533,
          41.884242
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 13'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.312645,
          41.885472
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 14'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.312044,
          41.886559
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 15'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.312859,
          41.887485
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 16'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314232,
          41.888380
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 17'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.315885,
          41.888156
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 18'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.318095,
          41.888256
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 19'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.317752,
          41.887469
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 20'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.316636,
          41.888987
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 21'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.317172,
          41.885952
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 22'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.316764,
          41.886748
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 23'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.315498,
          41.8850
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 24'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314727,
          41.887586
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 25'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314427,
          41.886586
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'Lot 26'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.314727,
          41.885686
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {MAP_LABEL: 'N/A'},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -74.315627,
          41.887086
        ]
      }
    },
  ]
};

var sold = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 14",
            "image": "assets/img/availability/LOT-14.png",
            "lotSize": "7.95 Acres",
            "cost": "$776,000",
            "lotURL": "lot-14"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31265935301786,41.886737730174914 ],
                        [ -74.31038886308676,41.88586511662397 ],
                        [ -74.31013638525019,41.88607512825683 ],
                        [ -74.31010248728944,41.88617344233208 ],
                        [ -74.31007931807596,41.88628473578571 ],
                        [ -74.31006553636479,41.8863965282204 ],
                        [ -74.31004419922834,41.88645717723262 ],
                        [ -74.30995836862348,41.88663289702792 ],
                        [ -74.30992933568501,41.88671272219467 ],
                        [ -74.30984236207365,41.88680576600683, ],
                        [ -74.30981999751862,41.886843052636294 ],
                        [ -74.30979798753032,41.886873258691935 ],
                        [ -74.30979368804606,41.88729171592407 ],
                        [ -74.30979475378996,41.887316803526645 ],
                        [ -74.30982777826637,41.88752983587711 ],
                        [ -74.3098406862934,41.88760658723806 ],
                        [ -74.30987991362127,41.88783746571718 ],
                        [ -74.30995333914854,41.887976491416744 ],
                        [ -74.3100824206283,41.888087062756654 ],
                        [ -74.31034661832962,41.888168930354965 ],
                        [ -74.31046664714819,41.888161442486776 ],
                        [ -74.31075699627405,41.887975243486345 ],
                        [ -74.31106411437588,41.88777556638325 ],
                        [ -74.31129780240121,41.88762306213433 ],
                        [ -74.31140659860012,41.8875408193599 ],
                        [ -74.31176810913905,41.887265573850115 ],
                        [ -74.31202195346663,41.88707353765329 ],
                        [ -74.31224342316568,41.886957051970384 ],
                        [ -74.31247428059584,41.886939907243274 ],
                        [ -74.3125192076028,41.88695825296582 ],
                        [ -74.31257016958233,41.88697809626465 ],
                        [ -74.31258961558319,41.8869827762752 ],
                        [ -74.31268081073517,41.88705085483763 ],
                        [ -74.31266739964121,41.886886305271005 ],
                        [ -74.31266069411578,41.88680902250588 ],
                        [ -74.31265935301786,41.886737730174914 ],
                    ]
                ]
            ]
        }
    },
{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 10",
            "image": "assets/img/availability/LOT-10.png",
            "lotSize": "12.0 Acres",
            "cost": "$1,346,825",
            "lotURL": "lot-10"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.30981999751862,41.88684305263653 ],
                        [ -74.30984236207365,41.88680576600703 ],
                        [ -74.30990764189983,41.88673653037149 ],
                        [ -74.30992933568501,41.88671272219498 ],
                        [ -74.30995505274387,41.88664398567539 ],
                        [ -74.31004102577066,41.88646638733399 ],
                        [ -74.31005797494305,41.886424468896124 ],
                        [ -74.31006553636479,41.88639652822061 ],
                        [ -74.31007931807596,41.886284735785985 ],
                        [ -74.31009358490087,41.88620662472725 ],
                        [ -74.31010248728944,41.88617344233233 ],
                        [ -74.31013638525019,41.886075128257104 ],
                        [ -74.3102797567347,41.88596187368508 ],
                        [ -74.31038021247184,41.88587557629301 ],
                        [ -74.3104958190657,41.88577027579219 ],
                        [ -74.31053498252362,41.88572787580834 ],
                        [ -74.31056546069033,41.88569407069789 ],
                        [ -74.31060197379838,41.88565277739771 ],
                        [ -74.31061666195404,41.88561561900276 ],
                        [ -74.31067204978353,41.885467304837746 ],
                        [ -74.31071469692426,41.8853504410809 ],
                        [ -74.31074508468339,41.88523756437445 ],
                        [ -74.31075803802872,41.885192081608515 ],
                        [ -74.31080806137811,41.8851380753294 ],
                        [ -74.31085003802878,41.88509005957226 ],
                        [ -74.31096901495698,41.884958073717165 ],
                        [ -74.31102045660526,41.884892080699494 ],
                        [ -74.31107189814759,41.88482608756758 ],
                        [ -74.31114980514582,41.88469156259401 ],
                        [ -74.31127330919264,41.884469174559456 ],
                        [ -74.3113766885707,41.88436212166251 ],
                        [ -74.31144983575223,41.88428862622536 ],
                        [ -74.31147214583848,41.884260267876584 ],
                        [ -74.31149982031513,41.88421793128364 ],
                        [ -74.31155248710252,41.884118281205446 ],
                        [ -74.3115669785883,41.88395033991116 ],
                        [ -74.31158415211485,41.88375144603248 ],
                        [ -74.3115956478157,41.883596501093045 ],
                        [ -74.31160591897964,41.883474485003994 ],
                        [ -74.3116279656067,41.88326069095184 ],
                        [ -74.31164365641405,41.88311955573016 ],
                        [ -74.31164560243178,41.88307953778923 ],
                        [ -74.31164956010144,41.88305050295031 ],
                        [ -74.31165367658485,41.883014458073255 ],
                        [ -74.31165692142702,41.88296725435653 ],
                        [ -74.31167424785042,41.88294700920365 ],
                        [ -74.31159500000001,41.882901 ],
                        [ -74.30809399999998,41.886464 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 21",
            "image": "assets/img/availability/LOT-21.png",
            "lotSize": "6.6 Acres",
            "cost": "$777,200",
            "lotURL": "lot-21"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31766368448729,41.886277462956755 ],
                        [ -74.31589543819427,41.885292020691466 ],
                        [ -74.31516453623766,41.88593899969806 ],
                        [ -74.31486278772348,41.88626648040147 ],
                        [ -74.31683287024498,41.88728884838218 ],
                        [ -74.31685525051205,41.887279550454316 ],
                        [ -74.3168948760873,41.88725601000084 ],
                        [ -74.31693047832198,41.887233467933804 ],
                        [ -74.3170345397848,41.8871484477771 ],
                        [ -74.31706521674226,41.88712261473095 ],
                        [ -74.31710209858113,41.88707993207266 ],
                        [ -74.31724257981972,41.88686302863031 ],
                        [ -74.31753426790237,41.88638928523243 ],
                        [ -74.31761473421307,41.886308912938574 ],
                        [ -74.31766368448729,41.886277462956755 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 16",
            "image": "assets/img/availability/LOT-16.png",
            "lotSize": "3.8 Acres",
            "cost": "$973,675",
            "lotURL": "lot-16"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31408762931824,41.88857826669985 ],
                        [ -74.31408964249624,41.88855854864012 ],
                        [ -74.31408385981109,41.88849050318841 ],
                        [ -74.31407447207954,41.888429102822 ],
                        [ -74.31405355918298,41.888356673506145 ],
                        [ -74.31401252746576,41.88829123235364 ],
                        [ -74.3138355020518,41.8882962243767 ],
                        [ -74.3137724701553,41.888289485274875 ],
                        [ -74.31370943825925,41.88828174775437 ],
                        [ -74.31365914642805,41.88827675580464 ],
                        [ -74.31353174128992,41.888260282346955 ],
                        [ -74.31347239745418,41.88824006508624 ],
                        [ -74.3134244531393,41.888223841494245 ],
                        [ -74.31332554664232,41.88819139388082 ],
                        [ -74.31326888493845,41.88817342299211 ],
                        [ -74.3117755651474,41.88865464257824 ],
                        [ -74.31332923471933,41.88944085954705 ],
                        [ -74.3133659476224,41.88941852113801 ],
                        [  -74.31340266049756,41.88939218925736],
                        [ -74.3135203425312,41.88931157119254 ],
                        [ -74.31362628968651,41.889230204254076 ],
                        [ -74.31370943784714,41.889157822553 ],
                        [ -74.31377515203405,41.88908394322601 ],
                        [ -74.31380331521473,41.88904900031131 ],
                        [ -74.31384488940239,41.888999081679394 ],
                        [ -74.31390926257279,41.88891621677834 ],
                        [ -74.31393876693289,41.88887228839179 ],
                        [ -74.31398034111334,41.888810888415804 ],
                        [ -74.31400917470455,41.888765462317735 ],
                        [ -74.3140416964311,41.8887115499432 ],
                        [ -74.31406885381568,41.888654642478976 ],
                        [ -74.3140826001611,41.888610963513536 ],
                        [ -74.31408762931824,41.88857826669985 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 13",
            "image": "assets/img/availability/LOT-13.png",
            "lotSize": "4.3 Acres",
            "cost": "$1,173,500",
            "lotURL": "lot-13"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.312656167863,41.8866206667731 ],
                        [ -74.3126529827615,41.886511590559884 ],
                        [ -74.31264929473406,41.886408255063266 ],
                        [ -74.31265499443771,41.886115469792855 ],
                        [ -74.31268684575872,41.885912541243194 ],
                        [ -74.31278474628931,41.885735821039574 ],
                        [ -74.31083478033548,41.885105813327904 ],
                        [ -74.31080806137811,41.88513807532938 ],
                        [ -74.31075803802872,41.885192081608466 ],
                        [ -74.31075565516954,41.88519667060792 ],
                        [ -74.31071441627284,41.885344937387224 ],
                        [ -74.31071067361074,41.885358428508454 ],
                        [ -74.31069122759538,41.88540984755093 ],
                        [ -74.31065897402993,41.88549825608442 ],
                        [ -74.31061666195404,41.885615619002685 ],
                        [ -74.31060197379838,41.88565277739761 ],
                        [ -74.3104958190657,41.885770275792034 ],
                        [ -74.31038886308676,41.88586511662382 ],
                        [ -74.31265935301786,41.88673773017479 ],
                        [ -74.312656167863,41.8866206667731 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 12",
            "image": "assets/img/availability/LOT-12.png",
            "lotSize": "5.2 Acres",
            "cost": "$912,500",
            "lotURL": "lot-12"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31182384490967,41.88542780695214 ],
                        [ -74.31278474628931,41.885735821039525 ],
                        [ -74.3129788715371,41.885421067549565 ],
                        [ -74.31304961442953,41.885313986135465 ],
                        [ -74.31478500366217,41.88467898206912 ],
                        [ -74.31336879730225,41.883880225853794 ],
                        [ -74.31182384490967,41.88542780695214 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 22",
            "image": "assets/img/availability/LOT-22.png",
            "lotSize": "3.3 Acres",
            "cost": "$800,000",
            "lotURL": "lot-22"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31683287024498,41.88728884838213 ],
                        [ -74.31486278772348,41.88626648040142 ],
                        [ -74.31446850299835,41.88666185120907 ],
                        [ -74.31576199829578,41.88767572652961 ],
                        [ -74.3162318889805,41.88751985332893 ],
                        [ -74.31633699835754,41.88747979313604 ],
                        [ -74.31663422020608,41.88736659968331 ],
                        [ -74.31683287024498,41.88728884838213 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 17",
            "image": "assets/img/availability/LOT-17.png",
            "lotSize": "4.7 Acres",
            "cost": "$988,500",
            "lotURL": "lot-17"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31431025266642,41.88932355159768 ],
                        [ -74.31624144315714,41.88855779994577 ],
                        [ -74.3156493455171,41.88771366542184 ],
                        [ -74.31478098034853,41.88802166848914 ],
                        [ -74.3145313678483,41.88811417597084 ],
                        [ -74.31438644470097,41.88816966458288 ],
                        [ -74.31425225021712,41.8882226570108 ],
                        [ -74.31401252746576,41.888291232353666 ],
                        [ -74.31405355918298,41.88835667350617 ],
                        [ -74.31407447207954,41.88842910282202 ],
                        [ -74.31407740574082,41.88844916389008 ],
                        [ -74.31408059073271,41.88847331202634 ],
                        [ -74.31408964249624,41.88855854864015 ],
                        [ -74.31408628821367,41.888581261834105 ],
                        [ -74.3140822649064,41.88860672041708 ],
                        [ -74.31406885381568,41.888654642478976 ],
                        [ -74.3140416964311,41.8887115499432 ],
                        [ -74.31396290683858,41.88883385102306 ],
                        [ -74.31390121606103,41.88892420379143 ],
                        [ -74.31382007896894,41.88902653689013 ],
                        [ -74.31431025266642,41.88932355159768 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 11",
            "image": "assets/img/availability/LOT-11.png",
            "lotSize": "6.0 Acres",
            "cost": "$832,500",
            "lotURL": "lot-11"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31083478033548,41.885105813327854 ],
                        [ -74.31182384490967,41.88542780695214 ],
                        [ -74.31336879730225,41.883880225853794 ],
                        [ -74.3117943406105,41.883011567135 ],
                        [ -74.31167424785042,41.8829470092036 ],
                        [ -74.31165692142702,41.88296725435648 ],
                        [ -74.31164560243178,41.88307953778918 ],
                        [ -74.31164145469671,41.88313038436952 ],
                        [ -74.31163340806967,41.883199278295145 ],
                        [ -74.31164560243178,41.88307953778918 ],
                        [ -74.31164145469671,41.88313038436952 ],
                        [ -74.31163340806967,41.883199278295145 ],
                        [ -74.31160289804029,41.883492575908306 ],
                        [ -74.3115951865912,41.88359317039971 ],
                        [ -74.31158646954083,41.88370449820982 ],
                        [ -74.31157708168035,41.88382331409234 ],
                        [ -74.31157104671007,41.883893704947724 ],
                        [ -74.31156210225487,41.88398976841673 ],
                        [ -74.31155248710252,41.884118281205396 ],
                        [ -74.31149259209639,41.8842266875885 ],
                        [ -74.31144983575223,41.88428862622531 ],
                        [ -74.31138195097452,41.884354488561016 ],
                        [ -74.3112706395222,41.88447380249124 ],
                        [ -74.3110822141171,41.88480478526287 ],
                        [ -74.31107189814759,41.884826087567525 ],
                        [ -74.31095715639526,41.884969277565986 ],
                        [ -74.31083478033548,41.885105813327854 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 19",
            "image": "assets/img/availability/LOT-19.png",
            "lotSize": "4.2 Acres",
            "cost": "$897,500",
            "lotURL": "lot-19"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31709907948965,41.887083178013086 ],
                        [ -74.31706521674226,41.887122614731 ],
                        [ -74.31700738162971,41.88716879072018 ],
                        [ -74.31693554866888,41.88722832031246 ],
                        [ -74.31685525051205,41.887279550454316 ],
                        [ -74.31679376892572,41.88730266978648 ],
                        [ -74.31664109230036,41.887362729809354 ],
                        [ -74.3162318889805,41.88751985332895 ],
                        [ -74.31591446615272,41.887623249298315 ],
                        [ -74.31576199829573,41.887675726529636 ],
                        [ -74.3156493455171,41.88771366542189 ],
                        [ -74.31624144315714,41.88855779994577 ],
                        [ -74.31825377047056,41.887856435261746 ],
                        [ -74.31823063618327,41.8878162499069 ],
                        [ -74.318191408691,41.887756096742066 ],
                        [ -74.31812879581662,41.88767588229524 ],
                        [ -74.31808445572278,41.887626305921565 ],
                        [ -74.3179568830812,41.88753027306787 ],
                        [ -74.31790675899487,41.88749564121225 ],
                        [ -74.31780827110595,41.88743548791556 ],
                        [ -74.3176330049148,41.88732753638081 ],
                        [ -74.31733075361387,41.887185514236464 ],
                        [ -74.31709907948965,41.887083178013086 ],
                    ]
                ]
            ]
        }
    },
  ]
};

var contractOut = {
  "type": "FeatureCollection",
  "features": [ 
   {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 25",
            "image": "assets/img/availability/LOT-25.png",
            "lotSize": "3.7 Acres",
            "cost": "$785,000",
            "lotURL": "lot-25"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31446850299835,41.88666185120915 ],
                        [ -74.31264795362944,41.88642622647677 ],
                        [ -74.31265935301786,41.88673773017474 ],
                        [ -74.31265935301786,41.88680312579068 ],
                        [ -74.31268081073517,41.88705085483761 ],
                        [ -74.31268751621252,41.887259894826606 ],
                        [ -74.31269422173506,41.88749651487912 ],
                        [ -74.31271299719816,41.88756839927846 ],
                        [ -74.3135592341423,41.887672232157 ],
                        [ -74.31400716304779,41.88730482275211 ],
                        [ -74.31446850299835,41.88666185120915 ],
                    ]
                ]
            ]
        }
    },
{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 26",
            "image": "assets/img/availability/LOT-26.png",
            "lotSize": "4.2 Acres",
            "cost": "$785,000",
            "lotURL": "lot-26"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31446850299835,41.88666185120915 ],
                        [ -74.31486278772348,41.88626648040147 ],
                        [ -74.31516453623766,41.88593899969809 ],
                        [ -74.3129788715371,41.88542106754954 ],
                        [ -74.31278474628931,41.885735821039475 ],
                        [ -74.31268684575872,41.885912541243165 ],
                        [ -74.31265600025648,41.88610773234324 ],
                        [ -74.31264795362944,41.88642622647682 ],
                        [ -74.31343585252762,41.88652806439155 ],
                        [ -74.31446850299835,41.88666185120915 ],
                    ]
                ]
            ]
        }
    },


{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 24",
            "image": "assets/img/availability/LOT-24.png",
            "lotSize": "2.7 Acres",
            "cost": "—",
            "lotURL": "lot-24"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31478098034859,41.88802166848916 ],
                        [ -74.31400716304779,41.88730482275211 ],
                        [ -74.3135592341423,41.887672232157 ],
                        [ -74.31271299719816,41.88756839927843 ],
                        [ -74.31275457143789,41.88771915657551 ],
                        [ -74.31281290937983,41.88782298914541 ],
                        [ -74.31285716593266,41.887897868407244 ],
                        [ -74.31300938105403,41.88805511428716 ],
                        [ -74.3131025878813,41.88809929296143 ],
                        [ -74.31318707764149,41.88813897882927 ],
                        [ -74.31324206287621,41.88816368880268 ],
                        [ -74.31326888493845,41.88817342299216 ],
                        [ -74.3133956193924,41.88821535523282 ],
                        [ -74.31353174128992,41.888260282347005 ],
                        [ -74.3136008082671,41.88826951747542 ],
                        [ -74.31365914642805,41.88827675580467 ],
                        [ -74.31375235317671,41.888288237236445 ],
                        [ -74.31383147835726,41.88829822103138 ],
                        [ -74.31401252746576,41.888291232353694 ],
                        [ -74.31405946622681,41.88828000083133 ],
                        [ -74.31413054483698,41.888258785452884 ],
                        [ -74.31418687133106,41.88824231261767 ],
                        [ -74.31425225021712,41.88822265701083 ],
                        [ -74.31435517998199,41.88818353288097 ],
                        [ -74.31449398415208,41.88812924572767 ],
                        [ -74.31478098034859,41.88802166848916 ],
                    ]
                ]
            ]
        }
    },


   ]
};

var contractSigned = {
  "type": "FeatureCollection",
  "features": [


          

  ]
};


var notReleased = {
  "type": "FeatureCollection",
  "features": [
    


            {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 04",
            "image": "assets/img/availability/LOT-4.png",
            "lotSize": "6.6 Acres",
            "cost": "-",
            "lotURL": "lot-04"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31688249111176,41.89099679184332 ],
                        [ -74.31555211544037,41.89010926115699 ],
                        [ -74.31442189227755,41.88939019348232 ],
                        [ -74.31382007896894,41.8890265368901 ],
                        [ -74.3137121200561,41.88915382907677 ],
                        [ -74.31363098387658,41.889224712974254 ],
                        [ -74.31352268978685,41.88930807657331 ],
                        [ -74.31344104988034,41.88936523306349 ],
                        [ -74.31332923471933,41.889440859547 ],
                        [ -74.31320652365679,41.889515736849006 ],
                        [ -74.31632526218891,41.8915593541213 ],
                        [ -74.31688249111176,41.89099679184332 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 05",
            "image": "assets/img/availability/LOT-5.png",
            "lotSize": "7.1 Acres",
            "cost": "-",
            "lotURL": "lot-05"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31632526218891,41.8915593541213 ],
                        [ -74.31320652365679,41.88951573684898 ],
                        [ -74.31314013904262,41.88955941522101 ],
                        [ -74.31306704871241,41.88960409215838 ],
                        [ -74.31304693219249,41.889612578143044 ],
                        [ -74.3130268156529,41.889635540349495 ],
                        [ -74.31259900331503,41.89008530065244 ],
                        [ -74.31597054004669,41.891927238219935 ],
                        [ -74.31632526218891,41.8915593541213 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 06",
            "image": "assets/img/availability/LOT-6.png",
            "lotSize": "4.1 Acres",
            "cost": "-",
            "lotURL": "lot-06"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31332923471933,41.88944085954703 ],
                        [ -74.3117755651474,41.88865464257824 ],
                        [ -74.3111452460289,41.88929759406488 ],
                        [ -74.31259900331503,41.89008530065241 ],
                        [ -74.31282062164814,41.88985343222569 ],
                        [ -74.31303888559347,41.88962405919043 ],
                        [ -74.31305162605827,41.889612578142994 ],
                        [ -74.31307375423495,41.88960159625321 ],
                        [ -74.31322999298567,41.88950275812297 ],
                        [ -74.31332923471933,41.88944085954703 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 07",
            "image": "assets/img/availability/LOT-7.png",
            "lotSize": "4.2 Acres",
            "cost": "-",
            "lotURL": "lot-07"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.3117755651474,41.88865464257824 ],
                        [ -74.31074962019926,41.88797773945515 ],
                        [ -74.31071944535694,41.88799596002547 ],
                        [ -74.31068792939192,41.8880151789747 ],
                        [ -74.31063495585693,41.88805012251745 ],
                        [ -74.31057661784217,41.88808856038293 ],
                        [ -74.31046664714819,41.888161442486854 ],
                        [ -74.31034661832962,41.888168930355064 ],
                        [ -74.3102158606053,41.88814446994632 ],
                        [ -74.31019172072416,41.88813548448185 ],
                        [ -74.31011896575905,41.88810528330155 ],
                        [ -74.3100824206283,41.888087062756725 ],
                        [ -74.30997982621199,41.887998705588814 ],
                        [ -74.30927574634552,41.88827326146485 ],
                        [ -74.3111452460289,41.88929759406488 ],
                        [ -74.3117755651474,41.88865464257824 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 08",
            "image": "assets/img/availability/LOT-8.png",
            "lotSize": "4.0 Acres",
            "cost": "-",
            "lotURL": "lot-08"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.30927574634552,41.88827326146485 ],
                        [ -74.30997982621199,41.88799870558884 ],
                        [ -74.30995333914854,41.887976491416815 ],
                        [ -74.30987991362127,41.88783746571733 ],
                        [ -74.30984571576124,41.88763329484731 ],
                        [ -74.30983129860988,41.88754244100878 ],
                        [ -74.30981554063356,41.88744060465738 ],
                        [ -74.30979475378996,41.88731680352682 ],
                        [ -74.30758461356163,41.88735274583779 ],
                        [ -74.30927574634552,41.88827326146485 ],
                    ]
                ]
            ]
        }
    },
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 09",
            "image": "assets/img/availability/LOT-9.png",
            "lotSize": "3.8 Acres",
            "cost": "-",
            "lotURL": "lot-09"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.30979475378996,41.88731680352685 ],
                        [ -74.30979368804606,41.88729171592428 ],
                        [ -74.30979798753032,41.886873258692134 ],
                        [ -74.30981999751862,41.8868430526365 ],
                        [ -74.30809423327446,41.88646416611116 ],
                        [ -74.30734723806381,41.88722694766119 ],
                        [ -74.30759400129318,41.887354742632255 ],
                        [ -74.30979475378996,41.88731680352685 ],
                    ]
                ]
            ]
        }
    },
    
         
  ]
};

var forSale = {
  "type": "FeatureCollection",
  "features": [
          
       {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 18",
            "image": "assets/img/availability/LOT-18.png",
            "lotSize": "3.7 Acres",
            "cost": "$765,000",
            "lotURL": "lot-18"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.3183033913374,41.88801567816825 ],
                        [ -74.31829852963449,41.887973995312926 ],
                        [ -74.31825377047056,41.887856435261746 ],
                        [ -74.31808076800365,41.88791384263166 ],
                        [ -74.31745346643521,41.88813024302858 ],
                        [ -74.31699179112906,41.888294227501426 ],
                        [ -74.31624144315714,41.88855779994577 ],
                        [ -74.31563861668104,41.88879191925411 ],
                        [ -74.31700855493546,41.88918827280122 ],
                        [ -74.3171426654443,41.8891178878993 ],
                        [ -74.31722715497631,41.889071962864435 ],
                        [ -74.31727141141891,41.88904700349412 ],
                        [ -74.31763283908367,41.8888503241505 ],
                        [ -74.31787356734276,41.8886716149832 ],
                        [ -74.3180888146162,41.88846195554637 ],
                        [ -74.31823868335289,41.888296723101796 ],
                        [ -74.31829618297456,41.88819014581157 ],
                        [ -74.31830842053273,41.8880840674303 ],
                        [ -74.3183033913374,41.88801567816825 ],
                    ]
                ]
            ]
        }
    },
{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 15",
            "image": "assets/img/availability/LOT-15.png",
            "lotSize": "4.6 Acres",
            "cost": "$795,000",
            "lotURL": "lot-15"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31308045983315,41.888237319671866 ],
                        [ -74.31327290834219,41.88817398465428 ],
                        [ -74.31323334567725,41.88815857202867 ],
                        [ -74.31310996396155,41.88810178884398 ],
                        [ -74.31300938105403,41.888055114287134 ],
                        [ -74.31293059131434,41.88797149945134 ],
                        [ -74.31285984798825,41.887901362637386 ],
                        [ -74.31275457143789,41.88771915657553 ],
                        [ -74.31269422173506,41.887496514879146 ],
                        [ -74.31269153952604,41.887401667283974 ],
                        [ -74.31268885731703,41.88723693165248 ],
                        [ -74.31268282241012,41.887108949263364 ],
                        [ -74.31268081073517,41.88705085483766 ],
                        [ -74.31258961558319,41.886982776275225 ],
                        [ -74.31256078185078,41.88697160664419 ],
                        [ -74.31247428059584,41.88693990724322 ],
                        [ -74.31224342316568,41.886957051970356 ],
                        [ -74.31202195346663,41.88707353765327 ],
                        [ -74.31127734999257,41.88763329555925 ],
                        [ -74.31074962019926,41.887977739455124 ],
                        [ -74.3117755651474,41.88865464257824 ],
                        [ -74.31308045983315,41.888237319671866 ],
                    ]
                ]
            ]
        }
    },

  {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 23",
            "image": "assets/img/availability/LOT-23.png",
            "lotSize": "4.1 Acres",
            "cost": "$795,000",
            "lotURL": "lot-23"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31589543819427,41.885292020691466 ],
                        [ -74.31478500366217,41.88467898206907 ],
                        [ -74.31392535997935,41.88498750168908 ],
                        [ -74.31304961442953,41.885313986135415 ],
                        [ -74.3129788715371,41.88542106754954 ],
                        [ -74.31516453623766,41.88593899969806 ],
                        [ -74.31589543819427,41.885292020691466 ],
                    ]
                ]
            ]
        }
    },


 {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 20",
            "image": "assets/img/availability/LOT-20.png",
            "lotSize": "4.2 Acres",
            "cost": "$805,000",
            "lotURL": "lot-20"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31566007435316,41.8887899225046 ],
                        [ -74.31499857747383,41.88904475808788 ],
                        [ -74.31431025266642,41.889323551597656 ],
                        [ -74.31573987007141,41.89023804871436 ],
                        [ -74.31700855493546,41.88918827280122 ],
                        [ -74.31566007435316,41.8887899225046 ],
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 03",
            "image": "assets/img/availability/LOT-3.png",
            "lotSize": "5.8 Acres",
            "cost": "$865,000",
            "lotURL": "lot-03"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31823365390301,41.88963903461493 ],
                        [ -74.31722246110434,41.88907445868424 ],
                        [ -74.31711047894498,41.88913361213141 ],
                        [ -74.31700855493546,41.88918827280125 ],
                        [ -74.31573987007141,41.89023804871436 ],
                        [ -74.31688249111176,41.89099679184332 ],
                        [ -74.31806668639183,41.88980725830841 ],
                        [ -74.31823365390301,41.88963903461493 ]
                    ]
                ]
            ]
        }
    },

{
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 02",
            "image": "assets/img/availability/LOT-2.png",
            "lotSize": "4.7 Acres",
            "cost": "$785,000",
            "lotURL": "lot-02"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [-74.31966662406921,41.888197384322616],
                        [-74.31938298046589,41.88802765880971],
                        [-74.31909397244453,41.88786791673858],
                        [-74.31830339133734,41.88801567816825],
                        [-74.31830842053273,41.88808406743035],
                        [-74.31829618297456,41.88819014581159],
                        [ -74.31824312551095,41.88829110740074 ],
                        [ -74.31816932293162,41.88837128999795 ],
                        [ -74.31808479130262,41.88846345311617 ],
                        [ -74.3178735673427,41.888671614983174 ],
                        [ -74.31762881577009,41.888851821711235 ],
                        [ -74.31721776723856,41.889073959499065 ],
                        [ -74.31823365390301,41.88963903461493 ],
                        [ -74.31966662406921,41.888197384322616 ]
                    ]
                ]
            ]
        }
    },


 {
      "type": "Feature",
        "properties": {
            "activityTitle": "Lot 01",
            "image": "assets/img/availability/LOT-1.png",
            "lotSize": "5.6 Acres",
            "cost": "$795,000",
            "lotURL": "lot-01"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [-74.31966662406921,41.888197384322616],
                        [-74.32019233703613,41.88767023537264],
                        [-74.31766368448729,41.886277462956805],
                        [-74.31761473421307,41.88630891293855],
                        [-74.31753627958676,41.886385541120255],
                        [-74.31748464703554,41.88646716134444],
                        [-74.31709907948965,41.887083178013135],
                        [-74.3173191874813,41.88718127107246],
                        [-74.31748498113404,41.88725739905367],
                        [-74.31763686089357,41.88733078121809],
                        [-74.31773878517185,41.88739442888814],
                        [-74.31780827110595,41.88743548791551],
                        [-74.318191408691,41.88775609674209],
                        [-74.31825075263004,41.88785094383305],
                        [-74.31827866442086,41.887922203859524],
                        [-74.31829852963449,41.88797399531295],
                        [-74.31830339133734,41.88801567816825],
                        [-74.31909397244453,41.88786791673858],
                        [-74.31937292218208,41.88802266687601],
                        [-74.31966662406921,41.888197384322616]
                    ]
                ]
            ]
        }
    },  
     ]
};

var notAvailable = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
        "properties": {
            "activityTitle": "N/A",
            "image": "assets/img/availability/LOT-.png",
            "lotSize": "5.5 Acres",
            "cost": "$500,000",
            "lotURL": "lot-24"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [ -74.31576199829578,41.88767572652971 ],
                        [ -74.31446850299835,41.88666185120915 ],
                        [ -74.31400716304779,41.88730482275211 ],
                        [ -74.31478098034859,41.88802166848914 ],
                        [ -74.31576199829578,41.88767572652971 ],
                    ]
                ]
            ]
        }
    },   
  ]
};

var itaHW = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.31709907948965,41.887083178013086
                ]
            },
            "type": "Feature",
            "properties": {
                "iconURL": "assets/img/in-the-area/icons/hw_logo.png",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "classType": "hudson-woods",
                "activity": "sleep",
                "activityTitle": "Hudson Woods",
                "image": "assets/img/in-the-area/hw_image.jpg",
                "activityDescription":"Set amidst forests and meadows with sweeping mountain views, Hudson Woods homes offer modern design that blends seamlessly with the natural surroundings.",
                "website": "http://www.hudsonwoods.com/availability"
            },
            "id": 1
        },
    ]
};

var itaSleep = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.155887,
                    41.768292
                ]
            },
            "type": "Feature",
            "properties": {
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "classType": "sleep",
                "activity": "sleep",
                "activityTitle": "Mohonk Mountain House",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Mohonk.jpg",
                "activityDescription":"The grand dame of Hudson Valley resorts (and longest surviving), the enormous Mountain House is perched in one of the most memorable settings in the country. The fairly new spa comes highly recommended and the dated nine-hole golf course set in a mountain is a wild pitch and putt. Skating in the winter is perfect and the grounds are brilliantly gardened.",
                "website": "http://www.mohonk.com/"
            },
            "id": 1
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.146385,
                    41.845768
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "The Inn at Stone Ridge",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Stone-ridge.jpg",
                "activityDescription":"This 18th century mansion, built by the prominent Dutch Hasbrouck family has been continuously occupied. It currently serves as a bed & breakfast with each room reflecting different periods of the Hasbrouck family with fully updated modern amenities. It is on 45 acres of groomed lawns and beautiful gardens.",
                "website": "http://www.innatstoneridge.com/"
            },
            "id": 2
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.145333,
                    41.847324
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "Blue Willow Bed & Breakfast",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_BlueWillow.jpg",
                "activityDescription":"A 1750 stone home impeccably remodeled with all of today’s amenities. This Martha Stewart ready gem is nestled in historic Stone Ridge, where there is a smattering of Arts & Crafts homes amongst the abundance of Dutch stone colonials.",
                "website": "http://bluewillowgetaways.com/"
            },
            "id": 3
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.190511,
                    41.824448
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "ElmRock Inn Bed & Breakfast",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Elmrock.jpg",
                "activityDescription":"A 1770 Dutch Boutique-Style Farmhouse offering guest accommodations and often hosting weddings for locals an out of towers. Apparently the catering is superb…",
                "website": "http://elmrockinn.com/"
            },
            "id": 4
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.31966090000003,
                    42.0886874
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "The Graham & Co",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Graham.jpg",
                "activityDescription":"The side project of 4 enterprising Brooklynites working in the realms of fashion and design, the Graham & Co is a cool mix of mid-century modern and quaint American rustic-chic. Camp-like features include outdoor movie nights, a fire pit, inner tubes in the pool and a rustic bar. Their 20 rooms are very popular among the twee, so book early!",
                "website": "http://www.thegrahamandco.com"
            },
            "id": 5
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.08345600000001,
                    41.843841
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "The 1850 House Inn & Tavern",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_1850.jpg",
                "activityDescription":"The “house” has operated as a hotel since 1850. The newest owners have restored it and it’s 11 rooms with historical integrity and modern amenities but most importantly, they have revived the public tavern. Check-out the recently installed enormous deck off the back of the hotel overlooking Rondout Creek.",
                "website": "http://www.the1850house.com"
            },
            "id": 6
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.10949900000003,
                    41.831324
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "Captain Schoonmaker Bed & Breakfast",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Captain.jpg",
                "activityDescription":"Captain Frederick Schoonmaker was a local Civil War hero. Of his large estate, only the stone house remained in his name when the war ended. For the past 30 years, it has been a well known bed & breakfast with quaint charm.",
                "website": "http://www.captainschoonmakers.com"
            },
            "id": 7
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -73.91291799,
                    41.926652
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "Beekman Arms-Delamater Inn Inc",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Beekman.jpg",
                "activityDescription":"America’s oldest continuously operating inn has all the historic trappings one would expect: wide-plank floors, beamed ceilings, and a stone hearth. It contains the sturdy Bogardus Tavern, built to withstand an Indian attack and a stage coach stop and hangout for revolutionaries. Of course, George Washington slept here. Its “sister” inn, the Delameter is considered an American Gothic masterpiece.",
                "website": "http://beekmandelamaterinn.com/"
            },
            "id": 8
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.1940399,
                    41.727852
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "Minnewaska Lodge",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Minnewaska.jpg",
                "activityDescription":"This hotel earns the word “lodge”—Tall ceilings, huge windows, lots of wood, an outdoor fire pit and adirondack chairs. The huge back yard abuts the intimidating cliffs of the Shawangunk Ridge and the surrounding 22,000 acres of state preserve. You practically fall out of bed onto a hiking trail.",
                "website": "http://www.minnewaskalodge.com"
            },
            "id": 9
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.126173,
                    42.003321
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sleep",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sleep.png",
                "activity": "sleep",
                "activityTitle": "The Hotel Dylan",
                "image": "assets/img/in-the-area/InTheArea_SLEEP_Dylan.jpg",
                "activityDescription":"The Hotel Dylan bills itself as a gateway to the music and the arts of the Hudson Valley. Reflecting the bohemian spirit of Woodstock it’s more Scandinavian chic than hippy and tie-die. The rooms look out over a central lawn where you can engage in “spontaneous leisure” activities like ping-pong, badminton, bocce ball, or just lazing in the hammock.",
                "website": "http://thehoteldylan.com"
            },
            "id": 10
        }
    ]
};



var itaEat = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.255629,
                    41.891399
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Country Inn",
                "image": "assets/img/in-the-area/InTheArea_EAT_Country.jpg",
                "activityDescription":"Wait, are we in Williamsburg? This former biker bar has brief but considered menu, over 400 beers from around the world, a beautiful deck with a lake view and plenty of taxidermy. They have recently installed a pizza oven as well. Here come more hipsters… beat them before kitchen closes at 9.",
                "website": ""
            },
            "id": 101
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.12797499,
                    41.827198
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "The Depuy Canal House",
                "image": "assets/img/in-the-area/InTheArea_EAT_Depuy.jpg",
                "activityDescription":"This formerly infamous tavern has been restored and lovingly maintained for over 44 years by Chef John Novi. Novi is deeply connected to local growers and works that knowledge into his menu that some call “kitchen theater.” Be prepared to settle in for a while they can over-serve at times.",
                "website": "http://www.depuycanalhouse.com"
            },
            "id": 102
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.142539,
                    41.850024
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Asia",
                "image": "assets/img/in-the-area/InTheArea_EAT_Asia.jpg",
                "activityDescription":"Amazingly there are two restaurants in Stone Ridge that serve fantastic sushi. Asia also features a long list (over 100!) of Chinese, Korean, Thai and Indian dishes on its menu? It was opened recently by a pair of Malaysian sisters who have another popular restaurant in Kingston under their belt.",
                "website": "http://asiastoneridge.com"
            },
            "id": 103
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.141758,
                    41.849948
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Momiji",
                "image": "assets/img/in-the-area/InTheArea_EAT_Momjii.jpg",
                "activityDescription":"Who knew you could get pretty darn good sushi in Stone Ridge? Momiji has all the Japanese staples in the non-sushi zone, and remarkably fresh fish. Kids love the cool Ramune bubble sodas.",
                "website": "http://www.yelp.com/biz/momiji-restaurant-stone-ridge"
            },
            "id": 104
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.08426099,
                    41.764988
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Rock and Rye Tavern",
                "image": "assets/img/in-the-area/InTheArea_EAT_rockrye.jpg",
                "activityDescription":"Outdoors get a spectacular view of the Shawangunk Ridge; indoors, dine in the 1759 stone tavern or the elegant 1830’s wing. Chef Kolakowski’s New American bistro-style menu sources from local farms, but truth be told, many just go for the cocktails with names like “Bitter-Sweet Symphony,” “Fitzcarraldo” and “Honey Badger.” ",
                "website": ""
            },
            "id": 105
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.087492,
                    41.747179
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "The Huguenot Restaurant",
                "image": "assets/img/in-the-area/InTheArea_EAT_Hugenot.jpg",
                "activityDescription":"The Huguenot isa collaboration between A Tavola Trattori, New Paltz and nearby Karl Family Farms. An organic, adventurous gastropub that would please any carnivore. There are plenty of vegetarian options but the farm sets the daily agenda with their meats. The cocktails are widely considered to be genius.",
                "website": "http://www.thehuguenot.com"
            },
            "id": 106
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.08709699,
                    41.747381
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "A Tavola Trattoria",
                "image": "assets/img/in-the-area/InTheArea_EAT_A-tavola.jpg",
                "activityDescription":"A Tavola Trattoria is the effort of two chefs from two of the best Italian restaurants in the city – Sfoglia and Al Di La. They combine classic Italian with local farm ingredients. We think it’s the best restaurant in New Paltz.",
                "website": "http://www.atavolany.com"
            },
            "id": 107
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.19237599999997,
                    41.727915
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Mountain Brauhaus Restaurant",
                "image": "assets/img/in-the-area/InTheArea_EAT_Brahaus.jpg",
                "activityDescription":"The German kitsch decore and the menu may not had changed much since the Ruoff family opened the Mountain Brauhaus in 1955, but that’s a good thing. Classic German cuisine and beers plus really good cocktails draw a bustling crowd, among them many weary rock climbers. Where else will your waitress be wearing a dirndl?",
                "website": "http://www.mountainbrauhaus.com"
            },
            "id": 108
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.39251000000002,
                    41.715937
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Aroma Thyme Bistro",
                "image": "assets/img/in-the-area/InTheArea_EAT_Aroma.jpg",
                "activityDescription":"A restaurant that’s certified Green and focuses on sourcing pure ingredients. The food is healthy and delicious, and the bar is well stocked, featuring 250 craft beers.",
                "website": "http://www.aromathymebistro.com"
            },
            "id": 109
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -73.9135674,
                    41.9268647
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Market Street",
                "image": "assets/img/in-the-area/InTheArea_EAT_Market-street.jpg",
                "activityDescription":"A favorite for catering our Hudson Woods events, Market Street is the closest to resembling a “scene” in the area. The American-Italian fare by seasoned Hudson Valley chef Gianni Scappin is all about sharing small plates before a seasonably informed, elegantly executed entree. Or sit by the pizza over (shown) and dive into the excellent wine list.",
                "website": "http://www.marketstrhinebeck.com/"
            },
            "id": 110
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //           -73.91238199999998,
        //             41.927949
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "eat",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
        //         "activity": "eat",
        //         "activityTitle": "Gigi Trattoria",
        //         "image": "assets/img/in-the-area/inthearea_eat_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 111
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.11893600000002,
                    42.040648
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Oriole9",
                "image": "assets/img/in-the-area/InTheArea_EAT_Oriole.jpg",
                "activityDescription":"The emphasis at Oriole 9 is on fresh, seasonal, simple and de rigueur local farm sourcing. Its “fresh from the garden” blackboard requires lots of chalk, making it a huge favorite in Woodstock. Co-owner Nina Moeys-Paturel’s parents served the likes of Dylan and Baez at their Woodstock espresso café.",
                "website": "http://www.oriole9.com/"
            },
            "id": 112
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.26381100000003,
                    41.997238
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Bread Alone, Boiceville",
                "image": "assets/img/in-the-area/InTheArea_EAT_Bread.jpg",
                "activityDescription":"This Bread Alone location is perfect before or after a jaunt through the Ashokan Reservoir. It carries almost all of the organic grain products, and the kitchen cooks a mean brunch. Coming soon, they will host a farmer’s market Friday afternoons.",
                "website": "http://www.breadalone.com/boiceville"
            },
            "id": 113
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.0693,
                   42.05002
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Red Onion",
                "image": "assets/img/in-the-area/InTheArea_EAT_RedOnion.jpg",
                "activityDescription":"Housed in an old Colonial eyebrow on the road where Woodstock blends into Saugerties, the Red Onion serves “international bistro cuisine” and is well known for its generous portions, consistently inventive dishes and the proper cocktails at the busy bar. Unpretentious, but not inexpensive.",
                "website": "http://www.redonionrestaurant.com/"
            },
            "id": 114
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.15389500000003,
                    42.040114
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Bear Cafe",
                "image": "assets/img/in-the-area/InTheArea_EAT_Bear.jpg",
                "activityDescription":"On the banks of the Saw Kill (river) and adjacent the Bearsville theater, the Bear Café is as Woodstock as it gets. It opened in 1971 by then manager of Bob Dylan, the Band, Janis Joplin and many others. The crowd is there to “see-and-be-seen” and to enjoy the emphasis on organic ingredients on the “big city-class” menu.",
                "website": "http://www.bearcafe.com/"
            },
            "id": 115
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.11038400000001,
                   42.037474
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Cucina",
                "image": "assets/img/in-the-area/InTheArea_EAT_Cucina.jpg",
                "activityDescription":"The setting alone makes this excellent, contemporary Italian restaurant worth the visit. A rambling rustic farmhouse and companion barn (now a gorgeous catering space) are where chef Giovanni Scappin serves “straight forward” but consistently delicious pastas, and a “sensational” flatbread pizza.",
                "website": "http://www.cucinawoodstock.com/"
            },
            "id": 116
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.01950399999998,
                   41.93427
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Elephant",
                "image": "assets/img/in-the-area/InTheArea_EAT_Elephant.jpg",
                "activityDescription":"A wine and tapas bar that’s quite small, very reasonable and has devoted local following for it’s “punk rock” tapas and extensive, Spanish dominated wine list. Unusual combinations of ingredients update the Basque and Spanish classics. ",
                "website": "http://www.elephantwinebar.com"
            },
            "id": 118
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.01840600000003 ,41.933698
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Le Canard Enchaine",
                "image": "assets/img/in-the-area/InTheArea_EAT_Canard.jpg",
                "activityDescription":"Classic, French cuisine that’s “so behind the curve, it’s probably ahead of it” says the Wall Street Journal. Come early for the almost ridiculously reasonable prix-fixe menu, or settle in later for a lavish meal, but always with proper French service.",
                "website": "http://le-canardenchaine.com"
            },
            "id": 119
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.020801,41.935213
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Boitson's",
                "image": "assets/img/in-the-area/InTheArea_EAT_Boitsons.jpg",
                "activityDescription":"A clubby bistro whose center of attraction is it’s boisterous bar with the word, “Lubrication’”  written in large stained glass type above it. Boitson’s succinct but well considered menu combines French bistro, pub fare and Southern standards into what Hudson Valley Magazine calls, “American bistro comfort food.” Off menu there’s always a considerable list of more dressed up dishes.",
                "website": "http://www.boitsons.com"
            },
            "id": 120
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.02000399999997,41.933753
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Duo Bistro",
                "image": "assets/img/in-the-area/InTheArea_EAT_Duo.jpg",
                "activityDescription":"“New American cuisine,” “eclectic American, timely and healthy,” “focus on responsibility and sustainability,”  “eclectic comfort food menu,” “in-house and organic with a twist.” This very popular bistro garners great quotes… and it serves breakfast all day! ",
                "website": "http://duobistro.com"
            },
            "id": 121
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -73.87101999999999,41.99465
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Mercato - Osteria & Enoteca",
                "image": "assets/img/in-the-area/InTheArea_EAT_Mercato.jpg",
                "activityDescription":'This authentic Italian osteria serves very upscale food to the dining cognoscenti on both sides of the Hudson. Co-owner Francesco Buitoni is in fact a 7th generation member of the Buitoni pasta family and according to the Times, the restaurant “enables him to cook the way he grew up eating in Italy."',
                "website": "http://www.mercatoredhook.com/"
            },
            "id": 122
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.126664,41.826748
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "High Falls Kitchenette",
                "image": "assets/img/in-the-area/InTheArea_EAT_Kitchenette.jpg",
                "activityDescription":"This retro-adorable eatery serves rather decadent comfort food, shakes, pies and most notably, a lavish country breakfast. A High Falls version of the popular locations in Manhattan. Mom will be jealous.",
                "website": "http://www.kitchenetterestaurant.com/home.html"
            },
            "id": 123
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                   -74.4505573,42.1075011
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "eat",
                "classIcon": "assets/img/in-the-area/icons/card-icon-eat.png",
                "activity": "eat",
                "activityTitle": "Peekamoose Restaurant & Tap Room",
                "image": "assets/img/in-the-area/InTheArea_EAT_Peekamoose.jpg",
                "activityDescription":'This restaurant has lots going for it: Chef Devin Mills is from Brooklyn; he and his wife trained at Le Bernardin, Gramercy Tavern and Picholine among others; 35 beers are on tap; ingredients are sourced from local growers; the prices are reasonable; it’s got “lodge appeal”',
                "website": "http://www.peekamooserestaurant.com/"
            },
            "id": 124
        },
    ]
};

var itaSip = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.17528099999998,41.686817
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "Tuthilltown Spirits",
                "image": "assets/img/in-the-area/InTheArea_SIP_Tuthill.jpg",
                "activityDescription":"The adorable but pricey family of Hudson Whiskeys as well as Half Moon Orchard Gin, Indigenous Vodkas and evan a Cassis are all distilled from locally grown grains, apples and corn. Take a tour, hit the store, and have lunch or dinner next door at the historic grist mill turned restaurant. ",
                "website": "http://www.tuthilltown.com"
            },
            "id": 200
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.08966399999997,41.747007
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "sip",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
        //         "activity": "sip",
        //         "activityTitle": "Gilded Otter Brewing",
        //         "image": "assets/img/in-the-area/inthearea_sip_otter.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 200
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.012227,41.931309
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "Keegan Ales",
                "image": "assets/img/in-the-area/InTheArea_SIP_Keegan.jpg",
                "activityDescription":"Only 11 years old, Keegan Ales Brewery in Kingston is now a Hudson Valley staple and a testament to local sourcing and production. The bottling operation creates 8 regular styles and countless seasonal batches. Tour the brewery, sample the line up at the bar, or kit-up a home brew.",
                "website": "http://www.keeganales.com"
            },
            "id": 201
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.62445200000002,42.034388
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "Hillrock Estate",
                "image": "assets/img/in-the-area/InTheArea_SIP_Hillrock.jpg",
                "activityDescription":"The Hillrock Distillery is a “field-to-glass” craft distilling operation, i.e. farm-to-table for booze. Hillrock’s custom-made copper distillation equipment gives them extraordinary control over the quality of each batch. They produce aged Bourbon, and will release a single malt whiskey and a rye in the coming months. ",
                "website": "http://hillrockdistillery.com/"
            },
            "id": 202
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.439717,41.29121
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "sip",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
        //         "activity": "sip",
        //         "activityTitle": "Warwick Valley Winery",
        //         "image": "assets/img/in-the-area/inthearea_sip_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 203
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.92657099999997,41.705311
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "Mill House Brewing Company",
                "image": "assets/img/in-the-area/InTheArea_SIP_Millhouse.jpg",
                "activityDescription":'This cavernous brew-pub restaurant sits alongside its namesake brewery and currently serves 6 house made beers: Kold One, PK Pale Ale, Alpha, De Raileur, Kilt Spinnei and Velvet Panda Stout. We’ve had them at many of our events because it’s all really good. Their motto: “Food, Farms, and beer.”',
                "website": "http://www.millhousebrewing.com"
            },
            "id": 204
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -73.92957999999999,41.769164
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "sip",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
        //         "activity": "sip",
        //         "activityTitle": "Hyde Park Brewing Company",
        //         "image": "assets/img/in-the-area/inthearea_sip_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 205
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.92957999999999,41.769164
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "The Brewery at Bacchus",
                "image": "assets/img/in-the-area/InTheArea_SIP_Bacchus.jpg",
                "activityDescription":"The 2 year-old Brewery at Bacchus operates as a series of experiments with unusual beers categories: Brett saisons, farmhouse ales aged on fruit, dark sours, 100% Brett IPAs, whiskey-aged imperial stouts. Because it’s such a small operation, there is limited production and each barrel goes quickly.",
                "website": "http://www.bacchusnewpaltz.com/brewery"
            },
            "id": 205
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.1610607,41.7149915
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "sip",
                "classIcon": "assets/img/in-the-area/icons/card-icon-sip.png",
                "activity": "sip",
                "activityTitle": "Robibero Family Vineyards",
                "image": "assets/img/in-the-area/InTheArea_SIP_Robibero.jpg",
                "activityDescription":"A fairly new vineyard on the New York scene, Robibero is also one of the most scenic, located on 42 acres in and around the Shawangunk Ridge. It’s a family operation who’s mission is less corporate and more about passion. Wines are crafted in small lots, in very limited production and sold mostly on site. ",
                "website": "http://www.rnewyorkwine.com/"
            },
            "id": 206
        },
    ]
};


var itaSwing = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.155887,41.768292
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Mohonk Mountain House Golf Course",
                "image": "assets/img/in-the-area/InTheArea_SWING_Mohonk.jpg",
                "activityDescription":"The nine holes are set among the mountain terrain of the Shawangunk Ridge, and so playing here is a bit like riding a roller coaster. Each hole is on a small foot print with limited sight lines, and yet it’s still very fun to play while giving you quite the workout if you choose to walk it. Public course and available to non-guests.",
                "website": "http://www.mohonk.com/activities/overnight/outdoors#Golf"
            },
            "id": 301
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.22894100000002,41.79971
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Rondout Valley Golf Club",
                "image": "assets/img/in-the-area/InTheArea_SWING_Rondout.jpg",
                "activityDescription":"Closest to Hudson Woods, and a moderately challenging course, the Rondout Valley Golf Club is 18 holes of beautiful scenery. We recommend afternoon play to catch the late light and after the 18th enjoy the deck of Ivan’s bar that looks out over the valley course.",
                "website": "http://www.rondoutgolfclub.com"
            },
            "id": 302
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.047955,41.718813
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Apple Green's Golf Course",
                "image": "assets/img/in-the-area/InTheArea_SWING_Apple.jpg",
                "activityDescription":"Just west of New Paltz, this working apple orchard shares space with 27 holes of challenging but entertaining golf terrain. It’s a beautiful course worthy of its own day trip from the city. Wonderful in all seasons, but particularly late summer and early fall when you can sample the produce.",
                "website": "http://www.applegreens.com"
            },
            "id": 303
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.15097700000001,41.819347
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Stone Dock Golf Course",
                "image": "assets/img/in-the-area/InTheArea_SWING_Stone-dock.jpg",
                "activityDescription":"An adorable 9 hole course sited on the Rondout Creek, Stone Dock Golf Club has experienced a great rejuvenation over the last several years. Though it is not without its challenges, the course is fun for all levels and features the added bonus of housing the quite delicious High Falls Café.",
                "website": "http://www.stonedockgolfclub.com/"
            },
            "id": 304
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.15097700000001,41.819347
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "swing",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
        //         "activity": "swing",
        //         "activityTitle": "New Paltz Golf Course",
        //         "image": "assets/img/in-the-area/inthearea_swing_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 305
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.957876,42.122227
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Lazy Swan Golf & Country Club",
                "image": "assets/img/in-the-area/InTheArea_SWING_LazySwan.jpg",
                "activityDescription":"Certainly one of the best courses in Ulster County, the Lazy Swan is “championship caliber,” designed by Barry Jordan, and is anchored by a fairly swanky golf club, a bistro/martini lounge, and set of golf bungalows. It’s fairly new (2005) and it’s mountain style holes are in near perfect shape.",
                "website": "http://www.thelazyswan.com"
            },
            "id": 306
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.721771,41.788544
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swing",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swing.png",
                "activity": "swing",
                "activityTitle": "Grossinger Country Club",
                "image": "assets/img/in-the-area/InTheArea_SWING_Grossinger.jpg",
                "activityDescription":"Part of The Concord complex, this Joe Finger designed course is well noted for how it takes advantage of pre-existing terrain. Each nine at starts atop a hill and works down into a valley and then back to the top of the hill. Many bending holes and high reward 5’s make it a fun course where you can up your game.",
                "website": "http://www.grossingergolf.net"
            },
            "id": 307
        },
    ]
};




var itaSwim = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.2361881693115,41.727845154531984
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swim",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
                "activity": "swim",
                "activityTitle": "Lake Minnewaska",
                "image": "assets/img/in-the-area/InTheArea_SWIM_Minnewaska.jpg",
                "activityDescription":"The tour around Lake Minnewaska is not only very beautiful, but it’s also quite manageable at 1.7 miles. Directly off the main parking lot in Minnewaska State Park, the well attended, but not overcrowded trails are open, airy and provide a moment of scenic bliss.",
                "website": "http://nysparks.com/parks/127/details.aspx"
            },
            "id": 401
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.2905538,41.7057625
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swim",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
                "activity": "swim",
                "activityTitle": "Lake Awosting",
                "image": "assets/img/in-the-area/InTheArea_SWIM_Awosting.jpg",
                "activityDescription":"With a beach made of solid rock, this gorgeous lake’s dedicated swimming area provides a brilliant way to douse after making the uphill, but moderate 4.5 mile hike.",
                "website": "http://www.catskillhiker.net/Trails/trails_gunks.shtml"
            },
            "id": 402
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.19376373291016,41.78051293953792
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "swim",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
        //         "activity": "swim",
        //         "activityTitle": "Deep Hole (on the Peterskill)",
        //         "image": "assets/img/in-the-area/inthearea_swim_deep-hole.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 403
        // },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.37657899999999,41.8223747
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "swim",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
        //         "activity": "swim",
        //         "activityTitle": "Vernooy Kill Swimming Hole",
        //         "image": "assets/img/in-the-area/inthearea_swim_placeholder.jpg",
        //         "activityDescription":"Gently sloping falls, and a kid friendly 4 mile round trip hike. Enter at 576 Upper Cherrytown Road.",
        //         "website": "http://www.trails.com/tcatalog_trail.aspx?trailid=HGN065-021"
        //     },
        //     "id": 404
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.29495400000002,41.730683
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swim",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
                "activity": "swim",
                "activityTitle": "Stony Kill Falls",
                "image": "assets/img/in-the-area/InTheArea_SWIM_Stonykill.jpg",
                "activityDescription":"The reward for a relatively brief walk in a portion of the Minnewaska Park, near Wawarsing is a stunning 90 foot waterfall flowing over a sheer cliff face into a pristine swimming hole. Above the fall is a pool from which there are marvelous views of the Stony Creek and Roundout Valleys, into Sullivan County.",
                "website": "http://en.wikipedia.org/wiki/Stony_Kill_Falls"
            },
            "id": 405
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.31526769999999,41.9525093
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "swim",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
        //         "activity": "swim",
        //         "activityTitle": "Peekamoose Blue Hole",
        //         "image": "assets/img/in-the-area/inthearea_swim_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 406
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.1020703,41.8622198
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "swim",
                "classIcon": "assets/img/in-the-area/icons/card-icon-swim.png",
                "activity": "swim",
                "activityTitle": "Split Rock Swimming Hole",
                "image": "assets/img/in-the-area/InTheArea_SWIM_splitrock.jpg",
                "activityDescription":"Split Rock Hole is a collection of unique wading opportunities. A brisk stream between two sizable cliffs where jumping off is a popular option. Take 44/55 to Clove Rd. Keep to the right on this dirt road, over bridges, until you get to the to the Coxing Kill Trailhead and parking area. Requires Mohonk Preserve Day Pass $10.",
                "website": "http://www.mohonkpreserve.org/coxing-trailhead"
            },
            "id": 407
        },
    ]
};



var itaTrail = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.27041199999996,41.723662
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Minnewaska State Park",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Minnewaska.jpg",
                "activityDescription":"At 21,106 acres and occupying part of New Paltz, Gardiner and Ellenville, the Minnewaska State Park Preserve is a behemoth size wise, but is also amenable to all levels of hikers, walkers, bikers, horses and XC skiing. Along with its two famous lakes Awosting and Minnewaska, the park contains a bey of fun destinations.",
                "website": "http://nysparks.com/parks/127/details.aspx"
            },
            "id": 500
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.19855899999999,41.737146
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Mohonk Preserve",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Mohonk.jpg",
                "activityDescription":"Most famous for it’s highly technical rock climbing routes on the ridges known as “The ‘Gunks”, the 8000 acre Mohonk Preserve is also accessible to the non-hard-hatted with 30 miles of gentle carriageways. It contains sections of the Appalachian Trail.",
                "website": "http://www.mohonkpreserve.org/"
            },
            "id": 501
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //            -74.16198370000001,41.6601477
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "trails",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
        //         "activity": "trails",
        //         "activityTitle": "Wallkill Valley Rail Trail",
        //         "image": "assets/img/in-the-area/inthearea_trails_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 502
        // },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //           -74.20769969999998,41.9649232
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "trails",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
        //         "activity": "trails",
        //         "activityTitle": "Reservoir Rd",
        //         "image": "assets/img/in-the-area/inthearea_trails_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 503
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.36454744964601,41.80328606981965
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "The Lundy Estate",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Lundy.jpg",
                "activityDescription":"Formerly the private estate of famed restaurateur owner of Lundy’s in Brooklyn, the 5400 acre preserve is a playground for mountain bikers and hikers.",
                "website": "http://www.fatsinthecats.com/trail.php?id=42"
            },
            "id": 504
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.1819084,41.9665477
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Ashokan Reservoir",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Ashokan.jpg",
                "activityDescription":"Bike, walk or run around New York City’s most attractive drinking water. The historic and beautiful Ashokan Reservoir was completed in 1915 and still supplies 40% of NYC’s daily usage. The views across the basin to the Catskills is awesome, and the bridges and old stonework have the effect of bringing you back in time. Very easy wide, paved trails are great for any athletic level.",
                "website": "http://www.nyc.gov/html/dep/html/watershed_protection/ashokan.shtml"
            },
            "id": 505
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.408593,41.655896
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Walkway over the Hudson",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Walkway.jpg",
                "activityDescription":"A formerly abandoned railroad bridge is now a glorious if somewhat vertiginous pedestrian park. The Walkway over the Hudson connects Highland to Poughkeepsie, and at1.28 miles, is the longest, elevated pedestrian bridge in the world. Among the more popular events scheduled there are the frequent “Moonwalks” and a very dramatic 4th of July.",
                "website": "http://walkway.org"
            },
            "id": 506
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.0880458,41.8434271
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Rosendale Trestle",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_trestle.jpg",
                "activityDescription":"The most impressive stage along the 24 mile long Walkill Valley Rail Trail, this refurbished train truss bridge that crosses over the Rondout Creek dates back to 1872. Peer over Rosendale, and while you’re there, marvel that rail trail now extends continuously from Gardiner to Kingston thanks in large part to the efforts of the Open Space Institute.",
                "website": "http://www.wvrta.org"
            },
            "id": 507
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.33699373553463,41.75300730868398
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "trails",
                "classIcon": "assets/img/in-the-area/icons/card-icon-trail.png",
                "activity": "trails",
                "activityTitle": "Mine Hole Trail",
                "image": "assets/img/in-the-area/InTheArea_TRAILS_Minehole.jpg",
                "activityDescription":"The recently opened 3.5 mile trail now connects the Shawangunks to the Catskills. Access from inside the Minnewaska State Park. ",
                "website": "http://www.nynjtc.org/mine-hole-trail"
            },
            "id": 508
        },
    ]
};





var itaSki = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.210219,42.204658
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "ski",
                "classIcon": "assets/img/in-the-area/icons/card-icon-ski.png",
                "activity": "ski",
                "activityTitle": "Hunter Mountain",
                "image": "assets/img/in-the-area/InTheArea_SKI_Hunter.jpg",
                "activityDescription":"Hunter Mountain offers snow tubing and snowshoeing as well skiing. Hunter Mountain also features two terrain parks and holds freestyle events throughout the ski season.",
                "website": "www.huntermtn.com"
            },
            "id": 600
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.505312,42.132245
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "ski",
                "classIcon": "assets/img/in-the-area/icons/card-icon-ski.png",
                "activity": "ski",
                "activityTitle": "Belleayre Ski Center",
                "image": "assets/img/in-the-area/InTheArea_SKI_Bellayre.jpg",
                "activityDescription":"Belleayre Ski Center is located in the unblemished Catskill Forest Preserve on “forever wild” land. Visitors can Ski and snowboard the trails that descend through silent, pristine woodlands of the Forest.",
                "website": "http://www.belleayre.com/ "
            },
            "id": 601
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.25696700000003,42.29896
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "ski",
                "classIcon": "assets/img/in-the-area/icons/card-icon-ski.png",
                "activity": "ski",
                "activityTitle": "Windham Mountain",
                "image": "assets/img/in-the-area/InTheArea_SKI_Windham.jpg",
                "activityDescription":"Windham Mountain is located in the northern section of the Catskills . It has 46 trails and 9 lifts, including two high-speed detachable quads, one from the bottom to top of each peak. The highest peak is situated at 3,100 feet (940 m).",
                "website": "www.windhammountain.com"
            },
            "id": 602
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.13375080000003,42.1956438
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "ski",
                "classIcon": "assets/img/in-the-area/icons/card-icon-ski.png",
                "activity": "ski",
                "activityTitle": "Mountain Trails XC Ski Center",
                "image": "assets/img/in-the-area/InTheArea_SKI_Trails.jpg",
                "activityDescription":"The 300 acres of gorgeous Catskill park has 22 miles of former logging roads have been upgraded and are continually groomed and re-graded. Fear not if you are un-initiated to alpine skiing since all necessities for skiing (or snowshoeing) can be rented or purchased at the lodge.",
                "website": "http://www.mtntrails.com/home.html"
            },
            "id": 603
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.609299,41.626282
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "ski",
                "classIcon": "assets/img/in-the-area/icons/card-icon-ski.png",
                "activity": "ski",
                "activityTitle": "Holiday Mountain Ski & Fun Park",
                "image": "assets/img/in-the-area/InTheArea_SKI_Holiday.jpg",
                "activityDescription":"4 lifts service 7 slopes and trails of varying skill levels but mostly for kids and beginners. Other fun stuff includes a tubing hill and night skiing on all trails. Come Summer, the area turns into a kid-cetric resort with bumper boats, go-karts, mini-golf, batting cages, bungee trampolines, and on and on…",
                "website": "http://www.holidaymtn.com"
            },
            "id": 604
        },
    ]
};



var itaCulture = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.06332099999997,41.426696
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Storm King Art Center",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_Stormking.jpg",
                "activityDescription":"Over 100 intelligently sited works of the most acclaimed artists of our times dot the 500 brilliantly landscaped acres of Storm King Arts Center, known as the world’s finest sculpture park. Calder, Serra, Bourgeois, Dubuffet, Moore, Judd, Smith… An absolute must for the life list. ",
                "website": "www.stormkingartcenter.org"
            },
            "id": 700
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.98263600000001,41.500733
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Dia Beacon",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_diabeacon.jpg",
                "activityDescription":'Dia:Beacon occupies a massive (240,000 sq ft!) former Nabisco box printing facility that was renovated for the purposes of presenting Dia Art Foundation’s collection from the 1960’s to the present and for mounting temporary exhibitions and hosting a bevy of education programs."',
                "website": "http://www.diaart.org"
            },
            "id": 701
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.82925869999997,42.2171046
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Olana",
                "image": "assets/img/in-the-area/InTheArea_PICK&GROW_Olana.jpg",
                "activityDescription":"Former home of Frederic Edwin Church, a Hudson River landscape painter this grand, eccentric mansion is a mixture of Victorian, Persian and Moorish style. It is lavishly accoutered with objects from Church’s extensive travels and contains over 40 of his paintings.",
                "website": "http://www.olana.org/"
            },
            "id": 702
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.906454,41.763251
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Springwood Estate",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_springwood.jpg",
                "activityDescription":"Where Franklin Delano Roosevelt was born and lived throughout his life, this fabulous estate hosted kings, queens, prime ministers and politicians. It is is marvelously preserved, containing FDR’s myriad collections of books and art, but it still remains “homey” for a mansion and inviting for a picnic on the grounds.",
                "website": "http://www.nps.gov/hofr/index.htm"
            },
            "id": 703
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.15400399999999,42.03984
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Bearsville Theater",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_Bearsville.jpg",
                "activityDescription":"Ostensibly the center of the Hudson Valley folk music scene, the venue has been recently renovated to house theater, experimental performances and special catering events.",
                "website": "http://www.bearsvilletheater.com/"
            },
            "id": 704
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.08583650000003,41.7575808
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Historic Huguenot Street",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_Hugenot.jpg",
                "activityDescription":"Beautifully preserved and maintained by descendants of the Huguenots who in 1678 began this community. Historic Huguenot Street is fabulous collection of stone homes, churches and meeting places of various colonial styles. With names like Bevier, Hasbrouk, Walloon and Freer on tombstones and plaques.",
                "website": "http://www.huguenotstreet.org/"
            },
            "id": 705
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.90295100000003,42.031112
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Richard B. Fisher Center for the Performing Arts",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_Fisher.jpg",
                "activityDescription":"It’s not hard to guess who designed this splendid performing arts hall, but it is hard to fathom how much cultural output it nurtures and produces. It comprises 2 theaters and 4 rehearsal studios and its climate is controlled by geothermal sources. A jam packed performance schedule make the center “[possibly] the best small concert hall in the United States” per The New Yorker.",
                "website": "http://fishercenter.bard.edu/"
            },
            "id": 706
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.111196,42.038221
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "culture",
                "classIcon": "assets/img/in-the-area/icons/card-icon-culture.png",
                "activity": "culture",
                "activityTitle": "Woodstock Playhouse",
                "image": "assets/img/in-the-area/InTheArea_CULTURE_playhouse.jpg",
                "activityDescription":"As a “rural extension of Broadway,” the Playhouse mounts traveling versions of famous musicals and summer repertory performances. The docket is also chock full of films, musical events and local theater.",
                "website": ""
            },
            "id": 706
        },
    ]
};

var itaPick = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.24897399999998,41.807869
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Westwind Orchard LLC.",
                "image": "assets/img/in-the-area/InTheArea_PICK&GROW_Westwind.jpg",
                "activityDescription":"Fashion photographer Fabio Chizzola and fashion stylist Laura Ferrar are creating a “Holistic Community Orchard” on their 31 acre property in Accord. Already certified organic they are introducing materials like Neem oil, Effective Microbes, seaweed, Kelp and compost teas to help grow healthier soil, trees, fruits and vegetables.",
                "website": "http://westwindorchard.com/"
            },
            "id": 800
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.23792500000002,41.791458
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Saunderskill Farm",
                "image": "assets/img/in-the-area/InTheArea_PICK&GROW_Sauderskill.jpg",
                "activityDescription":"After 12 generations in the same family, Saunderskill Farm isn’t just an historical curiosity, but a thriving, growing business with almost 500 acres in production, a sprawling nursery served by 15 greenhouses, a newly expanded 3100 square foot market selling their produce and scores of other locally sourced goods.",
                "website": "http://www.saunderskill.com"
            },
            "id": 801
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.25830200000001,41.785637
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Kelder Farm",
                "image": "assets/img/in-the-area/InTheArea_PICK&GROW_Kelder.jpg",
                "activityDescription":"Yes, that is the world’s largest garden gnome in front of that huge barn. This sprawling farm is a favorite with kids replete with petting farm animals, mini golf, u-pick fields, hay rides and, the highlight for kids, a giant yellow jumpy pillow. You can even become a member of the exclusive “jumpy club.”",
                "website": "http://www.kelderfarm.com/"
            },
            "id": 802
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.13397800000001,41.857861
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Davenport Farms",
                "image": "assets/img/in-the-area/InTheArea_P&G_Davenport.jpg",
                "activityDescription":"The Davenport family has been farming this land since Isaiah Davenport moved across the Hudson River in the 1840s, and a family member can still be found working in every phase of the farm. The farm stand makes baked goods and carries local products while the rather robust nursery has a tons of plant life.",
                "website": "http://www.davenportfarms.com"
            },
            "id": 803
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.14267899999999,41.837392
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Stone Ridge Orchard",
                "image": "assets/img/in-the-area/InTheArea_P&G_Stone_orchard.jpg",
                "activityDescription":"This orchard has been producing apples for over two hundred years. In two major re-plantings, dozens of new gourmet varieties were added on semi-dwarfing or fully dwarfing rootstocks that produce bigger, sweeter and redder fruit. Recently they have started growing sweet cherries, peaches, nectarines, plums and Asian pears. ",
                "website": "http://www.stoneridgeorchard.us"
            },
            "id": 804
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.084946,41.906291
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "pick-and-grow",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
        //         "activity": "pick-and-grow",
        //         "activityTitle": "Gill's Farm Market",
        //         "image": "assets/img/in-the-area/inthearea_pickandgrow_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 805
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.11115000000001,41.745908
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Wallkill View Farm Market",
                "image": "assets/img/in-the-area/InTheArea_P&G_Walkill.jpg",
                "activityDescription":"Possibly the best reason to visit this amazing farmer’s market is to soak in the views. Plunked in the middle of a hundred acres of fields, the market is backgrounded by the Shawangunk escarpment. There is a huge variety of produce, baked goods, the locally produced cheese.",
                "website": "http://wallkillviewfarm.snappages.com/home.htm"
            },
            "id": 806
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.157489,41.733103
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Jenkins - Lueken Orchards",
                "image": "assets/img/in-the-area/InTheArea_P&G_Jenkins.jpg",
                "activityDescription":"You’ll be in good company if you visit this orchard to pick or the farm stand to purchase. Jenkins & Luekin Orchards offers vegetables, peaches, plums, raspberries, blackberries, pumpkins, summer and winter squash, fall garden mums, and grapes in pure scenery. ",
                "website": "http://www.jlorchards.com"
            },
            "id": 807
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.26002900000003,41.819064
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Hudson Valley Seed Library",
                "image": "assets/img/in-the-area/InTheArea_P&G_Seeds.jpg",
                "activityDescription":"What was once a side project for a librarian in nearby Gardiner is now a three acre facility that produces 100’s of pounds of seeds each year. Seeds are grown on site or sourced from local farms and all certified Organic. ",
                "website": "http://www.seedlibrary.org"
            },
            "id": 808
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.30118299999998,41.831977
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Catskill Native Nursery",
                "image": "assets/img/in-the-area/InTheArea_P&G_Catskill.jpg",
                "activityDescription":"Catskill Native Nursery is the closest garden source to Hudson Woods. It’s a comprehensive and beautiful nursery that will guide you to create brilliant gardens. We source our seedlings there, and they source their seeds from our friends at the Hudson Valley Seed Library.",
                "website": "www.catskillnativenursery.com"
            },
            "id": 809
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.187389,41.836902
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "pick-and-grow",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
        //         "activity": "pick-and-grow",
        //         "activityTitle": "Veronica's Gardens",
        //         "image": "assets/img/in-the-area/inthearea_pickandgrow_placeholder.jpg",
        //         "activityDescription":"",
        //         "website": "http://victoriagardens.biz"
        //     },
        //     "id": 810
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.187389,41.836902
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "pick-and-grow",
                "classIcon": "assets/img/in-the-area/icons/card-icon-pick-grow.png",
                "activity": "pick-and-grow",
                "activityTitle": "Hudson Valley Farm Hub",
                "image": "assets/img/in-the-area/InTheArea_P&G_Farmhub.jpg",
                "activityDescription":"The Farm Hub is an experimental farming model that aims to be a regional center for farmer training, agricultural research and for incubating innovative farm technologies. Visit the farm stand in Hurley dedicated to building a resilient food system. ",
                "website": "http://www.localeconomiesproject.org/initiatives/farm-hub/"
            },
            "id": 810
        },
    ]
};

var itaMind = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.27942200000001,41.81477
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Pilates At the Bungalow",
                "image": "assets/img/in-the-area/InTheArea_MIND&BODY_Bungalow.jpg",
                "activityDescription":"All the equipment, expertise and rigor of the Joseph Pilates method in a scenic setting just 9 minutes from Hudson Woods. This beautiful studio has been voted best pilates studio in the Hudson Valley by Hudson Valley Magazine. ",
                "website": "http://www.pilatesatthebungalow.com/"
            },
            "id": 900
        },
        // {
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             -74.23077553510666,41.78740901823855
        //         ]
        //     },
        //     "type": "Feature",
        //     "properties": {
        //         "classType": "mind-and-body",
        //         "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
        //         "activity": "mind-and-body",
        //         "activityTitle": "Yoga at the Yurt",
        //         "image": "assets/img/in-the-area/inthearea_mindandbody_placeholder.jpg",
        //         "activityDescription":"Lorem Ipsum",
        //         "website": ""
        //     },
        //     "id": 901
        // },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.19552299999998,41.783529
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "One Body Spa",
                "image": "assets/img/in-the-area/InTheArea_MIND&BODY_Bodyspa.jpg",
                "activityDescription":"One Body Spa is a full service operation surrounded by nature in a quiet and peaceful setting. Their stated goal is “to nurture the body to bring balance, comfort, relaxation, and peace to enhance the quality of your life.”",
                "website": "http://www.onebodyspa.com"
            },
            "id": 902
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.18675999999999,41.819542
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "SIMHARA Portal Of the Heart",
                "image": "assets/img/in-the-area/InTheArea_M&B_Simhara.jpg",
                "activityDescription":"It’s unusual enough to find a full service spa in a colonial stone home, but Simhara aspires to help you “reach ever higher levels of holistic and restorative beauty, health, relaxation and happiness” with a host of services, treatments and yoga.",
                "website": "http://www.simhara.com/"
            },
            "id": 903
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.819928,41.885514
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Omega Institute For Holistic Studies",
                "image": "assets/img/in-the-area/InTheArea_M&B_Omega.jpg",
                "activityDescription":"The Omega Institute is a mind and spirit retreat. The Institute hums with seminars by hundreds of noted thinkers, artists and healers and draws over 23,000 attendees to its programs yearly.The recently constructed building to house the Center for Sustainable Living is worth a visit in and of itself.",
                "website": "http://www.eomega.org/"
            },
            "id": 904
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.27720899999997,42.048224
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Zen Mountain Monastery",
                "image": "assets/img/in-the-area/InTheArea_M&B_Zen.jpg",
                "activityDescription":"This is one of the most respected Zen Buddhist monasteries in the West, where monks are teaching and practicing ancient monasticism. Open to daily visits, retreats and other cultural programs to engage the dharma. The grounds are listed on the National Register of Historic Places.",
                "website": "http://zmm.mro.org/"
            },
            "id": 904
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.1366989,41.854862
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Stone Ridge Healing Arts",
                "image": "assets/img/in-the-area/InTheArea_MIND&BODY_Healing-center.jpg",
                "activityDescription":"The facility features several practitioners of “healing” methods from meditation to nutrition and counseling. Also notable is the building itself is a Dutch stone farmhouse dated from 1753 which has been re-imagined to be more contemporary.",
                "website": "http://stoneridgehealingarts.com"
            },
            "id": 905
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.141537,41.852253
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Mama Multi Arts Center",
                "image": "assets/img/in-the-area/InTheArea_M&B_Mama.jpg",
                "activityDescription":"This very busy community center hosts Yoga classes daily, but also Tai Chi, Chi Hung, Zumba and even Chinese Straight Sword sessions. ",
                "website": "http://www.cometomama.org/"
            },
            "id": 906
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.1248678,41.8270172
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Whole Sky Yoga",
                "image": "assets/img/in-the-area/InTheArea_M&B_sky.jpg",
                "activityDescription":"Located in a lean, bright lofty space with hardwood floors in the brand new High Falls Emporium. Whole Sky offers classes of vinyasa and also custom yoga sessions for those who to go to the next level.",
                "website": "http://www.wholeskyyoga.com//"
            },
            "id": 907
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -74.1560166,41.7682793
                ]
            },
            "type": "Feature",
            "properties": {
                "classType": "mind-and-body",
                "classIcon": "assets/img/in-the-area/icons/card-icon-mind-body.png",
                "activity": "mind-and-body",
                "activityTitle": "Mohonk Mountain House Spa",
                "image": "assets/img/in-the-area/InTheArea_M&B_Mohonk.jpg",
                "activityDescription":"Ranked the #1 resort spa by Condé Nast Traveller in 2013, the facility has 16 treatment rooms, fantastic views of the Catskills, a heated outdoor mineral pool and a “spa menu” that is actually 28 pages long.",
                "website": "http://www.mohonk.com/spa"
            },
            "id": 908
        },
    ]
};


var data =[
  {
   type: "Feature",
   properties: {
      type: "type1"
   },
   geometry: {
      type: "Point",
      coordinates: [-74.155887,41.768292]
   }
  },
  {
   type: "Feature",
   properties: {
      type: "type2"
   },
   geometry: {
      type: "Point",
      coordinates: [-74.255629,41.891399]
   }
  }
];

if ($('#availability-map').length) {
var map = L.map('map', {
    center: [41.8872809, -74.3138479],
    zoom: 16,
    scrollWheelZoom: false,
    // zoomControl: false,
    // doubleClickZoom: false
});

L.tileLayer('http://a.tiles.mapbox.com/v3/sandersonj.i245n6m6/{z}/{x}/{y}.png', {
    id: 'sandersonj.i245n6m6'
}).addTo(map);

// array to store layers for each feature type
var mapLayerGroups = [];

L.Icon.Default.imagePath = 'assets/img/availability/icons';

//draw GEOJSON - don't add the GEOJSON layer to the map here
// L.geoJson([available, unavailable], {onEachFeature: onEachFeature})//.addTo(map);

// Set Global Popup Options
var popupOptions = {
    maxWidth: 400,
    keepInView: false,
    closeButton: true,
    autoPanPadding: [30, 30]
};

// Draw Map Labels


var callLocatorLayer = L.geoJson(labels, {
    pointToLayer: function (feature, latlng)
    {
        return L.marker(latlng).bindLabel( feature.properties.MAP_LABEL, { noHide: true });
    }
}).addTo(map);

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function resetMap(e) {
    map.setView(new L.LatLng(41.8872809, -74.3138479), 16);

}

// Draw Model Home Icon
var modelHomeIcon = L.icon({
    iconUrl: 'assets/img/availability/icons/Model-House-icon-map.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [11, 11], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([41.8888444,-74.310715], {icon: modelHomeIcon}).addTo(map);

// Sold Map Tiles

function soldMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#003f00",
        fillOpacity: .33
    };
}

function soldMapResetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#003f00",
        fillOpacity: .33
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function soldMapHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: 1,
        fillColor: "#003f00",
        fillOpacity: .45
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function onEachFeaturesold(feature, layer) {

        //does layerGroup already exist? if not create it and add to map
        var lg = mapLayerGroups[feature.properties.type];

    var popupContent = 
    
    "<div class='card availability sold" + "'" + ">" + 
        "<h2>" + feature.properties.activityTitle + "</h2>" +
        "<img src=" + feature.properties.image +  ">" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>AVAILABILITY</p>" +
            "<p class='status" + "'" + ">"+"Sold"+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>SIZE</p>" +
            "<p>" + feature.properties.lotSize+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>COST</p>" +
            "<p>"+feature.properties.cost+"</p>" +
        "</div>" + 
        "<div class='row" + "'" + ">" + "</div>" +
        "<a href=" + "http://hudsonwoods.com/availability/sold/" + feature.properties.lotURL + ">" + 
        "<i class='fa fa-search" + "'" +">" + "</i>" +
        "View Floor Plans" + 
        "</a>" +
    
    "</div>";


    layer.bindPopup(popupContent,popupOptions);
    layer.on({
        mouseover: soldMapHighlight,
        mouseout: soldMapResetHighlight,  
        popupclose: resetMap 
    });
}

geojson = L.geoJson(sold, {
    style: soldMap,
    onEachFeature: onEachFeaturesold,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);



// For Sale

function forSaleMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#95856b",
        fillOpacity: .37
    };
}

function forSaleMapResetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#95856b",
        fillOpacity: .37
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function forSaleMapHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: 1,
        fillColor: "#95856b",
        fillOpacity: .65
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function onEachFeatureforSale(feature, layer) {

        //does layerGroup already exist? if not create it and add to map
        var lg = mapLayerGroups[feature.properties.type];

    var popupContent = 
    
    "<div class='card availability for-sale" + "'" + ">" + 
        "<h2>" + feature.properties.activityTitle + "</h2>" +
        "<img src=" + feature.properties.image +  ">" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>AVAILABILITY</p>" +
            "<p class='status" + "'" + ">"+"For Sale"+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>SIZE</p>" +
            "<p>"+feature.properties.lotSize+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>COST</p>" +
            "<p>"+feature.properties.cost+"</p>" +
        "</div>" + 
        "<div class='row" + "'" + ">" + "</div>" +
        "<a href=" + "http://hudsonwoods.com/availability/for-sale/" + feature.properties.lotURL + ">" + 
        "<i class='fa fa-search" + "'" +">" + "</i>" +
        "View Floor Plans" + 
        "</a>" +
    
    "</div>";


    layer.bindPopup(popupContent,popupOptions);
    layer.on({
        mouseover: forSaleMapHighlight,
        mouseout: forSaleMapResetHighlight,
        popupclose: resetMap    
    });
}

geojson = L.geoJson(forSale, {
    style: forSaleMap,
    onEachFeature: onEachFeatureforSale,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);



// Contract Out

function contractOutMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#94c05b",
        fillOpacity: .33
    };
}

function contractOutMapResetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#94c05b",
        fillOpacity: .33
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function contractOutMapHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: 1,
        fillColor: "#94c05b",
        fillOpacity: .65
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function onEachFeaturecontractOut(feature, layer) {

        //does layerGroup already exist? if not create it and add to map
        var lg = mapLayerGroups[feature.properties.type];

    var popupContent = 
    
    "<div class='card availability contract-out" + "'" + ">" + 
        "<h2>" + feature.properties.activityTitle + "</h2>" +
        "<img src=" + feature.properties.image +  ">" + 
        "<div class='col-md-5" + "'" + ">" +
            "<p>AVAILABILITY</p>" +
            "<p class='status" + "'" + ">"+"Contract Out"+"</p>" +
        "</div>" + 
        "<div class='col-md-3" + "'" + ">" +
            "<p>SIZE</p>" +
            "<p>"+feature.properties.lotSize+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>COST</p>" +
            "<p>"+feature.properties.cost+"</p>" +
        "</div>" + 
        "<div class='row" + "'" + ">" + "</div>" +
        "<a href=" + "http://hudsonwoods.com/availability/contract-out/" + feature.properties.lotURL + ">" + 
        "<i class='fa fa-search" + "'" +">" + "</i>" +
        "View Floor Plans" + 
        "</a>" +
    
    "</div>";


    layer.bindPopup(popupContent,popupOptions);
    layer.on({
        mouseover: contractOutMapHighlight,
        mouseout: contractOutMapResetHighlight,
        popupclose: resetMap    
    });
}

geojson = L.geoJson(contractOut, {
    style: contractOutMap,
    onEachFeature: onEachFeaturecontractOut,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);



// Contract Signed

function contractSignedMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#239000",
        fillOpacity: .33
    };
}

function contractSignedMapResetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#239000",
        fillOpacity: .33
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function contractSignedMapHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: 1,
        fillColor: "#239000",
        fillOpacity: .65
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function onEachFeaturecontractSigned(feature, layer) {

        //does layerGroup already exist? if not create it and add to map
        var lg = mapLayerGroups[feature.properties.type];

    var popupContent = 
    
    "<div class='card availability contract-signed" + "'" + ">" + 
        "<h2>" + feature.properties.activityTitle + "</h2>" +
        "<img src=" + feature.properties.image +  ">" + 
        "<div class='col-md-6" + "'" + ">" +
            "<p>AVAILABILITY</p>" +
            "<p class='status" + "'" + ">"+"Contract Signed"+"</p>" +
        "</div>" + 
        "<div class='col-md-3" + "'" + ">" +
            "<p>SIZE</p>" +
            "<p>"+feature.properties.lotSize+"</p>" +
        "</div>" + 
        "<div class='col-md-3" + "'" + ">" +
            "<p>COST</p>" +
            "<p>"+feature.properties.cost+"</p>" +
        "</div>" + 
        "<div class='row" + "'" + ">" + "</div>" +
        "<a href=" + "http://hudsonwoods.com/availability/contract-signed/" + feature.properties.lotURL + ">" + 
        "<i class='fa fa-search" + "'" +">" + "</i>" +
        "View Floor Plans" + 
        "</a>" +
    
    "</div>";


    layer.bindPopup(popupContent,popupOptions);
    layer.on({
        mouseover: contractSignedMapHighlight,
        mouseout: contractSignedMapResetHighlight,
        popupclose: resetMap    
    });
}

geojson = L.geoJson(contractSigned, {
    style: contractSignedMap,
    onEachFeature: onEachFeaturecontractSigned,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);



// Not Released

function notReleasedMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#d7d2cb",
        fillOpacity: .33
    };
}

function notReleasedMapResetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#d7d2cb",
        fillOpacity: .33
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function notReleasedMapHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: "#676566",
        opacity: 1,
        fillColor: "#d7d2cb",
        fillOpacity: .65
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function onEachFeaturenotReleased(feature, layer) {

        //does layerGroup already exist? if not create it and add to map
        var lg = mapLayerGroups[feature.properties.type];

    var popupContent = 
    
    "<div class='card availability not-released" + "'" + ">" + 
        "<h2>" + feature.properties.activityTitle + "</h2>" +
        "<img src=" + feature.properties.image +  ">" + 
        "<div class='col-md-5" + "'" + ">" +
            "<p>AVAILABILITY</p>" +
            "<p class='status" + "'" + ">"+"Not Released"+"</p>" +
        "</div>" + 
        "<div class='col-md-4" + "'" + ">" +
            "<p>SIZE</p>" +
            "<p>"+feature.properties.lotSize+"</p>" +
        "</div>" + 
        "<div class='col-md-3" + "'" + ">" +
            "<p>COST</p>" +
            "<p>"+feature.properties.cost+"</p>" +
        "</div>" + 
        "<div class='row" + "'" + ">" + "</div>" +
        "<a href=" + "http://hudsonwoods.com/availability/not-released/" + feature.properties.lotURL + ">" + 
        "<i class='fa fa-search" + "'" +">" + "</i>" +
        "View Floor Plans" + 
        "</a>" +
    
    "</div>";


    layer.bindPopup(popupContent,popupOptions);
    layer.on({
        mouseover: notReleasedMapHighlight,
        mouseout: notReleasedMapResetHighlight,
        popupclose: resetMap    
    });
}

geojson = L.geoJson(notReleased, {
    style: notReleasedMap,
    onEachFeature: onEachFeaturenotReleased,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);




// Not Available

function notAvailableMap(feature) {
    return {
        weight: 1,
        color: "#676566",
        opacity: .2,
        fillColor: "#d7d2cb",
        fillOpacity: .33
    };
}

function onEachFeaturenotAvailable(feature, layer) {
    //does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[feature.properties.type];
}

geojson = L.geoJson(notAvailable, {
    style: notAvailableMap,
    onEachFeature: onEachFeaturenotAvailable,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
    }
}).addTo(map);

    
}


if ($('#in-the-area-map').length) {
var map = L.map('map', {
    center: [41.77197384322616, -74.20966662406921],
    zoom: 10,
    scrollWheelZoom: false
});


L.tileLayer('http://a.tiles.mapbox.com/v3/sandersonj.i245n6m6/{z}/{x}/{y}.png', {
  maxZoom: 18,
  id: 'examples.map-20v6611k'
}).addTo(map);

//array to store layers for each feature type
var mapLayerGroups = [];

// Set Global Popup Options
var popupOptions = {
  maxWidth: 400,
  keepInView: true,
  closeButton: true,
  autoPanPadding: [30, 30]
};

// Create Activity Specific Panes For Filtering
var pane1 = map.createPane('itaSleep ita');
var pane2 = map.createPane('itaEat ita');
var pane3 = map.createPane('itaSip ita');
var pane4 = map.createPane('itaSwing ita');
var pane5 = map.createPane('itaSwim ita');
var pane6 = map.createPane('itaTrail ita');
var pane7 = map.createPane('itaSki ita');
var pane8 = map.createPane('itaCulture ita');
var pane9 = map.createPane('itaPick ita');
var pane10 = map.createPane('itaMind ita');
var pane11 = map.createPane('itaHW ita');



// Activate Each Set of Activities

var hwIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/hw_logo.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
});


function highlightFeaturehw(e) {
    var layer = e.target;
    layer.setIcon(hwIcon);
}

function resetHighlighthw(e) {
  var layer = e.target;
    layer.setIcon(hwIcon);
}

function resetMapSleep(e) {
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
}

function onEachFeaturehw(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties;
  }

  layer.bindPopup(popupContent,popupOptions);


  // layer.setIcon(grayhwIcon);
  layer.on({
    mouseover: highlightFeaturehw,
    mouseout: resetHighlighthw,   
    popupclose: resetMapSleep 
  });
  // map.on({click: resetHighlighthw});
}

var itahw = L.geoJson([itaHW], {

  style: function (feature) {
    return feature.properties;
  },

  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: hwIcon});
  },
  onEachFeature: onEachFeaturehw,


});
var hwBounds = itahw.getBounds();
itahw.addTo(map);








var graySleepIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_sleep.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSleepIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_sleep.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});


function highlightFeatureSleep(e) {
    var layer = e.target;
    layer.setIcon(colorSleepIcon);
}

function resetHighlightSleep(e) {
  var layer = e.target;
    layer.setIcon(graySleepIcon);
}

function resetMapSleep(e) {
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
}




function onEachFeatureSleep(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties;
  }

  layer.bindPopup(popupContent,popupOptions);


  // layer.setIcon(graySleepIcon);
  layer.on({
    mouseover: highlightFeatureSleep,
    mouseout: resetHighlightSleep,   
    popupclose: resetMapSleep 
  });
  // map.on({click: resetHighlightSleep});
}

var itaSleep = L.geoJson([itaSleep], {

  style: function (feature) {
    return feature.properties;
  },

  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSleep ita', icon: graySleepIcon});
  },
  onEachFeature: onEachFeatureSleep,


});
// var sleepBounds = itaSleep.getBounds();
itaSleep.addTo(map);







var grayCultureIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_culture.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorCultureIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_culture.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureCulture(e) {
    var layer = e.target;
    layer.setIcon(colorCultureIcon);
}

function resetHighlightCulture(e) {
  var layer = e.target;
    layer.setIcon(grayCultureIcon);
}

function resetMapCulture(e) {
  map.fitBounds(itaCulture,{
    padding: [50,50]
  });
}


function onEachFeatureCulture(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayCultureIcon);
  layer.on({
    mouseover: highlightFeatureCulture,
    mouseout: resetHighlightCulture,   
    popupclose: resetMapCulture 
  });
  // map.on({click: resetHighlightCulture});
}

var itaCulture = L.geoJson([itaCulture], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaCulture ita', icon: grayCultureIcon});

  },
  onEachFeature: onEachFeatureCulture

});
var CultureBounds = itaCulture.getBounds();
itaCulture.addTo(map);







var grayEatIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_eat.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorEatIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_eat.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureEat(e) {
    var layer = e.target;
    layer.setIcon(colorEatIcon);
}

function resetHighlightEat(e) {
  var layer = e.target;
    layer.setIcon(grayEatIcon);
}

function resetMapEat(e) {
  map.fitBounds(itaEat,{
    padding: [50,50]
  });
}

function onEachFeatureEat(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayEatIcon);
  layer.on({
    mouseover: highlightFeatureEat,
    mouseout: resetHighlightEat,   
    popupclose: resetMapEat 
  });
  // map.on({click: resetHighlightEat});
}

var itaEat = L.geoJson([itaEat], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaEat ita', icon: grayEatIcon});

  },
  onEachFeature: onEachFeatureEat

});
var EatBounds = itaEat.getBounds();
itaEat.addTo(map);









var grayMindIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_mind-body.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorMindIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_mind-body.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureMind(e) {
    var layer = e.target;
    layer.setIcon(colorMindIcon);
}

function resetHighlightMind(e) {
  var layer = e.target;
    layer.setIcon(grayMindIcon);
}

function resetMapMind(e) {
  map.fitBounds(itaMind,{
    padding: [50,50]
  });
}

function onEachFeatureMind(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayMindIcon);
  layer.on({
    mouseover: highlightFeatureMind,
    mouseout: resetHighlightMind,   
    popupclose: resetMapMind 
  });
  // map.on({click: resetHighlightMind});
}

var itaMind = L.geoJson([itaMind], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaMind ita', icon: grayMindIcon});

  },
  onEachFeature: onEachFeatureMind

});
var MindBounds = itaMind.getBounds();
itaMind.addTo(map);






var grayPickIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_pick-grow.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorPickIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_pick-grow.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeaturePick(e) {
    var layer = e.target;
    layer.setIcon(colorPickIcon);
}

function resetHighlightPick(e) {
  var layer = e.target;
    layer.setIcon(grayPickIcon);
}

function resetMapPick(e) {
  map.fitBounds(itaPick,{
    padding: [50,50]
  });
}

function onEachFeaturePick(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayPickIcon);
  layer.on({
    mouseover: highlightFeaturePick,
    mouseout: resetHighlightPick,   
    popupclose: resetMapPick 
  });
  // map.on({click: resetHighlightPick});
}

var itaPick = L.geoJson([itaPick], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaPick ita', icon: grayPickIcon});

  },
  onEachFeature: onEachFeaturePick

});
var PickBounds = itaPick.getBounds();
itaPick.addTo(map);






var graySipIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_sip.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSipIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_sip.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSip(e) {
    var layer = e.target;
    layer.setIcon(colorSipIcon);
}

function resetHighlightSip(e) {
  var layer = e.target;
    layer.setIcon(graySipIcon);
}

function resetMapSip(e) {
  map.fitBounds(itaSip,{
    padding: [50,50]
  });
}

function onEachFeatureSip(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySipIcon);
  layer.on({
    mouseover: highlightFeatureSip,
    mouseout: resetHighlightSip,   
    popupclose: resetMapSip 
  });
  // map.on({click: resetHighlightSip});
}

var itaSip = L.geoJson([itaSip], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSip ita', icon: graySipIcon});

  },
  onEachFeature: onEachFeatureSip

});
var SipBounds = itaSip.getBounds();
itaSip.addTo(map);





var graySkiIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_ski.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSkiIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_ski.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});




function highlightFeatureSki(e) {
    var layer = e.target;
    layer.setIcon(colorSkiIcon);
}

function resetHighlightSki(e) {
  var layer = e.target;
    layer.setIcon(graySkiIcon);
}

function resetMapSki(e) {
  map.fitBounds(itaSki,{
    padding: [50,50]
  });
}

function onEachFeatureSki(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySkiIcon);
  layer.on({
    mouseover: highlightFeatureSki,
    mouseout: resetHighlightSki,   
    popupclose: resetMapSki 
  });
  // map.on({click: resetHighlightSki});
}

var itaSki = L.geoJson([itaSki], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSki ita', icon: graySkiIcon});

  },
  onEachFeature: onEachFeatureSki

});
var SkiBounds = itaSki.getBounds();
itaSki.addTo(map);





var graySwimIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_swim.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSwimIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_swim.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSwim(e) {
    var layer = e.target;
    layer.setIcon(colorSwimIcon);
}

function resetHighlightSwim(e) {
  var layer = e.target;
    layer.setIcon(graySwimIcon);
}

function resetMapSwim(e) {
  map.fitBounds(itaSwim,{
    padding: [50,50]
  });
}

function onEachFeatureSwim(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySwimIcon);
  layer.on({
    mouseover: highlightFeatureSwim,
    mouseout: resetHighlightSwim,   
    popupclose: resetMapSwim 
  });
  // map.on({click: resetHighlightSwim});
}

var itaSwim = L.geoJson([itaSwim], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSwim ita', icon: graySwimIcon});

  },
  onEachFeature: onEachFeatureSwim

});
var SwimBounds = itaSwim.getBounds();
itaSwim.addTo(map);





var graySwingIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_swing.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSwingIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_swing.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSwing(e) {
    var layer = e.target;
    layer.setIcon(colorSwingIcon);
}

function resetHighlightSwing(e) {
  var layer = e.target;
    layer.setIcon(graySwingIcon);
}

function resetMapSwing(e) {
  map.fitBounds(itaSwing,{
    padding: [50,50]
  });
}

function onEachFeatureSwing(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySwingIcon);
  layer.on({
    mouseover: highlightFeatureSwing,
    mouseout: resetHighlightSwing,   
    popupclose: resetMapSwing 
  });
  // map.on({click: resetHighlightSwing});
}

var itaSwing = L.geoJson([itaSwing], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSwing ita', icon: graySwingIcon});

  },
  onEachFeature: onEachFeatureSwing

});
var SwingBounds = itaSwing.getBounds();
itaSwing.addTo(map);






var grayTrailIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_trail.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorTrailIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_trail.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureTrail(e) {
    var layer = e.target;
    layer.setIcon(colorTrailIcon);
}

function resetHighlightTrail(e) {
  var layer = e.target;
    layer.setIcon(grayTrailIcon);
}

function resetMapTrail(e) {
  map.fitBounds(itaTrail,{
    padding: [50,50]
  });
}

function onEachFeatureTrail(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayTrailsIcon);
  layer.on({
    mouseover: highlightFeatureTrail,
    mouseout: resetHighlightTrail,   
    popupclose: resetMapTrail 
  });
  // map.on({click: resetHighlightTrail});
}

var itaTrail = L.geoJson([itaTrail], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaTrail ita', icon: grayTrailIcon});

  },
  onEachFeature: onEachFeatureTrail

});
var TrailBounds = itaTrail.getBounds();
itaTrail.addTo(map);







$('.ita-pane').addClass('active');
$('#all').addClass('active');

$('.markers').click(function(){
  $('.ita-pane').removeClass('active');
  $('.markers').removeClass('active');
  $(this).addClass('active');
  map.closePopup()

});

$( "#all" ).click(function() {
  $('.ita-pane').addClass('active');
  map.setView(new L.LatLng(41.77197384322616, -74.20966662406921), 10)
});



$( "#sleep" ).click(function() {
  $('.leaflet-itaSleep').addClass('active');
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
});

$( "#eat" ).click(function() {
  $('.leaflet-itaEat').addClass('active');
  map.fitBounds(itaEat,{
    padding: [50,50]
  });
});

$( "#sip" ).click(function() {
  $('.leaflet-itaSip').addClass('active');
  map.fitBounds(itaSip,{
    padding: [50,50]
  });
});

$( "#culture" ).click(function() {
  $('.leaflet-itaCulture').addClass('active');
  map.fitBounds(itaCulture,{
    padding: [50,50]
  });
});

$( "#swing" ).click(function() {
  $('.leaflet-itaSwing').addClass('active');
  map.fitBounds(itaSwing,{
    padding: [50,50]
  });
});

$( "#ski" ).click(function() {
  $('.leaflet-itaSki').addClass('active');
  map.fitBounds(itaSki,{
    padding: [50,50]
  });
});

$( "#swim" ).click(function() {
  $('.leaflet-itaSwim').addClass('active');
  map.fitBounds(itaSwim,{
    padding: [50,50]
  });
});

$( "#pick-and-grow" ).click(function() {
  $('.leaflet-itaPick').addClass('active');
  map.fitBounds(itaPick,{
    padding: [50,50]
  });
});

$( "#trails" ).click(function() {
  $('.leaflet-itaTrail').addClass('active');
  map.fitBounds(itaTrail,{
    padding: [50,50]
  });
});

$( "#mind-and-body" ).click(function() {
  $('.leaflet-itaMind').addClass('active');
  map.fitBounds(itaMind,{
    padding: [50,50]
  });
});



}


// Smooth Scroll

$(function() {
  $('a.scroll[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

$(function(){
  $('a.scroll').click(function() {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    });
  });
});




// Generated by CoffeeScript 1.6.2
/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/

(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery', 'waypoints'], factory);
    } else {
      return factory(root.jQuery);
    }
  })(this, function($) {
    var defaults, wrap;

    defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'stuck'
    };
    wrap = function($elements, options) {
      $elements.wrap(options.wrapper);
      return $elements.parent();
    };
    $.waypoints('extendFn', 'sticky', function(opt) {
      var $wrap, options, originalHandler;

      options = $.extend({}, $.fn.waypoint.defaults, defaults, opt);
      $wrap = wrap(this, options);
      originalHandler = options.handler;
      options.handler = function(direction) {
        var $sticky, shouldBeStuck;

        $sticky = $(this).children(':first');
        shouldBeStuck = direction === 'down' || direction === 'right';
        $sticky.toggleClass(options.stuckClass, shouldBeStuck);
        $wrap.height(shouldBeStuck ? $sticky.outerHeight() : '');
        if (originalHandler != null) {
          return originalHandler.call(this, direction);
        }
      };
      $wrap.waypoint(options);
      return this.data('stuckClass', options.stuckClass);
    });
    return $.waypoints('extendFn', 'unsticky', function() {
      this.parent().waypoint('destroy');
      this.unwrap();
      return this.removeClass(this.data('stuckClass'));
    });
  });

}).call(this);

var navbarHeight = $('.navbar').height();

$(window).scroll(function() {
  var navbarColor = "214,212,203";//color attr for rgba
  var navbarTextColor ="#fff";
  var smallLogoHeight = $('.small-logo').height();
  var bigLogoHeight = $('.big-logo').height();


  var smallLogoEndPos = 0;
  var smallSpeed = (smallLogoHeight / bigLogoHeight);

  var ySmall = ($(window).scrollTop() * smallSpeed);

  var smallPadding = navbarHeight - ySmall;
  if (smallPadding > navbarHeight) { smallPadding = navbarHeight; }
  if (smallPadding < smallLogoEndPos) { smallPadding = smallLogoEndPos; }
  if (smallPadding < 0) { smallPadding = 0; }

  $('.small-logo-container ').css({ "padding-top": smallPadding});

  var navOpacity = ySmall / smallLogoHeight;
  if  (navOpacity > 1) { navOpacity = 1; }
  if (navOpacity < 0 ) { navOpacity = 0; }
  var navBackColor = 'rgba(' + navbarColor + ',' + navOpacity + ')';
  $('.navbar').css({"background-color": navBackColor});
  $('.navbar-inverse .navbar-nav > li > a').css({"color": navbarTextColor});

  var shadowOpacity = navOpacity * 0.4;
  if ( ySmall > 1) {
    $('.navbar').css({"box-shadow": "0 2px 3px rgba(0,0,0," + shadowOpacity + ")"});
  } else {
    $('.navbar').css({"box-shadow": "none"});
  }


});

  /**
 * This demo was prepared for you by Petr Tichy - Ihatetomatoes.net
 * Want to see more similar demos and tutorials?
 * Help by spreading the word about Ihatetomatoes blog.
 * Facebook - https://www.facebook.com/ihatetomatoesblog
 * Twitter - https://twitter.com/ihatetomatoes
 * Google+ - https://plus.google.com/u/0/109859280204979591787/about
 * Article URL: http://ihatetomatoes.net/simple-parallax-scrolling-tutorial/
 */

// ( function( $ ) {

//   // Setup variables
//   $window = $(window);
//   $slide = $('.homeSlide');
//   $body = $('body');

//     //FadeIn all sections
//   $body.imagesLoaded( function() {
//     setTimeout(function() {

//           // Resize sections
//           adjustWindow();

//           // Fade in sections
//         $body.removeClass('loading').addClass('loaded');

//     }, 800);
//   });

//   function adjustWindow(){

//     // Init Skrollr

//     var s = skrollr.init({
//     forceHeight: false
//     });


//     // Refresh Skrollr after resizing our sections
//     s.refresh($('.homeSlide'));

//     // Get window size
//       winH = $window.height();

//       // Keep minimum height 550
//       if(winH <= 550) {
//       winH = 550;
//     }

//       // Resize our slides
//       // $slide.height(winH);

//       // Refresh Skrollr after resizing our sections
//       s.refresh($('.homeSlide'));

//   }

// } )( jQuery );


$('.sticky-wrapper-primary').waypoint(function() {
  $(this).find('.navbar').toggleClass('stuck');
}, { offset: -80 });

// $('.sticky-wrapper-secondary').waypoint(function() {
//   $(this).find('#secondary-nav').toggleClass('stuck');
// }, { offset: 80 });

$(document).ready(function() {
    $('#secondary-nav').waypoint('sticky', {
    offset: 80 // Apply "stuck" when element 30px from top
  });
});




$('body').scrollspy({ target: '#secondary-nav-list', offset:1});

// Upgrades content filtering

$('#upgrades-nav #all').click(function(event){
    $('.all').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #house').click(function(event){
    $('.all').hide(200);
    $('.house').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #site').click(function(event){
    $('.all').hide(200);
    $('.site').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #land').click(function(event){
    $('.all').hide(200);
    $('.land').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #equipment').click(function(event){
    $('.all').hide(200);
    $('.equipment').show(200);
    event.preventDefault();
    return false;
});

// Upgrades slideshow code

//randomize landing page slideshow
$("#slideshow .slideshow-image").sort(function(){
    return Math.random()*10 > 5 ? 1 : -1;
}).each(function(){
    var $t = $(this),
        color = $t.attr("class");
    $t.css({}).appendTo( $t.parent() );
});

// slideshow code
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(2000)
    .next()
    .fadeIn(2000)
    .end()
    .appendTo('#slideshow');
},  3500);

// Slick Carousel Initializer 

$('.slick-carousel-upgrades').slick({
  dots: false,
  arrows: false,
  infinite: true,
  speed: 2000,
  autoplaySpeed: 1000,
  fade: true,
  autoplay: true
});

$('.slick-carousel-landing').slick({
  dots: true,
  arrows: false,
  infinite: true,
  speed: 2000,
  autoplaySpeed: 1000,
  fade: true,
  autoplay: true
});

// Activate Upgrades Bootstrap Tabs
$('#upgrades-nav li a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

// Activate Availability Lot Tabs
$('.map-mobile-container li a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

// Update dropdown values on click

$(document).on('click','.dropdown ul a',function(){
    var text = $(this).text();
    $(this).closest('.dropdown').children('a.dropdown-toggle').text(text).append("<i class='fa fa-chevron-down'></i>");
});

$('.map-mobile-content .tab-pane:first').addClass('in active');

// Initialize fitvids (100% width video embeds)
$(document).ready(function(){
  // Target your .container, .wrapper, .post, etc.
  $(".video").fitVids();
});

// upgrades scroll position hack

$('.upgrades-scroll').click(function () {
    $('html,body').animate({
        scrollTop: $("#upgrades-anchor").offset().top
    }, 800);
});

$('#upgrades').css({'min-height':(($(window).height())-254)+'px'});

$('#map').css({'height':(($(window).height())-254)+'px'});

if ($('#instafeed').length) {
var feed = new Instafeed({
    get: 'user',
    clientId: 'f61fb2669e734e2da2587b457f0afe57',
    accessToken: '501656935.f61fb26.c99de54c939c432bb20f5dd282ef4e33',
    userId: 501656935,
    resolution: 'standard_resolution',
    template: '<div class="instagram-wrapper"><div class="flipcard"><a target=_blank href="{{link}}"><div class="front"><img src="{{image}}" /></div><div class="back"><p>{{caption}}</p></div></a></div></div>',
    limit: 15
      });
feed.run();
}


$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})


var disqus_shortname = 'hudsonwoodsny'; // required: replace example with your forum shortname

/* * * DON'T EDIT BELOW THIS LINE * * */
(function () {
var s = document.createElement('script'); s.async = true;
s.type = 'text/javascript';
s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());

// Google Analytics Code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46418002-1', 'auto');
ga('send', 'pageview');


$('#contact-submit').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SubmitForm'});
});

$('#sales-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SalesContact'});
});

$('#media-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'PressContact'});
});




