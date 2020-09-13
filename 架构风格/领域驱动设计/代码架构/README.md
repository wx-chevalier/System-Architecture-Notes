# 领域代码架构

DDD DSL 更多的是代码生成器，如果是代码生成器，那么生成的代码一定有对应的规范和结构等，如 entity、value object，service，repository 保存的目录，生成的代码可能还包括一定的 Annotation 或者 interface，标准字段等等。当然这里我们不讨论代码生成器的问题，但我们希望大家的 DDD 架构设计还是要采用一定的规范目录结构，这里有几个标准推荐给大家：

- ddd-4-java: Base classes for DDD with Java.

- jDDD：Libraries to help developers express DDD building blocks in Java code.

- ddd-base: DDD base package for java.

这三者其实出发点都是一致的，就是在代码层面来描述 DDD，核心是一些 annotation、interface，base class，当然也包括推荐的 package 结构。
