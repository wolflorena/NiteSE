const DATA = require("./movies_and_tvshows.json");

const rules = {
  q0: (input, facts) =>
    !input ? true : input === "any" ? true : facts.q0 === input,
  q1: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseArray(input, facts.q1),
  q2: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.q2),
  q3: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseArray(input, facts.q3),
  qm0: (input, facts) =>
    !input || !facts.qm0
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.qm0),
  qt0: (input, facts) =>
    !input || !facts.qt0
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.qt0),
};

const checkResponseArray = (response, facts) => {
  return response.some((element) => facts.includes(element));
};

function checkResponseInterval(response, facts) {
  const [startInterval, endInterval] = response.split("-");

  if (facts >= parseInt(startInterval) && facts <= parseInt(endInterval)) {
    return true;
  }
  return false;
}

function main() {
  const inputs = ["tv-show", ["comedy"], "2000-2005", "any", "any", "any"];

  // all db
  let results = DATA;

  const ruleKeys = Object.keys(rules);

  console.log("ruleKeys: ", ruleKeys);
  // ruleKeys: [ 'q0', 'q1', 'q2', 'q3', 'qm0', 'qt0' ]

  inputs.forEach((input, index) => {
    console.log("input: ", input);
    console.log("index: ", index);
    results = checkRules(results, input, rules[ruleKeys[index]]);
  });

  console.log(results);
}

function checkRules(entries, input, rule) {
  console.log("rule: ", rule);
  const res = entries.filter((entry) => {
    // console.log("entry: ", entry);
    return rule(input, entry.facts);
  });

  console.log("entries length: ", entries.length);
  console.log("res length: ", res.length);

  if (res.length === 0) return entries;
  return res;
}

main();
