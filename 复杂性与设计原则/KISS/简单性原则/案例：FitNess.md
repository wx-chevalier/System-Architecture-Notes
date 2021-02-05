# FitNesse 实例

这段代码案例来自 Robert Martin 的著作《代码整洁之道》。Robert Martin 在书中给出了对源代码的三个重构版本，这三个版本的演化恰好可以帮助我们理解简单设计原则。重构前的代码初始版本是定义在 HtmlUtil 类中的一个长函数：

```java
public static String testableHtml(PageData pageData, boolean includeSuiteSetup) throws Exception {
        WikiPage wikiPage = pageData.getWikiPage();
        StringBuffer buffer = new StringBuffer();
        if (pageData.hasAttribute("Test")) {
            if (includeSuiteSetup) {
                WikiPage suiteSetupPage = PageCrawlerImpl.getInheritedPage(SuiteResponder.SUITE_SETUP_NAME, wikiPage);
                if (suiteSetupPage != null) {
                    WikiPagePath pagePath = wikiPage.getPageCrawler().getFullPath(suiteSetupPage);
                    String pagePathName = PathParser.render(pagePath);
                    buffer.append("\n!include -setup .")
                          .append(pagePathName)
                          .append("\n");
                }
            }
            WikiPage setupPage = PageCrawlerImpl.getInheritedPage("SetUp", wikiPage);
            if (setupPage != null) {
                WikiPagePath setupPath = wikiPage.getPageCrawler().getFullPath(setupPage);
                String setupPathName = PathParser.render(setupPath);
                buffer.append("\n!include -setup .")
                      .append(setupPathName)
                      .append("\n");
            }
        }
        buffer.append(pageData.getContent());
        if (pageData.hasAttribute("Test")) {
            WikiPage teardownPage = PageCrawlerImpl.getInheritedPage("TearDown", wikiPage);
            if (teardownPage != null) {
                WikiPagePath tearDownPath = wikiPage.getPageCrawler().getFullPath(teardownPage);
                String tearDownPathName = PathParser.render(tearDownPath);
                buffer.append("\n")
                      .append("!include -teardown .")
                      .append(tearDownPathName)
                      .append("\n");
            }
            if (includeSuiteSetup) {
                WikiPage suiteTeardownPage = PageCrawlerImpl.getInheritedPage(SuiteResponder.SUITE_TEARDOWN_NAME, wikiPage);
                if (suiteTeardownPage != null) {
                    WikiPagePath pagePath = wikiPage.getPageCrawler().getFullPath(suiteTeardownPage);
                    String pagePathName = PathParser.render(pagePath);
                    buffer.append("\n!include -teardown .")
                          .append(pagePathName)
                          .append("\n");
                }
            }
        }
        pageData.setContent(buffer.toString());
        return pageData.getHtml();
    }
```

假定这一个函数已经通过了测试，按照简单设计的评判步骤，我们需要检查代码是否存在重复。显然，在上述代码的 6~13 行、15~22 行、26~34 行以及 36~43 行四个地方都发现了重复或相似的代码。这些代码的执行步骤像一套模板：

- 获取 Page
- 若 Page 不为 null，则获取路径
- 解析路径名称
- 添加到输出结果中

这套模板的差异部分可以通过参数差异化完成，故而可以提取方法：

```java
private static void includePage(WikiPage wikiPage, StringBuffer buffer, String pageName, String sectionName) {
        WikiPage suiteSetupPage = PageCrawlerImpl.getInheritedPage(pageName, wikiPage);
        if (suiteSetupPage != null) {
            WikiPagePath pagePath = wikiPage.getPageCrawler().getFullPath(suiteSetupPage);
            String pagePathName = PathParser.render(pagePath);
            buildIncludeDirective(buffer, sectionName, pagePathName);
        }
    }

    private static void buildIncludeDirective(StringBuffer buffer, String sectionName, String pagePathName) {
        buffer.append("\n!include ")
                .append(sectionName)
                .append(" .")
                .append(pagePathName)
                .append("\n");
    }
```

在提取了 includePage()方法后，就可以消除四段几乎完全相似的重复代码。重构后的长函数为：

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

若遵循信息专家模式，isTestPage()方法应该分配给 PageData 类，通过移动方法，转移到 PageData 类后，将其改变为实例方法：

```java
public class PageData
    private boolean isTestPage() {
        return hasAttribute("Test");
    }
}
```

重构后的 testableHtml()方法的可读性仍有不足之处，例如方法的名称，buffer 变量名都没有清晰表达设计意图，对 Test 和 Suite 的判断增加了条件分支，给代码阅读制造了障碍。由于 includePage()方法是一个通用方法，未能清晰表达其意图，且传递的参数同样干扰了阅读，应该将各个调用分别封装为表达业务含义的方法，例如定义为 includeSetupPage()。当页面并非测试页面时，pageData 的内容无需重新设置，可以直接通过 getHtml()方法返回。因此，添加页面内容的第 11 行代码还可以放到 isTestPage() 分支中，让逻辑变得更加紧凑：

```java
public static String renderPage(PageData pageData, boolean includeSuiteSetup) throws Exception {
    if (pageData.isTestPage()) {
        WikiPage testPage = pageData.getWikiPage();
        StringBuffer newPageContent = new StringBuffer();

        includeSuiteSetupPage(testPage, newPageContent, includeSuiteSetup);
        includeSetupPage(testPage, newPageContent);
        includePageContent(testPage, newPageContent);
        includeTeardownPage(testPage, newPageContent);
        includeSuiteTeardownPage(testPage, newPageContent, includeSuiteSetup);

        pageData.setContent(buffer.toString());
    }
    return pageData.getHtml();
}
```

无论是避免重复，还是清晰表达意图，这个版本的代码都要远胜于最初的版本。Robert Martin 在《代码整洁之道》中也给出了他重构的第一个版本：

```java
public static String renderPageWithSetupsAndTeardowns(PageData pageData, boolean isSuite) throws Exception {
    boolean isTestPage = pageData.hasAttribute("Test");
    if (isTestPage) {
        WikiPage testPage = pageData.getWikiPage();
        StringBuffer newPageContent = new StringBuffer();
        includeSetupPages(testPage, newPageContent, isSuite);
        newPageContent.append(pageData.getContent());
        includeTeardownPages(testPage, newPageContent, isSuite);
        pageData.setContent(newPageContent.toString());
    }
    return pageData.getHtml();
}
```

对比我的版本和 Robert Martin 的版本，我认为 Robert Martin 的当前版本仍有以下不足之处：

- 方法名称过长，暴露了实现细节
- isTestPage 变量不如 isTestPage()方法的封装性好
- 方法体缺少分段，不同的意图混淆在了一起

最关键的不足之处在于第 7 行代码。对比第 7 行和第 6、8 两行代码，虽然都是一行代码，但其表达的意图却有风马牛不相及的违和感。这是因为第 7 行代码实际暴露了将页面内容追加到 newPageContent 的实现细节，第 6 行和第 8 行代码却隐藏了这一实现细节。这三行代码没有处于同一个抽象层次，违背了“单一抽象层次原则（SLAP）”。Robert Martin 在这个版本基础上，继续精进，给出了重构后的第二个版本：

```java
public static String renderPageWithSetupsAndTeardowns(PageData pageData, boolean isSuite) throws Exception {
    if (isTestPage(pageData))
        includeSetupAndTeardownPages(pageData, isSuite);
    return pageData.getHtml();
}
```

该版本的方法仍然定义在 HtmlUtil 工具类中。对比 Robert Martin 的两个重构版本，后一版本的主方法变得更加简单了，方法体只有短短的三行代码。虽然方法变得更简短，但提取出来的 includeSetupAndTeardownPages()方法却增加了不必要的抽象层次。

# 有限封装

封装需要有度，引入太多的层次反而会干扰阅读。尤其是方法，Java 或大多数语言都不提供“方法嵌套方法”的层次结构（Scala 支持这一语法特性）。如果为一个方法的不同业务层次提取了太多方法，在逻辑上，它存在递进的嵌套关系，在物理上，却是一个扁平的结构。阅读这样的代码会造成不停的跳转，不够直接。正如 Grady Booch 所述：“整洁的代码从不隐藏设计者的意图，充满了干净利落的抽象和直截了当的控制语句。”干净利落，直截了当，可以破除对过度细粒度方法的迷信！与其封装一个用超长名称才能表达其意图的 includeSetupAndTeardownPages()方法，不如直接“敞开”相同层次的代码细节，如：

```java
includeSuiteSetupPage(testPage, newPageContent, includeSuiteSetup);
includeSetupPage(testPage, newPageContent);
includePageContent(testPage, newPageContent);
includeTeardownPage(testPage, newPageContent);
includeSuiteTeardownPage(testPage, newPageContent, includeSuiteSetup);
```

这五行代码不正是直截了当地表达了包含的页面结构吗？因此，我觉得 Robert Martin 提取出来的 includeSetupAndTeardownPages()方法违背了简单设计的第四条原则，即增加了不必要的软件元素。事实上，如果一个方法的名称包含了 and，就说明该方法可能违背了“一个方法只做一件事情”的基本原则。

我并不反对定义细粒度方法，相反我很欣赏合理的细粒度方法，如前提取的 includePageContent()方法。一个庞大的方法往往缺少内聚性，不利于重用，但什么才是方法的合适粒度呢？不同的公司有着不同的方法行限制，有的是 200 行，有的是 50 行，有的甚至约束到 5 行。最关键的不是限制代码行，而在于一个方法只能做一件事。

若发现一个主方法过长，可通过提取方法使它变短。当提取方法的逻辑层次嵌套太多，彼此的职责又高内聚时，就需要考虑将这个主方法和提取出来的方法一起委派到一个专门的类。此外，通过 includeSetupPage()等方法传递的共同参数，也说明了这些方法相较于其他方法而言，要更加内聚。

由此可知，testableHtml()方法的逻辑提供了一个相对独立的职责，不应该将其实现逻辑放在 HtmlUtil 工具类，而应按照其意图独立为一个类 TestPageIncluder。一旦提取为类，还可以将方法共同传递的参数转换为这个新类的字段，从而减少方法之间传递的参数。重构后的代码为：

```java
public class TestPageIncluder {
    private PageData pageData;
    private WikiPage testPage;
    private StringBuffer newPageContent;
    private PageCrawler pageCrawler;

    private TestPageIncluder(PageData pageData) {
        this.pageData = pageData;
        testPage = pageData.getWikiPage();
        pageCrawler = testPage.getPageCrawler();
        newPageContent = new StringBuffer();
    }

    public static String render(PageData pageData) throws Exception {
        return render(pageData, false);
    }

    public static String render(PageData pageData, boolean isSuite) throws Exception {
        return new TestPageIncluder(pageData).renderPage(isSuite);
    }

    private String renderPage(boolean isSuite) throws Exception {
        if (pageData.isTestPage()) {
            includeSetupPages(isSuite);
            includePageContent();
            includeTeardownPages(isSuite);
            updatePageContent();
        }
        return pageData.getHtml();
    }

    private void includeSetupPages(boolean isSuite) throws Exception {
        if (isSuite) {
            includeSuitesSetupPage();
        }
        includeSetupPage();
    }
    private void includeSuitesSetupPage() throws Exception {
        includePage(SuiteResponder.SUITE_SETUP_NAME, "-setup");
    }
    private void includeSetupPage() throws Exception {
        includePage("SetUp", "-setup");
    }
    private void includeTeardownPages(boolean isSuite) throws Exception {
        if (isSuite) {
            includeSuitesTeardownPage();
        }
        includeTeardownPage();
    }
    private void includeSuitesTeardownPage() throws Exception {
        includePage(SuiteResponder.SUITE_TEARDOWN_NAME, "-teardown");
    }
    private void includeTeardownPage() throws Exception {
        includePage("TearDown", "-teardown");
    }

    private void updateContent() throws Exception {
        pageData.setContent(newPageContent.toString());
    }

    private void includePage(String pageName, String sectionName) throws Exception {
        WikiPage inheritedPage = PageCrawlerImpl.getInheritedPage(pageName, wikiPage);
        if (inheritedPage != null) {
            WikiPagePath pagePath = wikiPage.getPageCrawler().getFullPath(inheritedPage);
            String pathName = PathParser.render(pagePath);
            buildIncludeDirective(pathName, sectionName);
        }
    }
    private void buildIncludeDirective(String pathName, String sectionName) {
        buffer.append("\n!include ")
            .append(sectionName)
            .append(" .")
            .append(pathName)
            .append("\n");
    }
}
```

引入 TestPageIncluder 类后，职责的层次更加清晰了，分离出来的这个类承担了组装测试页面信息的职责，HtmlUtil 类只需要调用它的静态方法 render()即可，避免了因承担太多职责而形成一个上帝类。通过提取出类和对应的方法，形成不同的抽象层次，让代码的阅读者有选择地阅读自己关心的部分，这就是清晰表达设计者意图的价值。

对比 Robert Martin 给出的重构第二个版本以及这个提取类的最终版本，我赞成将该主方法的逻辑提取给专门的类，但不赞成在主方法中定义过度抽象层次的 includeSetupAndTeardownPages()方法。

我曾就 Robert Martin 给出的两个版本做过调查，发现仍然有一部分人偏爱第二个更加简洁的版本。这一现象恰好说明简单设计的第三条原则属于主观判断，不如第二条原则那般具有客观的评判标准，恰如大家对美各有自己的欣赏。但我认为，一定不会有人觉得重构前的版本才是最好。即使不存在重复代码，单从可读性角度判断，也会觉得最初版本的代码不堪入目，恰如大家对美的评判标准，仍具有一定的普适性。

Robert Martin 在《代码整洁之道》中也给出了分离职责的类 SetupTeardownIncluder。两个类的实现相差不大，只是 TestPageIncluder 类要少一些方法。除了没有 includeSetupAndTeardownPages()方法外，我也未曾定义 findInheritedPage()和 getPathNameForPage()之类的方法，也没有提取 isSuite 字段，因为我认为这些都是不必要的软件元素，它违背了简单设计的第四条原则，应当用奥卡姆的剃刀一割了之。

当然，如果开发人员在编写代码时就能遵循简单设计原则，实则也不会写出 FitNesse 最早版本这样的代码，因为该原则与测试驱动开发相匹配，在完成一个失败测试的实现之后，应该即刻进行重构，重构时依据重用性、可读性和简单性对代码质量进行判断，自然不会出现大段的充满了重复、冗长的代码臭味。
