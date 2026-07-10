"use client"

import axios from "axios"
import { checksumAddress } from "viem"
import { useAccount, useSignMessage } from "wagmi"

import { Button } from "@/components/ui/button"

interface NFTClaim {
  collection: string
  token_id: string
  account: string
  description: string
}
const winners = [
  "0x0072f7de3ef2e40b908297414c00ac6460e838be",
  "0x19692becf1430c301f81b01e6cb4de6045e63a79",
  "0x2dc0d18a8e3e59a62363b20164cfc5eee6383c91",
  "0x2eba0a5d03b07af80e4e4ace3bbffe3a7d956bcb",
  "0x434a4e9d7d57ce0df13da886cba4e16f6589f70e",
  "0x5cd3d18b42153969372da9f0921b7bc2136d7d6e",
  "0x68d751162e0721011628258670c6e2ee4689b4da",
  "0x7caa24263916505cfcca185b6d532f69426faeb4",
  "0x846ae2fa120fe1d1eeb5c7794cfaf2439ebb2e2c",
  "0x852c0d60a156e329a0e2b57ba72f75febc150b3b",
  "0x86735029a545bf565ace39ee8e74819469b6a728",
  "0x98ead61c1e82f6bb41a57e562f111f0ad665821f",
  "0xafddf6c8684e334cea25dffe52192ddd3854e7e6",
  "0xc55e66a69b96435ad6d4ed38c814f5f74e8f809a",
  "0xd792c55a85c872cbbe2555e175d924e9f9d9f798",
  "0xf0f6a7be751426182b3c90b8643fc581c20e5d97",
  "0xf415d980adb99038984f0f007f6ed76a011c157e",
  "0xf8dabff1f81c73e0a5592fe6c9dc2f612cdd8195",
  "0xf935399cb3012b6c6c4510827f2c4d7210a996f7",
  "0x006903d37cbefea51c6cc3496409718d94c709e0",
  "0x03925621802f1a449fefe8dc9dab8e825b2115b4",
  "0x0851e118426c7db3b9f65a5e81353d17ccca1512",
  "0x16b5b4ae7a3cbb996e12330f721f9fd56df60d05",
  "0x2af3115bf59ca1cab7d3b53934065e6675a01a4b",
  "0x2b36e5a33b2682d172c4d7d029889f828501fb79",
  "0x2ebd463db1a0a63017c76a436698b83e33170c80",
  "0x2f9d8f22c3b4f6f98aa9de65b81eb552446eee31",
  "0x3a93cb4ad6d3cc2385e0a7042d57641f5c0afe60",
  "0x3d322b32fbb27b6c2dfbe7906300781f425dc301",
  "0x40043fac995f1d6bfcfcf6a41670ec429bbc3e11",
  "0x44ae96e58054ecef901ed7855ffe46663ae4ac37",
  "0x4c6162d35fddde9a78ba752ccc6be7f45021697f",
  "0x4e178dfbea7595f9e3bccd600934dbd8cd7f94f3",
  "0x5151699ae30a2c963ab59cdcdce76bd95a5befa0",
  "0x54034b2441b74412b232700b1136a4bf1eb29524",
  "0x6286825690ce98143a5dd80601a264eb9ff40264",
  "0x6eafe9d8036d2a1649480d9e090fe7534b146b57",
  "0x80b98485155a1da3f1e7b7e05258369959589965",
  "0x919dcc144e750156cfced6d7e51d81128e671e7b",
  "0x9284ab32893420f210fddbeb46aa2065b567c642",
  "0x940df4acb85c3b190a777040f75498accc6ee0ea",
  "0x9c263347ad149b329956a16ca79fe64af6646b30",
  "0xa87a39d10a3980bedaa7528819669cdafd46e0fb",
  "0xb1ced81efa167a865a6b390b5d7d031dec2dc8d1",
  "0xcab26b3c24513ba4676571161cdc55417defb8ed",
  "0xde8f385645acb90824965f8e42db3cfb2404385d",
  "0xde9effe373ac472e95d85579f8ce21824d96f0fb",
  "0xe54befcca6bdb110b6711a6279e8b6e32bebe5d7",
  "0xed15c66644239730786bcc73cb098a77a5dd5708",
  "0xf3c5cfed1d0158bf674efdf70bd8eb247400fbb9",
  "0xf8a3d5a1df312c3c32e05a9ac2aa89c22e6f62ad",
  "0xf9290369dfbc11a9d2cc97d1f84d67400f698652",
  "0x00752828a823f7383a9c8e2ac9840b944ffcc5c3",
  "0x01915d0908ed0bc5b9c039ab4985a8af6dd3b203",
  "0x05330378b16eff0588a167e97747d145fa840e98",
  "0x07c0cb5cbac03402b8fe8eaa028b26d0032413c5",
  "0x1445aff2ef32c7554984b78c369a0bb8320d779b",
  "0x16fbb3d3c84d3cdcb997191aa6fb422e851221ce",
  "0x198fd8366b60d5b6e17e75fafa16ef69086483a1",
  "0x1db779c1be989504c4d28bf3fc57c104b304850b",
  "0x20af906712ab2f947f34b41ee7935e1d93eaa7d7",
  "0x236ee2269e209fd30712d94a17821e7d3b61507d",
  "0x247fc54a5e92d093e882c98772a4b6fde776f998",
  "0x268ce92bce8e07cdfd8433a47510de3173338cb7",
  "0x279ba1ceae21a7d43a5d8e88ef4ec142b6cd9af5",
  "0x2bb77f033f1d0534103b25ba8e00e8b5168da721",
  "0x3681bd2d51e4a39c15926ecdfc01500871c9acfc",
  "0x36c01da4f3d865c49742b3eb5553b56e488939a1",
  "0x3fe11a10c1e2e6d61143ce0748a8d0c7facf14a1",
  "0x400ad711df4fe4f07723a04bed4d4e65478bcb85",
  "0x4fe03631637b2fa00e40bb57608026dc25d9e032",
  "0x5e1f88c9595c1b211bbd7846efe89a455edad64c",
  "0x5f9c54f9618d10ca01eea8c10d654f943ec8fae3",
  "0x60bc1ed0afa62dbf56960da20d3384fd63dc9dcd",
  "0x63cb3929dc6ae1104fc88c4d3034003105b77b69",
  "0x752bc873155e92923aca4a929870e86ab3c0a42f",
  "0x7565158a5128b1e0db5fdff7da4a6258a418f5fa",
  "0x75e821b65afecc6af05f873be0c70f6221b9c31e",
  "0x79e3ce16e53cae1efc4ac5095e695ebcff728a43",
  "0x7e6d122df689d0cf9a73b309d916cc2f496a1ad3",
  "0x843ff05d3b91eb50bbe9a4fd904364adbcdc0ede",
  "0x8a28ceddd821e8420e70986dbda842e663a40663",
  "0x8b8b6d57921b72162f60a7bfef9d7a3529bf2255",
  "0x8ea79f4a9adb0684dcdbba6b3ebf3c1fa250458c",
  "0x94a9b17a5cf0ba15f0ae4bc22294613089c12bf6",
  "0xa6fb318ad0b5aa2a189466c31299229fe710f14d",
  "0xa840fb2fd29e6760334feaa401936edc4d68ff41",
  "0xa914c42b78ea0fda6a63a36b0eeae4e3ea161a82",
  "0xad81501fd55c4c3c1b7b4c1b5d45df1b98138207",
  "0xb170fb581932ebb1bf91c01708847df2ee6c9db3",
  "0xb3c1aa3f75446fb4d630c9104a965882889b1ae3",
  "0xc649ea76963099bd2bde1d51212c0982ff012997",
  "0xcae4ccfe670f8c2a4999f9dfaf44625110fce9e5",
  "0xcef8fad1bfb6f6fe41c9ca33287ed71de107bbdb",
  "0xcf2d2864c95e4580d5b3c9591ded8d9152fd8bf1",
  "0xd1b54276eeca9f70da41f04a1b6baf7fe3cca74d",
  "0xd49f5cc010f4b8e94d0d8c862fbc582a33ab370b",
  "0xe2ca007e903bc94ab9fc3058c9cc70704f97ecb2",
  "0xef1f86a7c89f5f74b2361a28bfa30eb97124ad03",
  "0xfad52545da31b749d4e3ca808ad2530a2f0f9ad6",
  "0xfc3f470f7a627466d2866a38724f8ad0559f8813",
  "0xff0c23c60139075dedb9ec3c2e17f69e61c706bc",
  "0x0693d819656e5f8817df9a66dff68a9e747d18e0",
  "0x0dddeacf798f55db7248b0f62894870286124687",
  "0x10cfae0b506210a89b3207241a2f31d18c663d09",
  "0x1455883cd3c687b6369316d6ec9c62ffca739192",
  "0x15c70fc10d1f4c37b1b3ceac6081bb6d30209f15",
  "0x20d9d9ecc308f3bb2276612e021c9466e5232ad8",
  "0x2985999fdf7b93ba95f202ab153e5fb4737eed15",
  "0x35f09e6d8024bf2e36fabef757ed2f2f39e2866c",
  "0x376e29ee506b0bb8f58b3deff073376ce7641e69",
  "0x416fa5d66cc32e23d6ed5f8451dfb9ab402302a1",
  "0x4ab30c9478849410145c1a5e5caaefa9194dbc1d",
  "0x559036a0488f6596f22297ea1473591a8b015fa5",
  "0x57410aac925f2a9c3d0bffcf3641475469645e6d",
  "0x658435cbce1abcef53af1af740c4ba692dd8b970",
  "0x96e76a8f0cdd8fe398fa26438823845a199df037",
  "0xa86f4f02f726c6e314696f1ad291fcaf60d52a03",
  "0xae2da2d85c50ef1f3a4ccfb59c57138f367cf633",
  "0xb2fa254bf7e4d4b419f7fe9df246fb123e1da1f4",
  "0xb990148af46b233c1a97cec1828eab21a7121647",
  "0xba66993426da20d226a1e0d4443eee57549ed9d2",
  "0xba7496f3cc4924c52c2b7f9f6fcdb4541150544d",
  "0xcb469b29c29d3bb340218fcffb31484ec60c5565",
  "0xe3edbfb29438000b1fb2461ae2c38295c81d47ae",
  "0xec51b885c9fe296db4d5d72f805b7f4dabb6aabe",
  "0xefaf3ab482b387ca7dbf98b9f1c466c4ae3b4217",
  "0xf26cc13e6510f29effec563acc856233f6f98557",
  "0xf6d4901d399e2563db7e7c4f42cc3ad0e2fa73dc",
  "0xfc25ea613f3bdc34e19528b2e39d28684fb1d890",
  "0xfde662db62c9c8d753874315aa5ffce03bb4f149",
] as const

const claims: NFTClaim[] = winners.map((address, i) => {
  return {
    collection: "0x25e27C666F1E306B254d9cb3A15Bf23145E60706",
    token_id: i.toString(),
    account: checksumAddress(address),
    description: "Mini App Factory Campaign",
  }
})

export default function ManualTokensMiniAppFactoryPage() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return (
    <div className="text-white flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">NFT Claims (total ({claims.length}))</span>
          <Button
            variant="outline"
            onClick={() => {
              if (!address) {
                return
              }

              const nftclaim = JSON.stringify(claims)
              signMessageAsync({
                account: address,
                message: nftclaim,
              })
                .then((signature) => {
                  return axios.post(
                    "https://indexer.core.openxai.org/api/nftclaim/upload",
                    {
                      nftclaim,
                      signature,
                    }
                  )
                })
                .catch(console.error)
            }}
          >
            Submit
          </Button>
        </div>
        {claims.map((claim, i) => {
          return <span key={i}>{JSON.stringify(claim)}</span>
        })}
      </div>
    </div>
  )
}
