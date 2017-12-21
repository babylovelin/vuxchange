const {
  findClosest,
  getWidth,
  percentage
} = require('./utils')
const classes = require('./lib/classes')
const mouse = require('./lib/mouse')
const events = require('./lib/events')

function Horizontal(element, options) {
  this.element = element
  this.options = options || {}
  this.slider = this.create('span', 'range-bar')
  this.hasAppend = false

  if (this.element !== null && this.element.type === 'text') this.init()
  if (this.options.step) {
    this.step(this.slider.offsetWidth || this.options.initialBarWidth, getWidth(this.handle))
  }
  this.setStart(this.options.start)
}

Horizontal.prototype.setStart = function(start) {
  var begin = (start === null) ? this.options.min : start
  var part = percentage.from(begin - this.options.min, this.options.max - this.options.min) || 0
  var offset = percentage.of(part, this.slider.offsetWidth - this.handle.offsetWidth)
  var position = (this.options.step) ? findClosest(offset, this.steps) : offset

  this.setPosition(position)
  this.setValue(this.handle.style.left, this.slider.offsetWidth - this.handle.offsetWidth)
}

Horizontal.prototype.setStep = function() {
  this.step(getWidth(this.slider) || this.options.initialBarWidth, getWidth(this.handle))
}

Horizontal.prototype.setPosition = function(val) {
  this.handle.style.left = val + 'px'
  // console.log(val);
  this.slider.querySelector('.range-quantity').style.width = val + 20 + 'px'
  if (val > 0) {
    document.getElementById("first").style.background = '#ff6000'
    document.getElementById("first").style.display = 'block'
  } else {
    document.getElementById("first").style.display = 'none'
  }
  if (val > 75) {
    document.getElementById("second").style.background = '#ff6000'
  } else {
    document.getElementById("second").style.background = '#a9acb1'
  }
  if (val > 150) {
    document.getElementById("third").style.background = '#ff6000'
  } else {
    document.getElementById("third").style.background = '#a9acb1'
  }
  if (val > 220) {
    document.getElementById("fourth").style.background = '#ff6000'
  } else {
    document.getElementById("fourth").style.background = '#a9acb1'
  }
  if (val > 250) {
    document.getElementById("fifth").style.background = 'transparent'
  } else {
    document.getElementById("fifth").style.background = '#a9acb1'
  }
  document.getElementById("percent").style.left = val - 10 + 'px'
  document.getElementById("midcircle").style.left = val + 15 + 'px'
}

Horizontal.prototype.onmousedown = function(e) {
  if (e.touches) e = e.touches[0]
  this.startX = e.clientX
  this.handleOffsetX = this.handle.offsetLeft
  this.restrictHandleX = this.slider.offsetWidth - this.handle.offsetWidth
  // console.log(this.restrictHandleX + "22222222222222");
  this.unselectable(this.slider, true)
}

Horizontal.prototype.changeEvent = function(state) {
  if (typeof Event === 'function' || !document.fireEvent) {
    var event = document.createEvent('HTMLEvents')
    event.initEvent('change', false, true)
    this.element.dispatchEvent(event)
  } else {
    this.element.fireEvent('onchange')
  }
}

Horizontal.prototype.onmousemove = function(e) {
  e.preventDefault()
  if (e.touches) e = e.touches[0]

  var leftOffset = this.handleOffsetX + e.clientX - this.startX
  var position = (this.steps) ? findClosest(leftOffset, this.steps) : leftOffset

  if (leftOffset <= 0) {
    this.setPosition(0)
  } else if (leftOffset >= this.restrictHandleX) {
    this.setPosition(this.restrictHandleX)
  } else {
    this.setPosition(position)
  }
  this.setValue(this.handle.style.left, this.slider.offsetWidth - this.handle.offsetWidth)
}

Horizontal.prototype.unselectable = function(element, set) {
  if (!classes(this.slider).has('unselectable') && set === true) {
    classes(this.slider).add('unselectable')
  } else {
    classes(this.slider).remove('unselectable')
  }
}

Horizontal.prototype.onmouseup = function(e) {
  this.unselectable(this.slider, false)
}

Horizontal.prototype.disable = function(force) {
  if (this.options.disable || force) {
    this.mouse.unbind()
    this.touch.unbind()
  }
  if (this.options.disable) {
    if (this.options.disableOpacity) {
      this.slider.style.opacity = this.options.disableOpacity
    }
    classes(this.slider).add('range-bar-disabled')
  }
}

Horizontal.prototype.init = function() {
  this.hide()
  this.append()
  this.bindEvents()
  this.checkValues(this.options.start)
  this.setRange(this.options.min, this.options.max)
  this.disable()
}

Horizontal.prototype.reInit = function(opts) {
  this.options.start = opts.value
  this.options.min = opts.min
  this.options.max = opts.max
  this.options.step = opts.step
  this.disable(true)
  this.init()
}

Horizontal.prototype.checkStep = function(value) {
  if (value < 0) value = Math.abs(value)
  this.options.step = value
  return this.options.step
}

Horizontal.prototype.setValue = function(offset, size) {
  var part = percentage.from(parseFloat(offset), size)
  if (offset === '0px' || size === 0) {
    value = this.options.min
    // value = 5
  } else {
    var value = percentage.of(part, this.options.max - this.options.min) + this.options.min
    value = (this.options.decimal) ? (Math.round(value * 100) / 100) : Math.round(value)

    if (value > this.options.max) {
      value = this.options.max
    }
  }

  var changed = false

  changed = this.element.value !== value

  this.element.value = value
  this.options.callback(value)
  if (changed) this.changeEvent()
}

Horizontal.prototype.checkValues = function(start) {
  if (start < this.options.min) this.options.start = this.options.min
  if (start > this.options.max) this.options.start = this.options.max
  if (this.options.min >= this.options.max) this.options.min = this.options.max
}

Horizontal.prototype.step = function(sliderSize, handleSize) {
  var dimension = sliderSize - handleSize
  var part = percentage.from(this.checkStep(this.options.step), this.options.max - this.options.min)
  var interval = percentage.of(part, dimension)
  var steps = []
  for (let i = 0; i <= dimension; i += interval) {
    steps.push(i)
  }

  this.steps = steps
  for (let i = 10; i >= 0; i--) {
    this.steps[steps.length - i] = dimension - interval * i
  }

  return this.steps
}

Horizontal.prototype.create = function(type, name) {
  var elem = document.createElement(type)
  elem.className = name

  return elem
}

Horizontal.prototype.insertAfter = function(reference, target) {
  reference.parentNode.insertBefore(target, reference.nextSibling)
}

Horizontal.prototype.setRange = function(min, max) {
  if (typeof min === 'number' && typeof max === 'number' && !this.options.hideRange) {
    // this.slider.querySelector('.range-min').innerHTML = this.options.minHTML || min
    // this.slider.querySelector('.range-max').innerHTML = this.options.maxHTML || max
  }
}

Horizontal.prototype.generate = function() {
  var elems = {
    'handle': {
      'type': 'span',
      'selector': 'range-handle'
    },
    'min': {
      'type': 'span',
      'selector': 'range-min'
    },
    'max': {
      'type': 'span',
      'selector': 'range-max'
    },
    'quantity': {
      'type': 'span',
      'selector': 'range-quantity'
    }
  }

  for (var key in elems) {
    if (elems.hasOwnProperty(key)) {
      var temp = this.create(elems[key].type, elems[key].selector)
      this.slider.appendChild(temp)
    }
  }

  return this.slider
}

Horizontal.prototype.append = function() {
  if (!this.hasAppend) {
    var slider = this.generate()
    this.insertAfter(this.element, slider)
  }
  this.hasAppend = true
}

Horizontal.prototype.hide = function() {
  this.element.style.display = 'none'
}

Horizontal.prototype.bindEvents = function() {
  this.handle = this.slider.querySelector('.range-handle')
  this.touch = events(this.handle, this)
  this.touch.bind('touchstart', 'onmousedown')
  this.touch.bind('touchmove', 'onmousemove')
  this.touch.bind('touchend', 'onmouseup')
  this.mouse = mouse(this.handle, this)
  this.mouse.bind()
}

var defaults = {
  callback() {},
  decimal: false,
  disable: false,
  disableOpacity: null,
  hideRange: false,
  min: 0,
  max: 100,
  start: null,
  step: null,
  vertical: false
}

export default function(element, options) {
  options = options || {}

  for (let i in defaults) {
    if (options[i] == null) {
      options[i] = defaults[i]
    }
  }

  return new Horizontal(element, options)
}