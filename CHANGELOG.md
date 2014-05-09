# 1.0.0 (2014-05-31)

#Improvements
- **behavior** Removing behavior class after applying ([b4b3584e66](https://github.com/stikjs/stik-core/commit/b4b3584e66a5367abd252017d43809fc4bb2f491))

# 0.12.0 (2014-04-10)

##Improvements
- **$courier** Removing $ sign from $send and $pull signature ([a8cf7e1aa4](https://github.com/stikjs/stik-core/commit/a8cf7e1aa476b44c481a2da0f0d667d437880275))
- **debugging** Naming functions to improve debugging ([771f0896a4](https://github.com/stikjs/stik-core/commit/771f0896a40f1567fe381d8b5bda34687bb0259d))

# 0.11.0 (2014-04-06)

##Improvements
- **utils** Preventing addClass and removeClass helpers to run when unecessary ([642933fe03](https://github.com/stikjs/stik-core/commit/642933fe030d74b3469b448589caff1d04ca997a))
- **utils_spec** Adding tests to some util methods ([2b619a197f](https://github.com/stikjs/stik-core/commit/2b619a197fd57f058afcd9bf3ca17093419c57ac))

##Bugs
- **Manager** Avoid creating two instances of $courier ([f332503389](https://github.com/stikjs/stik-core/commit/f332503389e8a44d55c2445262db389d69702659))

##Features
- **Helper Lab** ([a6d66bf30d](https://github.com/stikjs/stik-core/commit/a6d66bf30db156a6fb614e34c146a54c883ff194))

# 0.10.1 (2014-03-12)

##Improvements
- **Boundary cache** ([f69534682d](https://github.com/stikjs/stik-core/commit/f69534682d3b111e107d674982326b2f41f74bc9))
- **lazyBind** Aliasing lazyBind to bindLazy ([0cf1ac1937](https://github.com/stikjs/stik-core/commit/0cf1ac193722e013d26679afbe403c9f53841345))

##Bugs
- **$courier** Caching courier to avoid duplicate instances ([f69534682d](https://github.com/stikjs/stik-core/commit/f69534682d3b111e107d674982326b2f41f74bc9))

# 0.10.0 (2014-03-09)

##Features
- **Behavior Lab** Behaviors can now be tested using Behavior Lab ([c669286a81](https://github.com/stikjs/stik-core/commit/c669286a818ab461aa3a05177f5233cb05482695))
- **Boundary Lab** Boundaries can now be tested using Boundary Lab ([8d78632bab](https://github.com/stikjs/stik-core/commit/8d78632bab62e4690e892cae8858366464d8039c))
- **$params** `data-*` params are now easily accessible through the $params boundary ([a390c6f367](https://github.com/stikjs/stik-core/commit/a390c6f367c27b47062369ff298bc4912bd0c72a))
- **$courier** RegExp like messages can be sent to match mutiple receivers ([dd24e4d220](https://github.com/stikjs/stik-core/commit/dd24e4d220a7976983667b72c6493852c1f522ee))

##Improvements
- **Controller Lab** Stabilizing the Controller Lab api ([182335b59a](https://github.com/stikjs/stik-core/commit/182335b59a98a570178b555408cad42101e795fe))
- **Boundary** Defaulting `from` to both controllers and behaviors ([00693adbd9](https://github.com/stikjs/stik-core/commit/00693adbd9e078a541ed0f87406fb474387e92d6))

# 0.9.0 (2014-03-01)

##Features
- **Helpers** Functional helpers can be defined to avoid fat-controllers ([61f8d4bdd9](https://github.com/stikjs/stik-core/commit/61f8d4bdd918f78465d942418834675b9c258629), [021984c26a](https://github.com/stikjs/stik-core/commit/021984c26a65001d088e940019cafbc2e1f32321))

# 0.8.1 (2014-02-17)

##Bugs
- **lazyBind** Fixing lazyBind() evaluation ([ca301c8b84](https://github.com/stikjs/stik-core/commit/ca301c8b8491abf863315ed626067fe3f7b1673a))

# 0.8.0 (2014-02-05)

##Features
- **New Controller/Action API** actions can be grouped inside the same controller declaration ([77c16ecc66](https://github.com/stikjs/stik-core/commit/77c16ecc6647a98892f601837c650f327f8ed80f))

# 0.7.1 (2014-01-23)

##Bugs
- **$push** $viewBag can now $push empty ("") values ([83e324ceb5](https://github.com/stikjs/stik-core/commit/83e324ceb561ebdc2d4ac2d14da6b2fdc7d7b94c))

# 0.7.0 (2014-01-20)

##Features
- **Boundaries** now supports extensions through $boundary ([699f090faf](https://github.com/stikjs/stik-core/commit/699f090fafaa08ff237e074f86bddcc813bc74bd), [096a394b94](https://github.com/stikjs/stik-core/commit/096a394b94ee4319c246f7e7a543af9cefd0a972), [d30444960f](https://github.com/stikjs/stik-core/commit/d30444960f98a8f234cf35676b051d726a4c45b5))
- **$pull** $viewBag can have its bound data pulled out of the DOM as a dataset ([1387dd8dc0](https://github.com/stikjs/stik-core/commit/1387dd8dc004aa93ebdb6924948ec8890e042a2b))

##Improvements
- **$push** $viewBag uses $push to push new data into the view ([a0fbbacd0c](https://github.com/stikjs/stik-core/commit/a0fbbacd0cd322a32e191b9a75cf2ca43f865283))

# 0.6.0 (2014-01-15)

##Features
- **$wrapTemplate** Now identifies if MooTools, Zepto or jQuery are loaded and wraps the $template before injection with the respective library

##Improvements
- **.bindLazy** Now tries to apply both behaviors and controllers
  ([144f1beb0e](https://github.com/stikjs/stik-core/commit/144f1beb0edeed724ac520f62f7b50b3af6cd82a))
- **.behavior** Now prepends a `bh-` en every behavior for a clear separation of styling and behavior classes.
  ([3dd74d0dc3](https://github.com/stikjs/stik-core/commit/3dd74d0dc331ef2605d0489b9c1bf7eaeaf4c523))
- **$markAsBound** bound class flag doesn't include unecessary spacing ([d4d2e5253b](https://github.com/stikjs/stik-core/commit/d4d2e5253b2794f28a776d707a37016a7ffb7421))

##Bug
- **$findBehaviorTemplates** Fixing duplicate selection while lazily binding
  ([a1de0ae885](https://github.com/stikjs/stik-core/commit/a1de0ae885e5ba14947d908d0a4838c325c2b50d))
- **$viewBag** Fixing $viewBag to update input elements as well ([48cbf69aeb](https://github.com/stikjs/stik-core/commit/48cbf69aebe0571a2bf30e3598846cb07374401a), [66a01781d5](https://github.com/stikjs/stik-core/commit/66a01781d5d919574f7e2399ebaa5f1f1b60a40b))

# 0.5.2 (2013-12-28)

##Improvements
- **$injector** Now fails while trying to add an inexisting module
  ([78ceb14091](https://github.com/stikjs/stik-core/commit/78ceb140911db72888da751f05e3ce30dd93faa2))
- **$hash** $urlState now supports $hash
  ([916ae0610a](https://github.com/stikjs/stik-core/commit/916ae0610aeff9e4e39bd14375987927ee501dd6))

# 0.5.1 (2013-12-27)

##Improvements
- **.behavior** now can inject $courier and $urlState
  ([1b0d5ab65e](https://github.com/stikjs/stik-core/commit/1b0d5ab65e7944cbcc4c4ecc79ff47d05628b6d1))

# 0.5.0 (2013-12-26)

##Features
- **.controller:** give a more meaningful name to the controller registry method
  ([25e4b60222](https://github.com/stikjs/stik-core/commit/25e4b60222f7a3e909cfd9807a3c0be8295a8f6d))
- **.behavior:** compose visual behaviors using css classes
  ([8345afc70e](https://github.com/stikjs/stik-core/commit/8345afc70e56f493ef37309d0c8360c3717259fd),
  [37ddf02a28](https://github.com/stikjs/stik-core/commit/37ddf02a289a2dda44680fa82225d443c2535c43))
