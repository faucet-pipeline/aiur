# aiur

[![npm](https://img.shields.io/npm/v/aiur.svg)](https://www.npmjs.com/package/aiur)
[![build status](https://travis-ci.org/moonglum/aiur.svg?branch=master)](https://travis-ci.org/moonglum/aiur)
[![Greenkeeper badge](https://badges.greenkeeper.io/moonglum/aiur.svg)](https://greenkeeper.io)

aiur is a tool to generate style guides with a focus on pattern libraries.

## Usage

Install aiur in your project:

```sh
npm i --save aiur
```

You then need to write documentation using Markdown:

    title: Strong
    description: Pretty strong component

    This is how we **strong** around here.

    ```html
    Very <strong>strong</strong>
    ```

This is a regular Markdown file, with two special features:

1. You can provide meta information like a title, description etc. as a
   frontmatter (following RFC 822).
2. When you write a code snippet, it will be rendered as a code example.

In addition, you need to provide a `aiur.config.js`:

```js
exports.pages = {
	"": "./components/welcome.md",
	atoms: {
		file: "./components/atoms.md",
		children: {
			button: "./components/button/doc.md",
			strong: "./components/strong/doc.md"
		}
	}
};

exports.title = "Example Pattern Library";
exports.language = "en";
exports.description = "A very good pattern library"
```

Here you provide the page structure, a title, language and description.

Now you can generate your page by running:

```sh
npx aiur
```

The page will be generated and put into `./dist`. Done. You can see additional
options (like file watching) by running `npx aiur -h`.

## Credit

* Thanks to [@taoyuan](https://github.com/taoyuan) for donating the name on NPM.

## License

aiur is licensed under Apache 2.0 License.
