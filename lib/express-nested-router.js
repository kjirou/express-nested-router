var thisModule = {};

thisModule.Namespace = function Namespace(routes){

  this._routes = routes || {};

  this.getRoutes = function(){
    return this._routes;
  };

  this.addRoute = function(path, controller){
    this._routes[path] = controller;
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

  this._resolveRoutes = function(rootPath){
    rootPath = rootPath || '';

    var resolvedRoutes = [];
    (function(currentPath, routes){
      for (var path in routes) {
        var controller = routes[path];
        if (thisModule._isNamespace(controller)) {
          arguments.callee(
            thisModule._joinPath(currentPath, path),
            controller._routes
          );
        } else {
          resolvedRoutes.push([
            thisModule._joinPath(currentPath, path),
            controller
          ]);
        }
      }
    })(rootPath, this._routes);

    return resolvedRoutes.sort(function(a, b){
      return a[0] > b[0];
    });
  };

  this.resolve = function(app){
    this._resolveRoutes().forEach(function(routeData){
      // ルートパスとして '' は登録できなかった
      var path = routeData[0] || '/';
      var controller = routeData[1];
      app.all(path, controller);
    });
  };
};

thisModule.namespace = function(routes){
  return new thisModule.Namespace(routes);
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

  // '/index' -> ''
  path = path.replace(/^\/index(\/|$)/, '$1');

  var joinedPath = rootPath + path;

  return joinedPath;
};

module.exports = thisModule;
