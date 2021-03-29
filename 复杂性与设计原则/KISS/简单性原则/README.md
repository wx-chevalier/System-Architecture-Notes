# 简单性原则

在软件系统的设计中，我们天性会追求更多功能，更好的性能，更好的伸缩性，扩展性等等；往往决定“不要什么”比“要什么”更难。软件设计和定义过程中存在很多取舍，例如：完善功能和及早发布的取舍，伸缩性和性能的取舍。著名的 CAP 原则，就是一个很好的取舍的指导策略。为了更好的取舍，保持架构风格的一致性，在一开始架构师就应该根据系统的实际需求来定义一些取舍的原则，如：数据一致性拥有最高优先级，提前发布核心功能优于完整发布等。

Kent Beck 提出的简单设计原则，内容为：

- 通过所有测试（Passes its tests）：通过所有测试原则意味着我们开发的功能满足客户的需求，这是简单设计的底线原则。该原则同时隐含地告知与客户或领域专家（需求分析师）充分沟通的重要性。

- 尽可能消除重复 (Minimizes duplication)：尽可能消除重复原则是对代码质量提出的要求，并通过测试驱动开发的重构环节来完成。注意此原则提到的是 Minimizes（尽可能消除），而非 No duplication（无重复），因为追求极致的重用存在设计与编码的代价。

- 尽可能清晰表达 (Maximizes clarity)：尽可能清晰表达原则要求代码要简洁而清晰地传递领域知识，在领域驱动设计的语境下，就是要遵循统一语言，提高代码的可读性，满足业务人员与开发人员的交流目的。针对核心领域，甚至可以考虑引入领域特定语言（Domain Specific Language，DSL）来表现领域逻辑。

- 更少代码元素 (Has fewer elements)：在满足这三个原则的基础上，更少代码元素原则告诫我们遏制过度设计的贪心，做到设计的恰如其分，即在满足客户需求的基础上，只要代码已经做到了最少重复与清晰表达，就不要再进一步拆分或提取类、方法和变量。

以上四个原则的重要程度依次降低。在满足需求的基本前提下，简单设计其实为代码的重构给出了三个量化标准：重复性、可读性与简单性。重复性是一个客观的标准，可读性则出于主观的判断，故而应优先考虑尽可能消除代码的重复，然后在此基础上保证代码清晰地表达设计者的意图，提高可读性。只要达到了重用和可读，就应该到此为止，不要画蛇添足地增加额外的代码元素，如变量、函数、类甚至模块，保证实现方案的简单。

第四个原则是“奥卡姆剃刀”的体现，更加文雅的翻译表达即“如无必要，勿增实体”。在软件开发中，那些不必要的抽象反而会产生多余的概念，实际会干扰代码阅读者的判断，增加代码的复杂度。因此，简单设计强调恰如其分的设计，若实现的功能通过了所有测试，就意味着满足了客户的需求，这时，只需要尽可能消除重复，清晰表达了设计者意图，就不可再增加额外的软件元素。若存在多余实体，当用奥卡姆的剃刀一割了之。

## 简单与高可用

使系统设计尽可能简单是提高系统可靠性和安全性的最佳方法之一。更简单的设 计减少了攻击面，降低了意外的系统交互的可能性，并使人们更容易理解和推理 系统。可理解性在紧急情况下尤其有用，它可以帮助响应者快速缓解症状并减少 平均修复时间(MTTR)，例如将 攻击面减小和将安全不变量的责任隔离到小而简单的独立子系统进行推理。

# 逻辑显性化

> 参阅 [领域驱动设计/数据视图]() 中的 DP 案例。

晦涩难懂是导致复杂性的两个主要原因之一。当有关系统的重要信息对于新开发人员而言并不明显时，就会发生模糊。解决晦涩问题的方法是以显而易见的方式编写代码。如果代码很明显，则意味着某人可以不加思索地快速阅读该代码，并且他们对代码的行为或含义的最初猜测将是正确的。如果代码很明显，那么读者就不需要花费很多时间或精力来收集他们使用代码所需的所有信息。如果代码不明显，那么读者必须花费大量时间和精力来理解它。这不仅降低了它们的效率，而且还增加了误解和错误的可能性。明显的代码比不明显的代码需要更少的注释。

读者的想法是“显而易见”：注意到别人的代码不明显比发现自己的代码有问题要容易得多。因此，确定代码是否显而易见的最佳方法是通过代码审查。如果有人在阅读您的代码时说它并不明显，那么无论您看起来多么清晰，它也不是显而易见。通过尝试理解什么使代码变得不明显，您将学习如何在将来编写更好的代码。

## 应当坚持的

明智地使用空白。代码格式化的方式会影响其理解的容易程度。考虑以下参数文档，其中空格已被压缩：

```java
/**
 *  ...
 *  @param numThreads The number of threads that this manager should
 *  spin up in order to manage ongoing connections. The MessageManager
 *  spins up at least one thread for every open connection, so this
 *  should be at least equal to the number of connections you expect
 *  to be open at once. This should be a multiple of that number if
 *  you expect to send a lot of messages in a short amount of time.
 *  @param handler Used as a callback in order to handle incoming
 *  messages on this MessageManager's open connections. See
 *  {@code MessageHandler} and {@code handleMessage} for details.
 */
```

很难看到一个参数的文档在哪里结束而下一个参数的文档在哪里开始。甚至不知道有多少个参数或它们的名称是什么。如果添加了一些空白，结构会突然变得清晰，文档也更容易扫描：

```java
/**
 *  @param numThreads
 *           The number of threads that this manager should spin up in
 *           order to manage ongoing connections. The MessageManager spins
 *           up at least one thread for every open connection, so this
 *           should be at least equal to the number of connections you
 *           expect to be open at once. This should be a multiple of that
 *           number if you expect to send a lot of messages in a short
 *           amount of time.
 *  @param handler
 *           Used as a callback in order to handle incoming messages on
 *           this MessageManager's open connections. See
 *           {@code MessageHandler} and {@code handleMessage} for details.
 */
```

空行也可用于分隔方法中的主要代码块，例如以下示例：

```cpp
void* Buffer::allocAux(size_t numBytes) {
    //  Round up the length to a multiple of 8 bytes, to ensure alignment.
    uint32_t numBytes32 =  (downCast<uint32_t>(numBytes) + 7) & ~0x7;
    assert(numBytes32 != 0);
    //  If there is enough memory at firstAvailable, use that. Work down
    //  from the top, because this memory is guaranteed to be aligned
    //  (memory at the bottom may have been used for variable-size chunks).
    if  (availableLength >= numBytes32) {
        availableLength -= numBytes32;
        return firstAvailable + availableLength;
    }
    //  Next, see if there is extra space at the end of the last chunk.
    if  (extraAppendBytes >= numBytes32) {
        extraAppendBytes -= numBytes32;
        return lastChunk->data + lastChunk->length + extraAppendBytes;
    }
    //  Must create a new space allocation; allocate space within it.
    uint32_t allocatedLength;
    firstAvailable = getNewAllocation(numBytes32, &allocatedLength);
    availableLength = allocatedLength numBytes32;
    return firstAvailable + availableLength;
}
```

如果每个空白行之后的第一行是描述下一个代码块的注释，则此方法特别有效：空白行使注释更可见。语句中的空白有助于阐明语句的结构。比较以下两个语句，其中之一具有空格，而其中一个没有空格：

```cpp
for(int pass=1;pass>=0&&!empty;pass--) {
for (int pass = 1; pass >= 0 && !empty; pass--) {
```

注释。有时无法避免非显而易见的代码。发生这种情况时，重要的是使用注释来提供缺少的信息以进行补偿。要做到这一点，您必须使自己处于读者的位置，弄清楚什么可能会使他们感到困惑，以及哪些信息可以消除这种混乱。

## 应当避免的

有很多事情可以使代码变得不明显。本节提供了一些示例。其中某些功能（例如事件驱动的编程）在某些情况下很有用，因此您可能最终还是要使用它们。发生这种情况时，额外的文档可以帮助最大程度地减少读者的困惑。

事件驱动的编程。在事件驱动的编程中，应用程序对外部事件做出响应，例如网络数据包的到来或按下鼠标按钮。一个模块负责报告传入事件。应用程序的其他部分通过在事件发生时要求事件模块调用给定的函数或方法来注册对某些事件的兴趣。事件驱动的编程使其很难遵循控制流程。永远不要直接调用事件处理函数。它们是由事件模块间接调用的，通常使用函数指针或接口。即使您在事件模块中找到了调用点，也仍然无法确定将调用哪个特定功能：这将取决于在运行时注册了哪些处理程序。因此，很难推理事件驱动的代码或说服自己相信它是可行的。

为了弥补这种模糊性，请为每个处理程序函数使用接口注释，以指示何时调用该函数，如以下示例所示：

```cpp
/**
 * This method is invoked in the dispatch thread by a transport if a
 * transport-level error prevents an RPC from completing.
 */
void Transport::RpcNotifier::failed() {
    ...
}
```

如果无法通过快速阅读来理解代码的含义和行为，则它是一个危险标记。通常，这意味着有些重要的信息对于阅读代码的人来说并不能立即清除。通用容器。许多语言提供了用于将两个或多个项目组合到一个对象中的通用类，例如 Java 中的 Pair 或 C ++中的 std :: pair。这些类很诱人，因为它们使使用单个变量轻松传递多个对象变得容易。最常见的用途之一是从一个方法返回多个值，如以下 Java 示例所示：

```java
return new Pair<Integer, Boolean>(currentTerm, false);
```

不幸的是，通用容器导致代码不清晰，因为分组后的元素的通用名称模糊了它们的含义。在上面的示例中，调用者必须使用 result.getKey（）和 result.getValue（）引用两个返回的值，而这两个值都不提供这些值的实际含义。因此，最好不要使用通用容器。如果需要容器，请定义专门用于特定用途的新类或结构。然后，您可以为元素使用有意义的名称，并且可以在声明中提供其他文档，而对于常规容器而言，这是不可能的。

此示例说明了一条通用规则：软件应设计为易于阅读而不是易于编写。通用容器对于编写代码的人来说是很方便的，但是它们会使随后的所有读者感到困惑。对于编写代码的人来说，花一些额外的时间来定义特定的容器结构是更好的选择，以便使生成的代码更加明显。不同类型的声明和分配。考虑以下 Java 示例：

```java
private List<Message> incomingMessageList;
...
incomingMessageList = new ArrayList<Message>();
```

将该变量声明为 List，但实际值为 ArrayList。这段代码是合法的，因为 List 是 ArrayList 的超类，但是它会误导看到声明但不是实际分配的读者。实际类型可能会影响变量的使用方式（ArrayList 与 List 的其他子类相比，具有不同的性能和线程安全属性），因此最好将声明与分配匹配。违反读者期望的代码。考虑以下代码，这是 Java 应用程序的主程序：

```java
public static void main(String[] args) {
    ...
    new RaftClient(myAddress, serverAddresses);
}
```

大多数应用程序在其主程序返回时退出，因此读者可能会认为这将在此处发生。但是，事实并非如此。RaftClient 的构造函数创建其他线程，即使应用程序的主线程完成，该线程仍可继续运行。应该在 RaftClient 构造函数的接口注释中记录此行为，但是该行为不够明显，因此值得在 main 末尾添加简短注释。该注释应指示该应用程序将继续在其他线程中执行。如果代码符合读者期望的惯例，那么它是最明显的。如果没有，那么记录该行为很重要，以免使读者感到困惑。

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
