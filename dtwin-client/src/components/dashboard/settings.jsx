import { ArrowLeft, ArrowRight, Briefcase, Camera, LocateIcon, Eye, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Card className="mx-auto max-w-md rounded-none sm:rounded-lg">
        <CardHeader className="relative h-48 overflow-hidden rounded-b-[2.5rem] bg-[#1a1f37] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 to-transparent"></div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg bg-white/10">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <h1 className="mt-2 text-xl font-semibold text-white">Profile Setup</h1>
          </div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20165345-Rfihmxgr3nJw5B9S8Aqds6GHlHhCP0.png"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-16">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="fullName" placeholder="Shreya" className="pl-10" />
              </div>
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+81">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="phone" placeholder="8667052857" className="pl-10" />
                </div>
              </div>
            </div>

            {/* Location as Input */}
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <LocateIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="location" placeholder="Chennai, Tamilnadu" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="email" type="email" placeholder="shreya@dtwin.com" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="jobPosition">Job Position</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="jobPosition" placeholder="" className="pl-10" />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <Label>Gender</Label>
              <RadioGroup defaultValue="female" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button className="w-full gap-2 bg-blue-600 py-6 text-lg font-semibold hover:bg-blue-700">
            Continue
            <ArrowRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
