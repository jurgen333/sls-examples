const { default: axios } = require("axios");
require("dotenv").config();

const body = {
  userId: "1",
  products: [
    {
      productId: "1",
      quantity: 1,
    },
  ],
};

async function main() {
  let concurrentRequests = 1;
  const commandLineArgs = process.argv.slice(2);
  if (
    commandLineArgs.length &&
    commandLineArgs.find((el) => el.includes("n="))
  ) {
    // eslint-disable-next-line radix
    concurrentRequests = parseInt(
      commandLineArgs.find((el) => el.includes("n=")).split("=")[1],
    );
  }

  const endpoint = process.env.CREATE_ORDER_ENDPOINT;

  const arrayOfRequests = new Array(concurrentRequests).fill(body);
  const startDate = Date.now();

  await Promise.all(
    arrayOfRequests.map((request, index) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      axios
        .post(endpoint, request)
        .then((result) =>
          console.log(
            `Request ${index + 1} finished after ${Date.now() - startDate} ms`,
          ),
        )
        .catch((error) =>
          console.log(`Request ${index + 1} failed with error: ${error}`),
        ),
    ),
  );
}

main();
