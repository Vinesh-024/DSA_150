# CS Fundamentals: OOP & Java Internals

## 1. Object-Oriented Principles in Production
- **Encapsulation**: Bundling state and mutating methods together while hiding internal memory representations. In Java, private fields with controlled getters/setters or immutable record representations prevent state corruption.
- **Inheritance vs Composition**: Favor composition over inheritance ("has-a" over "is-a") to prevent tight coupling, fragile base class problems, and broken encapsulation.
- **Polymorphism**: The ability of different types to respond to the same interface or method call.

## 2. Compile-Time vs Runtime Polymorphism
- **Compile-Time (Static Dispatch / Overloading)**:
  - Resolved entirely by the compiler at compile time based on parameter types and counts.
  - No vtable overhead.
- **Runtime (Dynamic Dispatch / Overriding)**:
  - Resolved at runtime using the receiver object's actual class memory table (`vtable`).
  - In Java, all non-static, non-private, non-final instance methods are virtual by default.

```java
class Animal {
    void speak() { System.out.println("Animal generic sound"); }
}

class Dog extends Animal {
    @Override
    void speak() { System.out.println("Dog bark"); }
}

// Runtime dynamic dispatch
Animal a = new Dog();
a.speak(); // Output: "Dog bark" via vtable offset lookup
```

## 3. Java Memory Model & JVM Internals
- **Stack**: Stores primitive local variables and object reference pointers for the current thread execution frames. Fast allocation and deallocation upon frame return.
- **Heap**: Shared among all threads; stores all instantiated objects. Managed by garbage collectors (G1, ZGC, Parallel GC).
- **Metaspace (Native Memory)**: Stores class metadata, bytecode, and static constant pools (replaced PermGen since Java 8).

## 4. Key Interview Questions & Traps
1. **Q**: Can static methods be overridden in Java?
   **A**: No. Static methods belong to the class, not instance objects. Defining a static method with the same signature in a subclass hides the parent method, rather than overriding it.
2. **Q**: What is the difference between `Comparable` and `Comparator`?
   **A**: `Comparable` defines natural ordering implemented within the class (`compareTo(T o)`). `Comparator` defines external customizable ordering strategies (`compare(T o1, T o2)`).
3. **Q**: Why are String objects immutable in Java?
   **A**: Security (used in network connections and file paths), thread-safety without locks, hashcode caching for HashMap keys, and String Constant Pool memory optimization.
