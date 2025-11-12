---
layout: post
title: "Golang Gotchas"
date: "2016-02-26"
comments: true
tags: [dev]
draft: false
---

I've been playing around with golang lately, and got to know its intricacies better.
At first, I have to admit I was not very enthusiastic playing with it, but the more I got to know about it, the more I warmed to to its concepts.
And I observed it has matured pretty well from version 1.1 when I first started to play with it to version 1.4 and 1.5 when I first got do to something useful using Go.
Here I will summarise my Gotchas.

1. ### Non versioned dependency management

    I'm not sure I even spelled this right. Golang has it's own package acquisition tool which you can invoke with __go get__
    This will install the specified dependency in your go path, and you can start using it in your project by importing it.

    The problem with this is that it doesn't allow for version management. You can't ask for a specific version, you have to do with
    whatever version the author provided.

    There are some tools out there which alleviate this issue, like [go dep](https://github.com/tools/godep). It seems this
    registers a revision hash with the dependency, so when fetching it you get the specific version you want to get.

    I haven't used go dep myself, I circumvent the issue by forking the dependency to my own github account and use my forked repo as dependency.
    A nuisance, but not something that I tore my hair out for.

2. ### No cyclic imports

    I ran into this a couple of times. I come from the ruby land, so it was rather strange why the import manage couldn't figure
    import order. It seems in ruby, since [you can require all packages in some init file](http://stackoverflow.com/a/396184/1125712)
    you don't run into this issue. You can't do this in Go, since it doesn't allow you to import something and leave it unused.

3. ### No iterating over struct fields

    I'm not sure if I'm comparing apples and oranges here, but when you need to iterate over the variables of an plain ruby object,
    or attributes of an active model, the answer is usually only a method away. Go doesn't support much meta magic though,
    so when you need to do something like that you need to use reflection

{{< highlight go >}}
// returns a string representation of a struct.
func GetStructStr(lead string, strct interface{}) string {
    str := lead
    tempintslice := []int{0}
    ielements := reflect.TypeOf(strct).Elem().NumField()
    for i := 0; i < ielements; i++ {
        tempintslice[0] = i
        f := reflect.TypeOf(strct).Elem().FieldByIndex(tempintslice)
        value := reflect.Indirect(reflect.ValueOf(strct)).FieldByName(f.Name)
        str += fmt.Sprintf(" %v: %v\n", f.Name, getStringVal(value))
    }
    return str
}
{{< / highlight >}}

4. ### Lack of Generics aka. the interface{} Black Hole

    As you might have heard, [Go doesn't support Generics](http://yager.io/programming/go.html). Which leads to much pain and copy-paste.
    Once you descend into _interface{}_ hell, there is no turning back. But later I found out [it supports alias types](http://blog.jonathanoliver.com/golang-has-generics/).
    Which takes most of the pain away. Ok it's poor mans generics, but gets the job done 90% of the time.

5. ### Lack of Polymorphism

    This one is also little bit thorny issue. Go does not support polymorphism, so it's not an OOP in the sense you know.
    What it does have is interfaces, which are like function signatures which you can attach to Go types.
    Polymorphism in Go is kind of a [controversial subject](https://www.reddit.com/r/golang/comments/vldyv/less_is_exponentially_more_rob_pike_on_the),
    but I think the golang team has chosen wisely to adopt a minimal polymorphic policy. It makes it clear what you need to do
    and guides the programmer to do the _right_ thang (YMMV of course).

6. ### Use capitalised names for managing visibility

    This is something I've really grown to love. Anything you want to export from your package, you can just capitalise the field name.
    And anything you want to hide, you can just lower case its name, and bam! it's gone. Simple, elegant, clean.

7. ### Awesome Concurrency

    Unless you have been hiding in a cave for the last 5 years, Go has awesome support for concurrency.
    The official motto for concurrency in Go is [Share Memory By Communicating](https://blog.golang.org/share-memory-by-communicating) which
    is actually an old concept inspired by a paper by C.A.R. Hoare. Concurrency in Go is simply amazing.
    It is very simple, elegant and easy to understand and debug, especially compared to alternatives in other languages.
    And it works and SCALES very well (unlike *ahem* some oter languages). Concurrency is something
    that Go really shines in, so you should really consider giving Go a go if you intend to write a
    heavily concurrent program.

8. ### Pretty Good Cross Platform Support

    If you ever needed to write a program which needs to run in multiple platforms (ie, MacOs and Linux) and
    which will need to hit the Os directly in some cases, you know what a head ache and spaghetti it can be.
    Fortunately Go supports [build constraints](https://golang.org/pkg/go/build/) which can help you organize
    your code and build process nicely. Build constraints also work in file suffixes, so say if you have a
    package in `report.go`, you can have MacOs specific stuff in `report_darwin.go` and linux specific stuff in
    `report_linux.go`. And they will be package accordingly. Once again a simple solution which works really great.

Overall as you might have imagined, I'm pretty impressed by the language, and really looking forward to being able to do
more with it. In the mean time, I'm also checking Elixir, which is another exiting new language. I am checking a new
project which I hope I will be able to use it so I hope to be able to blog about it in some near future.
Another interesting new language is Crystal, but I think it is little bit too young at the moment.
They need to go little bit more and mature.
