import { useAccountContext } from "@/context/accountContext"
import { Button, Input, Modal, Spin, Table } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { getBooksTableColumns } from "@/utils/helpers"
//import { uploadJSONToIPFS, getNFTMetadata } from "@/utils/pinata"

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

  const insertBook = async () => {
    checkIfWalletIsConnected(accountDispatch)

    const newBook = {
      bookName: bookNameInput,
      authorWalletAddress: accountState?.account?.address,
      premiumPrice: priceInput,
    }

    try {
      axios.post("/api/createBook", newBook).then(() => fetchBooks())
    } catch (e) {
      console.error(e)
    }

    setBookNameInput("")
    setPriceInput("")
    setIsNewBookModalOpen(false)
  }

  const fetchBooks = async () => {
    const res = await fetch("/api/getBooks")
    const json = await res.json()

    const filteredBooks = json.filter(
      (book) => book.authorWalletAddress === accountState?.account?.address
    )

    setBooks(filteredBooks)
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
                insertBook()
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
