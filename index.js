(function yuiLoader() {
  function ensureEnvironmentReady() {
    return new Promise(function(resolve, reject) {
      if (!window.GlobalYUISandbox) {
        System.import(System.YUI_CONFIG_LOCATION)
          .then(function(YUIConfig) {
            window.GlobalYUISandbox = window.YUI(YUIConfig);
            resolve(window.GlobalYUISandbox);
          })
          .catch(function(err) {
            reject(err);
          });
      } else {
        resolve(window.GlobalYUISandbox);
      }
    });
  }
  /**
   * Locate function transforms the fullpath to the module
   * (http://<serverurl>/<modulename>) to a format the YUI loader understands.
   *
   * @param {*} load
   */
  exports.locate = function(load) {
    var shortName = load.address.split(System.baseURL)[1];
    return shortName;
  };

  /**
   * Fetch uses the YUI Loader to combo load the module and its YUI dependencies
   * @param {*} load
   */
  exports.fetch = function(load) {
    return ensureEnvironmentReady().then(function(YUISandbox) {
      // we use this promise to correctly wait for YUI async stuff
      return new Promise(function(resolve) {
        YUISandbox.use(load.address, function(Y) {
          resolve("");
        });
      });
    });
  };

  /**
   * We add the already fetched YUI module to the registry of CJS module.
   * @param {*} load
   */
  exports.instantiate = function(load) {
    return new Promise(function(resolve, reject) {
      var cjsModule = System.get(load.address);
      if (!cjsModule) {
        window.GlobalYUISandbox.use(load.address, function(Y) {
          // not sure how else we can get component config in to this load function
          var namespacedExport = System[load.address + "_config"].export;
          // because this is YUI, often the export will be Y.A.B.ClassName -> We want to export ClassName
          var exportsAsArray = namespacedExport.split(".");
          var myExport = Y;
          while (exportsAsArray.length) {
            myExport = myExport[exportsAsArray.shift()];
          }
          cjsModule = System.newModule(myExport);
          System.set(load.address, cjsModule);
          resolve(cjsModule);
        });
      } else {
        resolve(cjsModule);
      }
    });
  };
})();
