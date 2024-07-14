// Imports
const ethers = await import("npm:ethers@6.10.0");

const company = args[0];
const registrationNumber = company.slice(0, -2);

const authRes = await Functions.makeHttpRequest({
    // TODO: replace with live API url and use gist secret for API keys
    url: 'http://localhost:3000/api/dnbToken'
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

if (!res || !res.data) {
    throw Error("Failed to get report");
}

const rating = authRes.data.risk.creditRatings.currentCreditRating.code;

const abiCoder = new ethers.utils.AbiCoder();

// return company + rating
return abiCoder.encode(['string', 'string'], [company, score]);