var thisModule = {};

thisModule.Namespace = function Namespace(routes){

  this._routes = routes || {};

  this.copyRoute = function(originalPath, aliasPath){
    if (!(originalPath in this._routes)) {
      throw new Error('Path not found.');
    }
    this._routes[aliasPath] = this._routes[originalPath];
  };

  this.changeRoute = function(fromPath, toPath){
    this.copyRoute(fromPath, toPath);
    delete this._routes[fromPath];
  };

  // @TODO ソート順どうする？ 正規表現や入れ子構造を影響させたいならここが最後
  // @TODO 循環参照対応
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

    return resolvedRoutes;
  };

  this.resolve = function(app){
    this._resolveRoutes().forEach(function(routeData){
      var path = routeData[0];
      var controller = routeData[1];
      // @TODO get/post は選択できなくて良いのか？
      app.all(path, controller);
    });
  };
};

thisModule.namespace = function(routes){
  return new Namespace(routes);
};

thisModule._isNamespace = function(any){
  return any instanceof Namespace;
};

thisModule._joinPath = function(rootPath, path){
  // @TODO 正規表現対応
  //       正規表現かの判別は 1.regExp オブジェクトか 2.独自記法による文字列かを想定
  return rootPath + path;
};

module.exports = thisModule;
