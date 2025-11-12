---
layout: post
title: "Our Gitlab CI setup"
date: "2015-10-03"
comments: true
tags: [dev]
draft: false
---

We're fervent supporters of Gitlab in our company, and [when they rolled out a new CI module](https://about.gitlab.com/2015/09/22/gitlab-8-0-released/), we immediately jumped in to see how
we can use it. In the past I've had experience with Jenkins, and a little bit with Travis. The Gitlab CI module is kind of based on Travis which is cool.
It's rather new so I had my doubts about it initially, but fortunately it turned out pretty good.

## The Project for the CI

Recently I'm working on a project where we need to distribute a software to a fleet of raspberry pis.
I had already packaged it nicely with goxc, but I was not really sure about how I would distribute it.
I was contemplating two options

* build at CI and deploy via something like ansible
* build at CI, deploy to a central repo, and fetch from the clients

Setting up with ansible is easier to setup initially, but
as our fleet grew larger it is bound to be a management hell. So I bit the bullet and decided to setup a repo.
I had two options there too, I either had to

* spin up a new server  
  _which I thought was overkill, and I would have a hard time pushing it to Op's, because one more server is one more headache to maintain_
* piggyback it to an existing server  
  _which is pretty damn ugly and subject to other kinds of headaches_

Then I did research as to what actually is a repository server, and it dawned at me that it could very well be
a static file directory, and I don't actually need to spin up a dedicated server. I checked up little bit and
sure enough, there are folks who use AWS S3 as an apt repository. We need two tools to setup:

* on the client side we use [apt-s3](https://github.com/castlabs/apt-s3), which lets you use a S3 bucket
as an apt source. I didn't want my repository to be public, so I created a reader user with reading privileges
on the bucket, and configure apt-s3 at the clients as a file under `/etc/apt/sources.list.d`.

* On the CI side we use [deb-s3](https://github.com/krobertson/deb-s3) to prepare deb repo and upload to the s3 bucket.

My project is written in Go, so I used [goxc](https://github.com/laher/goxc) For cross-compiling to arm/linux.
Initially we are also using goxc for deb packaging, but we soon ran into some problems there, since goxc is not meant to be
a true deb packager. [It doesn't support some deb niceties](https://github.com/laher/goxc/issues/86) (like conffiles, postinst, prerm) so we switched to packaging
with `dpkg-buildpackage` as its meant to be. For pushing the package to the repository, I created a master key-pair for the bucket and
used deb-s3 as planned.

here is some of my configuration in case your mouth is watering for some config pron :

### .goxc.json

{{< highlight  json >}}
{
  "ArtifactsDest": "./build",
  "Tasks": [
    "xc",
    "copy-resources"
    ],
  "BuildConstraints": "linux,arm",
  "ConfigVersion": "0.9"
}
{{< / highlight >}}

a previous version looked like this, when I was using goxc for deb packaging as well :

{{< highlight  json >}}
{
  "ArtifactsDest": "./build",
  "Tasks": [
    "xc",
    "copy-resources",
    "deb",
    "rmbin"
  ],
  "TaskSettings": {
    "deb": {
      "other-mapped-files": {
        "/": "files/"
      }
    }
  },
  "BuildConstraints": "linux,arm",
  "ConfigVersion": "0.9"
}
{{< / highlight >}}

### Dockerfile

Docker file for gitlab CI image which runs the build :

{{< highlight  docker >}}
FROM golang:1.4.3

RUN apt-get update

RUN apt-get install -y git ruby ruby-dev zlib1g-dev npm sudo dh-make --fix-missing
RUN gem install deb-s3 --no-rdoc --no-ri
RUN gem install slim --no-rdoc --no-ri
RUN npm config set registry http://registry.npmjs.org/
RUN npm install -g coffee-script
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN go get github.com/laher/goxc
RUN go get golang.org/x/tools/cmd/vet

RUN goxc -t -arch=arm -bc=linux

ADD ./ /go/src/gitlab.mycompany.com/FupIntuition

WORKDIR /go/src/gitlab.mycompany.com/FupIntuition
{{< / highlight >}}

This basically sets up the docker container for building and asset compilation etc.
Docker file I use locally for testing the builds:

{{< highlight  docker >}}
FROM golang:1.4.3

RUN apt-get update

RUN apt-get install -y git ruby ruby-dev zlib1g-dev npm sudo dh-make --fix-missing
RUN gem install deb-s3 --no-rdoc --no-ri
RUN gem install slim --no-rdoc --no-ri
RUN npm config set registry http://registry.npmjs.org/
RUN npm install -g coffee-script
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN go get github.com/laher/goxc
RUN go get golang.org/x/tools/cmd/vet

RUN goxc -t -arch=arm -bc=linux

ADD ./ /go/src/gitlab.mycompany.com/FupIntuition

WORKDIR /go/src/gitlab.mycompany.com/FupIntuition
RUN ./install_dependencies.sh
RUN ./compile_assets.sh
RUN goxc -pv=`go run intuition.go -c=./intuition.yaml -v`
RUN cp build/*/linux_arm/FupIntuition files/usr/bin
RUN dpkg-buildpackage -aarmhf -tlinux -B -us -uc
{{< / highlight >}}

This does the actual building. However you're not supposed to run the actual build commands inside the
Dockerfile. We run these from the gitlab-ci, which is triggered by the configuration file which follows.

### gitlab-ci.yml

Gitlab ci defines the stages and how to run the build.
initially I had separate build and deploy stages, but in my case these are
always needed to run sequentially, and I couldn't figure out how to make gitlab-ci
export the binary artifacts after the build, so I concatenated them. I may separate them
in the future.

{{< highlight  yaml >}}
stages:
  - test
  - deploy

test:
  image: arda_intuition
  stage: test
  script:
    - mkdir -p /usr/src/go/src/gitlab.mycompany.com
    - ln -s `pwd` /usr/src/go/src/gitlab.mycompany.com/FupIntuition
    - sh ./install_dependencies.sh
    - go test ./...
    - go vet ./...

deploy:
  image: arda_intuition
  stage: deploy
  only:
    - releases
  script:
    - mkdir -p /usr/src/go/src/gitlab.mycompany.com
    - ln -s `pwd` /usr/src/go/src/gitlab.mycompany.com/FupIntuition
    - sh ./install_dependencies.sh
    - sh ./compile_assets.sh
    - goxc -pv=`go run intuition.go -c=./intuition.yaml -v`
    - cp build/*/linux_arm/FupIntuition files/usr/bin
    - dpkg-buildpackage -aarmhf -tlinux -B -us -uc
    - sh /deploy_scripts/deploy_intuition.sh /builds/followup/intuition_`go run intuition.go -c=./intuition.yaml -v`_armhf.deb
{{< / highlight >}}

The test stage is run whenever any branch is pushed into the repo. Deploy stage is run only
when the `releases` branch is pushed. It is a protected branch which only I can push at the moment.
So doing a release is as simple as bumping version, updating changelog, and pushing to releases !

The `deploy_intuition.sh` script is the magic script which uploads the deb file to s3 repo. I didn't want to
check it in SCM because it contains vital access keys, so it is hard-coded in the container.

That's it ! Hopefully this gives some people new ideas ! I am totally pleased with my setup
and looking forward to improving on it and applying it to more of my projects.
