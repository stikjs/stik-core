# 0.10.0 (2014-03-08)

##Improvements
- **Controller Lab** Stabilizing the Controller Lab api ([182335b59a](https://github.com/stikjs/stik.js/commit/182335b59a98a570178b555408cad42101e795fe))
- **Boundary** Defaulting "from" to both controllers and behaviors ([00693adbd9](https://github.com/stikjs/stik.js/commit/00693adbd9e078a541ed0f87406fb474387e92d6))

# 0.9.0 (2014-03-01)

##Features
- **Helpers** Functional helpers can be defined to avoid fat-controllers ([61f8d4bdd9](https://github.com/stikjs/stik.js/commit/61f8d4bdd918f78465d942418834675b9c258629), [021984c26a](https://github.com/stikjs/stik.js/commit/021984c26a65001d088e940019cafbc2e1f32321))

# 0.8.1 (2014-02-17)

##Bugs
- **lazyBind** Fixing lazyBind() evaluation ([ca301c8b84](https://github.com/stikjs/stik.js/commit/ca301c8b8491abf863315ed626067fe3f7b1673a))

# 0.8.0 (2014-02-05)

##Features
- **New Controller/Action API** actions can be grouped inside the same controller declaration ([77c16ecc66](https://github.com/stikjs/stik.js/commit/77c16ecc6647a98892f601837c650f327f8ed80f))

# 0.7.1 (2014-01-23)

##Bugs
- **$push** $viewBag can now $push empty ("") values ([83e324ceb5](https://github.com/stikjs/stik.js/commit/83e324ceb561ebdc2d4ac2d14da6b2fdc7d7b94c))

# 0.7.0 (2014-01-20)

##Features
- **Boundaries** now supports extensions through $boundary ([699f090faf](https://github.com/stikjs/stik.js/commit/699f090fafaa08ff237e074f86bddcc813bc74bd), [096a394b94](https://github.com/stikjs/stik.js/commit/096a394b94ee4319c246f7e7a543af9cefd0a972), [d30444960f](https://github.com/stikjs/stik.js/commit/d30444960f98a8f234cf35676b051d726a4c45b5))
- **$pull** $viewBag can have its bound data pulled out of the DOM as a dataset ([1387dd8dc0](https://github.com/stikjs/stik.js/commit/1387dd8dc004aa93ebdb6924948ec8890e042a2b))

##Improvements
- **$push** $viewBag uses $push to push new data into the view ([a0fbbacd0c](https://github.com/stikjs/stik.js/commit/a0fbbacd0cd322a32e191b9a75cf2ca43f865283))

# 0.6.0 (2014-01-15)

##Features
- **$wrapTemplate** Now identifies if MooTools, Zepto or jQuery are loaded and wraps the $template before injection with the respective library

##Improvements
- **.bindLazy** Now tries to apply both behaviors and controllers
  ([144f1beb0e](https://github.com/stikjs/stik.js/commit/144f1beb0edeed724ac520f62f7b50b3af6cd82a))
- **.behavior** Now prepends a `bh-` en every behavior for a clear separation of styling and behavior classes.
  ([3dd74d0dc3](https://github.com/stikjs/stik.js/commit/3dd74d0dc331ef2605d0489b9c1bf7eaeaf4c523))
- **$markAsBound** bound class flag doesn't include unecessary spacing ([d4d2e5253b](https://github.com/stikjs/stik.js/commit/d4d2e5253b2794f28a776d707a37016a7ffb7421))

##Bug
- **$findBehaviorTemplates** Fixing duplicate selection while lazily binding
  ([a1de0ae885](https://github.com/stikjs/stik.js/commit/a1de0ae885e5ba14947d908d0a4838c325c2b50d))
- **$viewBag** Fixing $viewBag to update input elements as well ([48cbf69aeb](https://github.com/stikjs/stik.js/commit/48cbf69aebe0571a2bf30e3598846cb07374401a), [66a01781d5](https://github.com/stikjs/stik.js/commit/66a01781d5d919574f7e2399ebaa5f1f1b60a40b))

# 0.5.2 (2013-12-28)

##Improvements
- **$injector** Now fails while trying to add an inexisting module
  ([78ceb14091](https://github.com/stikjs/stik.js/commit/78ceb140911db72888da751f05e3ce30dd93faa2))
- **$hash** $urlState now supports $hash
  ([916ae0610a](https://github.com/stikjs/stik.js/commit/916ae0610aeff9e4e39bd14375987927ee501dd6))

# 0.5.1 (2013-12-27)

##Improvements
- **.behavior** now can inject $courier and $urlState
  ([1b0d5ab65e](https://github.com/stikjs/stik.js/commit/1b0d5ab65e7944cbcc4c4ecc79ff47d05628b6d1))

# 0.5.0 (2013-12-26)

##Features
- **.controller:** give a more meaningful name to the controller registry method
  ([25e4b60222](https://github.com/stikjs/stik.js/commit/25e4b60222f7a3e909cfd9807a3c0be8295a8f6d))
- **.behavior:** compose visual behaviors using css classes
  ([8345afc70e](https://github.com/stikjs/stik.js/commit/8345afc70e56f493ef37309d0c8360c3717259fd),
  [37ddf02a28](https://github.com/stikjs/stik.js/commit/37ddf02a289a2dda44680fa82225d443c2535c43))
