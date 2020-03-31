aiur version history
====================

v0.6.0
------

Several feature implementations

* added: allow to configure the directories that are being watched
* added: allow to add your own assets build via faucet with the `snippetAssets`
  configuration
* bug fix: `--target` works now

v0.5.1
------

Several feature implementations

* added: additionally (temporarily) included languages: handlebars, Thymeleaf
* added: code blocks process parameters, height parameter actually has effect
* added: injectable context data for snippet rendering
* added: ability to inject target assets (scss, js)
* added: ability to add remote "vendor assets", e.g. font awesome icons
* added: more document meta data gets processed: status, version, tags, ...
* added: tabbed snippet views: preview, source, markup result
* added: status badges

v0.4.0
------

_2019-09-16_

significant changes for end users:

* Support new CLI options (`--serve` and `--liveserve`) to host the styleguide
  locally (with auto reload in the second case)

v0.3.1
------

_2019-08-19_

significant changes for end users:

* Adds a trailing slash to the component paths so they are referenced properly in
  the iframe on simple static node http servers
* upgrade dependencies

v0.3.0
------

_2019-01-08_

significant changes for end users:

* bug fix: show the heading in h1, not the title
* upgrade dependencies

v0.2.0
------

_2018-11-23_

significant changes for end users:

* first version

Pre 0.2.0
---------

The previous versions of this package are an entirely different project. The
name was donated to this project on November, 18. 2018.
