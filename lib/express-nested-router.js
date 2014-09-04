var thisModule = {};

thisModule.Namespace = function Namespace(routes){

  this._routes = routes || {};

  this.getRoutes = function(){
    return this._routes;
  };

  // @TODO バリデーション
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

  // @TODO ソート順どうする？ 正規表現や入れ子構造を影響させたいならここが最後
  // @TODO 循環参照対応
  // @TODO path を _joinPath した結果、同じ route が存在した場合はどうする？
  //       -> 正規表現で意図せずに同じrouteになることはあるから、気にしないでいいか。ソート順で解決の方が良い
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
  return new thisModule.Namespace(routes);
};

thisModule._isNamespace = function(any){
  return any instanceof Namespace;
};

thisModule._joinPath = function(rootPath, path){
  // contorollers 定義時に {foo:function(req, res, next){}} と先頭に '/' を付けたくないため
  if (!/^\//.test(path)) {
    path = '/' + path;
  }

  // '/index' -> ''
  // @TODO Namespace 生成時のオプションで無効にしたり '__index__' などにできるようにする？
  //       その場合、これはインスタンスメソッドにしないといけない
  path = path.replace(/^\/index(\/|$)/, '$1');

  // @TODO 正規表現対応
  //       正規表現かの判別は 1.regExp オブジェクトか 2.独自記法による文字列かを想定
  var joinedPath = rootPath + path;

  // @TODO 末尾の '/' の扱いは express だとどうなっているのだろう？
  return joinedPath;
};

module.exports = thisModule;
