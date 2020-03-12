testPowerLaw();
// simulate();

function simulate({
  myStartingValuation,
  othersStartingValuation,
  ownership,
  runXTimes,
  poolMembers,
  poolOwnership,
  myRaiseChance,
  othersRaiseChance,
  myBestOutcome,
  othersBestOutcome,
}) {
  const k_min = 0.00001;
  const k_max = 100;
  const gamma = 1.12;

  const resultsOneCo = [];
  const resultsShare = [];

  for (var i = 0; i < runXTimes; i++) {
    let oneCoMultiplier = power_law(k_min, myBestOutcome, Math.random(), myRaiseChance);
    oneCoMultiplier =
      oneCoMultiplier < 1 ? 0 : Math.floor(oneCoMultiplier * 10) / 10;
    const oneCoResult = Math.floor(
      myStartingValuation * ownership * oneCoMultiplier
    );

    let poolTotal = 0;
    for (var poolMember = 0; poolMember < poolMembers - 1; poolMember++) {
      let multiplier = power_law(k_min, othersBestOutcome, Math.random(), othersRaiseChance);
      multiplier = multiplier < 1 ? 0 : Math.floor(multiplier * 10) / 10;
      const poolResult = Math.floor(othersStartingValuation * multiplier);
      poolTotal += poolResult;
    }

    poolTotal = Math.ceil(poolTotal);

    const shareResult =
      Math.floor(
        myStartingValuation *
          (ownership - poolMembers * poolOwnership) *
          oneCoMultiplier
      ) +
      poolOwnership * poolTotal;

    console.log(`result ${i} ${oneCoResult} / ${poolOwnership * poolTotal}`);
    resultsOneCo.push(oneCoResult);
    resultsShare.push(shareResult);
  }

  return {
    solo: resultsOneCo.sort((a, b) => a - b),
    share: resultsShare.sort((a, b) => a - b)
  };
}

function simulateWithArray() {
  const outcomeArray = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 10, 12, 14, 16, 20, 30, 50,
  ];
  const startingValuation = 3000000;
  const ownership = 0.3;
  const runXTimes = 100;
  const poolMembers = 20;
  const poolOwnership = 0.005;

  for (var i = 0; i < runXTimes; i++) {
    const oneCoResult =
      startingValuation *
      ownership *
      outcomeArray[getRandomInt(0, outcomeArray.length - 1)];
    let poolTotal = 0;
    for (var poolMember = 0; poolMember < poolMembers - 1; poolMember++) {
      const poolResult =
        startingValuation *
        outcomeArray[getRandomInt(0, outcomeArray.length - 1)];
      poolTotal += poolResult;
      // console.log(`result${i}: `, poolResult);
    }

    console.log(`result ${i} ${oneCoResult} / ${poolOwnership * poolTotal}`);
    // console.log("Individual Outcome", oneCoResult);
    // console.log("Pool Outcome", poolOwnership * poolTotal);
  }
}

function testPowerLaw() {
  const runXTimes = 100;
  const k_min = 0.00001;
  const k_max = 100;
  const gamma = 1.22;

  // Gamma of 0.97 seems to give about the same as the distribution from the article
  // Gamma=1.1 if you think that there's a 50/50 chance of getting to stage shown in article data
  // Gamma=1.175 if you think that there's only about a 1/4 chance of getting that stage
  // Gamma=1.22 if you only have a 1 in 8 chance to fundraise

  let resultsArray = [];

  console.log("test", power_law(0.0001, 50, Math.random(), 5));

  for (var i = 0; i < runXTimes; i++) {
    let result = power_law(k_min, k_max, Math.random(), gamma);
    result = result < 1 ? 0 : Math.floor(result);
    resultsArray.push(result);
  }

  console.log(
    resultsArray.sort(function(a, b) {
      return a - b;
    })
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function power_law(k_min, k_max, y, gamma) {
  return Math.pow(
    (Math.pow(k_max, -gamma + 1) - Math.pow(k_min, -gamma + 1)) * y +
      Math.pow(k_min, -gamma + 1.0),
    1.0 / (-gamma + 1.0)
  );
}
