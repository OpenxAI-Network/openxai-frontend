"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFlag,
  faFlagCheckered,
  faCoins,
  faDollarSign,
  faScaleBalanced
} from "@fortawesome/free-solid-svg-icons"

const SIDE_MENU_ITEMS = [
  { 
    name: "Genesis", 
    href: "/genesis", 
    icon: <FontAwesomeIcon icon={faFlag} className="size-4" />
  },
  { 
    name: "Claims", 
    href: "/claims", 
    icon: <FontAwesomeIcon icon={faFlagCheckered} className="size-4" />
  },
  { 
    name: "Stake", 
    href: "/stake", 
    icon: <FontAwesomeIcon icon={faCoins} className="size-4" />
  },
  { 
    name: "Earn", 
    href: "/earn", 
    icon: <FontAwesomeIcon icon={faDollarSign} className="size-4" />
  },
  { 
    name: "Governance", 
    href: "/governance", 
    icon: <FontAwesomeIcon icon={faScaleBalanced} className="size-4" />
  },
]

export function SideMenu() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-48 bg-black p-4 pt-40">
      {SIDE_MENU_ITEMS.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`mb-4 flex items-center space-x-3 rounded-lg p-2 text-gray-300 hover:bg-gray-800 ${
            pathname === item.href ? "bg-blue-600" : ""
          }`}
        >
          <span className="text-gray-400">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  )
} 