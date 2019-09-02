title: Languages in Aiur

In Aiur it is quite simple to mix several templating languages in one document. Aiur uses slightly enhanced markdown code blocks to transform your component code into an interactive preview of it.

Here, a handlebars template wants to say “Hello!”:

```handlebars
<button>{{handlebars.message}}</button>
```

Plain HTML is with us, too, of course:

```html
<button>Hi, HTML here 👋</button>
```

Simply provide an annotated code block as you are used to:

    ```handlebars
    <button>{{message}}</button>
    ```
