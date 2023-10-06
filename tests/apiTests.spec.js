import { test, expect } from '@playwright/test';


for (const param of [
  { currencyFrom: 'CAD', currencyTo: 'AUD', weeks: 10 },
  { currencyFrom: 'USD', currencyTo: 'CAD', weeks: 5 },
]) {
  test(`Find average ${param.currencyFrom} to ${param.currencyTo} Forex conversion rate for the recent ${param.weeks} weeks`, async ({ request }) => {
    const recentWeekResponse = await request.get(`/valet/observations/FX${param.currencyFrom}${param.currencyTo}/json?recent_weeks=${param.weeks}`);
    expect(recentWeekResponse.ok()).toBeTruthy();
    const recentWeekResponseJson = await recentWeekResponse.json();
    let sumRate = 0;
    for (const observationsValue of recentWeekResponseJson.observations) {
      let rate = observationsValue[`FX${param.currencyFrom}${param.currencyTo}`].v;
      expect(!isNaN(rate)).toBeTruthy();
      let rateDecimal = Number(rate);
      sumRate += rateDecimal;
    };
    let avrRate = sumRate / recentWeekResponseJson.observations.length;
    console.log(avrRate)
  });
}

const allowedFormat = ['json', 'xml', 'csv']
for (const format of allowedFormat) {
  test(`Verify ${format} format can be used in the request`, async ({ request }) => {
    const allowedFormatResponse = await request.get(`/valet/observations/FXCADAUD/${format}`);
    expect(allowedFormatResponse.ok()).toBeTruthy();
  });
}

test('Verify non-numerical data cannot be used as a parameter for weeks', async ({ request }) => {
  const nonNumValResponse = await request.get('/valet/observations/FXCADAUD/json?recent_weeks=hello');
  const nonNumResponseJson = await nonNumValResponse.json();
  expect(nonNumValResponse.status()).toBe(400)
  expect(nonNumResponseJson.message).toBe('Bad recent observations request parameters, must be numeric');
  expect(nonNumResponseJson.docs).toBe('https://www.bankofcanada.ca/valet/docs');
});

test('Verify values are not retrieved if there is no Forex conversion rate', async ({ request }) => {
  const noRateResponse = await request.get('/valet/observations/json?recent_weeks=5');
  const noRateResponseJson = await noRateResponse.json();
  expect(noRateResponse.status()).toBe(404)
  expect(noRateResponseJson.message).toBe('Series json not found.');
  expect(noRateResponseJson.docs).toBe('https://www.bankofcanada.ca/valet/docs');
});

test('Verify wrong format cannot be used', async ({ request }) => {
  const wrongFormatResponse = await request.get('/valet/observations/FXCADAUD/docx?recent_weeks=5');
  const wrongFormatResponseJson = await wrongFormatResponse.json();
  expect(wrongFormatResponse.status()).toBe(400)
  expect(wrongFormatResponseJson.message).toBe('Bad output format (docx) requested.');
  expect(wrongFormatResponseJson.docs).toBe('https://www.bankofcanada.ca/valet/docs');
});

test('Verify zero cannot be used in recent_interval', async ({ request }) => {
  const zeroIntervalResponse = await request.get('/valet/observations/FXCADAUD/json?recent_weeks=0');
  const zeroIntervalResponseJson = await zeroIntervalResponse.json();
  expect(zeroIntervalResponse.status()).toBe(400)
  expect(zeroIntervalResponseJson.message).toBe('Bad recent observations request parameters, you cannot have a recent value less than one');
  expect(zeroIntervalResponseJson.docs).toBe('https://www.bankofcanada.ca/valet/docs');
});
