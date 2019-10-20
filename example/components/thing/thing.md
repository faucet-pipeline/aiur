title: A Thing
description: This is a thing
status: deprecated
tags: things, thymeleaf, example-components
version: 0.5

Esse dolor dolor nostrud voluptate mollit minim sit ut et non qui cillum voluptate sunt commodo laborum cillum nostrud dolore commodo incididunt.

Non ut aliqua nulla proident commodo aliquip amet exercitation voluptate proident cupidatat aliqua officia adipisicing ex irure exercitation laborum voluptate exercitation sit nostrud duis officia nulla exercitation laborum ut irure ullamco pariatur aliqua enim deserunt laborum deserunt deserunt in dolore occaecat in veniam qui elit aute nostrud in officia occaecat quis elit aliqua aliqua in et duis ea labore qui sunt eu in deserunt dolor qui voluptate enim amet aliqua sed ea elit occaecat magna amet voluptate cillum tempor sunt laboris minim sint consectetur tempor ullamco sunt qui dolore enim sed officia do dolor voluptate aute deserunt ex veniam dolor culpa ex labore et consequat excepteur nulla elit proident nisi veniam et est minim amet ut consequat do velit voluptate.

This is a thing

```thymeleaf
<i class="fas fa-leaf"></i> <span class="thing" th:text="'Thymeleaf ON'">Thymeleaf OFF</span>
```

This is a thing fragment

```thymeleaf height="64"
<div th:replace="~{components/thing/thing.html :: thing}"></div>
```

This uses data

```thymeleaf
<div th:text="${message}">No message.</div>
```
