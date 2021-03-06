---
layout: layout.pug
navigationTitle:  Jenkins for DC/OS
title: Jenkins for DC/OS
menuWeight: 60
beta: false
excerpt: Run your continuous integration, automated testing, and continuous delivery jobs at scale with Jenkins for DC/OS.
featureMaturity:
enterprise: false
category: Continuous Delivery
---

Run your continuous integration, automated testing, and continuous delivery jobs at scale with Jenkins for DC/OS. Instead of the static partitions so typical of other Jenkins clusters, Jenkins for DC/OS  can create and destroy agents as demand increases and decreases. With multiple Jenkins masters sharing a single pool of compute resources, you can achieve much more efficient and resilient automations.

Jenkins for DC/OS needs a directory on disk to store its configuration and build data. To get up and running quickly, you can pin it to a single agent and use this to store the data. However, should the agent go down, your data will be lost.

Before going into production, you should set up a single POSIX-compliant file system that each agent mounts using the same path. Some options include NFS, Ceph, HDFS, and iSCSI.
