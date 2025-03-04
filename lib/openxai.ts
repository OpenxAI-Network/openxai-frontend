import { projects } from "@/data/projects"

export const PROJECT_RATE = projects.map(
  (project) =>
    (parseInt(project.backersRewards) + parseInt(project.flashBonus)) /
    parseInt(project.fundingGoal)
)

export function formatNumber(number: string | number) {
  let n = typeof number === "string" ? parseFloat(number) : number

  return n.toLocaleString("en-us", { maximumFractionDigits: 2 })
}
