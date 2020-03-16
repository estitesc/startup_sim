testPowerLaw();
// simulate();

function randn_bm() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
  return num;
}

const getDilution = () => 10 + randn_bm() * 70;

const getDilutionMultiplier = () => {
  const dilution = getDilution();
  const result = (100 - dilution) / 100;
  return result;
};
function simulate({
  myStartingValuation,
  othersStartingValuation,
  ownership,
  poolAllocation,
  poolMembers,
  myRaiseChance,
  othersRaiseChance,
  myBestOutcome,
  othersBestOutcome
}) {
  const k_min = 0.00001;
  const k_max = 100;
  const gamma = 1.12;
  const runXTimes = 100;

  const resultsOneCo = [];
  const resultsShare = [];
  const poolOwnership = poolAllocation / 100 / poolMembers;

  for (var i = 0; i < runXTimes; i++) {
    let oneCoMultiplier = power_law(
      k_min,
      myBestOutcome,
      Math.random(),
      myRaiseChance
    );
    oneCoMultiplier =
      oneCoMultiplier < 1 ? 0 : Math.floor(oneCoMultiplier * 10) / 10;
    const oneCoResult = Math.floor(
      myStartingValuation *
        (ownership / 100) *
        oneCoMultiplier *
        getDilutionMultiplier()
    );

    let poolTotal = 0;
    for (var poolMember = 0; poolMember < poolMembers - 1; poolMember++) {
      let multiplier = power_law(
        k_min,
        othersBestOutcome,
        Math.random(),
        othersRaiseChance
      );
      multiplier = multiplier < 1 ? 0 : Math.floor(multiplier * 10) / 10;
      const poolResult = Math.floor(
        othersStartingValuation * multiplier * getDilutionMultiplier()
      );
      poolTotal += poolResult;
    }

    poolTotal = Math.ceil(poolTotal);

    const shareResult =
      Math.floor(
        myStartingValuation *
          (ownership / 100 - poolMembers * poolOwnership) *
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
