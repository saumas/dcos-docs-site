---
layout: layout.pug
navigationTitle:  dcos security cluster ca sign
title: dcos security cluster ca sign
menuWeight: 20
excerpt: 签名 CSR
render: mustache
model: /mesosphere/dcos/2.1/data.yml
enterprise: true
---

# 说明

`dcos security cluster ca sign` 命令允许您签署证书签名请求 (CSR)。

# 使用

```
dcos security cluster ca sign [OPTIONS]
```

# 选项

| 名称 | 说明 |
|----------|---------------|
| `--csr <filename>` | CSR 签名路径。（必填)|
|  `-p`, `--profile <text>` | 要使用的签名资料。|
|  `-h`, `--help` |                显示此消息并退出。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos security cluster ca](/mesosphere/dcos/cn/2.1/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | 查看 DC/OS 安全群集证书颁发机构信息。 |
