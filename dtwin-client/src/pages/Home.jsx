import React from 'react'
import HealthGenders from '../components/onboarding/health-gender'
import HealthGoals from '../components/onboarding/health-goal'
import HealthWeight from '../components/onboarding/health-weight'
import HealthAge from '../components/onboarding/health-age'
import HealthBloodFGroup from '../components/onboarding/health-blood-group'
import HealthFitness from '../components/onboarding/health-fitness'
import HealthSleepLevel from '../components/onboarding/health-sleeplevel'
import HealthMedication from '../components/onboarding/health-medications'
import HealthSymptoms from '../components/onboarding/health-symptoms'
import HealthSetup from '../components/onboarding/health-setup'
import HealthLoading from '../components/onboarding/health-loading'
import HealthHeartRate from '@/components/dashboard/health-heart-rate'
import AvatarSelector from '@/components/onboarding/health-avatar'
import Settings from '@/components/dashboard/settings'

function Home() {
  return (
    <>
        {/* <HealthGoals />
        <HealthGenders />
        <HealthWeight />
        <HealthAge />
        <HealthBloodFGroup />
        <HealthFitness />
        <HealthSleepLevel />
        <HealthMedication />
        <HealthSymptoms />
        
        <HealthLoading /> */}
        <HealthHeartRate />
        {/* <AvatarSelector /> */}
        <HealthSetup />
        <Settings/>
    </>

  )
}

export default Home