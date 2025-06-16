type PostListProps = {
  postTitle: string
  comments: number
  date: string
}

export default function PostList({ postTitle, comments, date }: PostListProps) {
  return (
    <>
      <div className="w-full h-[55px] px-[20px] flex justify-between items-center">
        <div className="flex justify-between items-center gap-[12px]">
          <span className="font-semibold text-[15px] truncate max-w-[300px] cursor-pointer hover:underline">
            {postTitle}
          </span>
          <span className="text-[12px]">[{comments}]</span>
        </div>
        <div className="text-[12px]">{date.slice(0, 10)}</div>
      </div>
    </>
  )
}
