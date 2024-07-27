# geocontext

An **experimental** API providing spatial context for LLM.

## Motivation

REST/GeoJSON API can be invoked by LLMs for RAG purpose. Meanwhile :

* Some input params are not relevant (ex : search geom instead of lon,lat) and default values are not adapted (ex : there is no reason to define defaults limits to 5000 features)
* There is no need for complexe geometries in responses leading to ResponseTooLargeError with ChatGPT
* Thus, there is no need to produce "GeoJSON Feature" with id, properties and a geometry put on a pedestal
* ...

This is an attempt to create a "facade" over existing webservices to ease usage with LLM.

## Principles

* No geocoding (as ChatGPT already use multiple sources to find lon,lat for a given location)
* No large geometries in responses (bbox instead?)
* JSON responses as flat as possible (no GeoJSON Feature or FeatureCollection)

## Features

See [OpenAPI specifications](public/geocontext.yaml)

## Credits

* [express](https://expressjs.com/en/starter/hello-world.html)
* [express-validator](https://express-validator.github.io/docs/guides/getting-started)

## License

[MIT](LICENSE)