export class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`
  }
}
 