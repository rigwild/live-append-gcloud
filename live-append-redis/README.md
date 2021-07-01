# Live append

A real-time webpage content synchronization using WebSockets and a Redis PubSub.

This is just for fun to play with Google Cloud. It should be covered by the free tier quota.

Google Cloud services used:

- [Cloud Build](https://cloud.google.com/build)
- [Container Registry](https://cloud.google.com/container-registry)
- [Cloud Run](https://cloud.google.com/run)
- [Virtual Private Cloud (VPC)](https://cloud.google.com/vpc)
- [Memorystore (Redis)](https://cloud.google.com/memorystore/vpc)

# Deploy on Google Cloud

- Create a new Google Cloud project

- Build your image using Cloud Build and store it in Container Registry

```sh
gcloud builds submit --tag gcr.io/PROJECT_ID/liveappend
```

- Deploy your image to Cloud Run

```sh
gcloud run deploy --image gcr.io/PROJECT_ID/liveappend
```

- Create a Redis Memorystore instance: https://console.cloud.google.com/memorystore/redis/instances

- Create a Virtual Private Cloud (VPC): https://console.cloud.google.com/networking/networks/list
- Create a Serverless VPC access connector (to allow Cloud Run instances to connect with Memorystore): https://console.cloud.google.com/networking/connectors/list

  - Set the IP address range corresponding to your Memorystore instance or your Cloud Run instances will not be able to reach your Redis instance!

- Edit & Deploy a new revision of your Cloud Run service: https://console.cloud.google.com/run

  - Set the maximum requests per container to 1
  - Set the `REDIS_HOST` environment variable to your Redis instance IP
  - Set your previously created VPC serverless connector
  - Deploy the revision

- Access the app using the URI of your Cloud Run instance in multiple browser tabs
- Notice the real-time synchronization
- Delete your Google Cloud project to clean up the resources

**Note:** Alternatively, the same functionality could have been achieved using services like [Cloud Pub/Sub](https://cloud.google.com/pubsub/) or [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging). This is just for fun.

# Run locally

Start a Redis server

```sh
redis-server
```

Install dependencies

```sh
yarn
```

Run multiple instances

```sh
PORT=8080 node server.js
PORT=8081 node server.js
```

Open both webpages and notice the real-time synchronization.

# License

```
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2021 rigwild <me@rigwild.dev>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
```
