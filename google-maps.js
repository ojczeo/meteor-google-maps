import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const supportedTypes = ['Map', 'StreetViewPanorama'];

const once = (func) => {
  let memo;
  let times = 2;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
};

GoogleMaps = {
  load: once((opts) => {
    const options = Object.assign({}, { v: '3.exp' }, opts);
    const params = Object.keys(options)
      .forEach((key) => {
        const value = options[key];
        return `${key}=${value}`;
      })
      .join('&');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?${params}&callback=GoogleMaps.initialize`;

    document.body.appendChild(script);
  }),
  utilityLibraries: [],
  loadUtilityLibrary(path) {
    this.utilityLibraries.push(path);
  },
  _loaded: new ReactiveVar(false),
  loaded() {
    return this._loaded.get();
  },
  maps: {},
  _callbacks: {},
  initialize() {
    this._loaded.set(true);
    this.utilityLibraries.forEach((path) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = path;

      document.body.appendChild(script);
    });
  },
  _ready(name, map) {
    this._callbacks[name].forEach((cb) => {
      if (typeof cb === 'function') {
        cb(map);
      }
    });
  },
  ready(name, cb) {
    if (!this._callbacks[name]) {
      this._callbacks[name] = [];
    }
    // make sure we run the callback only once
    // as the tilesloaded event will also run after initial load
    this._callbacks[name].push(once(cb));
  },
  // options: function(options) {
  //   var self = this;
  //   return function() {
  //     if (self.loaded())
  //       return options();
  //   };
  // },
  get(name) {
    return this.maps[name];
  },
  _create(name, options) {
    const self = this;
    self.maps[name] = {
      instance: options.instance,
      options: options.options,
    };

    if (options.type === 'StreetViewPanorama') {
      options.instance.setVisible(true);
      self._ready(name, self.maps[name]);
    } else {
      google.maps.event.addListener(options.instance, 'tilesloaded', () => {
        self._ready(name, self.maps[name]);
      });
    }
  },
  create(options) {
    // default to Map
    const type = options.type ? options.type : 'Map';
    if (supportedTypes.indexOf(type) < 0) {
      throw new Meteor.Error(`GoogleMaps - Invalid type argument: ${type}`);
    }

    this._create(options.name, {
      type,
      instance: new google.maps[type](options.element, options.options),
      options: options.options,
    });
  },
};
