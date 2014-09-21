var thisModule = {};

thisModule.Namespace = function Namespace(routes){

  this._routes = {};
  this._beforeFilters = [];
  this._afterFilters = [];

  this.getRoutes = function(){
    return this._routes;
  };

  this.addRoute = function(path, controller){
    this._routes[path] = controller;
  };

  this.extendRoutes = function(routes){
    thisModule._extend(this._routes, routes);
  };

  this.removeRoute = function(path){
    if (!(path in this._routes)) {
      throw new Error('Path not found.');
    }
    delete this._routes[path];
  };

  this.copyRoute = function(originalPath, aliasPath){
    if (!(originalPath in this._routes)) {
      throw new Error('Path not found.');
    }
    this.addRoute(aliasPath, this._routes[originalPath]);
  };

  this.moveRoute = function(fromPath, toPath){
    this.copyRoute(fromPath, toPath);
    this.removeRoute(fromPath);
  };

  this.addBeforeFilter = function(callback){
    this._beforeFilters.push(callback);
  };

  this.addAfterFilter = function(callback){
    this._afterFilters.push(callback);
  };

  // Returns [
  //   [route, controller, beforeFilters, afterFilters], ..] or
  //   [route, namespace]
  // ]
  this._resolveRoutes = function(){
    var resolvedRoutes = [];
    (function(currentPath, routes, beforeFilters, afterFilters){
      for (var path in routes) {
        var controller = routes[path];
        var nextPath = thisModule._joinPath(currentPath, path);
        if (thisModule._isNamespace(controller)) {
          resolvedRoutes.push([
            nextPath,
            controller
          ]);
          arguments.callee(
            nextPath,
            controller._routes,
            controller._beforeFilters,
            controller._afterFilters
          );
        } else {
          resolvedRoutes.push([
            nextPath,
            controller,
            beforeFilters,
            afterFilters
          ]);
        }
      }
    })('', this._routes, this._beforeFilters, this._afterFilters);

    return resolvedRoutes.sort(function(a, b){
      return a[0] > b[0];
    });
  };

  this.resolve = function(app){
    this._resolveRoutes().forEach(function(routeData){
      // ルートパスとして '' は登録できなかった
      var path = routeData[0] || '/';
      var controller = routeData[1];

      // 名前空間の登録は除外する
      if (thisModule._isNamespace(controller)) { return; }

      var beforeFilters = routeData[2];
      var afterFilters = routeData[3];

      var filters = beforeFilters.concat([controller], afterFilters);
      app.all.apply(app, [path].concat(filters));
    });
  };

  // Return paths by controller or namespace
  this.reverseLookUp = function(target){
    var paths = [];
    this._resolveRoutes().forEach(function(routeData){
      var path = routeData[0] || '/';
      var controller = routeData[1];
      if (target === controller) {
        paths.push(path);
      }
    });
    return paths;
  };

  // Initialization
  routes = routes || {};
  if (thisModule._isNamespace(routes)) {
    routes = routes.getRoutes();
  }
  this.extendRoutes(routes);
};

thisModule.namespace = function(routes){
  return new thisModule.Namespace(routes);
};

thisModule._extend = function(source, props){
  for (var prop in props) {
    if (props.hasOwnProperty(prop)) {
      source[prop] = props[prop];
    }
  }
  return source;
};

thisModule._isNamespace = function(any){
  return any instanceof thisModule.Namespace;
};

thisModule._joinPath = function(rootPath, path){
  // 'foo'  -> '/foo'
  // '/foo' -> '/foo'
  if (!/^\//.test(path)) {
    path = '/' + path;
  }

  // '/index'     -> ''
  // '/index/foo' -> '/foo'
  // '/indexfoo'  -> '/indexfoo'
  path = path.replace(/^\/index(\/|$)/, '$1');

  var joinedPath = rootPath + path;

  return joinedPath;
};

module.exports = thisModule;
