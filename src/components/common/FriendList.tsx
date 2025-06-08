import icon_accept from '../../assets/images/icon_accept.png'
import icon_cancel from '../../assets/images/icon_cancel.png'

type FriendListProps = {
  userCharacter: string
  userName: string
  request?: boolean
}

export default function FriendList({
  userCharacter,
  userName,
  request,
}: FriendListProps) {
  return (
    <>
      <div className="w-[258px] h-[57px] flex justify-between items-center px-[16px] py-[8px]">
        <div className="flex gap-[10px] items-center">
          <img
            src={userCharacter}
            alt="userCharacter"
            className="size-[41px]"
          />
          <span className="font-semibold text-[16px]">{userName}</span>
        </div>
        {request && (
          <div className="w-[54px] h-[24px] flex gap-[8px]">
            <img
              src={icon_accept}
              alt="accept icon"
              onClick={() => alert('수락!')}
            />
            <img
              src={icon_cancel}
              alt="cancel icon"
              onClick={() => alert('거절!')}
            />
          </div>
        )}
      </div>
    </>
  )
}
