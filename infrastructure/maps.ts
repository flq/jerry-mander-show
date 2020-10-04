export const maps = [{
  title: "Obliteration",
  description: "The Blues have just the majority (60%) to win all districts. Make it happen!",
  win: { tribe: "BLUE" as "RED" | "BLUE", atLeast: 5 },
  districtSize: 5,
  distribution: [
    "10101",
    "11001",
    "10101",
    "10001",
    "10111",
  ]
}, {
  title: "Example from Blog Post",
  description: "The Reds are having a hard-time here with only 36% of the popular vote. Each district must contain 5 units. Make the Reds win the majority of districts!",
  win: { tribe: "RED" as "RED" | "BLUE", atLeast: 3 },
  districtSize: 5,
  distribution: [
    "00111",
    "10010",
    "01111",
    "11001",
    "11110"
  ]
}];