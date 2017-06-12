/**
 * Created by Administrator on 2015/12/27.
 *
 * 类：类本就是个对象（函数对象或者{xxx}）
 * 封装：如何组织私有、共有方法属性，即创建出来的实例对象具有的那些属性方法
 * 子类父类之间继承，子类具有父类哪些属性方法
 *
 * 类：就是抽象出来的一个工具，使用这个工具，创建实例对象
 */
// 1、构造函数模式
function Person(name, age){
    this.name = name;
    this.age = age;
}

Person.prototype = {
    constructor: Person,
    sayName: function(){
        console.log(this.name);
    },
    sayAge: function(){
        console.log(this.age);
    }
}

var person1 = new Person("fanlong", 28);
person1.sayName();

// 2、Object.create()， IE678不支持
function defineClass(obj){
    if( Object.create ){
        return Object.create(obj);
    }else{
        var fn = function(){};
        fn.prototype = obj;
        return new fn();
    }
}
var obj = {
    name:"fly",
    age:28,
    sayName: function(){
        console.log(this.name);
    }
}
var obj1 = defineClass(obj);
obj1.sayName();

// 3、极简法
var superClass = {
    // 共有属性与方法
    name: "fanlong",
    age: 28,
    sayName: function(){
        console.log(this.name);
    },
    // 工厂模式创建对象
    createNew: function(){
        // 私有属性与方法
        var top = this;
        var national = "china";
        var obj = {};
        obj.sayNation = function(){
            console.log(national);
        }
        obj.sayTop = function(){
            // 调用公共属性
            console.log(top.name);
        };
        return obj;
    }
};
var supClass = {
    createNew: function(){
        var obj = superClass.createNew();
        obj.sayHi = function(){
            console.log("hello nihao");
        };
        return obj;
    }
};
var class1 = supClass.createNew();
class1.sayTop();