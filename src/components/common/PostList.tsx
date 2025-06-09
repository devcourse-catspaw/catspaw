type PostListProps = {
  postTitle: string
  comments: number
  date: string
}

export default function PostList({ postTitle, comments, date }: PostListProps) {
  return (
    <>
      <div className="w-[688px] h-[55px] px-[20px] flex justify-between items-center">
        <div className="flex justify-between items-center gap-[12px]">
          <span className="font-semibold text-[15px] truncate max-w-[300px] overflow-hidden whitespace-nowrap">
            {postTitle}
          </span>
          <span className="text-[12px]">[{comments}]</span>
        </div>
        <div className="text-[12px]">{date}</div>
      </div>
    </>
  )
}
