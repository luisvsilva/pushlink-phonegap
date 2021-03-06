/* PushLink JavaScript interface
 * @module PushLink
 * @see module:PushLink
 */

var cordovaExec = function(action, successCallback, errorCallback, arg) {
  'use strict';
  var args = (arg != null) ? [arg] : [];
  cordova.exec(successCallback, errorCallback, 'com.pushlink.cordova.PushLinkPlugin', action, args);
};

var pushLinkOnResumeCallback = function() {
  'use strict';
  cordovaExec('setCurrentActivity');
};

/**
 * The PushLink object
 * @constructor
 * @exports PushLink
 */
var PushLink = function() {
  'use strict';
  /** The NINJA strategy
   * @see module:PushLink#setCurrentStrategy
   */
  this.NINJA = 'NINJA';

  /** The STATUS_BAR strategy
   * @see module:PushLink#setCurrentStrategy
   */
  this.STATUS_BAR = 'STATUS_BAR';

  /** The ANNOYING_POPUP strategy
   * @see module:PushLink#setCurrentStrategy
   */
  this.ANNOYING_POPUP = 'ANNOYING_POPUP';

  /** The FRIENDLY_POPUP strategy
   * @see module:PushLink#setCurrentStrategy
   */
  this.FRIENDLY_POPUP = 'FRIENDLY_POPUP';
};

/**
 * Starts PushLink connection
 * @param {string} packageName - The package name for the app (optional)
 * @param {string} apiKey - Your PushLink API key
 * @param {string} deviceId - The device id
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.start = function(packageName,apiKey, deviceId, successCallback, errorCallback) {
  'use strict';

  if (!errorCallback){
    
    //then we are not passing package name
    cordovaExec('start', deviceId, successCallback, {
      apiKey: packageName,
      deviceId: apiKey
    });
    return this;
  }

  console.warn("calling start with packageName parameter is deprecated, check documentation");
  cordovaExec('start', successCallback, errorCallback, {
      packageName: packageName,
      apiKey: apiKey,
      deviceId: deviceId
    });
    return this;
};

/**
 * This method adds information about the application to identify users, apps, devices, etc.
 * This information is going to appear ONLY in the 'Exceptions' tab of the web administration
 * @param {string} key - The metadata label
 * @param {string} value - The metadata value
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.addExceptionMetadata = function(key, value, successCallback, errorCallback) {
  'use strict';
  cordovaExec('addExceptionMetadata', successCallback, errorCallback, {key: key, value: value});
  return this;
};

/**
 * This method adds information about the application to identify users, apps, devices, etc.
 * This information is going to appear in two palces: 'Installations' and 'Exceptions' tabs of the web administration
 * @param {string} key - The metadata label
 * @param {string} value - The metadata value
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.addMetadata = function(key, value, successCallback, errorCallback) {
  'use strict';
  cordovaExec('addMetadata', successCallback, errorCallback, {key: key, value: value});
  return this;
};

/**
 * Enable automatic catch/send exception.
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.enableExceptionNotification = function(successCallback, errorCallback) {
  'use strict';
  cordovaExec('enableExceptionNotification', successCallback, errorCallback);
  return this;
};

/**
 * Disable automatic catch/send exception. You can still send exceptions manually.
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.disableExceptionNotification = function(successCallback, errorCallback) {
  'use strict';
  cordovaExec('disableExceptionNotification', successCallback, errorCallback);
  return this;
};

/**
 * This method sets the current notification strategy.
 * @param {string} strategy - the strategy name. Valid values are PushLink.STATUS_BAR, PushLink.FRIENDLY_POPUP, PushLink.ANNOYING_POPUP or PushLink.NINJA
 * @param {object} properties - the properties for the current strategy **TODO describe the objects**
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 * @see {@link https://www.push-link.com/javadoc/javadoc510/com/pushlink/android/AnnoyingPopUpStrategy.html|ANNOYING_POPUP} strategy properties
 * @see {@link https://www.push-link.com/javadoc/javadoc510/com/pushlink/android/FriendlyPopUpStrategy.html|FRIENDLY_POPUP} strategy properties
 * @see {@link https://www.push-link.com/javadoc/javadoc510/com/pushlink/android/StatusBarStrategy.html|STATUS_BAR} strategy properties
 * @see NINJA pop-up has no properties to be set.
 */
PushLink.prototype.setCurrentStrategy = function(strategy, properties, successCallback, errorCallback) {
  'use strict';

  if (typeof properties === 'function') {
    errorCallback = successCallback;
    successCallback = properties;
    properties = {};
  } else if (typeof properties !== 'object') {
    properties = {};
  }

  if (strategy === PushLink.ANNOYING_POPUP || strategy === PushLink.FRIENDLY_POPUP) {
    document.addEventListener('resume', pushLinkOnResumeCallback, false);
  } else {
    document.removeEventListener('resume', pushLinkOnResumeCallback, false);
  }

  cordovaExec('setCurrentStrategy', successCallback, errorCallback, {strategy: strategy, properties: properties});

  return this;
};

/**
 * This method returns StatusBarStrategy or FriendlyPopUpStrategy or AnnoyingPopUpStrategy or NinjaStrategy objects.
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.getCurrentStrategy = function(successCallback, errorCallback) {
  'use strict';

  cordovaExec('getCurrentStrategy', successCallback, errorCallback);
  return this;
};

/**
 * This method checks if there is a downloaded but not applied update. It also notify the user again. It is useful for 'Check for updates' button.
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.hasPendingUpdate = function(successCallback, errorCallback) {
  'use strict';

  cordovaExec('hasPendingUpdate', successCallback, errorCallback);
  return this;
};

/**
 * Especially useful for NINJA strategy.
 * In order to update your app only when it is idle:
 *
 * 1 - Call PushLink.idle(false) before PushLink.start()
 * 2 - Call PushLink.idle(true) when your app become idle
 * 3 - Call PushLink.idle(false) when your app is back to the action again
 *
 * When idle == false it disables all strategies
 *
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.idle = function(isIdle, successCallback, errorCallback) {
  'use strict';

  cordovaExec('idle', successCallback, errorCallback, {idle: isIdle});
  return this;
};

/**
 * Returns the current PushLink client version
 * @param {function} successCallback - A function to be called if the command succeeded
 * @param {function} errorCallback - A function to be called if the command failed
 */
PushLink.prototype.getVersion = function(successCallback, errorCallback) {
  'use strict';

  cordovaExec('version', successCallback, errorCallback);
  return this;
};

module.exports = new PushLink();
