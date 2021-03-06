---
layout: layout.pug
navigationTitle:  dcos node
title: dcos node
menuWeight: 11
excerpt: 显示 DC/OS 节点信息
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: false
---

<p class="message--warning"><strong>警告：</strong>从 DC/OS 1.13 开始，使用 <tt>dcos node</tt> 命令列出节点已被弃用。要列出 dcos 节点，请使用 <tt><a href="/mesosphere/dcos/1.13/cli/command-reference/dcos-node/dcos-node-list/">dcos node list</a></tt> 命令。</p>

# 说明
`dcos node` 命令允许您查看 DC/OS 节点信息。


# 使用

```bash
dcos node [OPTION]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` |  显示用法。 |
| `--info`   | 显示该子命令的简短描述。|
| `--json`   | 显示 JSON 格式的数据。|
| `--version`   | 显示版本信息。|


# 示例

```bash
dcos node
Getting the list of nodes from `dcos node` is deprecated. Please use `dcos node list`.
   HOSTNAME        IP            PUBLIC IP(S)                       ID                            TYPE            REGION          ZONE
  10.0.2.221   10.0.2.221       213.61.89.166       02b1bdc8-2bac-44a0-81ff-65816936b97b-S1   agent            aws/us-west-2  aws/us-west-2a
  10.0.5.54    10.0.5.54        213.61.89.167       02b1bdc8-2bac-44a0-81ff-65816936b97b-S0   agent (public)   aws/us-west-2  aws/us-west-2a
master.mesos.  10.0.6.122       213.61.89.168       02b1bdc8-2bac-44a0-81ff-65816936b97b      master (leader)  aws/us-west-2  aws/us-west-2a
```

# 命令

