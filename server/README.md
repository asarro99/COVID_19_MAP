Local node server that gets the data updated day by day from here "https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
converts the data from csv to json and saves them via lowdb in the covid-19.json file.

## Available Script

In the project directory, you can run:

### `yarn run dev`

Start the server on localhost port 3000.

### `yarn run load`

It only receives data from the source and saves it in the database
