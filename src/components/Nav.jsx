import Link from "next/link"
import { Button, PageHeader } from "antd"
import { useAccountContext } from "../context/accountContext"
import { useEffect } from "react"
import { formatAccount } from "@/utils/common"

const Nav = () => {
  const {
    accountState,
    accountDispatch,
    checkIfWalletIsConnected,
    changeNetwork,
    connectWallet,
  } = useAccountContext()
  let buttonText

  if (accountState.metamaskNotFound) {
    buttonText = "Please install metamask"
  } else if (accountState.isAppDisabled) {
    buttonText = "Switch Network"
  } else {
    buttonText = "Connect Wallet"
  }

  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch)
  }, [])

  return (
    <div className="header">
      <PageHeader
        ghost={false}
        avatar={{
          src: "/assets/logo.png",
        }}
        title={
          <Link href="/" className="heading">
            NovelBits
          </Link>
        }
        subTitle="Generate artwork through AI, secure it as NFT"
        extra={
          <>
            <Button
              size="large"
              loading={accountState.isLoading}
              type="primary"
              onClick={() =>
                accountState.isAppDisabled
                  ? changeNetwork()
                  : connectWallet(accountDispatch)
              }
              disabled={
                !!accountState?.account || accountState.metamaskNotFound
              }
            >
              {accountState.account
                ? `${formatAccount(accountState?.account?.address)}`
                : buttonText}
            </Button>
            <Link href="/explore">
              <Button
                type="primary"
                disabled={!accountState.account}
                size="large"
              >
                Explore
              </Button>
            </Link>
            <Link href={`/user/${accountState?.account?.address}`}>
              <Button disabled={!accountState.account} size="large">
                Profile
              </Button>
            </Link>
          </>
        }
      />
    </div>
  )
}

export default Nav
