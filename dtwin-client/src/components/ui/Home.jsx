import React from 'react'
import HealthGenders from '../onboarding/health-gender'
import HealthGoals from '../onboarding/health-goal'
import HealthWeight from '../onboarding/health-weight'
import HealthAge from '../onboarding/health-age'
import HealthBloodFGroup from '../onboarding/health-blood-group'
import HealthFitness from '../onboarding/health-fitness'
import HealthSleepLevel from '../onboarding/health-sleeplevel'
import HealthMedication from '../onboarding/health-medications'
import HealthSymptoms from '../onboarding/health-symptoms'

function Home() {
  return (
    <>
        <HealthGoals />
        <HealthGenders />
        <HealthWeight />
        <HealthAge />
        <HealthBloodFGroup />
        <HealthFitness />
        <HealthSleepLevel />
        <HealthMedication />
        <HealthSymptoms />
    </>

  )
}

export default Home