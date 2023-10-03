## Installation and running the app
to run the app use:

```bash 
$ docker-compose up --build
```

if it will be necessary run:
```bash
$ npm i
```

## Description
In this test task were implemented 2 tasks:
 - Task1 (parser)
 - Task2 (API request)

The App has two endpoints:
 - `/db/xml-from-file` will run the server and parse local static xml file and save it to the database.
 - `/db/top-profit-exchangers` will return top 3 countries with top 3 exchangers with the highest profit.

I have added microservice to emulate the API request and caching of the existing results.

## Answers to questions

 - How to change the code to support different file format versions?
```
    I have added a switch case to check file type and 
    use particular parser. In general it can be dedicater 
    service for it or we can use some npm modules for it.
```
 - How will the import system change if in the future we need to get this data from a web API?
```
    The particular microservice was create to handle this task.
    It immitates the API request and saves the data to the database.
    I use it to get currency rates from the API.
    Also, I use it is responsible for caching the data.

```
 - If in the future it will be necessary to do the calculations using the national bank rate, how could this be added to the system?
```
    Actually we only need to integrate the API request to the particular
    service.
    Now it takes the data from the local file.
```

 - How would it be possible to speed up the execution of requests if the task allowed you to update market data once a day or even less frequently? Please explain all possible solutions you could think of.
```
    I should be cached it will allow us to make less 
    queries and save the traffic. Caching was added to 
    show how we can save some time reusing results that 
    was get recently. I think if we have rapid changes once 
    a day will be too less.
```



