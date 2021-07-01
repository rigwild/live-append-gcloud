# Live append

A real-time webpage content synchronization using WebSockets and Cloud Pub/Sub.

This is just for fun to play with Google Cloud. It should be covered by the free tier quota.

Google Cloud services used:

- [Cloud Build](https://cloud.google.com/build)
- [Container Registry](https://cloud.google.com/container-registry)
- [Cloud Run](https://cloud.google.com/run)
- [Cloud Pub/Sub](https://cloud.google.com/pubsub/)

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

- Edit & Deploy a new revision of your Cloud Run service: https://console.cloud.google.com/run

  - Set the maximum requests per container to 1
  - Deploy the revision

- Create Cloud Pub/Sub channel and subscription

```sh
gcloud pubsub topics create my-topic
gcloud pubsub subscriptions create my-sub --topic my-topic
```

- Access the app using the URI of your Cloud Run instance in multiple browser tabs
- Notice the real-time synchronization
- Delete your Google Cloud project to clean up the resources

**Note:** Alternatively, the same functionality could have been achieved using services like [Cloud Pub/Sub](https://cloud.google.com/pubsub/) or [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging). This is just for fun.

# Run locally

Install dependencies

```sh
yarn
```

Create a Service account and enable the Pub/Sub API for that project. Download the private key in JSON format at `serviceAccount.json`.

Run multiple instances

```sh
GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json PORT=8080 node server.js
GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json PORT=8081 node server.js
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
