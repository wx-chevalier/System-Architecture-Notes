# DDD 的分层架构

在 DDD 落地的过程中，我们的基本思路是利用分层架构和六边形架构思想进行逻辑分层。

- 限界上下文：通过 限界上下文 对整个系统进行划分，将庞大的软件系统划分为松散耦合的多个小系统，基于业务进行垂直切割
- 利用分层架构和六边形架构思想：利用 分层架构 与 六边形架构 思想对其进行逻辑分层，以确保业务逻辑与技术实现的隔离

要避免业务逻辑的复杂度与技术实现的复杂度混淆在一起，首要任务就是确定业务逻辑与技术实现的边界，从而隔离各自的复杂度。在理想状态下，我们应该保证业务规则与技术实现是正交的。分层架构遵循了“关注点分离”原则，将属于业务逻辑的关注点放到领域层（Domain Layer）中，而将支撑业务逻辑的技术实现放到基础设施层（Infrastructure Layer）中。同时，领域驱动设计又颇具创见的引入了应用层（Application Layer），应用层扮演了双重角色。一方面它作为业务逻辑的外观（Facade），暴露了能够体现业务用例的应用服务接口；另一方面它又是业务逻辑与技术实现的粘合剂，实现二者之间的协作。

下图展现的就是一个典型的领域驱动设计分层架构，蓝色区域的内容与业务逻辑有关，灰色区域的内容与技术实现有关，二者泾渭分明，然后汇合在应用层。应用层确定了业务逻辑与技术实现的边界，通过直接依赖或者依赖注入（DI，Dependency Injection）的方式将二者结合起来：

![领域驱动设计分层架构](https://s3.ax1x.com/2021/02/02/ynHop6.md.png)

# DDD 框架

DDD DSL 更多的是代码生成器，如果是代码生成器，那么生成的代码一定有对应的规范和结构等，如 entity、value object，service，repository 保存的目录，生成的代码可能还包括一定的 Annotation 或者 interface，标准字段等等。当然这里我们不讨论代码生成器的问题，但我们希望大家的 DDD 架构设计还是要采用一定的规范目录结构，这里有几个标准推荐给大家：

- ddd-4-java: Base classes for DDD with Java.
- jDDD：Libraries to help developers express DDD building blocks in Java code.
- ddd-base: DDD base package for java.

这三者其实出发点都是一致的，就是在代码层面来描述 DDD，核心是一些 annotation、interface，base class，当然也包括推荐的 package 结构。
