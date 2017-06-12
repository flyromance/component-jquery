define(function () {
    /**
     */
    function createClass(parent, propers) {
        var args = [].slice.call(arguments);
        if (args.length < 1 || args.length > 2) {
            throw '创建类的参数错误'
        }

        // 创建的子类
        function SubClass() {
            if (typeof this.initialize === 'function') {
                this.initialize.apply(this, arguments);
            }
        }

        // 中介函数
        function Fn() {}

        var SuperClass = null,
            propers = null,
            method = null;

        if (typeof args[0] === 'function') {
            SuperClass = args[0];
            propers = args[1];
        } else {
            propers = args[0];
        }

        // 如果父类存在，继承父类原型上的方法
        if (SuperClass) {
            Fn.prototype = SuperClass.prototype;
            SubClass.prototype = new Fn();
            SubClass.prototype.constructor = SubClass;
        }

        // 子类添加propers的属性到原型上
        var reg = /function.*\(([^\)\(]*).*\)/i, // 不能加g
            match = null,
            method, superMethod;
        for (var key in propers) {
            method = propers[key];
            if (SuperClass && typeof method === 'function') {

                // 获取参数[$super, xxx, xxx]
                match = method.toString().match(reg)[1].split(',');
                superMethod = SuperClass.prototype[key];

                // 如果存在$super标识，并且父类中有同名的方法
                if (typeof superMethod === 'function' && match && match[0].trim() == '$super') {
                    SubClass.prototype[key] = (function (superMethod, method) {

                        return function () {
                            var that = this;
                            var args = [].slice.call(arguments);
                            var _superMethod = function () {
                                return superMethod.apply(that, arguments);
                            }

                            // 超类方法放在第一个
                            method.apply(this, [_superMethod].concat(args));
                        }
                    })(superMethod, method);
                } else {
                    SubClass.prototype[key] = method;
                }
            } else {
                SubClass.prototype[key] = method;
            }
        }

        // 继承父类静态方法
        if (SuperClass) {
            for (key in SuperClass) {

                // prototype其实是不可遍历，但是在有些浏览器中不可遍历被修改之后，会变成可遍历
                // superclass必须排除
                if (SuperClass.hasOwnProperty(key) && key !== 'superclass' && key !== 'prototype') {
                    SubClass[key] = SuperClass[key];
                }
            }
        }

        if (!SubClass.prototype.initialize) {
            SubClass.prototype.initialize = function () {}
        }

        SubClass.superclass = SuperClass;

        return SubClass;
    }

    return createClass;
});
