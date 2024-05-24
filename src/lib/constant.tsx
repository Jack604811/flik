import { Option } from "@/types"
import { MountainSnowIcon, Mountain, WavesIcon, ChefHatIcon, WifiIcon, Wifi, CarIcon, CameraIcon, AccessibilityIcon, WindIcon } from "lucide-react"

export const AMENITIES: Option[] = [
    {
        value: "mountain_view",
        label: (
          <>
            <MountainSnowIcon className="w-6 h-6 mr-2" />
            Mountain view
          </>
        ),
      },
      {
        value: "beach_access",
        label: (
          <>
            <WavesIcon className="w-6 h-6 mr-2" />
            Beach access
          </>
        ),
      },
      {
        value: "private_chef",
        label: (
          <>
            <ChefHatIcon className="w-6 h-6 mr-2" />
            Private chef
          </>
        ),
      },
      {
        value: "wifi",
        label: (
          <>
            <WifiIcon className="w-6 h-6 mr-2" />
            Wifi
          </>
        ),
      },
      {
        value: "parking",
        label: (
          <>
            <CarIcon className="w-6 h-6 mr-1" />
            Parking
          </>
        ),
      },
      {
        value: "security_cameras",
        label: (
          <>
            <CameraIcon className="w-6 h-6 mr-2" />
            Security cameras
          </>
        ),
      },
      {
        value: "wheelchair_accessible",
        label: (
          <>
            <AccessibilityIcon className="w-6 h-6 mr-2" />
            Wheelchair accessible
          </>
        ),
      },
      {
        value: "patio",
        label: (
          <>
            <WindIcon className="w-6 h-6 mr-2" />
            Patio
          </>
        ),
      },
];