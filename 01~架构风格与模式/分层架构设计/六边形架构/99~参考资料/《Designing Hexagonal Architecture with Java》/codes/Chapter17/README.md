# Chapter 17 - Good Designing Practices for your Hexagonal Application
Following are the instructions to test the code samples.

Make sure you have Docker running before executing the following commands.

You need to run these commands from within the chapter 17 directory:

**To generate an Uber Jar and start the application**
```
$ mvn clean package
$ java -jar bootstrap/target/bootstrap-1.0-SNAPSHOT-runner.jar
```
**To send a curl request to get router status**
```
$ curl -X GET http://localhost:8080/router/get-router-status
// Router with IP(ipAddress=55.0.0.1, protocol=IPV4) is alive!
```