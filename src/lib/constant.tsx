import { Option } from "@/types"
import { 
  MountainSnowIcon, 
  WavesIcon, 
  ChefHatIcon, 
  WifiIcon, 
  CarIcon, 
  AccessibilityIcon, 
  Dumbbell,
  Video,
  Bath,
  Presentation,
  Heater,
  FlameKindling,
  Waves, 
} from "lucide-react"

export const AMENITIES: Option[] = [
    
    {
        value: "mountain_view",
        label: (
          <>
            <MountainSnowIcon className="w-6 h-6 mr-1" />
            Mountain view
          </>
        ),
    },
    {
        value: "beach_access",
        label: (
          <>
            <WavesIcon className="w-6 h-6 mr-1" />
            Beach access
          </>
        ),
    },
    {
        value: "private_chef",
        label: (
          <>
            <ChefHatIcon className="w-6 h-6 mr-1" />
            Private chef
          </>
        ),
    },
    {
        value: "wifi",
        label: (
          <>
            <WifiIcon className="w-6 h-6 mr-1" />
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
            <Video className="w-6 h-6 mr-1" />
            Security cameras
          </>
        ),
    },
    {
        value: "wheelchair_accessible",
        label: (
          <>
            <AccessibilityIcon className="w-6 h-6 mr-1" />
            Wheelchair accessible
          </>
        ),
    },
    {
        value: "pool",
        label: (
          <>
            <Waves className="w-6 h-6 mr-1" />
            Pool
          </>
        ),
    },
    {
        value: "hottub",
        label: (
          <>
            <Bath className="w-6 h-6 mr-1" />
            Hot Tub
          </>
        ),
    },
    {
        value: "presentation",
        label: (
          <>
            <Presentation className="w-6 h-6 mr-1" />
            Cinema
          </>
        ),
    },
    {
        value: "gym",
        label: (
          <>
            <Dumbbell className="w-6 h-6 mr-1" />
            Gym
          </>
        ),
    },
    {
        value: "fireplace",
        label: (
          <>
            <FlameKindling className="w-6 h-6 mr-1" />
            Firepit
          </>
        ),
    },
    {
      value: "sauna",
      label: (
        <>
          <Heater className="w-6 h-6 mr-1" />
          Sauna
        </>
      ),
  },
];
