import React from 'react'
import HealthGenders from '../onboarding/health-gender'
import HealthGoals from '../onboarding/health-goal'
import HealthWeight from '../onboarding/health-weight'
import HealthAge from '../onboarding/health-age'

function Home() {
  return (
    <>
        {/* <HealthGenders /> */}
        {/* <HealthGoals /> */}
        <HealthWeight />
        <HealthAge />
    </>

  )
}

export default Home