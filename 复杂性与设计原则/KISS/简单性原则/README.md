# 简单性原则

在软件系统的设计中，我们天性会追求更多功能，更好的性能，更好的伸缩性，扩展性等等；往往决定“不要什么”比“要什么”更难。软件设计和定义过程中存在很多取舍，例如：完善功能和及早发布的取舍，伸缩性和性能的取舍。著名的 CAP 原则，就是一个很好的取舍的指导策略。为了更好的取舍，保持架构风格的一致性，在一开始架构师就应该根据系统的实际需求来定义一些取舍的原则，如：数据一致性拥有最高优先级，提前发布核心功能优于完整发布等。

Kent Beck 提出的简单设计原则，内容为：

- 通过所有测试（Passes its tests）：通过所有测试原则意味着我们开发的功能满足客户的需求，这是简单设计的底线原则。该原则同时隐含地告知与客户或领域专家（需求分析师）充分沟通的重要性。

- 尽可能消除重复 (Minimizes duplication)：尽可能消除重复原则是对代码质量提出的要求，并通过测试驱动开发的重构环节来完成。注意此原则提到的是 Minimizes（尽可能消除），而非 No duplication（无重复），因为追求极致的重用存在设计与编码的代价。

- 尽可能清晰表达 (Maximizes clarity)：尽可能清晰表达原则要求代码要简洁而清晰地传递领域知识，在领域驱动设计的语境下，就是要遵循统一语言，提高代码的可读性，满足业务人员与开发人员的交流目的。针对核心领域，甚至可以考虑引入领域特定语言（Domain Specific Language，DSL）来表现领域逻辑。

- 更少代码元素 (Has fewer elements)：在满足这三个原则的基础上，更少代码元素原则告诫我们遏制过度设计的贪心，做到设计的恰如其分，即在满足客户需求的基础上，只要代码已经做到了最少重复与清晰表达，就不要再进一步拆分或提取类、方法和变量。

以上四个原则的重要程度依次降低。在满足需求的基本前提下，简单设计其实为代码的重构给出了三个量化标准：重复性、可读性与简单性。重复性是一个客观的标准，可读性则出于主观的判断，故而应优先考虑尽可能消除代码的重复，然后在此基础上保证代码清晰地表达设计者的意图，提高可读性。只要达到了重用和可读，就应该到此为止，不要画蛇添足地增加额外的代码元素，如变量、函数、类甚至模块，保证实现方案的简单。

第四个原则是“奥卡姆剃刀”的体现，更加文雅的翻译表达即“如无必要，勿增实体”。在软件开发中，那些不必要的抽象反而会产生多余的概念，实际会干扰代码阅读者的判断，增加代码的复杂度。因此，简单设计强调恰如其分的设计，若实现的功能通过了所有测试，就意味着满足了客户的需求，这时，只需要尽可能消除重复，清晰表达了设计者意图，就不可再增加额外的软件元素。若存在多余实体，当用奥卡姆的剃刀一割了之。

# 避免提早优化

Donald Knuth 1974 年在 ACM Journal 上发表的文章《Structured Programming with go to Statements》中写道：Premature optimizationComplexity is the root of all evil or: How I Learned to Stop Worrying and Love the Monolith。其意就是在没有量化的性能测试检测出真正存在的性能问题前，各种在代码层面的“炫技式”优化，可能不仅提升不了性能，反而会导致更多 bug。

![重构的危害](https://s1.ax1x.com/2020/03/16/8JFiGQ.png)

复杂性是万恶之源，总结而言，我们在注重整体架构与性能的同时，要避免过早地优化、避免过度优化。

# 逻辑显性化

> 参阅 [领域驱动设计/数据视图]() 中的 DP 案例。

# 简单设计的量化标准

在满足需求的基本前提下，简单设计其实为代码的重构给出了三个量化标准：重复性、可读性与简单性。重复性是一个客观的标准，可读性则出于主观的判断，故而应优先考虑尽可能消除代码的重复，然后在此基础上保证代码清晰地表达设计者的意图，提高可读性。只要达到了重用和可读，就应该到此为止，不要画蛇添足地增加额外的代码元素，如变量、函数、类甚至模块，保证实现方案的简单。

## 简单并不容易

很多架构师都会常常提到保持简单，但是有时候我们会混淆简单和容易。简单和容易在英语里也是两个词“simple”和“easy”。

> Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple. But it’s worth it in the end because once you get there, you can move mountains. To be truly simple, you have to go really deep. -- SteveJobs

真正的一些简单的方法其实来自于对问题和技术更深入的理解。这些方案往往不是容易获得表明上的方法。曾经开发过一个系统设备管理系统，移动运营商通过这个系统来管理移动设备，实现包括设备的自动注册，固件和软件的同步等管理功能，这些功能是通过一些管理系统与移动设备间的预定义的交互协议来完成的。电信专家们会根据业务场景及需求来调整和新增这些交互协议。起初我们采用了一种容易实现的方式，即团队中的软件工程是会根据电信专家说明将协议实现为对应代码。

前面这个项目最大的问题是在系统上线后的运行维护阶段，电信专家和开发工程师之间会不断就新的协议修改和增加有持续的沟通，而他们的领域知识和词汇都很大的差别，这会大大影响沟通的效率。因此这期间系统的运行维护（协议的修改）变得十分艰难，不仅协议更新上线时间慢，而且由于软件工程对于电信协议理解程度有限，很多问题都要在实际上线使用后才能被电信专家发现，导致了很多的交换和反复。

> I believe that the hardest part of software projects, the most common source of project failure, is communication with the customers and users of that software. -- Martin Fowler

针对上面提到的问题，后来我们和电信专家一起设计了一种协议设计语言（并提供可视化的工具），这种设计语言使用的电信专家所熟悉的词汇。然后通过一个类似于编译器的程序将电信专家定义好的协议模型转换为内存中的 Java 结构。这样整个项目的运行和维护就变得简单高效了，省去了低效的交流和不准确人工转换。

在提取了 includePage() 方法后，就可以消除四段几乎完全相似的重复代码。重构后的长函数为：

```java
public static String testableHtml(PageData pageData, boolean includeSuiteSetup) throws Exception {
    WikiPage wikiPage = pageData.getWikiPage();
    StringBuffer buffer = new StringBuffer();

    if (pageData.hasAttribute("Test")) {
        if (includeSuiteSetup) {
            includePage(wikiPage, buffer, SuiteResponder.SUITE_SETUP_NAME, "-setup");
        }
        includePage(wikiPage, buffer, "SetUp", "-setup");
    }
    buffer.append(pageData.getContent());
    if (pageData.hasAttribute("Test")) {
        includePage(wikiPage, buffer, "TearDown", "-teardown");
        if (includeSuiteSetup) {
            includePage(wikiPage, buffer, SuiteResponder.SUITE_TEARDOWN_NAME, "-teardown");
        }
    }
    pageData.setContent(buffer.toString());
    return pageData.getHtml();
}
```

从重复性角度看，以上代码已经去掉了重复。当然，也可以将 pageData.hasAttribute("Test")视为重复，因为该表达式在第 5 行和第 12 行都出现过，表达式用到的常量"Test"也是重复。不过，你若认为这是从代码可读性角度对其重构，也未尝不可：

```java
private static boolean isTestPage(PageData pageData) {
    return pageData.hasAttribute("Test");
}
```
