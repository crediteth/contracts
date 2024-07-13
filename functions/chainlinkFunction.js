// Imports
const ethers = await import("npm:ethers@6.10.0");

const company = args[0];
const registrationNumber = company.slice(0, -2);

// test creds, use secrets for prod
const clientId = "3c5f94b7-ade9-43ef-afff-bf0fa33f3127";
const clientSecret = "tEaBp1X8Qc4Gk4UhM6XWfJKMTRNZQZw7rMZpvHJV955N5iWY824O8K8Umw2G9mVu";

const authRes = await Functions.makeHttpRequest({
    method: 'POST',
    url: 'https://login.bisnode.com/sandbox/v1/token.oauth2',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope: "credit_data_companies"
    },
})

if (!authRes || !authRes.data) {
    throw Error("Auth failed");
}

const access_token = authRes.data.access_token;

const res = await Functions.makeHttpRequest({
    method: 'POST',
    url: 'https://login.bisnode.com/sandbox/v1/token.oauth2',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    },
    data: JSON.stringify({
        registrationNumber,
        segments: [
            "RISK"
        ]
    })
});

if (!authRes || !authRes.data) {
    throw Error("Failed to get report");
}

const rating = authRes.data.risk.creditRatings.currentCreditRating.code;

const abiCoder = new ethers.utils.AbiCoder();

// return company + rating
return abiCoder.encode(['string', 'string'], [company, score]);
