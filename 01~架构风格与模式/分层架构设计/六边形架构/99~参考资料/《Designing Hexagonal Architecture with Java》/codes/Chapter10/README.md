    # Chapter 10 - Adding Quarkus to a Modularized Hexagonal Application
Following are the instructions to compile and run the code samples.

You need to run these commands from within the chapter 10 directory:

**To compile and package**
```
mvn clean package
```

**To run**
```
java -jar bootstrap/target/bootstrap-1.0-SNAPSHOT-runner.jar
```


**Sample requests**
```
curl -vv -H "Content-Type: application/json" -d  '{"field": "item-a", "value": 20}' localhost:8080/app/create-entity
```
```
curl -s localhost:8080/app/get-all-entities | jq
```