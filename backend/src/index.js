require("dotenv").config();
const http = require("http");
const { URL } = require("url");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ES_URL,
});

http.createServer(handle).listen(8080);

async function handle(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url = new URL(`http://incoming${req.url}`);
    switch (`${req.method} ${url.pathname}`) {
      case "GET /orgs":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await getFundedOrgs(url.searchParams),
          })
        );
        break;

      case "GET /orgs/search":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchOrgs(url.searchParams),
          })
        );
        break;

      case "GET /org":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await getOrg(url.searchParams),
          })
        );
        break;

      case "GET /fundings":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchFundings(url.searchParams),
          })
        );
        break;

      default:
        res.writeHead(404).end(
          JSON.stringify({
            message: "Not Found",
          })
        );
        break;
    }
  } catch (e) {
    console.error(e.stack);
    res.writeHead(500).end(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
}

async function getOrg(queryParams) {
  const orgName = queryParams.get("name") ?? "";

  const response = await client.search({
    index: "org",
    body: {
      query: {
        match_phrase: {
          company_name: orgName,
        },
      },
    },
  });

  return result(response);
}

async function getFundedOrgs(queryParams) {
  const limit = queryParams.get("limit") ?? 50;
  const offset = queryParams.get("offset") ?? 0;

  const response = await client.search({
    index: "org",
    body: {
      query: {
        range: { funding_rounds: { gte: "1" } },
      },
      size: limit,
      from: offset,
    },
  });

  return result(response);
}

async function searchOrgs(queryParams) {
  const limit = queryParams.get("limit") ?? 5;
  const query = queryParams.get("query") ?? "";

  const response = await client.search({
    index: "org",
    body: {
      query: {
        bool: {
          minimum_should_match: 1,
          should: [
            {
              match: {
                company_name: query,
              },
            },
            {
              match: {
                description: query,
              },
            },
          ],
        },
      },
      size: limit,
    },
  });

  return result(response);
}

async function searchFundings(queryParams) {
  const limit = queryParams.get("limit") ?? 10;
  const query = queryParams.get("query") ?? "";

  const response = await client.search({
    index: "funding",
    body: {
      query: {
        match_phrase: {
          company_name: query,
        },
      },
    },
    size: limit,
  });

  return result(response);
}

function result(response) {
  return {
    hits: response?.body?.hits?.hits?.map((h) => h._source),
    total: response?.body?.hits?.total?.value,
  };
}
