#### How to run tests
Run the following command from the root folder

```
npx playwright test
``` 

HTML report will be opened by default. To view report manually run the following command 
```
npx playwright show-report
```

#### Additional steps I would have taken with more time
1. In the first test I would add some verifications for the 'avrRate' depending on the requirements (e.g. whether it should be within the range or > 0).
2. In the second test I would add verification based on the returned format to make sure it has expected data.
3. I would also add logging for requests and responses for better tracking. 
