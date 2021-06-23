import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { Scrollbars } from 'react-custom-scrollbars'
import { Copy, Grid, UserPlus } from 'react-feather'

import AccessModal from './AccessModal'

function Election({
  electionId,
  lastAddedCandidate,
  loadElection,
  addCandidate,
}) {
  const [election, updateElection] = useState({})
  const [candidates, updateCandidates] = useState([])
  const [roles, updateRoles] = useState({})
  const [openAccessOptions, updateOpenAccessOptions] = useState(false)

  const refreshElection = async () => {
    const electionInfo = await loadElection(electionId)
    updateElection(electionInfo.election)
    updateCandidates(electionInfo.candidates)
    updateRoles({
      role: parseInt(electionInfo.role),
      roleRequest: parseInt(electionInfo.roleRequest),
    })
  }

  useEffect(async () => {
    // load content based on electionId
    if (electionId) {
      await refreshElection()
    }
  }, [electionId, lastAddedCandidate])

  const electionIdDisplay = election._id
    ? `#${election._id.substr(0, 6)}...${election._id.substr(-4)}`
    : ""

  if (!electionId) {
    return (
      <div className="flex flex-1 flex-col w-full h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Grid size={30} />
          <span className="mt-3 text-lg">No Election Selected Yet</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <div className="flex flex-1 flex-col w-full">
        <nav className="w-full">
          <div className="flex flex-row w-full justify-between">
            <h1 className="text-3xl font-semibold">{election.name}</h1>
            <div className="rounded p-2 px-5 flex items-center">
              {/* Before: Green, During: Yellow: After: Gray */}
              {/* <span>Display Countdown</span> */}
            </div>
          </div>
        </nav>
        <div className="flex flex-1 flex-col h-full w-full">
          <div className="mt-2 text-gray-400">{election.description}</div>
          <div className="mt-2 flex h-full flex-1 w-full">
            <Scrollbars
              style={{ overflowX: "visible" }}
              autoHeight
              autoHeightMin="100%"
              autoHeightMax={`calc(100vh - 152px)`}
            >
              <div className="gap-4 flex flex-row py-5 flex-wrap">
                {/* Candidate card */}
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="border rounded flex flex-col items-center justify-between py-3 p-2"
                    style={{ width: "32%" }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Avatar name={candidate.name} round={true} />
                      <span className="my-2">{candidate.name}</span>
                      <div className="mb-2 text-sm text-gray-300 text-center">
                        {candidate.manifesto}
                      </div>
                    </div>
                    <div className="flex flex-row w-full justify-between text-xs">
                      <div className="rounded-full py-2 px-3 bg-gray-300">
                        {candidate.party}
                      </div>
                      <button
                        disabled={roles.role < 1}
                        className="px-3 border-2 rounded flex items-center justify-center border-gray-300 hover:border-gray-500"
                      >
                        Vote
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add candidate button for admin */}
                {roles.role > 3 && (
                  <div
                    className="border border-dashed rounded flex flex-col items-center justify-center text-gray-600"
                    style={{ minHeight: "244px", width: "32%" }}
                    onClick={addCandidate}
                  >
                    <div className="">
                      <UserPlus size={35} />
                    </div>
                    <div className="mt-2">Add New Candidate</div>
                  </div>
                )}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
      <div className="w-full p-2 py-3 rounded bg-gray-50 flex flex-row justify-between">
        <div className="flex flex-nowrap items-center">
          <span>{electionIdDisplay}</span>
          <span className="ml-2 text-gray-800 cursor-pointer">
            <Copy size={16} />
          </span>
        </div>
        <div className="relative flex flex-nowrap">
          <div onClick={() => updateOpenAccessOptions(true)}>
            Election Access...
          </div>
        </div>
      </div>

      <AccessModal
        showModal={openAccessOptions}
        closeModal={() => updateOpenAccessOptions(false)}
        roles={roles}
      />
    </div>
  )
}

export default Election