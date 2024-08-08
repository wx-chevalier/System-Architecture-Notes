package dev.davivieira;


import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(plugin = {"pretty", "html:target/cucumber-result"}, features = "src/test/java/dev/davivieira/features")
public class RunCucumberTest {
}
