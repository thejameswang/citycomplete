# citycomplete

An API endpoint that provides auto-complete suggestions for large cities hosted on Heroku at citycomplete.herokuapp.com

![gif (https://media.giphy.com/media/1qbjEdWljfEjTUt2G2/giphy.gif)](https://media.giphy.com/media/1qbjEdWljfEjTUt2G2/giphy.gif)


## Key Features

- These responses are meant to provide guidance. The exact values can vary based on the data source and the scoring algorithm.
- the endpoint returns a JSON response with an array of scored suggested matches
    - the suggestions are sorted by descending score
    - each suggestion has a score between 0 and 1 (inclusive) indicating confidence in the suggestion (1 is most confident)
    - each suggestion has a name which can be used to disambiguate between similarly named locations
    - each suggestion has a latitude and longitude
  - the endpoint is exposed at `/suggestions`
  - the partial (or complete) search term is passed as a querystring parameter `q`
      - prefix match is a good minimal solution

**Near match**

    GET /suggestions?q=Londo&latitude=43.70011&longitude=-79.4163

```json
{
  "suggestions": [
    {
      "name": "London, ON, Canada",
      "latitude": "42.98339",
      "longitude": "-81.23304",
      "score": 0.9
    },
    {
      "name": "London, OH, USA",
      "latitude": "39.88645",
      "longitude": "-83.44825",
      "score": 0.5
    },
    {
      "name": "London, KY, USA",
      "latitude": "37.12898",
      "longitude": "-84.08326",
      "score": 0.5
    },
    {
      "name": "Londontowne, MD, USA",
      "latitude": "38.93345",
      "longitude": "-76.54941",
      "score": 0.3
    }
  ]
}
```

**No match**

    GET /suggestions?q=SomeRandomCityInTheMiddleOfNowhere

```json
{
  "suggestions": []
}
```


## References

- Geonames provides city lists Canada and the USA http://download.geonames.org/export/dump/readme.txt
- http://www.nodejs.org/
- http://ejohn.org/blog/node-js-stream-playground/

## Getting Started

Begin by cloning this repo.

### Setting up the project

In the project directory run

```
npm install
```

### Running the tests

The test suite can be run with

```
npm test
```

### Starting the application

To start a local server run

```
npm start
```


which should produce output similar to

```
Server running at http://localhost:2345
```

Otherwise the application is hosted at citycomplete.herokuapp.com
