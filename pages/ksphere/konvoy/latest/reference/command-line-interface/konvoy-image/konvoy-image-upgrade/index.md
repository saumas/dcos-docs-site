---
layout: layout.pug
navigationTitle: konvoy image upgrade
title: konvoy image upgrade
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Upgrade the Konvoy CLI image version
---

## konvoy image upgrade

Upgrade the Konvoy CLI image version

### Synopsis

Upgrade the Konvoy CLI image version

```
konvoy image upgrade [flags]
```

### Options

```
      --docker-registry-auth-service-url string   Docker registry token authentication service url
      --docker-registry-password string           Docker registry password
      --docker-registry-repository string         Docker registry image repository
      --docker-registry-service string            Name of the service which hosts the resource in the Docker registry
      --docker-registry-skip-verify               Flag to turn off the Docker registry certificate verification
      --docker-registry-url string                Docker registry url (default "https://registry-1.docker.io")
      --docker-registry-username string           Docker registry username
  -h, --help                                      help for upgrade
      --verbose                                   enable to debug level logging
      --version string                            Konvoy CLI version
```

### SEE ALSO

* [konvoy image](../)	 - Run Konvoy CLI images related actions

###### Auto generated by spf13/cobra on 10-Sep-2019