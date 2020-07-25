# 架构衍化

# 分布式应用的需求

当我们构建服务端应用程序时，随着业务逻辑复杂度以及协作者的增加，我们不可避免地会将其变为分布式应用，良好的分布式应用程序应该是无状态的、可扩展的、可配置的、独立发布的、容器化的、可自动化的，有时甚至是事件驱动的和 Serverless。创建之后，它们应该很容易进行升级，并且可以承受长期的维护。借鉴《[多运行时微服务架构实践](https://mp.weixin.qq.com/s/Sqpz4KD6Gyb7GDd0WVT8dg)》一文中的描述，我们可以把现代分布式应用程序的需求分为 4 类，分别是生命周期（lifecycle）、网络（networking）、状态（state）和绑定（binding）。

# 服务衍化

![](https://i.postimg.cc/fyh0pT8K/image.png)

![](https://i.postimg.cc/L4zPfLs0/image.png)
