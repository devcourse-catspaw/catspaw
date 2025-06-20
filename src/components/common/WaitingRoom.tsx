import Crown from '../..//assets/images/crown.svg?react';
import type { Database } from '../../types/supabase';

export type PlayerUserProps = Database['public']['Tables']['players']['Row'] & {
  users?: Database['public']['Tables']['users']['Row'];
};
export default function WaitingRoom({
  is_ready,
  is_leader,
  users,
}: PlayerUserProps) {
  const avatarUrl = users?.avatar
    ? `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/avatar-image/${users.avatar}`
    : '';

  return (
    <>
      <div className="w-full h-[77px] px-7 bg-[var(--white)] flex justify-between items-center text-[16px] font-bold rounded-md border-2 border-[var(--black)]">
        <div className="flex items-center gap-[7px]">
          <img src={avatarUrl} alt="캐릭터" className="w-[49px] h-[49px]" />
          <div className="flex items-center gap-[7px] w-[140px]">
            <div className="truncate">{users?.nickname}</div>
            {is_leader && (
              <Crown className="w-[18px] h-[15px] text-[#F4EC5A]" />
            )}
          </div>
        </div>
        {!is_leader ? (
          is_ready ? (
            <div className="text-[var(--blue)] w-[60px] text-right">READY</div>
          ) : (
            <div className="text-[var(--red)] w-[60px] text-right">waiting</div>
          )
        ) : (
          <div className="w-[60px]"></div>
        )}
      </div>
    </>
  );
}
