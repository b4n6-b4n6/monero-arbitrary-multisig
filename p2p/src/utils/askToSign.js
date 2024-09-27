import readline from "readline";
import { fromPiconero } from "./fromPiconero.js";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  question = `${question}: `;
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

export const askToSign = async (destinations) => {
  console.log("Spending");

  destinations.forEach(dest => {
    console.log(`Address: ${chalk.magenta(dest.address)}`);
    console.log(`Amount: ${chalk.magenta(fromPiconero(dest.amount))} XMR`);
    // TODO display fee here also
  });

  return (await askQuestion(`Type '${chalk.red("approve")}' and press enter to approve`)) === "approve";
};
