---
layout: layout.pug
beta: true
navigationTitle: Managing Clusters
title: Managing Clusters
menuWeight: 7
excerpt: View clusters created with Kommander or any connected Kubernetes cluster
---

## Creating or Connecting Clusters

Kommander allows you to monitor and manage very large numbers of clusters and so we make it easy to either connect existing clusters or create new clusters whose lifecycle is managed by Konvoy.

## Before you begin:

You must have run `konvoy up` with the Kommander addon deployed. You should be looking at the Kommander UI.
If you are creating a cluster with a cloud partner (Azure, AWS), you must configure your [infrastructure provider](/ksphere/kommander/1.2/operations/infrastructure-providers/).
If you are planning on attaching more than one cluster, ensure you enter your valid [license](/ksphere/kommander/1.2/licensing/).

From the dashboard page or the clusters page, click Add Cluster and Create Konvoy Cluster.

![Add Cluster Options](/ksphere/kommander/1.2/img/add-cluster.png)

### Creating a Konvoy Cluster

- [Creating Konvoy Clusters on AWS](/ksphere/kommander/1.2/clusters/creating-konvoy-cluster-aws/)
- [Creating Konvoy Clusters on Azure](/ksphere/kommander/1.2/clusters/creating-konvoy-cluster-azure/)
- [Creating Konvoy Clusters on your own infrastructure](/ksphere/kommander/1.2/clusters/creating-konvoy-cluster-on-prem/)

### Connecting an Existing Cluster

Using the Add Cluster option, you can attach an already existing cluster, even an existing Konvoy cluster, directly to Kommander. Enjoy all the multi-cluster management and monitoring benefits that Kommander provides while keeping your existing cluster on its current provider & infrastructure.

See [Attach Cluster](/ksphere/kommander/1.2/clusters/attach-cluster/)

### Creating a Konvoy Cluster via YAML

Selecting the **Upload YAML option** allows you to use a config generated by the Konvoy CLI tool. An example config can be created in the file `cluster.yaml` by [running](/ksphere/konvoy/1.5/reference/command-line-interface/konvoy-init/) `konvoy init`, or one is generated after running `konvoy up`. Ensure the correct Cloud Provider credentials are selected and add any cluster labels that apply.

![Create Cluster Upload YAML](/ksphere/kommander/1.2/img/create-cluster-yaml.png)

#### Adding Infrastructure Provider Tags

A tag is similar to a label and helps manage and track this cluster at the infrastructure provider level along with other provider resources. As providers support different amounts of tags, up to 10 tags may be added here as a baseline. You can add more directly through your infrastructure provider.

#### Adding/Removing Cluster Labels

Cluster labels are matched to the selectors created for [projects](/ksphere/kommander/1.2/projects/). If a cluster is removed from a project, any resources deployed to the cluster from that Project are removed. If a cluster is added to a project any existing project resources are deployed to the cluster.

#### Valid labels

- Valid labels must have a key and a value, separated by a colon and a space. For example, "env: dev". If you are creating the label through the UI, the space is automatically added when entering your values in the fields.
- Valid label keys and values must be alphanumeric and can contain “-”, “\_”, or “.”
- Valid label keys and values must not start or end with “-”, “\_”, or “.”

## Types

There are several types of clusters to be aware of in the Clusters tab.

- **Attached**: A cluster that was not created with Kommander. Attached clusters' lifecycle cannot be managed.
- **Managed**: A Konvoy cluster that was created with Kommander. Managed clusters' lifecycle can be managed.
- **Management**: The Konvoy cluster that hosts Kommander.

## Upgrading Kubernetes version

You can upgrade Kubernetes version on a running cluster from the Cluster Detail page (Figure 2.)
Select an available desired version from the Version dropdown and confirm your action in the confirmation dialog.

Figure 1:
![Update Kubernetes Version Action](/ksphere/kommander/1.2/img/upgrade-kubernetes-action-1-1-0.png)
Figure 2:
![Update Kubernetes Version Action](/ksphere/kommander/1.2/img/upgrade-kubernetes-confirmation-1-1-0.png)

## Editing Clusters

![Edit a Cluster Action](/ksphere/kommander/1.2/img/edit-cluster-action.png)

### Editing an Attached cluster

For an Attached cluster you can only edit labels that are assigned to it.

![Edit an Attached Cluster](/ksphere/kommander/1.2/img/edit-cluster-attached-1-1-0.png)

### Editing a Managed cluster

For a Managed cluster you can edit its name, Kubernetes version, labels, cloud provider tags, and its node pools.

![Edit a Cluster Form](/ksphere/kommander/1.2/img/edit-cluster-form-name-1-1-0.png)

#### Editing a node pool

When editing a node pool, you can only increase the number of nodes in the pool. This is to prevent losing any workloads that are currently running on the cluster.

You can also add labels and taints to a node pool.

![Edit a Cluster Node Pools](/ksphere/kommander/1.2/img/edit-cluster-node-pools.png)

#### Editing labels and cloud provider tags

When editing labels, you can not delete the region or provider labels.

![Edit a Cluster Labels and Cloud Provider Tags](/ksphere/kommander/1.2/img/edit-cluster-labels-tags-1-1-0.png)

## Disconnect vs Delete

When you attach a cluster to Kommander that was not created with Kommander, you may later disconnect it. This does not alter the running state of the cluster, but simply removes it from the Kommander UI.

For managed clusters created with Kommander, disconnecting the cluster is not an option, but it can be deleted. This completely removes the cluster and all of its cloud assets.

<p class="message--warning"><strong>WARNING: </strong>
If you delete the management (Konvoy) cluster, you won't be able to use Kommander to delete the managed clusters that were created by Kommander. Be sure and delete any managed clusters before finally deleting the Konvoy cluster if your intention is to delete all clusters.
</p>

## Statuses

| Status         | Description                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pending        | This is the initial state when a cluster is created or connected.                                                                                                   |
| Loading Data   | The cluster has been added to Kommander and we are fetching details about the cluster. This is the status before `Active`.                                          |
| Active         | The cluster is connected to API server                                                                                                                              |
| Provisioning\* | The cluster is being created on your cloud provider. This process can take a long time. To follow the progress of creation, click "View Logs" in the dropdown menu. |
| Joining        | Cluster is being joined to the management cluster for federation.                                                                                                   |
| Joined         | The join process is done, we wait for the first bit of data from the cluster to arrive                                                                              |
| Deleting       | Cluster is being deleted. This process may a long time.                                                                                                             |
| Error          | There has been an error connecting to the cluster or retrieving data from the cluster.                                                                              |
| Failed\*       | The cluster has failed to be provisioned. For more info on the failure, click "View Logs" in the dropdown menu.                                                     |
| Join Failed    | This can happen when kubefed does not have permission to create entities in the target cluster.                                                                     |
| Unjoining      | Kubefed cleans up after itself, removing all installed resources on the target cluster.                                                                             |
| Unjoined       | The cluster has been disconnected from the management cluster.                                                                                                      |
| Unjoin Failed  | Unjoining from kubefed failed or some other error with deleting or disconnecting.                                                                                   |
| Deleting       | The cluster and its resources are being removed from your cloud provider. Click "View Logs" in the dropdown menu to follow progress. This process may a long time.  |
| Deleted        | The cluster and its resources have been removed from your cloud provider.                                                                                           |
| Provisioned\*  | The cluster has been created on your cloud provider.                                                                                                                |

\* These statuses only happen on Managed clusters

## Resources

![Cluster card with resources](/ksphere/kommander/1.2/img/cluster-card.png)

Figure 1. A cluster card with resources

| Resource        | Description                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU Requests    | The portion of the allocatable CPU resource that the cluster is requesting to be allocated. Measured in number of cores (e.g.: .5 cores)                      |
| CPU Limits      | The portion of the allocatable CPU resource that the cluster is limited to allocating. Measured in number of cores (e.g.: .5 cores)                           |
| CPU Usage       | How much of the allocatable CPU resource that is being consumed. Cannot be higher than the configured CPU limit. Measured in number of cores (e.g.: .5 cores) |
| Memory Requests | The portion of the allocatable memory resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 GiB)                               |
| Memory Limits   | The portion of the allocatable memory resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 GiB)                                    |
| Memory Usage    | How much of the allocatable memory resource that is being consumed. Cannot be higher than the configured memory limit. Measured in bytes (e.g.: 64 GiB)       |
| Disk Requests   | The portion of the allocatable ephemeral storage resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 GiB)                    |
| Disk Limits     | The portion of the allocatable ephemeral storage resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 GiB)                         |

For more detailed information, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) about resources.

## Platform Services

Services that have been installed on your management cluster. You can visit a cluster's detail page to see which platform services have been enabled under the "Addons" section.

![Cluster Detail Page](/ksphere/kommander/1.2/img/cluster-detail-page.png)

Figure 2. Cluster detail page

[k8s_resources]: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
[k8s_docs]: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
