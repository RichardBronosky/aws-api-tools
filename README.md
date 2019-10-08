[![Build Status](http://jenkins.furnitureapis.com:8080/buildStatus/icon?job=RoomstoGoDigital/roomstogatsby/master)](http://jenkins.furnitureapis.com:8080/job/RoomstoGoDigital/job/roomstogatsby/job/master/)

## Install

Make sure you have NVM installed
```sh
brew install NVM
```

Change to the node version this repo requires
```sh
nvm use
```

Make sure that you have the Gatsby CLI program installed:

```sh
npm install --global gatsby-cli
```

Run npm install so that you can get all the modules:

```sh
npm install
```

Run the site locally on http://localhost:8000

```sh
npm run develop
```

Clearing the cache if you get any Gatsby/GraphQL Errors

```sh
npm run clear_cache
```

#### Links

[Dev Site on S3](http://www.rtg-dev.com/)

[Analytics](https://analytics.google.com/analytics/web/) (Rooms To Go -> Test - RTG Gatsby)

[Google Tag Manager](https://tagmanager.google.com/) (Rooms To Go -> RoomsToGo.com)


#### Regionality

You can set the region in the .env.development file.
