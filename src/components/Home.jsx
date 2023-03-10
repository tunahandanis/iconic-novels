import Head from "next/head"
import { Typography } from "antd"
import Link from "next/link"
import { useAccountContext } from "@/context/accountContext"

const Home = () => {
  const { Title } = Typography

  const { accountState } = useAccountContext()

  return (
    <>
      <Head>
        <title>Novelbits</title>
        <meta name="description" content="Novelbits Landing Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="hero">
        <div className="hero__text">
          <Title className="hero__title">
            Read, write and support thrilling books
          </Title>
          <p className="hero__para">
            NovelBits is a decentralized novel-protocol that lets people read,
            write and support books
          </p>
          <div className="hero__button-container">
            <Link href="/explore">
              <button
                className={`hero__button hero__button-explore ${
                  !accountState.account && "hero__button-disabled"
                }`}
              >
                Explore
              </button>
            </Link>
            <Link href={`/user/${accountState?.account?.address}`}>
              <button
                className={`hero__button hero__button-write ${
                  !accountState.account && "hero__button-disabled"
                }`}
              >
                Write
              </button>
            </Link>
          </div>
        </div>
        <img
          src="/assets/hero-image.jpg"
          alt="hero image"
          className="hero__image"
          loading="lazy"
        />
      </div>
    </>
  )
}

export default Home
