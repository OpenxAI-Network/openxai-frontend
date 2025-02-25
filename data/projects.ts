import rawProjects from "@/openxai-indexer/nodejs-app/utils/projects.json"

export let projects = rawProjects.map((p) => {
  return {
    ...p,
    status: process.env.NEXT_PUBLIC_TESTNET ? p.status : "Pending",
  }
})
