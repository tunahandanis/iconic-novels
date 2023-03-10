import { useAccountContext } from "@/context/accountContext"
import { Button, Collapse, Input, Modal, Spin } from "antd"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const MyBook = () => {
  const router = useRouter()
  const [book, setBook] = useState()

  const [isNewChapterModalOpen, setIsNewChapterModalOpen] = useState(false)
  const [chapterNameInput, setChapterNameInput] = useState("")
  const [contentInput, setContentInput] = useState("")

  const { checkIfWalletIsConnected, accountDispatch } = useAccountContext()

  const hideModal = () => {
    setIsNewChapterModalOpen(false)
  }

  const showModal = () => {
    setIsNewChapterModalOpen(true)
  }

  useEffect(() => {
    const bookId = router.query.book_id
    fetchBook(bookId)
  }, [])

  const fetchBook = async (bookId) => {
    const res = await fetch("/api/fetchBookById", {
      method: "POST",
      body: JSON.stringify({
        bookId: bookId,
      }),
    })
    const json = await res.json()

    setBook(json)
  }

  const insertChapter = async () => {
    checkIfWalletIsConnected(accountDispatch)

    const newChapter = {
      bookId: book._id,
      newChapter: {
        chapterName: chapterNameInput,
        content: contentInput,
      },
    }

    try {
      axios.post("/api/addChapter", newChapter).then((res) => setBook(res.data))
    } catch (e) {
      console.error(e.response.data)
    }

    setChapterNameInput("")
    setContentInput("")
    setIsNewChapterModalOpen(false)
  }

  if (!book) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="my-book">
      <h2 className="my-book__title">{book.bookName}</h2>

      <Button
        type="primary"
        onClick={showModal}
        className="my-book_new-chapter"
      >
        New Chapter
      </Button>
      {book.chapters.length ? (
        <Collapse className="my-book__collapse">
          {book.chapters.map((chapter, index) => (
            <Collapse.Panel
              header={`Chapter ${index + 1} - ${chapter.chapterName}`}
              key={index}
            >
              <p>{chapter.content}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      ) : (
        <div className="my-book__no-chapters">
          <h3>No Chapters Written</h3>
        </div>
      )}
      <Modal
        title="Write a new chapter"
        open={isNewChapterModalOpen}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button
            key="create"
            onClick={() => {
              if (
                chapterNameInput.trim() !== "" &&
                contentInput.trim() !== ""
              ) {
                insertChapter()
              }
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Input
          placeholder="Chapter name"
          onChange={(e) => setChapterNameInput(e.target.value)}
          value={chapterNameInput}
        />
        <Input.TextArea
          placeholder="Chapter content"
          onChange={(e) => setContentInput(e.target.value)}
          value={contentInput}
          className="mt-1"
        />
      </Modal>
    </div>
  )
}

export default MyBook
