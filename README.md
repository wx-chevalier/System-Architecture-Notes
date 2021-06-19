[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![license: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey.svg)][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wx-chevalier/SoftwareArchitecture-Series">
    <img src="header.svg" alt="Logo" style="width: 100vw;height: 400px" />
  </a>

  <p align="center">
    <a href="https://ng-tech.icu/SoftwareArchitecture-Series"><strong>在线阅读 >> </strong></a>
    <br />
    <br />
    <a href="https://github.com/wx-chevalier/Awesome-CheatSheets">速览手册</a>
    ·
    <a href="./examples">代码案例</a>
    ·
       <a href="https://github.com/wx-chevalier/Awesome-Lists">参考资料</a>
    ·
    <a href="./README.en.md">English Version</a>

  </p>
</p>

# Software Architecture Series | 软件架构设计实践

所谓架构，参考 ISO/IEC 42010:20072 及维基百科中对架构的定义：

> The fundamental organization of a system, embodied in its components, their relationships to each other and the enviroment, and the principles governing its design and evolution.
> 软件体系结构是指软件系统的基本结构，创建此类结构的规则以及这些结构的文档。需要这些结构来推断软件系统。每个结构包括软件元素，它们之间的关系，元素和关系的属性，以及每个元素的引入和配置的基本原理。

这里定义了架构的三要素：职责明确的模块或者组件、组件间明确的关联关系、约束和指导原则。

![架构三要素](https://s2.ax1x.com/2019/10/11/uHQKtU.png)

软件系统的体系结构是一种隐喻，类似于建筑物的体系结构，是一种**整体与局部关系的抽象描述**，架构是软件系统内部设计中最重要而又模糊的方面。有系统的地方就需要架构，大到航空飞机，小到一个电商系统里面的一个功能组件，都需要设计和架构。抽象而言，架构就是对系统中的实体以及实体之间的关系所进行的抽象描述，是对物/信息的功能与形式元素之间的对应情况所做的分配，是对元素之间的关系以及元素同周边环境之间的关系所做的定义。架构能将目标系统按某个原则进行切分，切分的原则，是要便于不同的角色进行并行工作，结构良好的创造活动要优于毫无结构的创造活动。

![软件架构头图](https://i.postimg.cc/L8T6Sz3G/image.png)

在软件架构领域有一句名言：架构并不由系统的功能决定，而是由系统的非功能属性决定。这句话直白的解释就是：假如不考虑性能、健壮性、可移植性、可修改性、开发成本、时间约束等因素，用任何的架构、任何的方法，系统的功能总是可以实现的，项目总是能开发完成的，只是开发时间、以后的维护成本、功能扩展的容易程度不同罢了。将这些考量点归类，在软件系统中，当我们谈及架构时，一般会指**控制系统复杂性的业务架构**与**保证系统高可用性的分布式系统架构**。

从业务系统的角度，**软件架构的核心价值，即是控制系统的复杂性，将核心业务逻辑和技术细节的分离与解耦**。软件架构是系统的草图，它描述的对象是直接构成系统的抽象组件；各个组件之间的连接则明确和相对细致地描述组件之间的通信。在实现阶段，这些抽象组件被细化为实际的组件，比如具体某个类或者对象。在面向对象领域中，组件之间的连接通常用接口来实现。架构师的职责是努力训练自己的思维，用它去理解复杂的系统，通过合理的分解和抽象，理解并解析需求，创建有用的模型，确认、细化并扩展模型，管理架构；能够进行系统分解形成整体架构，能够正确的技术选型，能够制定技术规格说明并有效推动实施落地。

## 架构模式与架构风格

软件架构设计的一个核心问题是能否使用重复的架构模式，即能否达到架构级的软件重用。也就是说，能否在不同的软件系统中，使用同一架构。当我们讨论软件架构时，常常会提及软件架构模式（Architectural Pattern）与软件架构风格（Architectural Style）。软件架构模式往往会用于具体地解决某个具体的重复的架构问题，而架构风格则是对于某个具体的架构设计方案的命名。软件架构风格是描述某一特定应用领域中系统组织方式的惯用模式；架构风格反映了领域中众多系统所共有的结构和语义特性，并指导如何将各个模块和子系统有效组织成一个完整的系统。

在笔者的系列文章中，CRUD、分层架构、六边形架构、洋葱架构、REST 以及 DDD，都算是架构风格；而 CQRS、EDA、UDLA、微服务等则被划分到架构模式中。

# About

## Copyright | 版权

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg) ![](https://parg.co/bDm)

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://ng-tech.icu/books/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://ng-tech.icu/books/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/wx-chevalier/SoftwareArchitecture-Series.svg?style=flat-square
[contributors-url]: https://github.com/wx-chevalier/SoftwareArchitecture-Series/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wx-chevalier/SoftwareArchitecture-Series.svg?style=flat-square
[forks-url]: https://github.com/wx-chevalier/SoftwareArchitecture-Series/network/members
[stars-shield]: https://img.shields.io/github/stars/wx-chevalier/SoftwareArchitecture-Series.svg?style=flat-square
[stars-url]: https://github.com/wx-chevalier/SoftwareArchitecture-Series/stargazers
[issues-shield]: https://img.shields.io/github/issues/wx-chevalier/SoftwareArchitecture-Series.svg?style=flat-square
[issues-url]: https://github.com/wx-chevalier/SoftwareArchitecture-Series/issues
[license-shield]: https://img.shields.io/github/license/wx-chevalier/SoftwareArchitecture-Series.svg?style=flat-square
[license-url]: https://github.com/wx-chevalier/SoftwareArchitecture-Series/blob/master/LICENSE.txt
