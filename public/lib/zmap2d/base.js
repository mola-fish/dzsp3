var COMPILED=!1,goog=goog||{};goog.global=this,goog.global.CLOSURE_UNCOMPILED_DEFINES,goog.global.CLOSURE_DEFINES,goog.isDef=function(o){return void 0!==o},goog.exportPath_=function(o,e,g){var t,r=o.split("."),n=g||goog.global;!(r[0]in n)&&n.execScript&&n.execScript("var "+r[0]);for(;r.length&&(t=r.shift());)!r.length&&goog.isDef(e)?n[t]=e:n=n[t]?n[t]:n[t]={}},goog.define=function(o,e){var g=e;COMPILED||(goog.global.CLOSURE_UNCOMPILED_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES,o)?g=goog.global.CLOSURE_UNCOMPILED_DEFINES[o]:goog.global.CLOSURE_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES,o)&&(g=goog.global.CLOSURE_DEFINES[o])),goog.exportPath_(o,g)},goog.DEBUG=!0,goog.define("goog.LOCALE","en"),goog.define("goog.TRUSTED_SITE",!0),goog.define("goog.STRICT_MODE_COMPATIBLE",!1),goog.define("goog.DISALLOW_TEST_ONLY_CODE",COMPILED&&!goog.DEBUG),goog.provide=function(o){if(!COMPILED&&goog.isProvided_(o))throw Error('Namespace "'+o+'" already declared.');goog.constructNamespace_(o)},goog.constructNamespace_=function(o,e){if(!COMPILED){delete goog.implicitNamespaces_[o];for(var g=o;(g=g.substring(0,g.lastIndexOf(".")))&&!goog.getObjectByName(g);)goog.implicitNamespaces_[g]=!0}goog.exportPath_(o,e)},goog.VALID_MODULE_RE_=/^[a-zA-Z_$][a-zA-Z0-9._$]*$/,goog.module=function(o){if(!goog.isString(o)||!o||-1==o.search(goog.VALID_MODULE_RE_))throw Error("Invalid module identifier");if(!goog.isInModuleLoader_())throw Error("Module "+o+" has been loaded incorrectly.");if(goog.moduleLoaderState_.moduleName)throw Error("goog.module may only be called once per module.");if(goog.moduleLoaderState_.moduleName=o,!COMPILED){if(goog.isProvided_(o))throw Error('Namespace "'+o+'" already declared.');delete goog.implicitNamespaces_[o]}},goog.module.get=function(o){return goog.module.getInternal_(o)},goog.module.getInternal_=function(o){if(!COMPILED)return goog.isProvided_(o)?o in goog.loadedModules_?goog.loadedModules_[o]:goog.getObjectByName(o):null},goog.moduleLoaderState_=null,goog.isInModuleLoader_=function(){return null!=goog.moduleLoaderState_},goog.module.declareTestMethods=function(){if(!goog.isInModuleLoader_())throw new Error("goog.module.declareTestMethods must be called from within a goog.module");goog.moduleLoaderState_.declareTestMethods=!0},goog.module.declareLegacyNamespace=function(){if(!COMPILED&&!goog.isInModuleLoader_())throw new Error("goog.module.declareLegacyNamespace must be called from within a goog.module");if(!COMPILED&&!goog.moduleLoaderState_.moduleName)throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");goog.moduleLoaderState_.declareLegacyNamespace=!0},goog.setTestOnly=function(o){if(goog.DISALLOW_TEST_ONLY_CODE)throw o=o||"",Error("Importing test-only code into non-debug environment"+(o?": "+o:"."))},goog.forwardDeclare=function(o){},COMPILED||(goog.isProvided_=function(o){return o in goog.loadedModules_||!goog.implicitNamespaces_[o]&&goog.isDefAndNotNull(goog.getObjectByName(o))},goog.implicitNamespaces_={"goog.module":!0}),goog.getObjectByName=function(o,e){for(var g,t=o.split("."),r=e||goog.global;g=t.shift();){if(!goog.isDefAndNotNull(r[g]))return null;r=r[g]}return r},goog.globalize=function(o,e){var g=e||goog.global;for(var t in o)g[t]=o[t]},goog.addDependency=function(o,e,g,t){if(goog.DEPENDENCIES_ENABLED){for(var r,n,a=o.replace(/\\/g,"/"),i=goog.dependencies_,l=0;r=e[l];l++)i.nameToPath[r]=a,i.pathIsModule[a]=!!t;for(var s=0;n=g[s];s++)a in i.requires||(i.requires[a]={}),i.requires[a][n]=!0}},goog.define("goog.ENABLE_DEBUG_LOADER",!0),goog.logToConsole_=function(o){goog.global.console&&goog.global.console.error(o)},goog.require=function(o){if(!COMPILED){if(goog.ENABLE_DEBUG_LOADER&&goog.IS_OLD_IE_&&goog.maybeProcessDeferredDep_(o),goog.isProvided_(o))return goog.isInModuleLoader_()?goog.module.getInternal_(o):null;if(goog.ENABLE_DEBUG_LOADER){var e=goog.getPathFromDeps_(o);if(e)return goog.included_[e]=!0,goog.writeScripts_(),null}var g="goog.require could not find: "+o;throw goog.logToConsole_(g),Error(g)}},goog.basePath="",goog.global.CLOSURE_BASE_PATH,goog.global.CLOSURE_NO_DEPS,goog.global.CLOSURE_IMPORT_SCRIPT,goog.nullFunction=function(){},goog.identityFunction=function(o,e){return o},goog.abstractMethod=function(){throw Error("unimplemented abstract method")},goog.addSingletonGetter=function(o){o.getInstance=function(){return o.instance_?o.instance_:(goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=o),o.instance_=new o)}},goog.instantiatedSingletons_=[],goog.define("goog.LOAD_MODULE_USING_EVAL",!0),goog.define("goog.SEAL_MODULE_EXPORTS",goog.DEBUG),goog.loadedModules_={},goog.DEPENDENCIES_ENABLED=!COMPILED&&goog.ENABLE_DEBUG_LOADER,goog.DEPENDENCIES_ENABLED&&(goog.included_={},goog.dependencies_={pathIsModule:{},nameToPath:{},requires:{},visited:{},written:{},deferred:{}},goog.inHtmlDocument_=function(){var o=goog.global.document;return void 0!==o&&"write"in o},goog.findBasePath_=function(){if(goog.global.CLOSURE_BASE_PATH)goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var o=goog.global.document.getElementsByTagName("script"),e=o.length-1;e>=0;--e){var g=o[e].src,t=g.lastIndexOf("?"),r=-1==t?g.length:t;if("base.js"==g.substr(r-7,7))return void(goog.basePath=g.substr(0,r-7))}},goog.importScript_=function(o,e){(goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_)(o,e)&&(goog.dependencies_.written[o]=!0)},goog.IS_OLD_IE_=goog.global.document&&goog.global.document.all&&!goog.global.atob,goog.importModule_=function(o){var e='goog.retrieveAndExecModule_("'+o+'");';goog.importScript_("",e)&&(goog.dependencies_.written[o]=!0)},goog.queuedModules_=[],goog.wrapModule_=function(o,e){return goog.LOAD_MODULE_USING_EVAL&&goog.isDef(goog.global.JSON)?"goog.loadModule("+goog.global.JSON.stringify(e+"\n//# sourceURL="+o+"\n")+");":'goog.loadModule(function(exports) {"use strict";'+e+"\n;return exports});\n//# sourceURL="+o+"\n"},goog.loadQueuedModules_=function(){var o=goog.queuedModules_.length;if(o>0){var e=goog.queuedModules_;goog.queuedModules_=[];for(var g=0;g<o;g++){var t=e[g];goog.maybeProcessDeferredPath_(t)}}},goog.maybeProcessDeferredDep_=function(o){if(goog.isDeferredModule_(o)&&goog.allDepsAreAvailable_(o)){var e=goog.getPathFromDeps_(o);goog.maybeProcessDeferredPath_(goog.basePath+e)}},goog.isDeferredModule_=function(o){var e=goog.getPathFromDeps_(o);return!(!e||!goog.dependencies_.pathIsModule[e])&&goog.basePath+e in goog.dependencies_.deferred},goog.allDepsAreAvailable_=function(o){var e=goog.getPathFromDeps_(o);if(e&&e in goog.dependencies_.requires)for(var g in goog.dependencies_.requires[e])if(!goog.isProvided_(g)&&!goog.isDeferredModule_(g))return!1;return!0},goog.maybeProcessDeferredPath_=function(o){if(o in goog.dependencies_.deferred){var e=goog.dependencies_.deferred[o];delete goog.dependencies_.deferred[o],goog.globalEval(e)}},goog.loadModule=function(o){var e=goog.moduleLoaderState_;try{var g;if(goog.moduleLoaderState_={moduleName:void 0,declareTestMethods:!1},goog.isFunction(o))g=o.call(goog.global,{});else{if(!goog.isString(o))throw Error("Invalid module definition");g=goog.loadModuleFromSource_.call(goog.global,o)}var t=goog.moduleLoaderState_.moduleName;if(!goog.isString(t)||!t)throw Error('Invalid module name "'+t+'"');if(goog.moduleLoaderState_.declareLegacyNamespace?goog.constructNamespace_(t,g):goog.SEAL_MODULE_EXPORTS&&Object.seal&&Object.seal(g),goog.loadedModules_[t]=g,goog.moduleLoaderState_.declareTestMethods)for(var r in g)0!==r.indexOf("test",0)&&"tearDown"!=r&&"setUp"!=r&&"setUpPage"!=r&&"tearDownPage"!=r||(goog.global[r]=g[r])}finally{goog.moduleLoaderState_=e}},goog.loadModuleFromSource_=function(source){"use strict";var exports={};return eval(arguments[0]),exports},goog.writeScriptTag_=function(o,e){if(goog.inHtmlDocument_()){var g=goog.global.document;if("complete"==g.readyState){if(/\bdeps.js$/.test(o))return!1;throw Error('Cannot write "'+o+'" after document load')}var t=goog.IS_OLD_IE_;if(void 0===e)if(t){var r=" onreadystatechange='goog.onScriptLoad_(this, "+ ++goog.lastNonModuleScriptIndex_+")' ";g.write('<script type="text/javascript" src="'+o+'"'+r+"><\/script>")}else g.write('<script type="text/javascript" src="'+o+'"><\/script>');else g.write('<script type="text/javascript">'+e+"<\/script>");return!0}return!1},goog.lastNonModuleScriptIndex_=0,goog.onScriptLoad_=function(o,e){return"complete"==o.readyState&&goog.lastNonModuleScriptIndex_==e&&goog.loadQueuedModules_(),!0},goog.writeScripts_=function(){var o=[],e={},g=goog.dependencies_;function t(r){if(!(r in g.written))if(r in g.visited)r in e||(e[r]=!0,o.push(r));else{if(g.visited[r]=!0,r in g.requires)for(var n in g.requires[r])if(!goog.isProvided_(n)){if(!(n in g.nameToPath))throw Error("Undefined nameToPath for "+n);t(g.nameToPath[n])}r in e||(e[r]=!0,o.push(r))}}for(var r in goog.included_)g.written[r]||t(r);for(var n=0;n<o.length;n++){r=o[n];goog.dependencies_.written[r]=!0}var a=goog.moduleLoaderState_;goog.moduleLoaderState_=null;for(n=0;n<o.length;n++){if(!(r=o[n]))throw goog.moduleLoaderState_=a,Error("Undefined script input");g.pathIsModule[r]?(!0,goog.importModule_(goog.basePath+r)):goog.importScript_(goog.basePath+r)}goog.moduleLoaderState_=a},goog.getPathFromDeps_=function(o){return o in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[o]:null},goog.findBasePath_(),goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js")),goog.normalizePath_=function(o){for(var e=o.split("/"),g=0;g<e.length;)"."==e[g]?e.splice(g,1):g&&".."==e[g]&&e[g-1]&&".."!=e[g-1]?e.splice(--g,2):g++;return e.join("/")},goog.retrieveAndExecModule_=function(o){if(!COMPILED){var e=o;o=goog.normalizePath_(o);var g=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_,t=null,r=new goog.global.XMLHttpRequest;if(r.onload=function(){t=this.responseText},r.open("get",o,!1),r.send(),null==(t=r.responseText))throw new Error("load of "+o+"failed");var n=goog.wrapModule_(o,t);goog.IS_OLD_IE_?(goog.dependencies_.deferred[e]=n,goog.queuedModules_.push(e)):g(o,n)}},goog.typeOf=function(o){var e=typeof o;if("object"==e){if(!o)return"null";if(o instanceof Array)return"array";if(o instanceof Object)return e;var g=Object.prototype.toString.call(o);if("[object Window]"==g)return"object";if("[object Array]"==g||"number"==typeof o.length&&void 0!==o.splice&&void 0!==o.propertyIsEnumerable&&!o.propertyIsEnumerable("splice"))return"array";if("[object Function]"==g||void 0!==o.call&&void 0!==o.propertyIsEnumerable&&!o.propertyIsEnumerable("call"))return"function"}else if("function"==e&&void 0===o.call)return"object";return e},goog.isNull=function(o){return null===o},goog.isDefAndNotNull=function(o){return null!=o},goog.isArray=function(o){return"array"==goog.typeOf(o)},goog.isArrayLike=function(o){var e=goog.typeOf(o);return"array"==e||"object"==e&&"number"==typeof o.length},goog.isDateLike=function(o){return goog.isObject(o)&&"function"==typeof o.getFullYear},goog.isString=function(o){return"string"==typeof o},goog.isBoolean=function(o){return"boolean"==typeof o},goog.isNumber=function(o){return"number"==typeof o},goog.isFunction=function(o){return"function"==goog.typeOf(o)},goog.isObject=function(o){var e=typeof o;return"object"==e&&null!=o||"function"==e},goog.getUid=function(o){return o[goog.UID_PROPERTY_]||(o[goog.UID_PROPERTY_]=++goog.uidCounter_)},goog.hasUid=function(o){return!!o[goog.UID_PROPERTY_]},goog.removeUid=function(o){"removeAttribute"in o&&o.removeAttribute(goog.UID_PROPERTY_)
/** @preserveTry */;try{delete o[goog.UID_PROPERTY_]}catch(o){}},goog.UID_PROPERTY_="closure_uid_"+(1e9*Math.random()>>>0),goog.uidCounter_=0,goog.getHashCode=goog.getUid,goog.removeHashCode=goog.removeUid,goog.cloneObject=function(o){var e=goog.typeOf(o);if("object"==e||"array"==e){if(o.clone)return o.clone();var g="array"==e?[]:{};for(var t in o)g[t]=goog.cloneObject(o[t]);return g}return o},goog.bindNative_=function(o,e,g){return o.call.apply(o.bind,arguments)},goog.bindJs_=function(o,e,g){if(!o)throw new Error;if(arguments.length>2){var t=Array.prototype.slice.call(arguments,2);return function(){var g=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(g,t),o.apply(e,g)}}return function(){return o.apply(e,arguments)}},goog.bind=function(o,e,g){return Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_,goog.bind.apply(null,arguments)},goog.partial=function(o,e){var g=Array.prototype.slice.call(arguments,1);return function(){var e=g.slice();return e.push.apply(e,arguments),o.apply(this,e)}},goog.mixin=function(o,e){for(var g in e)o[g]=e[g]},goog.now=goog.TRUSTED_SITE&&Date.now||function(){return+new Date},goog.globalEval=function(o){if(goog.global.execScript)goog.global.execScript(o,"JavaScript");else{if(!goog.global.eval)throw Error("goog.globalEval not available");if(null==goog.evalWorksForGlobals_&&(goog.global.eval("var _et_ = 1;"),void 0!==goog.global._et_?(delete goog.global._et_,goog.evalWorksForGlobals_=!0):goog.evalWorksForGlobals_=!1),goog.evalWorksForGlobals_)goog.global.eval(o);else{var e=goog.global.document,g=e.createElement("script");g.type="text/javascript",g.defer=!1,g.appendChild(e.createTextNode(o)),e.body.appendChild(g),e.body.removeChild(g)}}},goog.evalWorksForGlobals_=null,goog.cssNameMapping_,goog.cssNameMappingStyle_,goog.getCssName=function(o,e){var g,t=function(o){return goog.cssNameMapping_[o]||o};return g=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?t:function(o){for(var e=o.split("-"),g=[],r=0;r<e.length;r++)g.push(t(e[r]));return g.join("-")}:function(o){return o},e?o+"-"+g(e):g(o)},goog.setCssNameMapping=function(o,e){goog.cssNameMapping_=o,goog.cssNameMappingStyle_=e},goog.global.CLOSURE_CSS_NAME_MAPPING,!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING),goog.getMsg=function(o,e){return e&&(o=o.replace(/\{\$([^}]+)}/g,(function(o,g){return g in e?e[g]:o}))),o},goog.getMsgWithFallback=function(o,e){return o},goog.exportSymbol=function(o,e,g){goog.exportPath_(o,e,g)},goog.exportProperty=function(o,e,g){o[e]=g},goog.inherits=function(o,e){function g(){}g.prototype=e.prototype,o.superClass_=e.prototype,o.prototype=new g,o.prototype.constructor=o,o.base=function(o,g,t){for(var r=new Array(arguments.length-2),n=2;n<arguments.length;n++)r[n-2]=arguments[n];return e.prototype[g].apply(o,r)}},goog.base=function(o,e,g){var t=arguments.callee.caller;if(goog.STRICT_MODE_COMPATIBLE||goog.DEBUG&&!t)throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(t.superClass_){for(var r=new Array(arguments.length-1),n=1;n<arguments.length;n++)r[n-1]=arguments[n];return t.superClass_.constructor.apply(o,r)}var a=new Array(arguments.length-2);for(n=2;n<arguments.length;n++)a[n-2]=arguments[n];for(var i=!1,l=o.constructor;l;l=l.superClass_&&l.superClass_.constructor)if(l.prototype[e]===t)i=!0;else if(i)return l.prototype[e].apply(o,a);if(o[e]===t)return o.constructor.prototype[e].apply(o,a);throw Error("goog.base called from a method of one name to a method of a different name")},goog.scope=function(o){o.call(goog.global)},COMPILED||(goog.global.COMPILED=COMPILED),goog.defineClass=function(o,e){var g=e.constructor,t=e.statics;g&&g!=Object.prototype.constructor||(g=function(){throw Error("cannot instantiate an interface (no constructor defined).")});var r=goog.defineClass.createSealingConstructor_(g,o);return o&&goog.inherits(r,o),delete e.constructor,delete e.statics,goog.defineClass.applyProperties_(r.prototype,e),null!=t&&(t instanceof Function?t(r):goog.defineClass.applyProperties_(r,t)),r},goog.defineClass.ClassDescriptor,goog.define("goog.defineClass.SEAL_CLASS_INSTANCES",goog.DEBUG),goog.defineClass.createSealingConstructor_=function(o,e){if(goog.defineClass.SEAL_CLASS_INSTANCES&&Object.seal instanceof Function){if(e&&e.prototype&&e.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_])return o;var g=function(){var e=o.apply(this,arguments)||this;return e[goog.UID_PROPERTY_]=e[goog.UID_PROPERTY_],this.constructor===g&&Object.seal(e),e};return g}return o},goog.defineClass.OBJECT_PROTOTYPE_FIELDS_=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],goog.defineClass.applyProperties_=function(o,e){var g;for(g in e)Object.prototype.hasOwnProperty.call(e,g)&&(o[g]=e[g]);for(var t=0;t<goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;t++)g=goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[t],Object.prototype.hasOwnProperty.call(e,g)&&(o[g]=e[g])},goog.tagUnsealableClass=function(o){!COMPILED&&goog.defineClass.SEAL_CLASS_INSTANCES&&(o.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]=!0)},goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_="goog_defineClass_legacy_unsealable";