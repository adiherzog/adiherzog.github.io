# Testable Code for Unit Tests

&copy; 2017 Adrian Herzog

## TL;DR

In order to make hard to test code more testable, I would try to extract **logic code** into **pure functions** which makes them **easy to test**. What is left is mostly **glue code** or **orchestration code** that can then be tested independently from the complicated logic, either also on unit test level or even on higher test levels (API Tests, System Tests, etc.).

## An All Too Common Question

Sooner or later in your coding career you will probably ask yourself this question:

> How shall I unit test a private method of a class without the overhead the entire class brings with it?

Take the following class as an example. What we want to test is the logic in `calculateAcountBalance()`, but this method is private.

    class AccountBalanceCalculator() {

        // Dependencies on class level need to be set up for unit test
        public AccountBalanceCalculator(WebService transactionsWebService, DatabaseAccess databaseAccess) {
            ...
        }
        
        public calculateAccountBalanceForEachCustomer(CustomerId customerIds) {
            // DB access, probably needs to be mocked away in unit test
            var customers = loadCustomers(customerIds);

            foreach(customer in customers) {
                calculateAccountBalanceForSingleCustomer(customer);
            }

            updateAccountBalanceInDatabase(customers);
        }

        private void calculateAccountBalanceForSingleCustomer(Customer customer) {
            // WebService call, probably needs to be mocked away in unit test
            var recentTransactions = loadRecentTransactions(customer);

            var accountBalance = calculateAccountBalance(customer, recentTransactions);
        }

        private void calculateAcountBalance(Customer customer, List<Transaction> recentTransactions) {
            var newBalance = customer.balance;
            foreach(transaction in recentTransactions) {
                newBalance = doSomeFancyCalculations();
            }
            // Note that this is a side effect, i.e. an input variable is modified,
            // so the unit test has to assert the modification on the input variable.
            customer.balance = newBalance;
        }

        private Balance = doSomeFancyCalculations(Transaction transaction) {
            ...
        }
    }

## What's The Problem?

When trying to create a unit test for the method `calculateAcountBalance()` I face some problems, e.g.:

* I have to create an instance of the entire `AccountBalanceCalculator` class, which means I also have to supply `transactionsWebService` and `databaseAccess`. What's the big deal? Well, either I use the same classes for these parameters that the real system would use, but then I might end up setting up endless dependencies for these classes. Or I could mock the two dependencies, which is some additional work, considering that the two dependencies are not even used by the method I want to test.
* I have to call `calculateAccountBalanceForEachCustomer()` in order to test `calculateAcountBalance()`, which results in a Web Service and a Database Call being made. This means that in order to control my input data to the method, I have to set up the test data in these two dependencies correctly (no matter whether they are mocked or not).
* The result of the calculation is not returned by `calculateAccountBalanceForEachCustomer()`. The only way to assert the result is through the (mocked or not) database.

So we can say that `calculateAcountBalance()` is not unit testable without major effort. This has serious consequences, some of which could be:

* A programmer might start writing a test and finally give up because setting everything up does not seem worth the effort.
* There might be a few tests, but as the test code is mainly concerned with setting everything up, the actual test intention is barely visible and hard to understand.
* If something changes with database or web service access then the unit tests might break and needs to be fixed, even though the calculation logic that is tested did not change.

## How Can I Solve This?

There's no single true answer.

Some people suggest making the method `calculateAcountBalance()` *public*. Object Oriented purists might find this blasphemy. I think it's not a bad idea, as a lot of today's code is not really Object Oriented anyway. Nevertheless, I would still not do it and go for another option, as just making the method *public* does not solve all the problems there are in the above example.

Some languages even allow, that a method is accessible for *test code*, but not for the other *normal code*. This is more or less the same as making it *public*, so I would not recommend it either.

Instead I would suggest to refactor the code to improve testability in the following way:

* Extract the logic you want to test into it's own unit with only a single function. In some languages this is a class with just one public function.
* This function should be *pure functional*, i.e. it should receive all input as parameters and return all output. Input parameters must not be modified by the function. The function must not have any side effects, i.e. must not modify the database. Reading input from other sources (e.g. from a web service) is not allowed.

For the above example, the logic class would look like this:

    class AccountBalanceCalculatorLogic() {

        public static Map<Customer, Balance> calculateAcountBalance(Customer customer, List<Transaction> recentTransactions) {
            var newBalance = customer.balance;
            foreach(transaction in recentTransactions) {
                newBalance = doSomeFancyCalculations(transaction);
            }
            ...
            return mapWithResultsPerCustomer;
        }

        private Balance = doSomeFancyCalculations(Transaction transaction) {
            ...
        }

    }

Note that:

* The old `AccountBalanceCalculator` class still contains the database access and web service code but now uses the `AccountBalanceCalculatorLogic` class to do the complicated calculations.
* The new method `calculateAcountBalance()` is now `public static` and returns the result instead of modifying the input values.
* The method does not access any database or web service as this was done by the method `calculateAccountBalanceForEachCustomer()`.

**In other words: it is now super easy to write unit tests for this logic class.**

And if we want to write a test for `AccountBalanceCalculator`, we can ignore the entire calculation logic and focus on testing that kind of *glue code* that pulls data from different sources and stores something in the end. Instead of many different test cases, it's probably enough to have one or two cases for `AccountBalanceCalculator`. These tests can even be on higher levels than unit test level, e.g. on API or System Test level. The many different combinations of the logic will then be covered by the test class for `AccountBalanceCalculatorLogic`.