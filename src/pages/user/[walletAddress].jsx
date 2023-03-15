import { useAccountContext } from "@/context/accountContext"
import { Button, Input, Modal, notification, Spin, Table } from "antd"
import { useEffect, useState } from "react"
import { getBooksTableColumns } from "@/utils/helpers"
import BookNFT from "../../../artifacts/contracts/BookNFT.sol/BookNFT.json"
import { bookNftContractAddress } from "@/utils/constants"

import { uploadJSONToIPFS, getNFTMetadata } from "@/utils/pinata"
import { CheckOutlined } from "@ant-design/icons"
import { ethers } from "ethers"

const User = () => {
  const [books, setBooks] = useState()
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false)
  const [bookNameInput, setBookNameInput] = useState("")
  const [priceInput, setPriceInput] = useState("")

  const { accountState, checkIfWalletIsConnected, accountDispatch } =
    useAccountContext()

  const hideModal = () => {
    setIsNewBookModalOpen(false)
  }

  const showModal = () => {
    setIsNewBookModalOpen(true)
  }

  const mintBookNft = async () => {
    checkIfWalletIsConnected(accountDispatch)

    const newBook = {
      bookName: bookNameInput,
      authorWalletAddress: accountState?.account?.address,
      premiumPrice: priceInput,
    }

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(
        bookNftContractAddress,
        BookNFT.abi,
        signer
      )

      try {
        const pinataResponse = await uploadJSONToIPFS(newBook)

        const transaction = await contract.mintBookNFT(
          accountState.account.address,
          pinataResponse.ipfsHash
        )

        const res = await transaction.wait()

        const btn = (
          <a
            href={
              "https://arctic.epirus.io/transactions/" + res.transactionHash
            }
            target="_blank"
            rel="noreferrer"
          >
            <span style={{ color: "#40a9ff", cursor: "pointer" }}>
              {res.transactionHash.slice(0, 30) + "..."}
            </span>
          </a>
        )
        notification.open({
          message: `You just minted the a new book as NFT!`,
          description: "Click to view transaction on Epirus",
          btn,
          placement: "bottomRight",

          duration: 5,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        })
      } catch (error) {
        console.error(error)
      }
    }

    setBookNameInput("")
    setPriceInput("")
    setIsNewBookModalOpen(false)
  }

  const fetchBooks = async () => {
    /* const res = await fetch("/api/getBooks")
    const json = await res.json()

    const filteredBooks = json.filter(
      (book) => book.authorWalletAddress === accountState?.account?.address
    )

    setBooks(filteredBooks) */
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const contract = new ethers.Contract(
      bookNftContractAddress,
      BookNFT.abi,
      provider
    )

    try {
      const bookURIs = await contract.getAuthorBookURIs(
        accountState?.account?.address
      )
      const promises = []

      for (let uri of bookURIs) {
        promises.push(getNFTMetadata(uri))
      }

      const books = await Promise.all(promises)

      setBooks(books)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  if (!books) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="profile">
      <Button
        onClick={showModal}
        className="profile__new-button"
        type="primary"
        disabled={!accountState.account}
      >
        Write a new book!
      </Button>
      <div className="profile__table">
        <Table
          size="small"
          dataSource={Object.values(books)}
          columns={Object.values(getBooksTableColumns(true))}
          rowKey={(record) => record?._id}
          pagination={false}
        />
      </div>
      <Modal
        title="Create a new book"
        open={isNewBookModalOpen}
        onOk={() => {
          hideModal()
          setBookNameInput("")
          setPriceInput("")
        }}
        onCancel={() => {
          hideModal()
          setBookNameInput("")
          setPriceInput("")
        }}
        footer={[
          <Button
            key="create"
            onClick={() => {
              if (bookNameInput.trim() !== "" && priceInput.trim() !== "") {
                mintBookNft()
              }
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Input
          placeholder="Book name"
          onChange={(e) => setBookNameInput(e.target.value)}
          value={bookNameInput}
          size="middle"
        />
        <Input
          placeholder="Price for unlocking chapters in ICZ"
          onChange={(e) => setPriceInput(e.target.value)}
          value={priceInput}
          className="mt-1"
          size="middle"
          type="number"
          step="0.1"
        />
      </Modal>
    </div>
  )
}

export default User
