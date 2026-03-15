# 系统架构设计原则

![EP54~Top 10 Architecture Characteristics / Non-Functional Requirements with Cheatsheet](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/uPic/ANFRGQ5IxaUj.webp)

# 理解高可用

高可用是一个具体而又抽象的名词，谈及此我们会联想到用户随时随地访问系统即可得到预期的响应。

- 安全：内部的操作失误，外部的安全威胁 机密，完整，可用
- 可靠：各种黑天鹅事件 能够应对故障，提供冗余，便于运维
- 扩展：高并发峰值应对 可理解

高可用的挑战

- 不可靠的系统：在《[DistributedSystem-Notes](https://github.com/wx-chevalier/DistributedSystem-Notes?q=)》中我们详细讨论过不可靠的分布式系统。
- 高并发：
- 复杂性：
- 隐蔽性：
- 其他威胁：安全攻击，

# 代价

实现高可用系统并不是无代价的。

# Run cost as architecture fitness function

对于今天的组织来说，自动化评估、跟踪和预测云基础设施的运行成本是必要的。云供应商精明的定价模型，以及基于定价参数的费用激增，再加上现代架构的动态本质，常常导致让人吃惊的运行成本。例如，无服务架构基于 API 访问量的费用，事件流方案中基于流量的费用，以及数据处理集群中基于运行任务数量的费用，它们都具有动态的本质，会随着架构演进而产生改变。当我们的团队在云平台上管理基础设施时，将运行成本实现为架构适应度函数是他们的早期活动之一。这意味着我们的团队可以观察运行服务的费用，并同交付的价值进行对比；当看到与期望或可接受的结果之间存在偏差时，他们就会探讨架构是否应该继续演进了。对运行成本的观察和计算需要被实现为自动化的函数。

# Links

- [2021~21 大软件架构特点的全面解析](https://mp.weixin.qq.com/s?__biz=MzA3OTc0MzY1Mg==&mid=2247502628&idx=5&sn=29d08b015eca4ffc8d72a11e54750f6e&scene=58&subscene=0): 我们从业务需求（业务特征）、我们期望的系统运营方式（运营特征）中总结出这些特点，它们是隐式的、贯穿各领域，是架构师在字里行间能看出来的特点。
