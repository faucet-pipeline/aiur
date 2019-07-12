title: Thing
description: This is a thing

This is a thing

```thymeleaf
<div class="thing" th:text="'Thymeleaf ON'">Thymeleaf OFF</div>
```

This is a thing fragment

```thymeleaf
<div th:replace="~{components/thing/thing.html :: thing}"></div>
```
