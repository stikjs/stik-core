# 0.6.0 (2014-01-15)

##Features
- **$wrapTemplate** Now identifies if MooTools, Zepto or jQuery are loaded and wraps the $template before injection with the respective library

##Fix
- **.bindLazy** Now tries to apply both behaviors and controllers
  ([144f1beb0e](https://github.com/lukelex/stik.js/commit/144f1beb0edeed724ac520f62f7b50b3af6cd82a))
- **.behavior** Now prepends a `bh-` en every behavior for a clear separation of styling and behavior classes.
  ([3dd74d0dc3](https://github.com/lukelex/stik.js/commit/3dd74d0dc331ef2605d0489b9c1bf7eaeaf4c523))

##Bug
- **$findBehaviorTemplates** Fixing duplicate selection while lazily binding
  ([a1de0ae885](https://github.com/lukelex/stik.js/commit/a1de0ae885e5ba14947d908d0a4838c325c2b50d))
- **$viewBag** Fixing $viewBag to update input elements as well ([48cbf69aeb](https://github.com/lukelex/stik.js/commit/48cbf69aebe0571a2bf30e3598846cb07374401a), [66a01781d5](https://github.com/lukelex/stik.js/commit/66a01781d5d919574f7e2399ebaa5f1f1b60a40b))

# 0.5.2 (2013-12-28)

##Fix
- **$injector** Now fails while trying to add an inexisting module
  ([78ceb14091](https://github.com/lukelex/stik.js/commit/78ceb140911db72888da751f05e3ce30dd93faa2))
- **$hash** $urlState now supports $hash
  ([916ae0610a](https://github.com/lukelex/stik.js/commit/916ae0610aeff9e4e39bd14375987927ee501dd6))

# 0.5.1 (2013-12-27)

## Fix
- **.behavior** now can inject $courier and $urlState
  ([1b0d5ab65e](https://github.com/lukelex/stik.js/commit/1b0d5ab65e7944cbcc4c4ecc79ff47d05628b6d1))

# 0.5.0 (2013-12-26)

##Features
- **.controller:** give a more meaningful name to the controller registry method
  ([25e4b60222](https://github.com/lukelex/stik.js/commit/25e4b60222f7a3e909cfd9807a3c0be8295a8f6d))
- **.behavior:** compose visual behaviors using css classes
  ([8345afc70e](https://github.com/lukelex/stik.js/commit/8345afc70e56f493ef37309d0c8360c3717259fd),
  [37ddf02a28](https://github.com/lukelex/stik.js/commit/37ddf02a289a2dda44680fa82225d443c2535c43))
