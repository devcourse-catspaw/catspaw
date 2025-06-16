import icon_accept from '../../assets/images/icon_accept.svg'
import icon_cancel from '../../assets/images/icon_cancel.svg'
import kisu from '../../assets/images/kisu_.svg'

type FriendListProps = {
  userId: number
  userCharacter?: string
  userName?: string
  request?: boolean
}

export default function FriendList({
  userId,
  userCharacter,
  userName,
  request,
}: FriendListProps) {
  return (
    <>
      <div className="w-full h-[57px] flex justify-between items-center px-[16px] py-[8px]">
        <div className="flex gap-[10px] items-center cursor-pointer">
          <img
            src={userCharacter ?? kisu}
            alt="userCharacter"
            className="size-[35px]"
          />
          <span className="font-semibold text-[16px]">
            {userName}
            {userId}
          </span>
        </div>
        {request && (
          <div className="w-[54px] h-[24px] flex gap-[8px] items-center">
            <img
              src={icon_accept}
              alt="accept icon"
              onClick={() => alert('수락!')}
              className="cursor-pointer"
            />
            <img
              src={icon_cancel}
              alt="cancel icon"
              onClick={() => alert('거절!')}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
    </>
  )
}
