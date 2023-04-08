# Flowchart

流程图的语法大致分为两部分，定义元素与连接元素。定义元素即：

```s
tag=>type: content:>url
```

tag 标签，用于连接元素时使用；type 即该标签的类型。共有 6 种类型如下：

```s
start
end
operation
subroutine
condition
inputoutput
```

content 指流程语句中放置的内容，注意 `type:` 与 content 之间一定要有一个空格。url 则表示链接，与流程语句绑定。连接元素则主要是 `->` 符号，如：

```s
c2(yes)->io->e
c2(no)->op2->e
```

# 实例

```s
st=>start: Start|past:>http://www.baidu.com
e=>end: End:>http://www.baidu.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes or No?|approved:>http://www.baidu.com
c2=>condition: Good idea|rejected
io=>inputoutput: catch something...|request

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```

![示意图](https://i.postimg.cc/0QTqyqGk/image.png)

```s
st=>start: Start
e=>end: End
cond=>condition: Option
op1=>operation: solution_1
op2=>operation: solution_2

st->cond
cond(yes)->op1->e
cond(no)->op2->e
```

![Flowchart 示意图](https://i.postimg.cc/LsWcxMbt/image.png)

```s
st=>start: Start
e=>end: Why are you worried?
cond1=>condition: Do you have a problem?
cond2=>condition: Can you solve it?
op=>operation: Since you can't solve it,

st->cond1
cond1(yes)->cond2
cond1(no)->e
cond2(yes)->e
cond2(no)->op->e
```

![Flowchart 示意图](https://i.postimg.cc/mrPqz5gt/image.png)
