import { Spin, Table } from "antd"
import { useEffect, useState } from "react"
import { getBooksTableColumns } from "@/utils/helpers"

const Explore = () => {
  const [books, setBooks] = useState()

  const fetchBooks = async () => {
    const res = await fetch("/api/getBooks")
    const json = await res.json()

    setBooks(json)
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
    <div className="explore">
      <div>
        <Table
          size="small"
          dataSource={Object.values(books)}
          columns={Object.values(getBooksTableColumns(false))}
          rowKey={(record) => record?._id}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default Explore
